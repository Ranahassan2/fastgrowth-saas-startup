const GEMINI_KEY = "AIzaSyBsJn33yjWe9hDuoCQAH_Yj4oPfnSNyLIw";

const promptText = `أنت مصمم واجهات محترف. قم بكتابة كود HTML كامل لصفحة متجر إلكتروني سعودي يبيع عطور، جمهوره: فخم، وطابعه: بسيط وحديث. 
المتطلبات:
1. استخدم مكتبة Tailwind CSS عبر CDN (<script src="https://cdn.tailwindcss.com"></script>).
2. التصميم باللغة العربية (dir="rtl").
3. يجب أن يحتوي على: Header، Hero Section (مع زر تسوق الآن)، قسم للمميزات (شحن، دفع آمن)، قسم منتجات (3 كروت منتجات بصور وهمية من unsplash)، وFooter.
4. أرجع كود HTML فقط بدءاً من <!DOCTYPE html> بدون أي شروحات، وبدون استخدام \`\`\`html.`;

async function main() {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
    })
  });

  console.log(response.status, response.statusText);
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
