const fs = require('fs');
const content = fs.readFileSync('src/components/CodingAI.jsx', 'utf8');

const newFunc = `
    const generateWebsiteFromGemini = async (config, userPrompt) => {
        const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBsJn33yjWe9hDuoCQAH_Yj4oPfnSNyLIw";
        
        const fullPrompt = \`
        أنت مصمم واجهات محترف بدرجة "Anima AI Ultra-Premium Web Architect".
        مهمتك هي إنشاء كود HTML لصفحة هبوط (Landing Page) لمتجر إلكتروني فخم جداً، مشابه لمواقع الشركات الكبرى مثل Apple و Stripe.

        بيانات المتجر:
        - اسم المشروع: \${config.projectName || 'متجر فخم'}
        - التخصص/النشاط: \${config.niche || config.activityType}
        - اللغة: \${config.language} (إذا كانت عربية استخدم خط Cairo و dir="rtl")
        - الألوان: أساسي (\${config.primaryColor})، ثانوي (\${config.secondaryColor})

        تفاصيل إضافية من المستخدم: "\${userPrompt || 'تصميم عصري وجذاب'}"

        قواعد التصميم (إجبارية):
        1. الجودة: استخدم تأثيرات Glassmorphism وتدرجات لونية ناعمة وظلال خفيفة.
        2. الأقسام: قم بتوليد صفحة هبوط "طويلة جداً" ومكتملة تشمل (الهيدر، المنتجات، المميزات، التقييمات، الفوتر).
        3. التصميم المتجاوب: استخدم Tailwind CSS لضمان عمل الموقع على الجوال والكمبيوتر.
        4. الحركات: أضف تأثيرات انتقال (Hover) على كل الأزرار والبطاقات.

        التعليمات التقنية:
        - لا تقم بالرد بأي كلام بشري. أخرج فقط كود HTML.
        - الكود يجب أن يبدأ بـ <!DOCTYPE html> وينتهي بـ </html>.
        - يجب تضمين مكتبة Tailwind عبر CDN: <script src="https://cdn.tailwindcss.com"></script>
        - يجب تضمين الخطوط المناسبة.
        - لا تستخدم JSON أبداً.
        \`;

        try {
            const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${GEMINI_KEY}\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: fullPrompt }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
                })
            });

            if (!response.ok) throw new Error('فشل الاتصال بـ Gemini');
            const data = await response.json();
            
            const parts = data.candidates?.[0]?.content?.parts || [];
            let responseText = parts.filter(p => !p.thought).map(p => p.text).join('\\n') || "";

            // Extract ONLY the HTML part to avoid conversational text
            let htmlCode = "";
            const htmlMatch = responseText.match(/<!DOCTYPE html>[\\s\\S]*<\\/html>/i);
            if (htmlMatch) {
                htmlCode = htmlMatch[0];
            } else {
                htmlCode = responseText.replace(/\`\`\`(?:html)?/gi, '').replace(/\`\`\`/g, '').trim();
            }
            
            if (htmlCode && htmlCode.includes('<html')) {
                return { html: htmlCode, css: '', js: '' };
            }
            throw new Error("لم يتمكن الذكاء الاصطناعي من توليد الكود بشكل صحيح.");
        } catch (error) {
            console.error("Anima Engine Critical Failure:", error);
            throw error;
        }
    };
`;

const newContent = content.replace(/\s+const generateWebsiteFromGemini = async \(config, userPrompt\) => \{[\s\S]*?(?=\s+const handleSend = async \(\) => \{)/, "\n" + newFunc + "\n");

fs.writeFileSync('src/components/CodingAI.jsx', newContent);
console.log('done');
