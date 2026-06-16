const { execSync } = require('child_process');
const { google } = require('googleapis');
const { Logging } = require('@google-cloud/logging');

const PROJECT_ID = 'edgecrm-production';
const CHAT_APP_NAME = `projects/${PROJECT_ID}/locations/global/chatApp`;
const LOG_WINDOW_SECONDS = 15;

async function runPipeline() {
    const chat = google.chat('v1');
    const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    google.options({ auth });

    let previousDeployId = null;

    try {
        console.log('--- Phase 0: Pre-flight Snapshot ---');
        const currentApp = await chat.projects.locations.getChatApp({ name: CHAT_APP_NAME });
        previousDeployId = currentApp.data.appsScriptConfig?.deploymentId;
        console.log(`Current Deployment ID (Snapshot): ${previousDeployId}`);

        console.log('\n--- Phase 1: Build & Deploy ---');
        execSync('clasp push', { stdio: 'inherit' });
        const deployOutput = execSync('clasp deploy -d "Automated CI/CD Bridge"').toString();
        const newDeployId = deployOutput.match(/AKfy[a-zA-Z0-9_-]+/)[0];
        console.log(`\x1b[32mNew Deployment ID Created: ${newDeployId}\x1b[0m`);

        console.log('\n--- Phase 2: Atomic Bridge Update ---');
        await chat.projects.locations.updateChatApp({
            name: CHAT_APP_NAME,
            updateMask: 'appsScriptConfig.deploymentId',
            requestBody: { appsScriptConfig: { deploymentId: newDeployId } }
        });
        console.log('\x1b[32mGCP Bridge Synchronized: Chat API now pointing to new deployment.\x1b[0m');

        console.log('\n--- Phase 3: Telemetry & Health Check ---');
        console.log(`Monitoring ingress for ${LOG_WINDOW_SECONDS}s...`);
        const errorDetected = await monitorLogs();

        if (errorDetected) {
            console.error('\x1b[31m[FAILURE DETECTED] Initiating Emergency Rollback...\x1b[0m');
            await chat.projects.locations.updateChatApp({
                name: CHAT_APP_NAME,
                updateMask: 'appsScriptConfig.deploymentId',
                requestBody: { appsScriptConfig: { deploymentId: previousDeployId } }
            });
            console.log(`\x1b[33mRollback Successful: Reverted to ${previousDeployId}\x1b[0m`);
            process.exit(1);
        } else {
            console.log('\x1b[32mHealth Check Passed. Deployment finalized.\x1b[0m');
        }

    } catch (err) {
        console.error('\x1b[31mPipeline Critical Error: ' + err.message + '\x1b[0m');
        process.exit(1);
    }
}

async function monitorLogs() {
    const logging = new Logging({ projectId: PROJECT_ID });
    const startTime = new Date(Date.now() - 5000).toISOString();
    let hasError = false;

    for (let i = 0; i < LOG_WINDOW_SECONDS; i++) {
        await new Promise(r => setTimeout(r, 1000));
        try {
            const filter = `resource.type="chat.googleapis.com" AND timestamp >= "${startTime}"`;
            const [entries] = await logging.getEntries({ filter, pageSize: 5 });
            
            for (const entry of entries) {
                const payload = JSON.stringify(entry.data);
                // Catch common ingress failures
                if (entry.metadata.severity === 'ERROR' || payload.includes('"code":3') || payload.includes('403') || payload.includes('500')) {
                    console.error(`\x1b[31mIngress Failure Found: ${payload}\x1b[0m`);
                    hasError = true;
                    break;
                }
            }
        } catch (e) {}
        if (hasError) break;
    }
    return hasError;
}

runPipeline();
