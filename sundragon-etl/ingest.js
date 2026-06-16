require('dotenv').config();
const fs = require('fs');
const path = require('path');
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- 1. CONFIGURATION ---
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "nicksaperov-portfolio-2026.firebasestorage.app"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const IMAGES_DIR = path.join(__dirname, 'images');
const DONE_DIR = path.join(__dirname, 'done');

// Helper to convert local file to Gemini's required format
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    },
  };
}

async function processImages() {
  // Grab all images from the /images folder
  const files = fs.readdirSync(IMAGES_DIR).filter(file => file.match(/\.(jpg|jpeg|png)$/i));
  
  if (files.length === 0) {
    console.log("No images found in ./images directory. Place your compressed images there.");
    return;
  }

  console.log(`🚀 Initiating Path B: Enterprise ETL Pipeline for ${files.length} artifacts...`);
  

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = path.join(IMAGES_DIR, fileName);
    console.log(`\n[${i+1}/${files.length}] Processing ${fileName}...`);

    try {
        // --- A. GEMINI ANALYSIS ---
        console.log("   -> Querying Gemini Vision...");
        const imagePart = fileToGenerativePart(filePath, "image/jpeg");
        const prompt = "Analyze this artisan ceramic. Act as a master ceramicist and e-commerce copywriter. Return a JSON object with EXACTLY these keys: 'title' (a creative, elegant name for this item), 'whatIsThisFor' (purpose and poetic background), 'howToUse' (brewing/care instructions), 'material' (guess the clay/glaze visually, e.g., 'Wood-fired stoneware', 'Celadon'), 'capacity' (guess the volume in ml, e.g., '150ml' or leave blank). Output raw JSON only.";
        
        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();
        
        let aiData;
        try {
            // Strip any markdown code blocks the AI might inject
            aiData = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
        } catch (e) {
             console.error("   ❌ Failed to parse JSON from Gemini. Raw output:", responseText);
             continue; 
        }

        console.log(`   -> AI Metadata Generated: "${aiData.title}"`);

        // --- B. FIREBASE STORAGE UPLOAD ---
        console.log("   -> Uploading image to Cloud Storage...");
        const uniqueFileName = `products/${Date.now()}_AI_${fileName.replace(/[^a-zA-Z0-9.]/g, '')}`;
        
        await bucket.upload(filePath, {
            destination: uniqueFileName,
            metadata: { contentType: 'image/jpeg' }
        });
        
        // Generate native Firebase Client download URL
        const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(uniqueFileName)}?alt=media`;

        // --- C. FIRESTORE DATABASE COMMIT ---
        console.log("   -> Committing payload to Firestore...");
        await db.collection("products").add({
            title: aiData.title || "Unknown Artifact",
            price: "TBD",
            whatIsThisFor: aiData.whatIsThisFor || "",
            howToUse: aiData.howToUse || "",
            material: aiData.material || "stoneclay, handcraft",
            capacity: aiData.capacity || "",
            location: "AI Backlog",
            images: [{ url: downloadURL, path: uniqueFileName }],
            imageUrl: downloadURL,
            imagePath: uniqueFileName,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // --- D. CLEANUP ---
        // Move the file to the /done folder so it isn't processed again if the script is restarted
        fs.renameSync(filePath, path.join(DONE_DIR, fileName));
        console.log(`   ✅ Success! Moved to /done folder.`);

        // Throttle to respect API limits (2 seconds)
        await new Promise(res => setTimeout(res, 2000));

    } catch (error) {
        console.error(`   ❌ Fatal Error processing ${fileName}:`, error.message);
    }
  }
  
  console.log("\n🎉 Pipeline sequence complete.");
}

processImages();