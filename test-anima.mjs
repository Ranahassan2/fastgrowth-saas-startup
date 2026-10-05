import { Anima } from "@animaapp/anima-sdk";

async function main() {
  try {
    const anima = new Anima({
      auth: { token: process.env.VITE_ANIMA_WEBSITE_KEY }
    });
    
    console.log("Generating code...");
    const { files } = await anima.generateCodeFromPrompt({
      prompt: "A beautiful hero section for a perfume store",
      settings: {
        framework: "react",
        language: "javascript",
        styling: "css"
      }
    });
    
    console.log("Files generated:", files);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
