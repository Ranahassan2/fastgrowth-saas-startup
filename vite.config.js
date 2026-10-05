import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { Anima } from "@animaapp/anima-sdk"

process.on('unhandledRejection', (reason, promise) => {
  console.warn('Unhandled Rejection in Vite Server:', reason);
});

const animaPlugin = () => {
  return {
    name: 'anima-plugin',
    configureServer(server) {
      server.middlewares.use('/api/generate', async (req, res, next) => {
        if (req.method !== 'POST') return next();
        
        let body = '';
        req.on('data', chunk => { body += chunk.toString() });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            // Ensure env variables are loaded (Vite loads them, but to be safe we use process.env which might need loadEnv)
            const env = loadEnv('', process.cwd(), '');
            
            // Extract all keys starting with VITE_ANIMA_WEBSITE_KEY
            const animaKeys = Object.keys(env)
              .filter(k => k.startsWith('VITE_ANIMA_WEBSITE_KEY'))
              .map(k => env[k])
              .filter(Boolean);

            if (animaKeys.length === 0) {
                throw new Error("Missing any VITE_ANIMA_WEBSITE_KEY in .env.local");
            }

            let generatedFiles = null;
            let lastAnimaError = null;

            for (const token of animaKeys) {
                try {
                    const anima = new Anima({ auth: { token } });
                    console.log("Generating code via Anima SDK with prompt:", data.prompt);
                    const { files } = await anima.generateCodeFromPrompt({
                      prompt: data.prompt,
                      settings: {
                        framework: 'html',
                        styling: 'tailwind'
                      }
                    });
                    
                    console.log("Anima code generation successful!");
                    generatedFiles = files;
                    break; // Success! Exit the loop.
                } catch (err) {
                    console.warn("Anima key failed (might be limit exceeded), trying next key if available...");
                    lastAnimaError = err;
                    // Continue to next token
                }
            }

            if (generatedFiles) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ files: generatedFiles }));
            } else {
                throw lastAnimaError || new Error("All Anima keys failed.");
            }
          } catch (e) {
            console.error("Anima API Error:", e.message || e);
            try {
                const groqToken = env.VITE_GROQ_API_KEY;
                if (!groqToken) throw new Error("No Groq token available");
                console.log("Falling back to Groq (Llama 3)...");

                const systemPrompt = "You are an expert frontend developer and web designer. The user wants to generate a single-file HTML landing page using Tailwind CSS via CDN. Ensure the code looks premium, modern, and beautiful. Return ONLY valid HTML code inside a markdown code block or raw string. Do not include extra conversational text.";
                
                const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${groqToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'llama3-70b-8192',
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: data.prompt }
                        ],
                        temperature: 0.7
                    })
                });

                const groqData = await groqRes.json();
                if (!groqRes.ok) throw new Error(groqData.error?.message || 'Groq API failed');
                
                let generatedHtml = groqData.choices[0].message.content;
                generatedHtml = generatedHtml.replace(/^```(?:html)?\n?/im, '').replace(/```$/im, '').trim();

                console.log("Groq fallback generation successful!");
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ files: { 'index.html': { content: generatedHtml, isBinary: false } } }));
            } catch (groqError) {
                console.error("Groq Fallback Error:", groqError.message || groqError);
                try {
                  const anthropicToken = env.VITE_ANTHROPIC_API_KEY;
                  if (!anthropicToken) throw new Error("No Anthropic token available");
                  console.log("Falling back to Anthropic (Claude 3.5 Sonnet)...");
                  
                  const systemPrompt = "You are an expert frontend developer and web designer. The user wants to generate a single-file HTML landing page using Tailwind CSS via CDN. Ensure the code looks premium, modern, and beautiful. Return ONLY valid HTML code inside a markdown code block or raw string. Do not include extra conversational text.";
                  
                  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                      'x-api-key': anthropicToken,
                      'anthropic-version': '2023-06-01',
                      'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                      model: 'claude-3-5-sonnet-20240620',
                      max_tokens: 4000,
                      system: systemPrompt,
                      messages: [{ role: 'user', content: data.prompt }]
                    })
                  });

                  const anthropicData = await anthropicRes.json();
                  if (!anthropicRes.ok) throw new Error(anthropicData.error?.message || 'Anthropic API failed');
                  
                  let generatedHtml = anthropicData.content[0].text;
                  generatedHtml = generatedHtml.replace(/^```(?:html)?\n?/im, '').replace(/```$/im, '').trim();

                  console.log("Anthropic fallback generation successful!");
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ files: { 'index.html': { content: generatedHtml, isBinary: false } } }));
                } catch (anthropicError) {
                  console.error("Anthropic Fallback Error:", anthropicError.message || anthropicError);
                  try {
                    const geminiToken = env.VITE_GEMINI_API_KEY;
                    if (!geminiToken) throw new Error("No Gemini token available");
                    console.log("Falling back to Gemini API...");
                    
                    const geminiPrompt = `You are an expert frontend developer and web designer. The user wants to generate a single-file HTML landing page using Tailwind CSS via CDN. Ensure the code looks premium, modern, and beautiful. Return ONLY valid HTML code inside a markdown code block or raw string. Do not include extra conversational text.
User request: ${data.prompt}`;

                    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiToken}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        contents: [{ parts: [{ text: geminiPrompt }] }],
                        generationConfig: { temperature: 0.7 }
                      })
                    });

                    const geminiData = await geminiRes.json();
                    if (!geminiRes.ok) throw new Error(geminiData.error?.message || 'Gemini API failed');
                    
                    let generatedHtml = geminiData.candidates[0].content.parts[0].text;
                    generatedHtml = generatedHtml.replace(/^```(?:html)?\n?/im, '').replace(/```$/im, '').trim();

                    console.log("Gemini fallback generation successful!");
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ files: { 'index.html': { content: generatedHtml, isBinary: false } } }));
                  } catch (geminiError) {
                    console.error("Gemini Fallback Error:", geminiError.message || geminiError);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    const errorMsg = e.message || 'Anima generation failed';
                    const isLimitExceeded = e.status === 402 || errorMsg.includes('Limit') || errorMsg.includes('402');
                    res.end(JSON.stringify({ 
                        error: isLimitExceeded ? 'Usage Exceeds Limit' : errorMsg,
                        status: e.status || 500
                    }));
                  }
                }
            }
          }
        });
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), animaPlugin()],
  server: {
    host: true,
    proxy: {
      '/anima-api': {
        target: 'https://public-api.animaapp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/anima-api/, '')
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
