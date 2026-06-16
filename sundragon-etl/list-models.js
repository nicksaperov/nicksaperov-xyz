require('dotenv').config();

// Ensure you have your API key set in your .env file or terminal:
// export GEMINI_API_KEY="your-api-key"

async function checkAccessibleModels() {
  console.log("🔍 Scanning for available Gemini Vision & Text models...\n");
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
      console.error("❌ GEMINI_API_KEY is missing. Please check your .env file.");
      return;
  }

  try {
    // Bypassing the SDK wrapper to hit the REST API directly
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter out models that don't support generateContent for clarity
    const generativeModels = data.models.filter(model => 
        model.supportedGenerationMethods && model.supportedGenerationMethods.includes("generateContent")
    );

    generativeModels.forEach(model => {
      console.log(`✅ Model Name: ${model.name}`);
      console.log(`   - Display Name: ${model.displayName}`);
      console.log(`   - Input Limits: ${model.inputTokenLimit} tokens`);
      console.log(`   - Output Limits: ${model.outputTokenLimit} tokens\n`);
    });

    console.log("🎯 Architectural Recommendation: Use 'models/gemini-2.5-flash' for your ETL image tagging.");

  } catch (error) {
    console.error("❌ Failed to fetch models. Check your API key or network connection.", error);
  }
}

checkAccessibleModels();