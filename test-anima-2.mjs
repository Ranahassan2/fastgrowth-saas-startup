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
        framework: "html",
        styling: "tailwind"
      }
    });
    
    console.log("Files generated keys:", Object.keys(files));
    console.log("Type of index.html:", typeof files['index.html']);
    console.log("Value:", files['index.html']);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
