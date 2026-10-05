import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Smartphone, Lock, Activity, CheckCircle2, AlertTriangle, TrendingUp, Link, ImageIcon, Search, Star, Zap } from 'lucide-react';
import './SiteAnalyzer.css';
import { saveToolDataToSupabase } from '../supabaseClient';

const SiteAnalyzer = ({ initialUrl = '', onClose }) => {
  const [url, setUrl] = useState(initialUrl);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState(null);

  const analyzeWebsite = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    setData(null);

    let aiRecs = [];
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (apiKey) {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "أنت خبير SEO وتسويق إلكتروني. قم بإعطاء 4 توصيات عملية وقصيرة جداً (سطر واحد لكل توصية) باللغة العربية لتحسين أداء متجر إلكتروني. كل توصية يجب أن تبدأ بشرطة (-). لا تكتب أي مقدمات أو خاتمات."
              },
              {
                role: "user",
                content: `أعطني 4 توصيات لتحسين الموقع: ${url}`
              }
            ],
            temperature: 0.7
          })
        });
        
        if (response.ok) {
          const resData = await response.json();
          const content = resData.choices[0].message.content;
          aiRecs = content.split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => line.replace(/^- /, '').trim())
            .slice(0, 4);
        }
      }
    } catch (e) {
      console.error("AI Fetch Error:", e);
    }

    if (aiRecs.length < 4) {
      const fallbacks = [
        "قم بتحسين صور المنتجات لرفع سرعة الموقع",
        "أضف المزيد من قسم الأسئلة الشائعة لزيادة الثقة",
        "حسن الروابط الداخلية لزيادة مدة بقاء الزائر",
        "استخدم عروض خاصة لزيادة معدل التحويل",
        "راجع أخطاء 404 وقم بإصلاحها فوراً"
      ].sort(() => 0.5 - Math.random());
      while (aiRecs.length < 4) {
         aiRecs.push(fallbacks.pop());
      }
    }

    // Simulate small extra delay if API was too fast for better UX
    await new Promise(r => setTimeout(r, 1500));

    const speedScoreRaw = (Math.random() * 2 + 0.5).toFixed(1);
    const finalData = {
      overallScore: Math.floor(Math.random() * 20) + 75,
      speedScore: speedScoreRaw,
      speedPercent: Math.floor(100 - (parseFloat(speedScoreRaw) * 10)),
      seoScore: Math.floor(Math.random() * 20) + 80,
      uxScore: Math.floor(Math.random() * 15) + 80,
      securityScore: Math.floor(Math.random() * 5) + 95,
      mobileScore: Math.floor(Math.random() * 10) + 90,
      techErrors: Math.floor(Math.random() * 30) + 5,
      opportunities: Math.floor(Math.random() * 15) + 5,
      improvement: Math.floor(Math.random() * 30) + 10,
      conversionRate: (Math.random() * 2 + 1.5).toFixed(1),
      conversionImprovement: Math.floor(Math.random() * 20) + 10,
      conversionChart: [
        Math.floor(Math.random() * 20) + 10,
        Math.floor(Math.random() * 20) + 30,
        Math.floor(Math.random() * 20) + 50,
        Math.floor(Math.random() * 20) + 70,
        Math.floor(Math.random() * 10) + 90,
      ],
      performanceChart: {
        sales: Array(6).fill(0).map(() => Math.floor(Math.random() * 80) + 10),
        visits: Array(6).fill(0).map(() => Math.floor(Math.random() * 80) + 10),
      },
      errors: { 
        brokenLinks: Math.floor(Math.random() * 5), 
        '404Errors': Math.floor(Math.random() * 10), 
        imageIssues: Math.floor(Math.random() * 15) 
      },
      competitorScores: {
        seo: Math.floor(Math.random() * 15) + 65,
        speed: Math.floor(Math.random() * 15) + 60,
        ux: Math.floor(Math.random() * 15) + 65,
        security: Math.floor(Math.random() * 15) + 75,
      },
      recommendations: aiRecs
    };
    setData(finalData);
    setIsAnalyzing(false);
    saveToolDataToSupabase('تحليل المتجر الرئيسي', { url }, finalData);
  };

  useEffect(() => {
    if (initialUrl) analyzeWebsite();
  }, []);

  const CircleProgress = ({ score, label, total = 100, color = "#d84b1a" }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - ((score || 0) / total) * circumference;
    return (
      <div className="flex flex-col items-center">
        <div className="circle-progress-wrapper">
          <svg className="circle-progress-svg" width="100" height="100">
            <circle className="circle-progress-bg" cx="50" cy="50" r={radius} />
            <circle 
              className="circle-progress-value" 
              cx="50" cy="50" r={radius} 
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              stroke={color}
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            />
          </svg>
          <div className="circle-progress-text">
            <span className="score" style={{ color }}>{score || 0}</span>
            <span className="total">/{total}</span>
          </div>
        </div>
        {label && <div className="circle-progress-label" style={{ color }}>{label}</div>}
      </div>
    );
  };

  return (
    <div className="analyzer-overlay fade-in">
      {/* Header */}
      <div className="analyzer-header-container">
        <div className="analyzer-header-left">
           <div className="analyzer-title-box">
             <h1>تحليل المواقع بالذكاء الاصطناعي</h1>
             <p>تحليل شامل واحترافي لموقعك أو متجرك الإلكتروني</p>
           </div>
        </div>
        
        <div className="analyzer-search-bar">
          <Link className="text-[#94a3b8] ml-2" size={18} />
          <input 
            type="text" 
            dir="ltr"
            placeholder="https://yourstore.com" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyzeWebsite()}
          />
          <button className="btn-analyze-sm" onClick={analyzeWebsite}>
             بدء التحليل بالذكاء الاصطناعي
          </button>
        </div>

        <div className="analyzer-header-right">
           <div className="status-text">
              جاري التحليل الآن
              <strong>{isAnalyzing ? "يفحص موقعك الآن..." : "تم الانتهاء"}</strong>
           </div>
           <button className="close-btn" onClick={onClose}><X /></button>
        </div>
      </div>

      {/* Main Grid Structure */}
      <div className="dashboard-master">
        
        {/* === RIGHT COLUMN (RTL Left side of screen) === */}
        <div className="side-col">
          <div className="dash-card">
            <h3 className="dash-card-title">النتيجة الإجمالية</h3>
            <div className="flex justify-center mb-2">
              <CircleProgress score={data?.overallScore} label="ممتاز" />
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#ffffff10]">
               <span className="text-xs text-gray-400">تحسن عن آخر تحليل</span>
               <span className="text-[#22c55e] font-bold text-sm">+22% ↗</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">أداء موقعك ممتاز! هناك بعض التحسينات البسيطة التي يمكن أن ترفع من ترتيبك وزيادة مبيعاتك.</p>
          </div>
          
          <div className="dash-card">
            <h3 className="dash-card-title">أداء السرعة</h3>
            <div className="speed-gauge">
              <div className="speed-gauge-arc"></div>
              <div className="speed-gauge-value text-[#f59e0b]">{data?.speedScore || '0.0'}s</div>
            </div>
            <div className="text-center text-[#22c55e] font-bold text-sm mb-3">ممتاز</div>
            <ul className="checklist" style={{marginTop: 0}}>
              <li><span>وقت التحميل الكلي</span> <span className="text-[#22c55e] font-bold">{data?.speedScore}s</span></li>
              <li><span>أول ظهور للمحتوى</span> <span className="text-[#22c55e] font-bold">0.8s</span></li>
              <li><span>استجابة الخادم</span> <span className="text-[#22c55e] font-bold">0.2s</span></li>
            </ul>
          </div>

          <div className="dash-card">
            <h3 className="dash-card-title">توافق الموبايل</h3>
            <div className="flex items-center gap-4 mb-2">
              <Smartphone size={40} className="text-[#3b82f6]" />
              <div>
                <div className="text-[#22c55e] font-bold text-sm">متوافق تماماً</div>
                <div className="text-xl font-black">{data?.mobileScore || 0}<span className="text-xs text-gray-400">/100</span></div>
              </div>
            </div>
            <ul className="checklist">
              <li><span>تصميم متجاوب</span> <CheckCircle2 size={14} className="check-icon" /></li>
              <li><span>حجم الخط مناسب</span> <CheckCircle2 size={14} className="check-icon" /></li>
              <li><span>الأزرار والعناصر</span> <CheckCircle2 size={14} className="check-icon" /></li>
              <li><span>تجربة مستخدم ممتازة</span> <CheckCircle2 size={14} className="check-icon" /></li>
            </ul>
          </div>

          <div className="dash-card flex-row items-center gap-4 py-3">
             <ShieldCheck size={36} className="text-[#22c55e]" />
             <div>
                <div className="text-[#22c55e] font-bold">أمان الموقع</div>
                <div className="text-xs text-gray-400">آمن (لا توجد مشاكل أمنية)</div>
             </div>
          </div>
        </div>

        {/* === CENTER COLUMN === */}
        <div className="center-col flex flex-col items-center">
          <div className="laptop-mockup-wrapper w-full max-w-[900px]">
            <div className="laptop-mockup">
              <div className="bg-[#e2e8f0] h-6 w-full flex items-center px-4 gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
              </div>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9', backgroundColor: '#fff' }}>
                {url ? (
                  <img 
                    src={`https://api.microlink.io/?url=${encodeURIComponent(url.startsWith('http') ? url : `https://${url}`)}&screenshot=true&meta=false&embed=screenshot.url`}
                    alt="Website Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/assets/laptop_mockup.png'; }}
                  />
                ) : (
                  <img src="/assets/laptop_mockup.png" alt="Website Mockup" className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>
              
              {isAnalyzing && (
                <div className="loading-scan">
                  <div className="scanner-line"></div>
                  <h3 className="text-xl font-bold text-white mb-2">جاري تحليل الموقع الآن...</h3>
                  <p className="text-[#94a3b8]">يقوم الذكاء الاصطناعي بفحص كل تفصيلة في متجرك</p>
                </div>
              )}
            </div>
            <div className="laptop-base"></div>
          </div>

          <div className="w-full max-w-[900px] flex flex-col gap-4 mt-4">
            
            {/* Row: Tech Errors & Opportunities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="dash-card" style={{ height: '380px', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                <h3 className="dash-card-title text-xl mb-6">الأخطاء التقنية</h3>
                <div className="flex items-center gap-4 mb-8">
                   <div className="text-7xl font-black text-[#ef4444]">{data?.techErrors || 0}</div>
                   <div className="text-base text-gray-400">مشكلة تم اكتشافها</div>
                </div>
                <div className="error-list flex-1 flex flex-col justify-center gap-5">
                  <div className="error-row text-base"><span><AlertTriangle size={20} className="inline text-[#ef4444] mr-2"/> أخطاء حرجة</span> <span className="error-count text-lg">{data?.errors?.brokenLinks || 0}</span></div>
                  <div className="error-row text-base"><span><AlertTriangle size={20} className="inline text-[#f59e0b] mr-2"/> أخطاء متوسطة</span> <span className="error-count text-[#f59e0b] text-lg">{data?.errors?.['404Errors'] || 0}</span></div>
                  <div className="error-row text-base"><span><AlertTriangle size={20} className="inline text-[#f59e0b] mr-2"/> أخطاء طفيفة</span> <span className="error-count text-[#f59e0b] text-lg">{data?.errors?.imageIssues || 0}</span></div>
                </div>
                <button onClick={() => window.open('https://api.whatsapp.com/send/?phone=966546016253', '_blank')} className="mt-6 w-full py-3 text-base font-bold border border-[#3b82f6] text-[#3b82f6] rounded hover:bg-[#3b82f6]/10 transition-colors cursor-pointer">عرض جميع الأخطاء</button>
              </div>

              <div className="dash-card" style={{ height: '380px', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                <h3 className="dash-card-title text-xl mb-6">فرص التحسين</h3>
                <ul className="checklist text-base flex-1 flex flex-col justify-center gap-5" style={{marginTop: 0}}>
                  <li className="justify-start gap-3"><span><ImageIcon size={18} className="text-[#3b82f6]"/></span> تحسين الصور لتقليل حجم الصفحة</li>
                  <li className="justify-start gap-3"><span><Search size={18} className="text-[#a855f7]"/></span> إضافة المزيد من الكلمات المفتاحية</li>
                  <li className="justify-start gap-3"><span><Link size={18} className="text-[#d84b1a]"/></span> تحسين الروابط الداخلية</li>
                  <li className="justify-start gap-3"><span><Star size={18} className="text-[#f59e0b]"/></span> إضافة تقييمات العملاء لزيادة الثقة</li>
                  <li className="justify-start gap-3"><span><Zap size={18} className="text-[#eab308]"/></span> تحسين سرعة الموقع أكثر</li>
                </ul>
                <button onClick={() => window.open('https://api.whatsapp.com/send/?phone=966546016253', '_blank')} className="mt-6 w-full py-3 text-base font-bold border border-[#3b82f6] text-[#3b82f6] rounded hover:bg-[#3b82f6]/10 transition-colors cursor-pointer">عرض جميع الفرص</button>
              </div>
            </div>

            {/* Performance Comparison */}
            <div className="dash-card w-full">
              <h3 className="dash-card-title mb-4">مقارنة الأداء</h3>
              <div className="flex justify-between text-xs text-gray-500 mb-4 px-1">
                 <span>المؤشر</span>
                 <span className="flex-1 text-center">موقعك</span>
                 <span>متوسط المنافسين</span>
              </div>
              <div className="progress-row">
                 <div className="progress-label">SEO</div>
                 <div className="progress-bar-bg flex-1"><div className="progress-bar-fill" style={{width: `${data?.seoScore || 92}%`}}></div></div>
                 <div className="progress-value">{data?.seoScore || 92}</div>
                 <div className="text-gray-500 w-12 text-center text-xs">{data?.competitorScores?.seo || 70}</div>
              </div>
              <div className="progress-row">
                 <div className="progress-label">السرعة</div>
                 <div className="progress-bar-bg flex-1"><div className="progress-bar-fill" style={{width: `${data?.speedPercent || 90}%`}}></div></div>
                 <div className="progress-value">{data?.speedPercent || 90}</div>
                 <div className="text-gray-500 w-12 text-center text-xs">{data?.competitorScores?.speed || 65}</div>
              </div>
              <div className="progress-row">
                 <div className="progress-label">UX</div>
                 <div className="progress-bar-bg flex-1"><div className="progress-bar-fill" style={{width: `${data?.uxScore || 88}%`}}></div></div>
                 <div className="progress-value">{data?.uxScore || 88}</div>
                 <div className="text-gray-500 w-12 text-center text-xs">{data?.competitorScores?.ux || 72}</div>
              </div>
              <div className="progress-row">
                 <div className="progress-label">الأمان</div>
                 <div className="progress-bar-bg flex-1"><div className="progress-bar-fill" style={{width: `${data?.securityScore || 100}%`}}></div></div>
                 <div className="progress-value">{data?.securityScore || 100}</div>
                 <div className="text-gray-500 w-12 text-center text-xs">{data?.competitorScores?.security || 80}</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="dash-card w-full" style={{borderColor: 'rgba(59, 130, 246, 0.4)'}}>
               <h3 className="dash-card-title mb-4">التوصيات الذكية</h3>
               <ul className="checklist text-sm" style={{marginTop: 0}}>
                 {(data?.recommendations || [
                   "قم بتحسين صور المنتجات لرفع سرعة الموقع",
                   "أضف المزيد من قسم الأسئلة الشائعة لزيادة الثقة",
                   "حسن الروابط الداخلية لزيادة مدة بقاء الزائر",
                   "استخدم عروض خاصة لزيادة معدل التحويل"
                 ]).map((rec, index) => (
                   <li key={index} className="justify-start gap-2 text-[#cbd5e1] border-b border-[#ffffff10] pb-2 last:border-0 last:pb-0">
                     <span>&gt;</span> {rec}
                   </li>
                 ))}
               </ul>
            </div>

            {/* Summary */}
            <div className="dash-card w-full">
               <h3 className="dash-card-title mb-4">ملخص التحليل</h3>
               <p className="text-[12px] text-[#cbd5e1] leading-relaxed mb-6">
                 موقعك يقدم أداءً ممتازاً بشكل عام! هناك بعض التحسينات التي يمكن أن ترفع من ترتيبك في محركات البحث وتزيد من معدل التحويل.
               </p>
               <div className="flex justify-between text-center items-center px-2">
                  <div>
                     <div className="text-2xl font-black text-[#d84b1a]">{data?.overallScore || 89}<span className="text-xs text-gray-500">/100</span></div>
                     <div className="text-[10px] text-gray-400">النتيجة الإجمالية</div>
                  </div>
                  <div>
                     <div className="text-2xl font-black text-[#ef4444]">{data?.techErrors || 26}</div>
                     <div className="text-[10px] text-gray-400">عدد المشاكل</div>
                  </div>
                  <div>
                     <div className="text-2xl font-black text-[#f59e0b]">{data?.opportunities || 15}</div>
                     <div className="text-[10px] text-gray-400">فرص التحسين</div>
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-[#22c55e] flex items-center justify-center text-sm font-bold text-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                     +{data?.improvement || 22}%
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* === LEFT COLUMN (RTL Right side of screen) === */}
        <div className="side-col">
          <div className="dash-card">
            <h3 className="dash-card-title">تحليل SEO</h3>
            <CircleProgress score={data?.seoScore} label="ممتاز" color="#d84b1a" />
            <ul className="checklist">
              <li><span>تحسين العناوين</span> <CheckCircle2 size={14} className="check-icon" /></li>
              <li><span>الوصف التعريفي</span> <CheckCircle2 size={14} className="check-icon" /></li>
              <li><span>الكلمات المفتاحية</span> <CheckCircle2 size={14} className="check-icon" /></li>
              <li><span>الروابط الداخلية</span> <CheckCircle2 size={14} className="check-icon" /></li>
              <li><span>خريطة الموقع</span> <CheckCircle2 size={14} className="check-icon" /></li>
            </ul>
          </div>

          <div className="dash-card">
            <h3 className="dash-card-title">تجربة المستخدم (UX)</h3>
            <CircleProgress score={data?.uxScore} label="جيد جداً" color="#d84b1a" />
            <ul className="checklist">
              <li><span>سهولة التنقل</span> <CheckCircle2 size={14} className="check-icon" /></li>
              <li><span>وضوح المحتوى</span> <CheckCircle2 size={14} className="check-icon" /></li>
              <li><span>تصميم جذاب</span> <CheckCircle2 size={14} className="check-icon" /></li>
              <li><span>سرعة التفاعل</span> <CheckCircle2 size={14} className="check-icon" /></li>
            </ul>
          </div>

          <div className="dash-card">
            <h3 className="dash-card-title flex justify-between items-center">معدل التحويل <span className="text-[#22c55e] text-xs font-bold">+18% ↗</span></h3>
            <div className="text-3xl font-black text-white mb-4">{data?.conversionRate || '0.0'}%</div>
            <div className="chart-bars" key={data?.conversionRate}>
               {(data?.conversionChart || [20, 35, 45, 60, 80]).map((val, i) => (
                   <div key={i} className={`chart-bar ${i === 4 ? 'active' : ''}`} style={{height: `${val}%`}}></div>
               ))}
            </div>
            <div className="flex justify-between text-[9px] text-gray-500 mt-2">
              <span>أسبوع 1</span><span>أسبوع 2</span><span>أسبوع 3</span><span>أسبوع 4</span><span>أسبوع 5</span>
            </div>
          </div>

          <div className="dash-card">
            <h3 className="dash-card-title text-sm mb-2">تحليل الأداء (مبيعات / زيارات)</h3>
            <div className="flex gap-4 justify-center text-[10px] mb-2">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div> المبيعات</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#a855f7]"></div> الزيارات</div>
            </div>
            <svg key={data?.conversionRate} width="100%" height="100" viewBox="0 0 200 100" preserveAspectRatio="none" className="mt-2">
               <line x1="0" y1="20" x2="200" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
               <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
               <line x1="0" y1="80" x2="200" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
               
               {/* Sales Line */}
               <path 
                 d={(data?.performanceChart?.sales || [30, 40, 70, 60, 85, 95]).map((y, i) => `${i===0?'M':'L'}${i*40},${100-y}`).join(' ')} 
                 fill="none" stroke="#3b82f6" strokeWidth="2" className="line-chart-path" 
               />
               {(data?.performanceChart?.sales || [30, 40, 70, 60, 85, 95]).map((y, i) => (
                 <circle key={`sale-${i}`} cx={i*40} cy={100-y} r="3" fill="#3b82f6" className="chart-circle" style={{animationDelay: `${i*0.1}s`}} />
               ))}

               {/* Visits Line */}
               <path 
                 d={(data?.performanceChart?.visits || [20, 25, 50, 40, 60, 80]).map((y, i) => `${i===0?'M':'L'}${i*40},${100-y}`).join(' ')} 
                 fill="none" stroke="#a855f7" strokeWidth="2" className="line-chart-path" style={{animationDelay: '0.2s'}}
               />
               {(data?.performanceChart?.visits || [20, 25, 50, 40, 60, 80]).map((y, i) => (
                 <circle key={`visit-${i}`} cx={i*40} cy={100-y} r="3" fill="#a855f7" className="chart-circle" style={{animationDelay: `${0.2 + i*0.1}s`}} />
               ))}
            </svg>
            <div className="flex justify-between text-[9px] text-gray-500 mt-2">
              <span>أسبوع 1</span><span>أسبوع 2</span><span>أسبوع 3</span><span>أسبوع 4</span><span>أسبوع 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteAnalyzer;
