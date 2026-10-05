process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
import { Anima } from "@animaapp/anima-sdk";
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const keys = envFile.split('\n')
  .filter(line => line.startsWith('VITE_ANIMA_WEBSITE_KEY_'))
  .map(line => line.split('=')[1].trim());

console.log(`Found ${keys.length} keys.`);

async function testKeys() {
  for (let i = 0; i < keys.length; i++) {
    const token = keys[i];
    console.log(`Testing key ${i+1}...`);
    try {
      const anima = new Anima({ auth: { token } });
      const { files } = await anima.generateCodeFromPrompt({
        prompt: "A beautiful button",
        settings: { framework: 'html', styling: 'tailwind' }
      });
      console.log(`Key ${i+1} SUCCESS!`);
      break;
    } catch (err) {
      console.error(`Key ${i+1} FAILED with error:`, err.message || err);
    }
  }
}
testKeys();
