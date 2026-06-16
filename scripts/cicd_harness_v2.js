const { execSync } = require('child_process');
const { Logging } = require('@google-cloud/logging');

const PROJECT_ID = 'edgecrm-production';
const LOG_WINDOW_SECONDS = 15;

async function runPipeline() {
    try {
        console.log('--- Phase 1: Build & Deploy ---');
        console.log('Syncing local code...');
        execSync('clasp push', { stdio: 'inherit' });

        console.log('Generating fresh production deployment...');
        const deployOutput = execSync('clasp deploy -d "Automated CI/CD Bridge"').toString();
        const deployId = deployOutput.match(/AKfy[a-zA-Z0-9_-]+/)[0];
        
        console.log('\n\x1b[32m--- DEPLOYMENT SUCCESSFUL ---\x1b[0m');
        console.log(`New Deployment ID: \x1b[33m${deployId}\x1b[0m`);

        console.log('\n--- Phase 2: Bridge Synchronization ---');
        console.log('Google Chat API for Apps Script requires a manual ID sync in the GCP Console.');
        console.log('Use this direct link to update the "Deployment ID" field:');
        console.log(`\x1b[34mhttps://console.cloud.google.com/apis/api/chat.googleapis.com/hangouts-chat?project=${PROJECT_ID}\x1b[0m`);

        console.log('\n--- Phase 3: Telemetry Health Check ---');
        console.log('Tailing logs for 15s to detect ingress silent failures...');
        await monitorLogs();
        console.log('\n\x1b[32mTelemetry Window Closed.\x1b[0m');

    } catch (err) {
        console.error('\x1b[31mPipeline Aborted: ' + err.message + '\x1b[0m');
        process.exit(1);
    }
}

async function monitorLogs() {
    const logging = new Logging({ projectId: PROJECT_ID });
    const startTime = new Date(Date.now() - 5000).toISOString();
    for (let i = 0; i < LOG_WINDOW_SECONDS; i++) {
        await new Promise(r => setTimeout(r, 1000));
        try {
            const filter = `resource.type="chat.googleapis.com" AND timestamp >= "${startTime}"`;
            const [entries] = await logging.getEntries({ filter, pageSize: 5 });
            for (const entry of entries) {
                if (entry.metadata.severity === 'ERROR') {
                    console.error(`\x1b[31m[INGRESS ERROR]: ${JSON.stringify(entry.data)}\x1b[0m`);
                }
            }
        } catch (e) {}
    }
}

runPipeline();
