const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  console.log('Page loaded, clicking Chatbot tool...');
  const tools = await page.$$('text/جرب الأداة');
  if (tools.length >= 2) {
    await tools[1].click(); // Click second tool (Chatbot)
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('Filling form...');
    await page.type('input[name="name"]', 'Puppeteer Test');
    await page.type('input[name="email"]', 'pup@test.com');
    // Assuming phone is the second input or we can find by placeholder
    const inputs = await page.$$('input');
    await inputs[1].type('555123456');
    
    console.log('Submitting form...');
    const submitBtn = await page.$('text/الاستمرار الآن');
    if (submitBtn) await submitBtn.click();
    else console.log('Submit button not found');
    
    await new Promise(r => setTimeout(r, 2000));
    console.log('Done testing UI.');
  } else {
    console.log('Tools not found');
  }

  await browser.close();
})();
