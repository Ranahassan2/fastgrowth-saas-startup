import { loadEnv } from 'vite';
const env = loadEnv('', process.cwd(), '');
const animaKeys = Object.keys(env)
  .filter(k => k.startsWith('VITE_ANIMA_WEBSITE_KEY'))
  .map(k => env[k])
  .filter(Boolean);
console.log("Found keys:", animaKeys.length);
