import React, { useState, useRef, useContext, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import CodingAI from './CodingAI';
import LeadCaptureModal from './LeadCaptureModal';
import { useLanguage } from '../context/LanguageContext';
import { saveToolDataToSupabase } from '../supabaseClient';

const TOOLS_DATA = {
  'meta-ads': {
    icon: '', name: 'مولد إعلانات احترافية', sub: 'أنشئ إعلانات جذابة لجميع المنصات (ميتا، جوجل، تيك توك)',
    fields: [
      { id: 'f1', label: 'اسم المنتج / الخدمة', type: 'input', placeholder: 'مثال: عطر فاخر' },
      { id: 'f2', label: 'وصف المنتج باختصار', type: 'textarea', placeholder: 'اكتب وصف قصير عن المنتج أو الخدمة' },
      { id: 'f3', label: 'الجمهور المستهدف', type: 'select', options: ['اختر جمهورك المستهدف', 'رجال 25-40 سنة', 'نساء 20-35 سنة', 'أصحاب مشاريع', 'شباب 18-25 سنة', 'أمهات'] },
      { id: 'f4', label: 'هدف الحملة', type: 'select', options: ['اختر هدف الحملة', 'زيادة المبيعات', 'زيادة الوعي بالعلامة', 'جذب متابعين جدد', 'تشجيع زيارة المتجر'] }
    ],
  },
  'store-audit': {
    icon: '', name: 'محلل نقاط ضعف المتجر', sub: 'تحليل فوري لمتجرك ومقترحات تحسين عملية',
    fields: [
      { id: 'f1', label: 'رابط الموقع الإلكتروني', type: 'input', placeholder: 'www.example.com', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> },
      { id: 'f2', label: 'مجال العمل / النشاط', type: 'input', placeholder: 'مثال: عقارات، متجر ملابس، عيادة أسنان...', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> }
    ],
    buttonText: <>بدء الفحص الشامل الآن <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></>
  },
  'content-ideas': {
    icon: '', name: 'مولد أفكار المحتوى', sub: '10 أفكار محتوى جاهزة لمنتجك',
    fields: [
      { id: 'f1', label: 'ما الذي تبيعه؟', type: 'input', placeholder: 'مثال: عسل طبيعي، ملابس أطفال، دورات تعليمية...' },
      { id: 'f2', label: 'المنصة الرئيسية', type: 'select', options: ['TikTok', 'Instagram', 'Snapchat', 'X (تويتر)'] },
      { id: 'f3', label: 'الهدف من المحتوى', type: 'select', options: ['زيادة المبيعات', 'بناء الثقة', 'جذب متابعين', 'تعليم الجمهور'] },
      { id: 'f4', label: 'الفئة المستهدفة', type: 'input', placeholder: 'مثال: نساء متزوجات، شباب مهتم باللياقة...' }
    ],
  },
  'product-desc': {
    icon: '', name: 'كاتب وصف المنتج SEO', sub: 'وصف احترافي محسّن لمحركات البحث',
    fields: [
      { id: 'f1', label: 'اسم المنتج', type: 'input', placeholder: 'مثال: سماعة بلوتوث لاسلكية...' },
      { id: 'f2', label: 'المميزات الرئيسية للمنتج', type: 'textarea', placeholder: 'اذكر 3-5 مميزات مهمة للمنتج...' },
      { id: 'f3', label: 'السعر', type: 'input', placeholder: 'مثال: 199 ريال' },
      { id: 'f4', label: 'الكلمة المفتاحية الأساسية', type: 'input', placeholder: 'مثال: سماعة بلوتوث سعر رخيص' }
    ],
  },
  'budget-plan': {
    icon: '', name: 'مخطط ميزانية الإعلانات', sub: 'توزيع ذكي لميزانيتك الإعلانية',
    fields: [
      { id: 'f1', label: 'الميزانية الشهرية (ريال)', type: 'input', placeholder: 'مثال: 3000' },
      { id: 'f2', label: 'نوع المنتج', type: 'select', options: ['ملابس وأزياء', 'مستلزمات المنزل', 'مكملات غذائية', 'إكسسوارات وعطور', 'تقنية وإلكترونيات', 'دورات تعليمية', 'طعام ومشروبات'] },
      { id: 'f3', label: 'الهدف الرئيسي', type: 'select', options: ['زيادة المبيعات', 'بناء العلامة التجارية', 'جذب زيارات للمتجر', 'كسب متابعين'] },
      { id: 'f4', label: 'خبرتك بالإعلانات', type: 'select', options: ['مبتدئ', 'متوسط', 'متقدم'] }
    ],
  },
  'hashtags': {
    icon: '', name: 'مولد الهاشتاقات المتصدرة', sub: '20 هاشتاق مخصص لجمهورك',
    fields: [
      { id: 'f1', label: 'ما الذي تبيعه أو تروّج له؟', type: 'input', placeholder: 'مثال: عباءات فاخرة، قهوة مختصة، منتجات عناية بالبشرة...' },
      { id: 'f2', label: 'المنصة', type: 'select', options: ['Instagram', 'TikTok', 'X (تويتر)', 'Snapchat'] },
      { id: 'f3', label: 'المنطقة المستهدفة', type: 'select', options: ['كل الدول العربية', 'السعودية', 'الإمارات', 'الخليج العربي كله'] }
    ],
  },
  'image-gen': {
    icon: '', name: 'مولد صور المنتجات', sub: 'أنشئ صوراً احترافية بالذكاء الاصطناعي',
    fields: [
      { id: 'f1', label: 'ارفع صورة المنتج', type: 'image-upload', placeholder: '' },
      { id: 'f2', label: 'وصف الهوية البصرية (الخلفية)', type: 'textarea', placeholder: 'مثال: زجاجة عطر ذهبية على صخرة سوداء مع قطرات ماء وإضاءة خافتة زرقاء' },
      { id: 'f3', label: 'بيئة الصورة', type: 'select', options: ['استوديو إضاءة بيضاء', 'طبيعة وورود', 'طاولة خشبية فخمة', 'خلفية سوداء ذهبية', 'شاطئ وسماء زرقاء'] }
    ],
  },
  'chatbot-maker': {
    icon: '', name: 'محاكي ومُدرب الشات بوت', sub: 'درب ذكاء اصطناعي ليكون موظف خدمة عملاء لمتجرك وجربه الآن',
    fields: [
      { id: 'f0', label: 'رابط المتجر (لسحب البيانات تلقائياً - اختياري)', type: 'fetch-link', placeholder: 'https://example.com' },
      { id: 'f1', label: 'اسم المتجر وماذا يبيع؟', type: 'textarea', placeholder: 'مثال: متجر الأناقة، نبيع عطور أصلية بأسعار تنافسية...' },
      { id: 'f2', label: 'نبرة حديث البوت', type: 'select', options: ['ودية (لهجة عامية)', 'رسمية واحترافية', 'مرحة وشبابية'] },
      { id: 'f3', label: 'سياسات المتجر (الشحن، الاسترجاع، العروض)', type: 'textarea', placeholder: 'مثال: الشحن بـ 25 ريال خلال 24 ساعة، الاسترجاع متاح خلال 7 أيام، عرض حالي خصم 20% بكود KSA20' },
      { id: 'f4', label: 'أي تعليمات أو إجابات أخرى (اختياري)', type: 'textarea', placeholder: 'مثال: الدفع عند الاستلام متاح، الدعم الفني من 9 لـ 9' }
    ],
  },
  'competitor-price': {
    icon: '', name: 'محلل أسعار المنافسين', sub: 'اكتشف أفضل سعر لمنتجك مقارنة بالسوق',
    fields: [
      { id: 'f1', label: 'رابط منتج المنافس (اختياري)', type: 'input', placeholder: 'https://...' },
      { id: 'f2', label: 'سعر منتجك الحالي (ريال)', type: 'input', placeholder: 'مثال: 150' },
      { id: 'f3', label: 'نوع المنتج', type: 'input', placeholder: 'مثال: حذاء رياضي، قهوة كولومبية...' }
    ],
  },
  'store-design': {
    icon: '', name: 'تصميم متجرك', sub: 'اقتراحات ألوان وخطوط وهيكل احترافي لمتجرك',
    fields: [
      { id: 'f1', label: 'ما هو مجال متجرك؟', type: 'input', placeholder: 'مثال: عطور، ملابس، إلكترونيات...' },
      { id: 'f2', label: 'من هو جمهورك المستهدف؟', type: 'input', placeholder: 'مثال: شباب، فخامة/VIP، عائلات...' },
      { id: 'f3', label: 'المنصة التي تستخدمها؟', type: 'select', options: ['سلة (Salla)', 'زد (Zid)', 'Shopify', 'أخرى'] },
      { id: 'f4', label: 'طابع التصميم المفضل؟', type: 'select', options: ['بسيط وحديث (Minimalist)', 'فخم وكلاسيكي', 'مليء بالحيوية والألوان', 'لا أعرف، اقترح لي'] }
    ],
  }
};

const Tools = () => {
  const { lang, t } = useLanguage();
  const [activeCat, setActiveCat] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedHtml, setGeneratedHtml] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const fileInputRef = useRef(null);
  const [botChatHistory, setBotChatHistory] = useState([]);
  const [botChatInput, setBotChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [botConfig, setBotConfig] = useState(null);
  const chatMessagesEndRef = useRef(null);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [pendingToolId, setPendingToolId] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [chatbotTab, setChatbotTab] = useState('settings'); // 'settings' | 'simulator'
  const [mobileStep, setMobileStep] = useState(0); // stepper for meta-ads on mobile

  // Lock body scroll when modal is open (prevents background scroll-through on mobile)
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [modalOpen]);

  const handleToolClick = (id) => {
    setPendingToolId(id);
    setShowLeadForm(true);
  };

  const handleFetchStoreData = async (url) => {
    if (!url) return setErrorMsg('يرجى إدخال الرابط أولاً');
    setErrorMsg('');
    setIsFetchingData(true);
    try {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (!data.contents) throw new Error('لم نتمكن من جلب الصفحة');

      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');

      const scripts = doc.querySelectorAll('script, style, noscript, iframe, img, svg');
      scripts.forEach(s => s.remove());

      const pageText = doc.body.innerText.replace(/\s+/g, ' ').substring(0, 4000);

      const groqKey = import.meta.env.VITE_GROQ_API_KEY;
      const prompt = `أنت خبير في تحليل المتاجر الإلكترونية.
هذا نص مستخرج من موقع متجر إلكتروني:
---
${pageText}
---
استخرج البيانات التالية بصيغة JSON فقط بدون أي نص إضافي، استخدم المفاتيح التالية بدقة:
{
  "storeName": "اسم المتجر (إذا لم تجده خمنه من الرابط أو النص)",
  "storeNiche": "ماذا يبيع المتجر؟ (وصف موجز للمنتجات)",
  "shippingPolicy": "سياسة الشحن والتوصيل (إن وجدت، وإلا اكتب 'حسب سياسة المتجر القياسية')",
  "returnPolicy": "سياسة الاسترجاع (إن وجدت، وإلا اكتب 'حسب سياسة المتجر القياسية')",
  "offers": "عروض أو ميزة تنافسية (إن وجدت، وإلا اتركها فارغة)"
}`;

      const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          response_format: { type: 'json_object' }
        })
      });

      const aiData = await aiRes.json();
      if (aiData.error) throw new Error(aiData.error.message);

      let content = aiData.choices[0].message.content;
      // Strip markdown code blocks in case the LLM wrapped the JSON
      content = content.replace(/```json/gi, '').replace(/```/g, '').trim();
      const result = JSON.parse(content);

      setFieldValues(prev => ({
        ...prev,
        f1: result.storeName || prev.f1,
        f2: result.storeNiche || prev.f2,
        f4: result.shippingPolicy || prev.f4,
        f5: result.returnPolicy || prev.f5,
        f6: result.offers || prev.f6
      }));

    } catch (e) {
      console.error(e);
      setErrorMsg(`حدث خطأ أثناء السحب: ${e.message}. يرجى إدخال البيانات يدوياً.`);
    }
    setIsFetchingData(false);
  };

  const [adsPlatform, setAdsPlatform] = useState('meta');
  const [generatedAds, setGeneratedAds] = useState([]);
  const [activeAdTab, setActiveAdTab] = useState(0);

  const openTool = (id) => {
    setCurrentTool({ id, ...TOOLS_DATA[id] });
    setResult(null);
    setImageFile(null);
    setImagePreview(null);
    setGeneratedImage(null);
    setGeneratedHtml(null);
    setFieldValues({});
    setMobileStep(0);
    setGeneratedAds([]);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeTool = () => {
    setModalOpen(false);
    setImageFile(null);
    setImagePreview(null);
    setGeneratedImage(null);
    setGeneratedHtml(null);
    setBotConfig(null);
    setBotChatHistory([]);
    setBotChatInput('');
    setAdsPlatform('meta');
    setGeneratedAds([]);
    setActiveAdTab(0);
    document.body.style.overflow = '';
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (fieldId, value) => {
    setFieldValues(prev => ({ ...prev, [fieldId]: value }));
    setErrorMsg('');
  };

  const runImageGen = async () => {
    if (!imageFile) { alert('يرجى رفع صورة المنتج أولاً'); return; }

    setLoading(true);
    setGeneratedImage(null);
    setResult(null);
    setStatusMsg(' جاري إرسال الطلب');

    const HORDE_KEY = import.meta.env.VITE_HORDE_API_KEY || '0000000000';

    const productDesc = fieldValues['f2'] || 'luxury product';
    const envDesc = fieldValues['f3'] || 'white studio lighting';
    const genPrompt =
      `professional product photography, ${productDesc}, ${envDesc}, ` +
      `commercial photo, high quality, 4k, sharp details, beautiful lighting, e-commerce style`;

    try {
      const submitRes = await fetch('https://stablehorde.net/api/v2/generate/async', {
        method: 'POST',
        headers: {
          'apikey': HORDE_KEY,
          'Content-Type': 'application/json',
          'Client-Agent': 'fastgrowth:1.0:anonymous',
        },
        body: JSON.stringify({
          prompt: genPrompt,
          params: {
            sampler_name: 'k_euler',
            cfg_scale: 7.5,
            steps: 30,
            width: 512,
            height: 512,
            n: 1,
          },
          models: ['stable_diffusion'],
          r2: true,
        }),
      });

      if (!submitRes.ok) {
        const e = await submitRes.json().catch(() => ({}));
        throw new Error(e.message || `خطأ ${submitRes.status}`);
      }

      const { id } = await submitRes.json();
      setStatusMsg(` تم إرسال الطلب (ID: ${id.slice(0, 8)}) — جاري الانتظار`);

      let done = false;
      let waitSeconds = 0;
      while (!done) {
        await new Promise(r => setTimeout(r, 4000));
        waitSeconds += 4;

        const checkRes = await fetch(`https://stablehorde.net/api/v2/generate/check/${id}`, {
          headers: { 'Client-Agent': 'fastgrowth:1.0:anonymous' },
        });
        const check = await checkRes.json();

        if (check.faulted) { throw new Error('فشل التوليد على الخادم'); }
        if (check.done) { done = true; break; }

        const eta = check.wait_time || '...';
        setStatusMsg(` في الطابور... متبقي ~${eta} ثانية (${waitSeconds}ث مضت)`);

        if (waitSeconds > 300) throw new Error('انتهى وقت الانتظار (5 دقائق)');
      }

      setStatusMsg(' جاري تحميل الصورة');
      const statusRes = await fetch(`https://stablehorde.net/api/v2/generate/status/${id}`, {
        headers: { 'Client-Agent': 'fastgrowth:1.0:anonymous' },
      });
      const statusData = await statusRes.json();
      const imgUrl = statusData.generations?.[0]?.img;

      if (!imgUrl) throw new Error('لم يتم إرجاع صورة');

      if (imgUrl.startsWith('http')) {
        setGeneratedImage(imgUrl);
      } else {
        setGeneratedImage(`data:image/webp;base64,${imgUrl}`);
      }
      setStatusMsg('');
      saveToolDataToSupabase('مولد صور المنتجات', fieldValues, imgUrl);

    } catch (err) {
      console.error('Horde Error:', err);
      setResult(` ${err.message}`);
    }

    setLoading(false);
    setStatusMsg('');
  };

  const runStoreDesign = async () => {
    setLoading(true);
    setResult(null);
    setGeneratedHtml(null);
    setStatusMsg(' جاري إرسال الطلب لذكاء Gemini (سريع جداً)');

    try {
      const storeType = fieldValues['f1'] || 'منتجات عامة';
      const audience = fieldValues['f2'] || 'الجميع';
      const platform = fieldValues['f3'] || 'سلة';
      const style = fieldValues['f4'] || 'بسيط وحديث';

      const promptText = `صمم صفحة رئيسية لمتجر إلكتروني يبيع ${storeType}، الجمهور المستهدف: ${audience}، وطابع التصميم: ${style}. المنصة المفضلة: ${platform}.
استخدم Tailwind CSS مع دعم اللغة العربية (RTL). يجب أن يحتوي على شريط تنقل (Header) مع اسم المتجر، قسم ترحيبي (Hero)، وقسم للمنتجات المميزة.`;

      const animaKeys = [
        import.meta.env.VITE_ANIMA_WEBSITE_KEY_1,
        import.meta.env.VITE_ANIMA_WEBSITE_KEY_2,
        import.meta.env.VITE_ANIMA_WEBSITE_KEY_3,
        import.meta.env.VITE_ANIMA_WEBSITE_KEY_4,
        import.meta.env.VITE_ANIMA_WEBSITE_KEY_5,
        import.meta.env.VITE_ANIMA_WEBSITE_KEY_6
      ].filter(Boolean);
      const ANIMA_KEY = animaKeys.length > 0 ? animaKeys[Math.floor(Math.random() * animaKeys.length)] : null;
      if (!ANIMA_KEY) throw new Error('مفتاح Anima API غير متوفر في ملف .env.local');

      setStatusMsg(' جاري بناء واجهة المتجر باستخدام Anima (قد يستغرق 1-3 دقائق)');

      const { Anima } = await import('@animaapp/anima-sdk');
      const anima = new Anima({ auth: { token: ANIMA_KEY }, apiBaseAddress: '/anima-api' });

      const response = await anima.generateCodeFromPrompt({
        prompt: promptText,
        settings: {
          framework: 'html',
          styling: 'tailwind'
        }
      });

      if (response && response.files && Object.keys(response.files).length > 0) {
        const fileKeys = Object.keys(response.files);
        let indexHtml = response.files['index.html'] || response.files['App.jsx'] || response.files[fileKeys[0]];

        if (typeof indexHtml === 'object' && indexHtml !== null) {
          indexHtml = indexHtml.content || indexHtml.source || JSON.stringify(indexHtml);
        }

        setGeneratedHtml(indexHtml);
        saveToolDataToSupabase('تصميم متجرك', fieldValues, 'تم توليد التصميم بنجاح');
      } else {
        throw new Error('لم يتم استلام كود التصميم من الخادم');
      }
    } catch (err) {
      console.error(err);
      setResult(` تعذر توليد التصميم: ${err.message}`);
    }

    setLoading(false);
    setStatusMsg('');
  };

  const runChatbotMaker = () => {
    setErrorMsg('');
    const storeInfo = fieldValues['f1'];
    const botTone = fieldValues['f2'] || 'ودية (لهجة عامية)';
    const storePolicies = fieldValues['f3'] || 'حسب سياسة المتجر القياسية';
    const otherRules = fieldValues['f4'] || 'لا توجد تعليمات إضافية';

    // يتم تحديد المحرك برمجياً (مخفي عن المستخدم)
    const aiEngine = 'groq'; // Options: 'groq', 'gemini', 'claude'

    const keys = {
      groq: import.meta.env.VITE_GROQ_API_KEY,
      gemini: import.meta.env.VITE_GEMINI_API_KEY,
      claude: import.meta.env.VITE_ANTHROPIC_API_KEY
    };

    if (!storeInfo) {
      setErrorMsg("يرجى إدخال اسم المتجر ومجاله للبدء");
      return;
    }

    setLoading(true);

    // Simulate training delay for better UX
    setTimeout(() => {
      setBotConfig({ storeInfo, botTone, storePolicies, otherRules, aiEngine, keys });
      setBotChatHistory([{ role: 'model', text: `أهلاً بك! أنا المساعد الذكي للمتجر. كيف أقدر أخدمك اليوم؟` }]);
      setResult(' تم تدريب الشات بوت بنجاح! جرب المحادثة معه الآن لتختبر مهارته في الرد على عملائك.');
      saveToolDataToSupabase('صانع شات بوت لمتجرك', fieldValues, 'تم تدريب الشات بوت بنجاح بناء على المعطيات المحددة.');
      setLoading(false);

      // Auto-switch to simulator tab on mobile
      if (window.innerWidth <= 600) {
        setChatbotTab('simulator');
      }

      // Auto-scroll to simulator
      setTimeout(() => {
        const simContainer = document.getElementById('chatbot-simulator');
        if (simContainer) {
          simContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 1500);
  };

  const sendBotMessage = async () => {
    if (!botChatInput.trim() || isBotTyping || !botConfig) return;

    const newHistory = [...botChatHistory, { role: 'user', text: botChatInput }];
    setBotChatHistory(newHistory);
    setBotChatInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      const systemInstruction = `أنت المساعد الذكي ومندوب المبيعات الخبير لمتجرنا. 
بيانات المتجر وماذا يبيع: ${botConfig.storeInfo}.
نبرة الرد المطلوبة منك: ${botConfig.botTone}.

بيانات وسياسات المتجر (التي يجب أن تلتزم بها حرفياً ولا تخالفها أبدأ):
- ${botConfig.storePolicies}
- تعليمات وقوانين إضافية للردود: ${botConfig.otherRules}

تعليمات الأداء العالي والالتزام التام (لإبهار العميل وزيادة المبيعات):
1. الالتزام الصارم بمجال المتجر (Domain Restriction): يُمنع منعاً باتاً التحدث، التلميح، أو الإجابة عن أي منتجات أو مجالات أخرى خارج إطار المتجر المذكور أعلاه. إذا سألك العميل عن شيء خارج مجالك، اعتذر بلباقة ووضح له تخصص المتجر فقط.
2. الترحيب واللباقة: كن مرحباً جداً، واستخدم لغة تعكس احترافية وفخامة المتجر وتزيد من ثقة العميل.
3. ذكاء المبيعات (Sales-Oriented): حاول دائماً بذكاء ولطف توجيه العميل لإتمام الشراء، وشجعه باستخدام "العروض الحالية" المتاحة لتعطيه إحساساً بالفرصة.
4. الإجابات الذكية والمباشرة: لا تكتب فقرات طويلة مملة. أعطِ الخلاصة بأسلوب جذاب ومقنع، واستخدم الإيموجي المناسب (بدون مبالغة).
5. المنع البات للتأليف (Zero Hallucination): إذا سألك العميل عن معلومة أو سياسة غير موجودة في البيانات أعلاه ضمن مجالكم، قل بكل لباقة: "أعتذر منك، ليس لدي تفاصيل دقيقة عن هذا حالياً، لكن يسعدنا تواصلك مع خدمة العملاء". لا تخترع أسعاراً أو وعوداً من عندك أبداً.
6. الالتزام التام بالنبرة: تأكد 100% أن أسلوبك وكلماتك تتطابق تماماً مع النبرة المطلوبة (${botConfig.botTone}).`;

      let botReply = '';

      if (botConfig.aiEngine === 'groq') {
        const messages = [
          { role: 'system', content: systemInstruction },
          ...newHistory.map(msg => ({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: msg.text
          }))
        ];
        const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${botConfig.keys.groq}`
          },
          body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: messages, temperature: 0.7 })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        botReply = data.choices[0].message.content;

      } else if (botConfig.aiEngine === 'gemini') {
        const contents = newHistory.map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${botConfig.keys.gemini}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: { text: systemInstruction } },
            contents: contents
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        botReply = data.candidates[0].content.parts[0].text;

      } else if (botConfig.aiEngine === 'claude') {
        const messages = newHistory.map(msg => ({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.text
        }));
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': botConfig.keys.claude,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            system: systemInstruction,
            messages: messages
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        botReply = data.content[0].text;
      }
      setBotChatHistory(prev => {
        const updated = [...prev, { role: 'model', text: botReply }];
        setTimeout(() => chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        return updated;
      });
    } catch (e) {
      setBotChatHistory(prev => [...prev, { role: 'model', text: 'عذراً، تأكد من صحة مفتاح الـ API. خطأ: ' + e.message }]);
    }
    setIsBotTyping(false);
  };

  const runMetaAds = async () => {
    setErrorMsg('');
    const productName = fieldValues['f1'];
    const productDesc = fieldValues['f2'];
    const audience = fieldValues['f3'];
    const goal = fieldValues['f4'];

    if (!productName || !productDesc) {
      setErrorMsg("يرجى إدخال اسم المنتج ووصفه باختصار");
      return;
    }

    setLoading(true);
    setGeneratedAds([]);
    setActiveAdTab(0);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      const platformName = adsPlatform === 'meta' ? 'Meta (فيسبوك وإنستجرام)' : adsPlatform === 'google' ? 'Google Ads' : 'TikTok';

      const systemInstruction = `أنت واحد من أفضل خبراء كتابة الإعلانات (Senior Copywriter) في العالم العربي المتخصصين في إعلانات ${platformName}، وتمتلك خبرة تفوق 10 سنوات في علم النفس الاستهلاكي وزيادة المبيعات (CRO). طلب منك العميل كتابة 3 إعلانات احترافية جداً.
بيانات الحملة:
- اسم المنتج/الخدمة: ${productName}
- وصف المنتج: ${productDesc}
- الجمهور المستهدف: ${audience || 'غير محدد'}
- هدف الحملة: ${goal || 'غير محدد'}

المطلوب:
اكتب 3 إعلانات جذابة، كل إعلان يعتمد على استراتيجية تسويقية مختلفة (مثلاً: إعلان قصصي يلامس مشاعر العميل، إعلان مباشر يركز على الحل السحري للمشكلة، وإعلان مبني على الندرة FOMO).
تحذير وتوجيه احترافي: سر نجاحك كخبير هو أن كتاباتك تبدو طبيعية وعفوية 100% ولا يظهر عليها أبداً أنها مولدة آلياً. استخدم لغة بشرية جذابة، مقنعة، وتخاطب رغبات ومخاوف العميل العميقة. تجنب تماماً المصطلحات الآلية المكررة.
يجب أن تفصل بين كل إعلان والآخر بكلمة ---AD_SPLIT--- بالضبط (في سطر منفصل) لكي أستطيع برمجياً فصلها. 
لا تكتب أي مقدمات أو خاتمة أو أرقام قبل الإعلانات، فقط نصوص الإعلانات الثلاثة مفصولة بالكلمة المحددة.
استخدم الإيموجي بذكاء كخبير تسويق، وضع CTA (دعوة لاتخاذ إجراء) قوي، صريح، ومباشر في نهاية كل إعلان متوافق مع المنصة المختارة.`;

      const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: systemInstruction }],
          temperature: 0.7
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      const content = data.choices[0].message.content;
      let adsArray = content.split('---AD_SPLIT---').map(ad => ad.trim()).filter(ad => ad.length > 0);

      if (adsArray.length < 3) {
        adsArray = [
          adsArray[0] || 'خطأ في التوليد',
          adsArray[1] || 'لم يتم توليد هذا الإعلان بشكل صحيح بسبب نقص البيانات، حاول مرة أخرى.',
          adsArray[2] || 'لم يتم توليد هذا الإعلان بشكل صحيح بسبب نقص البيانات، حاول مرة أخرى.'
        ];
      }

      setGeneratedAds(adsArray.slice(0, 3));
      saveToolDataToSupabase('مولد إعلانات احترافية', fieldValues, adsArray.slice(0, 3));

      // Auto-scroll to results on mobile
      setTimeout(() => {
        const resultsContainer = document.getElementById('meta-ads-results');
        const modalContainer = document.getElementById('meta-ads-modal');
        if (resultsContainer && modalContainer && window.innerWidth <= 600) {
          modalContainer.scrollTo({ top: resultsContainer.offsetTop, behavior: 'smooth' });
        }
      }, 100);

    } catch (err) {
      console.error(err);
      setErrorMsg('حدث خطأ أثناء توليد الإعلانات: ' + err.message);
    }
    setLoading(false);
  };

  const runStoreAudit = async () => {
    setErrorMsg('');
    setResult(null);
    const url = fieldValues['f1'];
    const niche = fieldValues['f2'];

    if (!url || !niche) {
      setErrorMsg('يرجى إدخال رابط الموقع ومجال العمل أولاً');
      return;
    }

    setLoading(true);
    setStatusMsg('جاري فحص المتجر ...');

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      const prompt = `بصفتك خبيراً استراتيجياً في تحسين محركات البحث (SEO) وتجربة المستخدم (UI/UX) لمواقع التجارة الإلكترونية، قم بإجراء تحليل شامل للموقع الإلكتروني التالي:
الرابط: ${url}
مجال العمل: ${niche}

يجب أن يركز التحليل على تقديم توصيات عملية وقابلة للتنفيذ تغطي النقاط التالية بدقة:

أولاً: تحليل تجربة المستخدم وواجهة المستخدم (UI/UX)
- تحليل مسار المستخدم (User Journey): تقييم سهولة التنقل، تحديد نقاط الاحتكاك، واقتراح تحسينات لمسار الدفع.
- تحسينات صفحة المنتج (Product Page Optimization): تحليل ووضوح المعلومات، إبراز عناصر بناء الثقة، وتقييم قسم المنتجات الموصى بها.
- وظائف البحث والتصفية (Search & Filtering): تقييم دقة البحث وفلاتر المنتجات.

ثانياً: تحليل تحسين محركات البحث (SEO)
- التحليل التقني (Technical SEO): أداء الموقع (Core Web Vitals)، البيانات المنظمة (Schema Markup)، والروابط الأساسية (Canonicalization).
- استراتيجية المحتوى والكلمات المفتاحية (On-Page SEO): الكلمات المفتاحية الطويلة الذيل، تحليل صفحات الفئات، وعناوين الصفحات والأوصاف التعريفية.

المخرجات النهائية المطلوبة:
يجب أن تعيد كود HTML نقي فقط (بدون أي نصوص خارج الكود، وبدون تنسيق Markdown أو ${'```'}html). يجب أن يكون الهيكل مطابقاً تماماً لهذا القالب:

<div class="audit-report">
  <div class="audit-header">
    <h2>تقرير تحليل استراتيجي لمتجر [استخرج اسم المتجر من الرابط]</h2>
    <div class="url">عن الموقع: ${url}</div>
    <div class="audit-date" style="font-size: 0.95rem; color: #7AAEC5; margin-top: 0.5rem; font-weight: 700;">تاريخ الفحص: ${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
  </div>
  <div class="audit-desc">يقدم هذا التقرير تحليلاً مفصلاً لتجربة المستخدم وتحسين محركات البحث لموقعك، مع اقتراح حلول عملية لرفع معدلات التحويل وتحسين ظهور الموقع.</div>
  
  <div class="audit-section-title">1. جدول تحليل تجربة المستخدم UI/UX</div>
  <table class="audit-table">
    <thead>
      <tr>
        <th>الجانب المستهدف</th>
        <th>المشكلة المحددة</th>
        <th>الحل المقترح</th>
        <th>الأولوية</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>[اسم الجانب]</td>
        <td>[وصف المشكلة]</td>
        <td>[وصف الحل]</td>
        <td><span class="priority-[high|medium|low]">عالية/متوسطة/منخفضة</span></td>
      </tr>
      <!-- كرر الصفوف لكل جانب -->
    </tbody>
  </table>

  <div class="audit-section-title">2. جدول تحليل تحسين محركات البحث SEO</div>
  <table class="audit-table">
    <thead>
      <tr>
        <th>الجانب التقني</th>
        <th>المشكلة المحددة</th>
        <th>الحل المقترح</th>
        <th>الأولوية</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>[اسم الجانب]</td>
        <td>[وصف المشكلة]</td>
        <td>[وصف الحل]</td>
        <td><span class="priority-[high|medium|low]">عالية/متوسطة/منخفضة</span></td>
      </tr>
      <!-- كرر الصفوف لكل جانب -->
    </tbody>
  </table>

  <div class="audit-section-title">3. جدول ملخص التوصيات التنفيذي</div>
  <table class="audit-table">
    <thead>
      <tr>
        <th>التوصية</th>
        <th>الإجراء المطلوب</th>
        <th>التأثير المتوقع</th>
        <th>الأولوية</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>[وصف التوصية]</td>
        <td>[وصف الإجراء]</td>
        <td>[التأثير]</td>
        <td><span class="priority-[high|medium|low]">عالية/متوسطة/منخفضة</span></td>
      </tr>
      <!-- كرر الصفوف لكل جانب -->
    </tbody>
  </table>
</div>

تأكد من استخدام الكلاسات priority-high (للعالية), priority-medium (للمتوسطة), priority-low (للمنخفضة).
لا تكتب أي مقدمات أو خاتمات خارج هذا الكود.`;

      const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      let htmlContent = data.choices[0].message.content;
      htmlContent = htmlContent.replace(/```html/g, '').replace(/```/g, '');
      setResult(htmlContent);
      saveToolDataToSupabase('محلل نقاط ضعف المتجر', fieldValues, htmlContent);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء فحص المتجر: ' + err.message);
    }
    setLoading(false);
    setStatusMsg('');
  };

  const runTool = () => {
    if (currentTool?.id === 'chatbot-maker') {
      runChatbotMaker();
      return;
    }
    if (currentTool?.id === 'meta-ads') {
      runMetaAds();
      return;
    }
    if (currentTool?.id === 'image-gen') {
      runImageGen();
      return;
    }
    if (currentTool?.id === 'store-design') {
      runStoreDesign();
      return;
    }
    if (currentTool?.id === 'store-audit') {
      runStoreAudit();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResult('هذه واجهة تجريبية. سيتم ربط باقي الأدوات قريباً بالذكاء الاصطناعي.');
      setLoading(false);
    }, 1500);
  };

  const downloadPdf = () => {
    const element = document.getElementById('audit-report-content');
    if (!element) return;
    const opt = {
      margin: [10, 10, 15, 10], // top, left, bottom, right
      filename: 'store-audit-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#111111' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      pagebreak: { mode: ['css', 'legacy'], avoid: ['tr', '.audit-section-title', '.audit-desc'] }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <>
      <LeadCaptureModal
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        onSuccess={() => {
          setShowLeadForm(false);
          if (pendingToolId) openTool(pendingToolId);
        }}
      />
      <section id="tools">
        <div className="tools-inner">
          <div className="section-header reveal" style={{ textAlign: 'center' }}>
            <div className="section-eyebrow"> {lang === 'ar' ? 'أدوات ذكية مجانية' : 'Free Smart Tools'}</div>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: lang === 'ar' ? 'نحل مشكلاتك الفعلية<br />بأدوات ذكية ومخصصة' : 'Solving your real problems<br />with custom smart tools' }}></h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>{lang === 'ar' ? 'أدوات مدعومة بالذكاء الاصطناعي صممناها خصيصاً لأصحاب المتاجر الإلكترونية — استخدمها مجاناً الآن' : 'AI-powered tools designed specifically for e-commerce owners — use them for free now'}</p>
          </div>

          <div className="tools-grid reveal" id="toolsGrid">
            {(activeCat === 'all' || activeCat === 'ads') && (
              <div className="tool-card" onClick={() => handleToolClick('meta-ads')}>
                <div className="tool-card-top"><div className="tool-icon"></div><span className="tool-badge badge-ai">AI</span></div>
                <div><div className="tool-name">{lang === 'ar' ? 'مولد إعلانات احترافية' : 'Pro Ads Generator'}</div><div className="tool-desc">{lang === 'ar' ? 'أنشئ إعلانات جذابة لجميع المنصات (Meta, Google, TikTok)' : 'Create catchy ads for all platforms (Meta, Google, TikTok)'}</div></div>
                <div className="tool-tags"><span className="tool-tag">Facebook</span><span className="tool-tag">Instagram</span><span className="tool-tag">Reels</span></div>
                <div className="tool-trigger">{lang === 'ar' ? 'جرب الأداة' : 'Try Tool'} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></div>
              </div>
            )}
            {(activeCat === 'all' || activeCat === 'analysis') && (
              <div className="tool-card" onClick={() => handleToolClick('store-audit')}>
                <div className="tool-card-top"><div className="tool-icon"></div><span className="tool-badge badge-ai">AI</span></div>
                <div><div className="tool-name">{lang === 'ar' ? 'محلل نقاط ضعف المتجر' : 'Store Weakness Analyzer'}</div><div className="tool-desc">{lang === 'ar' ? 'صف متجرك واحصل على تحليل فوري لأهم نقاط الضعف ومقترحات تحسين عملية' : 'Describe your store and get instant analysis of weaknesses and improvement tips'}</div></div>
                <div className="tool-tags"><span className="tool-tag">Shopify</span><span className="tool-tag">Salla</span><span className="tool-tag">Zid</span></div>
                <div className="tool-trigger">{lang === 'ar' ? 'جرب الأداة' : 'Try Tool'} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></div>
              </div>
            )}


            {(activeCat === 'all' || activeCat === 'support') && (
              <div className="tool-card" onClick={() => handleToolClick('chatbot-maker')}>
                <div className="tool-card-top"><div className="tool-icon"></div><span className="tool-badge badge-ai">SaaS</span></div>
                <div><div className="tool-name">{lang === 'ar' ? 'صانع شات بوت لمتجرك' : 'Store Chatbot Maker'}</div><div className="tool-desc">{lang === 'ar' ? 'درب شات بوت ذكي على منتجاتك وسياساتك، جربه بنفسك، لتختبر مهارته.' : 'Train a smart chatbot on your products and policies, and test it yourself.'}</div></div>
                <div className="tool-tags"><span className="tool-tag">{lang === 'ar' ? 'خدمة العملاء' : 'CS'}</span><span className="tool-tag">{lang === 'ar' ? 'شات بوت' : 'Chatbot'}</span></div>
                <div className="tool-trigger">{lang === 'ar' ? 'جرب الأداة' : 'Try Tool'} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></div>
              </div>
            )}

            {(activeCat === 'all' || activeCat === 'design') && (
              <div className="tool-card" onClick={() => handleToolClick('store-design')}>
                <div className="tool-card-top"><div className="tool-icon"></div><span className="tool-badge badge-ai">AI</span></div>
                <div><div className="tool-name">{lang === 'ar' ? 'تصميم متجرك' : 'Store Design'}</div><div className="tool-desc">{lang === 'ar' ? 'احصل على مقترحات احترافية للألوان، الخطوط، وهيكل الصفحة الرئيسية لمتجرك لزيادة المبيعات' : 'Get professional color, font, and layout suggestions to increase sales'}</div></div>
                <div className="tool-tags"><span className="tool-tag">UI/UX</span><span className="tool-tag">{lang === 'ar' ? 'ألوان' : 'Colors'}</span><span className="tool-tag">{lang === 'ar' ? 'تجربة المستخدم' : 'UX'}</span></div>
                <div className="tool-trigger">{lang === 'ar' ? 'جرب الأداة' : 'Try Tool'} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className={`tool-modal-overlay ${modalOpen ? 'open' : ''}`} onClick={(e) => { if (e.target.classList.contains('tool-modal-overlay')) closeTool(); }}>
        {currentTool && currentTool.id === 'store-design' && (
          <div className="w-[95vw] xl:w-[90vw] max-w-[1400px] h-[95vh] xl:h-[90vh] rounded-[2.5rem] relative flex flex-col bg-[#111111] border border-[#D84B1A]/30 shadow-[0_0_40px_rgba(216,75,26,0.2)] overflow-hidden" onClick={(e) => e.stopPropagation()} dir="rtl">
            <CodingAI hasBooked={true} onBooking={() => { }} onClose={closeTool} />
          </div>
        )}
        {currentTool && currentTool.id === 'chatbot-maker' && (
          <div className="w-[95vw] xl:w-[90vw] max-w-[1400px] h-[95vh] xl:h-[90vh] rounded-[2.5rem] relative flex flex-col bg-[#111111] border border-[#D84B1A]/30 shadow-[0_0_40px_rgba(216,75,26,0.2)] overflow-hidden" onClick={(e) => e.stopPropagation()} dir="rtl">

            {/* Mobile Header (Pinned completely to the top, outside scroll area) */}
            <div className="hidden max-[600px]:block relative text-center shrink-0 z-[70] bg-[#111111] shadow-[0_10px_30px_rgba(2,8,14,0.5)] border-b border-[#D84B1A]/20" style={{ paddingTop: '20px', paddingBottom: '16px' }}>
              <button className="z-[100] w-[36px] h-[36px] flex items-center justify-center rounded-full border-none cursor-pointer transition-all hover:bg-[#ff4b4b] hover:text-white" style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(255, 75, 75, 0.1)', color: '#ff4b4b' }} onClick={closeTool}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <h3 className="text-xl font-bold text-white px-14">إعدادات الشات بوت</h3>
            </div>

            {/* Content Area: Side-by-side on desktop, stacked on mobile */}
            <div className="flex-1 flex flex-row max-[600px]:flex-col min-h-0 gap-3 p-3 max-[600px]:p-0 max-[600px]:gap-0 max-[600px]:overflow-y-auto">

              {/* Right Column: Settings / Inputs */}
              <div className="w-[48%] max-[600px]:w-full shrink-0 flex flex-col h-full max-[600px]:h-auto">
                {/* Desktop Header Section (Hidden on mobile) */}
                <div className="relative text-center shrink-0 sticky top-0 z-[60] bg-[#111111] max-[600px]:hidden" style={{ paddingTop: '32px', paddingBottom: '24px' }}>
                  {/* Desktop Close Button (Fixed on the Right) */}
                  <button className="z-[100] w-[36px] h-[36px] flex items-center justify-center rounded-full border-none cursor-pointer transition-all hover:bg-[#ff4b4b] hover:text-white" style={{ position: 'absolute', top: '32px', right: '32px', backgroundColor: 'rgba(255, 75, 75, 0.1)', color: '#ff4b4b' }} onClick={closeTool}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                  <h3 className="text-lg font-bold text-white px-14">إعدادات الشات بوت</h3>
                </div>
                
                {/* Settings Fields Container */}
                <div className="flex-1 overflow-y-auto px-1 pb-4 max-[600px]:pt-6 flex flex-col justify-center gap-6 max-[600px]:gap-4 max-[600px]:px-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d84b1a transparent' }}>
                  {currentTool.fields.map((field) => {
                    return (
                    <div key={field.id} className="flex flex-col gap-4 mb-4 shrink-0">
                      <label className="text-base font-bold text-white/90" style={{ paddingRight: '16px' }}>{field.label}</label>
                      {field.type === 'fetch-link' && (
                        <div className="flex max-[600px]:flex-col gap-2">
                          <input
                            className="flex-1 p-4 rounded-2xl bg-[#02080e] border border-[#D84B1A]/10 text-white placeholder-white/20 focus:border-[#D84B1A] focus:outline-none transition-all text-[16px] min-h-[54px] shrink-0"
                            placeholder={field.placeholder}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            value={fieldValues[field.id] || ''}
                            dir="ltr"
                            style={{ color: '#fff', paddingTop: '24px', paddingRight: '16px', paddingBottom: '16px', paddingLeft: '16px' }}
                          />
                          <button
                            onClick={() => handleFetchStoreData(fieldValues[field.id])}
                            disabled={isFetchingData}
                            className="px-4 py-3 bg-[#D84B1A] text-[#02080e] font-bold rounded-2xl whitespace-nowrap hover:bg-[#ff5a1f] transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed text-[16px] min-h-[54px] shrink-0"
                          >
                            {isFetchingData ? 'جاري السحب...' : 'سحب البيانات'}
                          </button>
                        </div>
                      )}
                      {field.type === 'input' && (
                        <input
                          className="p-4 rounded-2xl bg-[#02080e] border border-[#D84B1A]/10 text-white placeholder-white/20 focus:border-[#D84B1A] focus:outline-none transition-all text-[16px] min-h-[54px] shrink-0"
                          placeholder={field.placeholder}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          value={fieldValues[field.id] || ''}
                          style={{ color: '#fff', paddingTop: '24px', paddingRight: '16px', paddingBottom: '16px', paddingLeft: '16px' }}
                        />
                      )}
                      {field.type === 'select' && (
                        <div className="relative">
                          <select
                            className="w-full p-4 rounded-2xl bg-[#02080e] border border-[#D84B1A]/10 text-white focus:border-[#D84B1A] focus:outline-none transition-all appearance-none text-[16px] min-h-[54px] shrink-0"
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            value={fieldValues[field.id] || field.options[0]}
                            style={{ color: '#fff', paddingTop: '24px', paddingRight: '16px', paddingBottom: '16px', paddingLeft: '16px' }}
                          >
                            {field.options.map(opt => <option key={opt}>{opt}</option>)}
                          </select>
                          <svg className="absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#D84B1A] pointer-events-none" style={{ left: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      )}
                      {field.type === 'textarea' && (
                        <textarea
                          className="p-4 rounded-2xl bg-[#02080e] border border-[#D84B1A]/10 text-white placeholder-white/20 focus:border-[#D84B1A] focus:outline-none transition-all resize-y text-[16px] min-h-[100px] shrink-0"
                          placeholder={field.placeholder}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          value={fieldValues[field.id] || ''}
                          style={{ color: '#fff', paddingTop: '32px', paddingRight: '16px', paddingBottom: '16px', paddingLeft: '16px', lineHeight: '1.8' }}
                        ></textarea>
                      )}
                    </div>
                  )})}
                </div>
                <div className="shrink-0 bg-[#02080e] max-[600px]:hidden" style={{ padding: '14px 20px 24px', marginTop: 'auto' }}>
                  {errorMsg && (
                    <div style={{ color: '#ff4b4b', background: 'rgba(255,75,75,0.1)', border: '1px solid rgba(255,75,75,0.2)', padding: '0.5rem', borderRadius: '10px', marginBottom: '0.5rem', fontSize: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>
                      ️ {errorMsg}
                    </div>
                  )}
                  <button
                    className="group w-full bg-gradient-to-r from-[#D84B1A] to-[#A83010] font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(216,75,26,0.2)] hover:opacity-90 border border-[#D84B1A]/30"
                    style={{ padding: '16px', color: '#fff', fontSize: '18px', border: 'none', fontFamily: "'Alexandria', sans-serif", borderRadius: '12px' }}
                    onClick={runTool}
                    disabled={loading}
                  >
                    {loading ? 'جاري المعالجة...' : (
                      <>
                        تدريب الشات بوت
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Left Column: Result / Chat Simulator */}
              <div id="chatbot-simulator" className="flex-1 min-w-0 max-[600px]:w-full rounded-3xl max-[600px]:rounded-none border border-[#D84B1A]/30 max-[600px]:border-0 bg-[#02080e] flex flex-col overflow-hidden relative shadow-[0_0_30px_rgba(216,75,26,0.05)] max-[600px]:min-h-[500px]">
                <div className="flex-1 p-6 flex flex-col">
                  {!botConfig ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                      <div className="w-24 h-24 mb-6 rounded-full bg-[#D84B1A]/10 flex items-center justify-center relative">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D84B1A" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#D84B1A] text-[#111111] rounded-full flex items-center justify-center text-xs font-bold">?</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-white">بانتظار البيانات...</h3>
                      <p className="text-xs tracking-widest text-[#D84B1A] uppercase mt-2">READY TO TRAIN YOUR CHATBOT</p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col bg-[#02080e] rounded-xl border border-[#D84B1A]/20 overflow-hidden">
                      <div className="bg-[#02080e] flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                        {botChatHistory.map((msg, idx) => (
                          <div key={idx} style={{
                            background: msg.role === 'model' ? '#111111' : '#d84b1a', color: msg.role === 'model' ? '#fff' : '#02080e', padding: '14px 18px', borderRadius: '16px', borderBottomLeftRadius: msg.role === 'model' ? '4px' : '16px', borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px', alignSelf: msg.role === 'model' ? 'flex-start' : 'flex-end', maxWidth: '85%', fontSize: '15px', lineHeight: '1.6', border: msg.role === 'model' ? '1px solid rgba(216,75,26,0.2)' : 'none'
                          }}>
                            {msg.text}
                          </div>
                        ))}
                        {isBotTyping && <div style={{ background: '#111111', color: '#fff', padding: '14px 18px', borderRadius: '16px', borderBottomLeftRadius: '4px', alignSelf: 'flex-start', fontSize: '15px', border: '1px solid rgba(216,75,26,0.2)' }}>... يكتب الآن</div>}
                        <div ref={chatMessagesEndRef} />
                      </div>
                      <div className="p-4 bg-[#111111] border-t border-[#D84B1A]/20">
                        <div className="relative flex items-center w-full">
                          <input className="w-full py-4 min-h-[60px] rounded-full border border-[#D84B1A]/20 bg-[#02080e] text-white outline-none text-[16px] focus:border-[#D84B1A]" style={{ paddingRight: '24px', paddingLeft: '70px', color: '#ffffff' }} placeholder="اكتب رسالتك لتجربة البوت..." value={botChatInput} onChange={e => setBotChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendBotMessage()} />
                          <button onClick={sendBotMessage} className="absolute bg-[#d84b1a] text-[#02080e] border-none rounded-full w-[44px] h-[44px] flex items-center justify-center cursor-pointer hover:bg-[#E05A2A] transition-colors shadow-lg" style={{ left: '8px', right: 'auto' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Footer (Pinned completely to the bottom, outside scroll area) */}
            <div className="hidden max-[600px]:block shrink-0 z-[70] bg-[#02080e] border-t border-[#D84B1A]/20" style={{ padding: '14px 20px 24px' }}>
              {errorMsg && (
                <div style={{ color: '#ff4b4b', background: 'rgba(255,75,75,0.1)', border: '1px solid rgba(255,75,75,0.2)', padding: '0.5rem', borderRadius: '10px', marginBottom: '0.5rem', fontSize: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>
                  ️ {errorMsg}
                </div>
              )}
              <button
                className="group w-full bg-gradient-to-r from-[#D84B1A] to-[#A83010] font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(216,75,26,0.2)] hover:opacity-90 border border-[#D84B1A]/30"
                style={{ padding: '16px', color: '#fff', fontSize: '18px', border: 'none', fontFamily: "'Alexandria', sans-serif", borderRadius: '12px' }}
                onClick={runTool}
                disabled={loading}
              >
                {loading ? 'جاري المعالجة...' : (
                  <>
                    تدريب الشات بوت
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-arrow"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  </>
                )}
              </button>
            </div>

          </div>
        )}
        {currentTool && currentTool.id === 'meta-ads' && (
          <div id="meta-ads-modal" className="relative flex flex-row max-[600px]:flex-col shadow-[0_0_40px_rgba(216,75,26,0.2)]" onClick={(e) => e.stopPropagation()} dir="rtl" style={{ width: '90vw', maxWidth: '1400px', height: '90vh', borderRadius: '24px', backgroundColor: '#1E0942', border: '1px solid rgba(216,75,26,0.3)', padding: '24px', gap: '24px' }}>
            <style>{`
              #meta-ads-modal::-webkit-scrollbar-track {
                background: transparent;
                margin: 40px 0;
              }
            `}</style>
            {/* Right Side: Settings & Form */}
            <div className="shrink-0 flex flex-col h-full relative" style={{ width: '420px', maxWidth: '100%' }}>
              <style>{`
                @media (max-width: 600px) {
                  #meta-ads-modal {
                    width: 100vw !important;
                    max-width: 100vw !important;
                    height: 100dvh !important;
                    border-radius: 0 !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    flex-direction: column !important;
                    overflow: hidden !important;
                  }
                  .meta-ads-form-col {
                    width: 100% !important;
                    height: 100dvh !important;
                    display: flex !important;
                    flex-direction: column !important;
                  }
                  .meta-ads-form-scroll {
                    flex: 1 !important;
                    overflow-y: auto !important;
                    padding-bottom: 0 !important;
                  }
                  .meta-ads-btn-sticky {
                    position: sticky !important;
                    bottom: 0 !important;
                    background: #1E0942 !important;
                    padding: 14px 20px 24px !important;
                    border-top: 1px solid rgba(216,75,26,0.15) !important;
                    z-index: 10 !important;
                  }
                  .meta-ads-results-col { display: none !important; }
                  .meta-ads-close-desktop { display: none !important; }
                  .meta-ads-close-mobile { display: flex !important; }
                  .platform-btn {
                    padding: 10px 4px !important;
                    font-size: 13px !important;
                    flex: 1 1 0% !important;
                    min-width: 0 !important;
                  }
                  .platform-container {
                    width: 100% !important;
                    gap: 4px !important;
                  }
                }
                 @media (min-width: 601px) {
                  .meta-ads-close-mobile { display: none !important; }
                  .meta-ads-platform-tabs { display: none !important; }
                  .platform-btn {
                    padding: 12px 36px;
                    font-size: 15px;
                  }
                }
              `}</style>

              {/* Mobile Top Bar: close + title */}
              <div className="meta-ads-close-mobile hidden" style={{ flexShrink: 0, position: 'relative', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(216,75,26,0.12)' }}>
                <button
                  onClick={closeTool}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,75,75,0.12)', border: 'none', color: '#ff4b4b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '-8px' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <div style={{ textAlign: 'center', flex: 1, padding: '0 8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'white', lineHeight: 1.3 }}>{currentTool.name}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{currentTool.sub}</div>
                </div>
                <div style={{ width: '38px', flexShrink: 0 }} />
              </div>

              {/* Desktop Title (hidden on mobile, shown on desktop) */}
              <div className="meta-ads-close-desktop text-center shrink-0" style={{ paddingBottom: '16px', paddingTop: '8px' }}>
                <h3 className="font-bold text-white" style={{ fontSize: '20px', marginBottom: '6px' }}>{currentTool.name}</h3>
                <p className="font-medium" dir="auto" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{currentTool.sub}</p>
              </div>

              {/* Platform Tabs - sticky below header */}
              <div className="meta-ads-platform-tabs" style={{ flexShrink: 0, padding: '12px 16px' }}>
                <div className="flex platform-container" style={{ gap: '8px', backgroundColor: '#0A0512', padding: '6px', borderRadius: '50px', width: '100%' }}>
                  {['meta', 'google', 'tiktok'].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setAdsPlatform(platform)}
                      className={`font-bold transition-all whitespace-nowrap platform-btn`}
                      style={{ padding: '12px 36px', fontSize: '15px', borderRadius: '50px', backgroundColor: adsPlatform === platform ? '#D84B1A' : 'transparent', color: adsPlatform === platform ? '#0A0512' : 'rgba(255,255,255,0.6)', border: 'none', flex: 1, cursor: 'pointer' }}
                    >
                      {platform === 'meta' ? 'ميتا' : platform === 'google' ? 'جوجل' : 'تيك توك'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable form area */}
              <div className="meta-ads-form-scroll" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto', paddingTop: '16px', paddingBottom: '8px', paddingLeft: '20px', paddingRight: '20px', gap: 0, scrollbarWidth: 'thin', scrollbarColor: '#d84b1a transparent' }}>


                {/* Platform Tabs - Desktop only (inside scroll for desktop layout) */}
                <div className="meta-ads-close-desktop flex justify-center w-full" style={{ marginBottom: '24px', flexShrink: 0 }}>
                  <div className="flex platform-container" style={{ gap: '8px', backgroundColor: '#0A0512', padding: '6px', borderRadius: '50px' }}>
                    {['meta', 'google', 'tiktok'].map((platform) => (
                      <button
                        key={platform}
                        onClick={() => setAdsPlatform(platform)}
                        className={`font-bold transition-all whitespace-nowrap platform-btn`}
                        style={{ padding: '12px 36px', fontSize: '15px', borderRadius: '50px', backgroundColor: adsPlatform === platform ? '#D84B1A' : 'transparent', color: adsPlatform === platform ? '#0A0512' : 'rgba(255,255,255,0.6)', border: 'none', flex: 1, cursor: 'pointer' }}
                      >
                        {platform === 'meta' ? 'ميتا' : platform === 'google' ? 'جوجل' : 'تيك توك'}
                      </button>
                    ))}
                  </div>
                </div>


                {/* Form Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
                  {currentTool.fields.map(field => (
                    <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label className="font-bold text-white text-right" style={{ fontSize: '15px', paddingRight: '4px' }}>{field.label}</label>
                      {field.type === 'input' && (
                        <input
                          placeholder={field.placeholder}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          value={fieldValues[field.id] || ''}
                          style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: '#0A0512', border: '1px solid rgba(255,255,255,0.05)', color: 'white', textAlign: 'right', outline: 'none', boxSizing: 'border-box', fontSize: '16px' }}
                        />
                      )}
                      {field.type === 'select' && (
                        <div style={{ position: 'relative', width: '100%' }}>
                          <select
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            value={fieldValues[field.id] || field.options[0]}
                            style={{ width: '100%', padding: '16px', paddingLeft: '40px', borderRadius: '12px', backgroundColor: '#0A0512', border: '1px solid rgba(255,255,255,0.05)', color: 'white', textAlign: 'right', outline: 'none', appearance: 'none', cursor: 'pointer', boxSizing: 'border-box', fontSize: '16px' }}
                          >
                            {field.options.map(opt => <option key={opt}>{opt}</option>)}
                          </select>
                          <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#D84B1A', pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      )}
                      {field.type === 'textarea' && (
                        <textarea
                          placeholder={field.placeholder}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          value={fieldValues[field.id] || ''}
                          style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: '#0A0512', border: '1px solid rgba(255,255,255,0.05)', color: 'white', textAlign: 'right', outline: 'none', minHeight: '100px', resize: 'vertical', boxSizing: 'border-box', fontSize: '16px' }}
                        ></textarea>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sticky bottom button */}
              <div className="meta-ads-btn-sticky shrink-0" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
                {errorMsg && (
                  <div style={{ color: '#ff4b4b', background: 'rgba(255,75,75,0.1)', border: '1px solid rgba(255,75,75,0.2)', padding: '0.75rem', borderRadius: '10px', marginBottom: '0.8rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>
                    ️ {errorMsg}
                  </div>
                )}
                <button
                  onClick={runTool}
                  disabled={loading}
                  className="group font-bold transition-all flex justify-center items-center hover:opacity-90 disabled:opacity-70 shadow-lg"
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'linear-gradient(to right, #D84B1A, #C83A0A)', color: 'white', gap: '10px', cursor: 'pointer', border: 'none', fontSize: '18px', fontFamily: "'Alexandria', sans-serif" }}
                >
                  {loading ? 'جاري التوليد...' : (
                    <>
                      <svg className="btn-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                      إنشاء الإعلانات
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Left Side: Results */}
            <div id="meta-ads-results" className="flex-1 max-[600px]:flex-none min-w-0 bg-[#02080e] rounded-3xl max-[600px]:rounded-none flex flex-col overflow-hidden max-[600px]:h-[100dvh] max-[600px]:border-0 relative shadow-[inset_0_0_30px_rgba(216,75,26,0.05)] border border-[#D84B1A]/20">
              <div className="border-b border-[#D84B1A]/10 flex justify-center items-center px-6 shrink-0 bg-[#02080e] relative" style={{ paddingTop: '32px', paddingBottom: '20px' }}>
                <button className="flex items-center justify-center transition-all hover:bg-[#ff4b4b] hover:text-white" style={{ position: 'absolute', left: '16px', top: '16px', zIndex: 50, width: '36px', height: '36px', backgroundColor: 'rgba(255, 75, 75, 0.1)', color: '#ff4b4b', borderRadius: '50%', cursor: 'pointer', border: 'none' }} onClick={closeTool}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <span className="text-white font-bold" style={{ fontSize: '22px' }}>نتائج الإعلانات</span>
              </div>

              <div className="flex-1 p-6 flex flex-col bg-[#02080e]">
                {generatedAds.length > 0 ? (
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="grid grid-cols-3 gap-3 mb-6 shrink-0">
                      {[0, 1, 2].map(index => (
                        <button
                          key={index}
                          onClick={() => setActiveAdTab(index)}
                          className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all border ${activeAdTab === index ? 'bg-[#d84b1a] border-[#d84b1a]' : 'bg-[#111111] border-[#D84B1A]/20 hover:border-[#D84B1A]/50'}`}
                        >
                          <span style={{ fontSize: '22px', fontWeight: 900, lineHeight: 1, color: 'white' }}>{index + 1}</span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>إعلان</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex-1 overflow-y-auto bg-[#111111] rounded-2xl border border-[#D84B1A]/20 p-6 whitespace-pre-wrap text-white leading-relaxed font-medium text-[15px]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d84b1a transparent' }}>
                      {generatedAds[activeAdTab]}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#D84B1A]/10 shrink-0">
                      <button onClick={() => {
                        navigator.clipboard.writeText(generatedAds[activeAdTab]);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }} className="flex flex-col items-center justify-center gap-2 py-4 bg-[#111111] hover:bg-[#D84B1A]/20 text-[#d84b1a] font-bold rounded-2xl border border-[#D84B1A]/30 transition-all text-base hover:border-[#D84B1A]/60">
                        {isCopied ? (
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        ) : (
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        )}
                        <span style={{ fontSize: '13px' }}>{isCopied ? ' تم' : 'نسخ'}</span>
                      </button>
                      <button onClick={() => { alert('تمت المشاركة!'); }} className="flex flex-col items-center justify-center gap-2 py-4 bg-[#111111] hover:bg-[#D84B1A]/20 text-[#d84b1a] font-bold rounded-2xl border border-[#D84B1A]/30 transition-all text-base hover:border-[#D84B1A]/60">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                        <span style={{ fontSize: '13px' }}>مشاركة</span>
                      </button>
                      <button onClick={() => { const blob = new Blob([generatedAds[activeAdTab]], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `ad-${activeAdTab + 1}.txt`; a.click(); }} className="flex flex-col items-center justify-center gap-2 py-4 bg-[#111111] hover:bg-[#D84B1A]/20 text-[#d84b1a] font-bold rounded-2xl border border-[#D84B1A]/30 transition-all text-base hover:border-[#D84B1A]/60">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        <span style={{ fontSize: '13px' }}>تحميل</span>
                      </button>
                    </div>

                    <div className="mt-5 pt-5 border-t border-[#D84B1A]/10 text-center shrink-0">
                      <p className="text-sm font-bold text-white/60 mb-2">هل أعجبتك النتيجة؟</p>
                      <div className="flex justify-center gap-1 text-[#d84b1a]">
                        {[1, 2, 3, 4, 5].map(star => <svg key={star} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>)}
                      </div>
                      <p className="text-xs text-white/40 mt-1">(4.8) من 125 تقييم</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div style={{ width: '96px', height: '96px', marginBottom: '24px', borderRadius: '50%', background: 'rgba(216,75,26,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 0 30px rgba(216,75,26,0.2)' }}>
                      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#D84B1A" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: 'white' }}>بانتظار البيانات...</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>قم بتعبئة بيانات الحملة لتوليد إعلاناتك</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {currentTool && currentTool.id !== 'store-design' && currentTool.id !== 'chatbot-maker' && currentTool.id !== 'meta-ads' && (
          <div className="tool-modal">
            <div className="tool-modal-head">
              <div className="tool-modal-title">
                <div className="modal-icon">{currentTool.icon}</div>
                <div>
                  <div className="modal-name">{currentTool.name}</div>
                  <div className="modal-sub">{currentTool.sub}</div>
                </div>
              </div>
              <button className="modal-close" onClick={closeTool}></button>
            </div>
            <div className="tool-modal-body">
              {currentTool.fields.map(field => (
                <div className="modal-input-group" key={field.id}>
                  <label className="modal-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {field.icon && <span style={{ color: 'var(--teal)', display: 'flex' }}>{field.icon}</span>}
                    {field.label}
                  </label>
                  {field.type === 'input' && (
                    <input
                      className="modal-input"
                      placeholder={field.placeholder}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    />
                  )}
                  {field.type === 'select' && (
                    <select className="modal-select" onChange={(e) => handleFieldChange(field.id, e.target.value)}>
                      {field.options.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      className="modal-textarea"
                      placeholder={field.placeholder}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    ></textarea>
                  )}
                  {field.type === 'image-upload' && (
                    <div className="image-upload-area" onClick={() => fileInputRef.current.click()}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                      {imagePreview ? (
                        <img src={imagePreview} alt="صورة المنتج" className="uploaded-preview" />
                      ) : (
                        <div className="upload-placeholder">
                          <div className="upload-icon"></div>
                          <div className="upload-text">اضغط لرفع صورة المنتج</div>
                          <div className="upload-hint">PNG, JPG, WEBP مقبولة</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <button className="modal-run-btn" onClick={runTool} disabled={loading}>
                {loading
                  ? <>{statusMsg || 'جاري المعالجة'} <span className="loading-dots"><span></span><span></span><span></span></span></>
                  : currentTool?.buttonText || (currentTool?.id === 'image-gen' ? ' ولّد الصورة الاحترافية' : currentTool?.id === 'chatbot-maker' ? '️ تدريب الشات بوت' : ' تنفيذ الأداة')}
              </button>

              {errorMsg && (
                <div style={{ color: '#ff4b4b', background: 'rgba(255,75,75,0.1)', border: '1px solid rgba(255,75,75,0.2)', padding: '0.75rem', borderRadius: '10px', marginTop: '0.8rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>
                  ️ {errorMsg}
                </div>
              )}

              {loading && statusMsg && currentTool?.id === 'image-gen' && (
                <div style={{ fontSize: '.8rem', color: 'var(--gold)', marginTop: '.5rem', padding: '.5rem .8rem', background: 'rgba(232,160,32,0.07)', borderRadius: '8px', border: '1px solid rgba(232,160,32,0.2)' }}>
                  {statusMsg}
                </div>
              )}

              {result && (
                <div className="modal-result visible">
                  <div className="result-head" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
                    <span className="result-label">النتيجة</span>
                    {currentTool?.id === 'store-audit' && (
                      <button onClick={downloadPdf} style={{ background: 'transparent', border: '1px solid #d84b1a', color: '#d84b1a', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', padding: '4px 12px', borderRadius: '50px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        تحميل التقرير كـ PDF
                      </button>
                    )}
                  </div>
                  {currentTool?.id === 'store-audit' ? (
                    <div id="audit-report-content" style={{ background: '#111111', padding: '20px', borderRadius: '12px' }}>
                      <div className="result-content overflow-x-auto" dangerouslySetInnerHTML={{ __html: result }}></div>
                    </div>
                  ) : (
                    <div className="result-content">{result}</div>
                  )}
                </div>
              )}

              {generatedImage && (
                <div className="modal-result visible" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
                  <div className="result-head" style={{ padding: '12px 16px' }}>
                    <span className="result-label"> الصورة الاحترافية جاهزة!</span>
                    <a href={generatedImage} download="product-ai-image.jpg" target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#7c6ef7', textDecoration: 'none', fontWeight: 600 }}>️ تحميل الصورة</a>
                  </div>
                  <img src={generatedImage} alt="الصورة المولدة بالذكاء الاصطناعي" style={{ width: '100%', display: 'block', maxHeight: '400px', objectFit: 'contain', background: '#111' }} />
                </div>
              )}

              {generatedHtml && (
                <div className="modal-result visible" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px', marginTop: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="result-head" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="result-label" style={{ fontSize: '1rem' }}> تصميم متجرك جاهز!</span>
                    <button onClick={() => { const blob = new Blob([generatedHtml], { type: 'text/html' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'store-design.html'; a.click(); }} style={{ background: 'transparent', border: 'none', color: '#d84b1a', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>️ تحميل الكود</button>
                  </div>
                  <iframe srcDoc={generatedHtml} style={{ width: '100%', height: '500px', border: 'none', backgroundColor: '#fff' }} title="Store Design Preview" />
                </div>
              )}


            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tools;
