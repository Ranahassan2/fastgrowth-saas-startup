import { Anima } from "@animaapp/anima-sdk";
import fs from 'fs';
const envFile = fs.readFileSync('.env.local', 'utf8');
const key = envFile.split('\n').find(line => line.startsWith('VITE_ANIMA_WEBSITE_KEY_1')).split('=')[1].trim();
const anima = new Anima({ auth: { token: key } });
anima.generateCodeFromPrompt({
  prompt: "A simple page",
  settings: { framework: 'html', styling: 'tailwind' }
}).then(({ files }) => {
  const indexHtml = files['index.html'];
  console.log("typeof indexHtml:", typeof indexHtml);
  if (typeof indexHtml === 'object') {
    console.log("keys:", Object.keys(indexHtml));
    console.log("is string inside?", typeof indexHtml.content, typeof indexHtml.source, typeof indexHtml.code);
  } else {
    console.log("Content length:", indexHtml.length);
  }
});
