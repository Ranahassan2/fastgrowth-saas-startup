import React, { useState, useEffect } from 'react';

import Tools from './Tools';
import LeadCaptureModal from './LeadCaptureModal';
import { useLanguage } from '../context/LanguageContext';
import { Search, Compass, Rocket, Activity } from 'lucide-react';
import client1 from '../assets/logo1.jpg';

import client2 from '../assets/logo2.png';
import client3 from '../assets/logo3.png';
import client4 from '../assets/logo4.png';
const Features = () => {
  const [activeTab, setActiveTab] = useState('ads');
  const [activeStep, setActiveStep] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const { lang, t } = useLanguage();
const clients = [
  { image: client1, name: 'Client 1' },
  { image: client2, name: 'Client 2' },
  { image: client3, name: 'Client 3' },
  { image: client4, name: 'Client 4' },
 
];
  return (
    <>

      <div className="ticker-wrap" dir="ltr">
        <div className="ticker-track">
          <span className="ticker-item">{lang === 'ar' ? 'إعلانات Meta' : 'Meta Ads'} <span>+270% ROAS</span></span>
          <span className="ticker-item">{lang === 'ar' ? 'SEO متقدم' : 'Advanced SEO'} <span>#1 Google</span></span>
          <span className="ticker-item">{lang === 'ar' ? 'متاجر Shopify / Salla / Zid' : 'Shopify / Salla / Zid'} <span>+40% {lang === 'ar' ? 'تحويل' : 'CR'}</span></span>
          <span className="ticker-item">{lang === 'ar' ? 'إدارة TikTok' : 'TikTok Ads'} <span>2M+ {lang === 'ar' ? 'مشاهدة' : 'Views'}</span></span>
          <span className="ticker-item">Google Ads <span>-60% {lang === 'ar' ? 'تكلفة عميل' : 'CPA'}</span></span>
          <span className="ticker-item">{lang === 'ar' ? 'نمو LTV العملاء' : 'Customer LTV Growth'} <span>+5-7x {lang === 'ar' ? 'قيمة' : 'Value'}</span></span>
          <span className="ticker-item">{lang === 'ar' ? 'لوحة بيانات حية' : 'Live Dashboard'} <span>{lang === 'ar' ? 'تحديث يومي' : 'Daily Updates'}</span></span>
          <span className="ticker-item">{lang === 'ar' ? 'إعلانات Meta' : 'Meta Ads'} <span>+270% ROAS</span></span>
          <span className="ticker-item">{lang === 'ar' ? 'SEO متقدم' : 'Advanced SEO'} <span>#1 Google</span></span>
          <span className="ticker-item">{lang === 'ar' ? 'متاجر Shopify / Salla / Zid' : 'Shopify / Salla / Zid'} <span>+40% {lang === 'ar' ? 'تحويل' : 'CR'}</span></span>
          <span className="ticker-item">{lang === 'ar' ? 'إدارة TikTok' : 'TikTok Ads'} <span>2M+ {lang === 'ar' ? 'مشاهدة' : 'Views'}</span></span>
          <span className="ticker-item">Google Ads <span>-60% {lang === 'ar' ? 'تكلفة عميل' : 'CPA'}</span></span>
          <span className="ticker-item">{lang === 'ar' ? 'نمو LTV العملاء' : 'Customer LTV Growth'} <span>+5-7x {lang === 'ar' ? 'قيمة' : 'Value'}</span></span>
          <span className="ticker-item">{lang === 'ar' ? 'لوحة بيانات حية' : 'Live Dashboard'} <span>{lang === 'ar' ? 'تحديث يومي' : 'Daily Updates'}</span></span>
        </div>
      </div>

      <section id="statsbar">
        <div className="stats-inner">
          <div className="stat-cell reveal"><div className="stat-num counter" data-target="200" data-suffix="+">0</div><div className="stat-label">{lang === 'ar' ? 'متجر نما معنا فعلياً' : 'Stores Grown With Us'}</div></div>
          <div className="stat-cell reveal"><div className="stat-num gold">8x</div><div className="stat-label">{lang === 'ar' ? 'متوسط زيادة المبيعات' : 'Avg Sales Increase'}</div></div>
          <div className="stat-cell reveal"><div className="stat-num counter" data-target="30" data-suffix="+">0</div><div className="stat-label">{lang === 'ar' ? 'يوم لأول نتيجة مضمونة' : 'Days to First Result'}</div></div>
          <div className="stat-cell reveal"><div className="stat-num counter" data-target="98" data-suffix="%">0</div><div className="stat-label">{lang === 'ar' ? 'رضا العملاء' : 'Client Satisfaction'}</div></div>
        </div>
      </section>

      <section id="problems">
        <div className="section-header reveal" style={{ textAlign: 'center' }}>
          <div className="section-eyebrow">{lang === 'ar' ? 'المشاكل التي تستنزف نمو متجرك بصمت' : 'Silent Problems Draining Your Store'}</div>
          <h2 className="section-title">{lang === 'ar' ? 'متجرك يخسر أموالاً أكثر مما تعتقد... هل تعرف أين تذهب؟' : 'Your Store Is Losing More Than You Think'}</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>{lang === 'ar' ? 'قد يكون منتجك ممتازاً، وسعرك مناسباً، ومتجرك جاهزاً للبيع؛ ومع ذلك تتسرب الأرباح بسبب فجوات صغيرة في الإعلانات، والتحويل، والاحتفاظ بالعملاء، وفهم السوق.' : 'Your product might be great and pricing fair, yet profits leak through small gaps in ads, conversion, retention, and market understanding.'}</p>
        </div>
        <div className="prob-tabs reveal">
          <button className={`prob-tab ${activeTab === 'ads' ? 'active' : ''}`} onClick={() => setActiveTab('ads')}> {lang === 'ar' ? 'الإعلانات' : 'Ads'}</button>
          <button className={`prob-tab ${activeTab === 'sales' ? 'active' : ''}`} onClick={() => setActiveTab('sales')}> {lang === 'ar' ? 'المبيعات' : 'Sales'}</button>
          <button className={`prob-tab ${activeTab === 'market' ? 'active' : ''}`} onClick={() => setActiveTab('market')}> {lang === 'ar' ? 'الأسواق والجمهور' : 'Markets & Audience'}</button>
        </div>
        <div className="prob-panels reveal">
          <div className={`prob-panel ${activeTab === 'ads' ? 'active' : ''}`}>
            <div className="prob-card">
              <div className="prob-icon">1</div>
              <div>
                <div className="prob-title">{lang === 'ar' ? 'تدفع أكثر... وتحصل على أقل' : 'Paying More, Getting Less'}</div>
                <div className="prob-desc">{lang === 'ar' ? 'ميزانيتك الإعلانية لا يجب أن تختفي داخل أرقام الحملة. إذا كنت تنفق آلاف الريالات ولا تعرف أي إعلان يبيع فعلياً وأين تتوقف رحلة العميل، فأنت لا تدير ميزانية؛ أنت تطارد النتائج.' : 'Your ad budget should not disappear into campaign numbers. If you spend thousands without knowing which ad actually sells and where the customer journey stops, you are not managing a budget — you are chasing results.'}</div>
                <div className="prob-stat">{lang === 'ar' ? '72% من المتاجر تخسر >40% من ميزانيتها الإعلانية شهرياً' : '72% of stores lose >40% of their ad budget monthly'}</div>
              </div>
            </div>
            <div className="prob-card">
              <div className="prob-icon">2</div>
              <div>
                <div className="prob-title">{lang === 'ar' ? 'إعلانك يصل لمن لا يريد شراءك' : 'Your Ads Reach People Who Won\'t Buy'}</div>
                <div className="prob-desc">{lang === 'ar' ? 'كل نقرة من الجمهور الخطأ تعني ريالاً مهدراً وفرصة بيع ضائعة. الاستهداف الضعيف يرفع CPC، يضاعف تكلفة اكتساب العميل، ويجعل حتى الإعلان الجيد يبدو وكأنه لا يعمل.' : 'Every click from the wrong audience means wasted money and lost sales. Weak targeting raises CPC, multiplies customer acquisition cost, and makes even a good ad look like it is not working.'}</div>
                <div className="prob-stat">{lang === 'ar' ? 'متوسط تكلفة العميل لديك أعلى 3x من اللازم' : 'Your average customer cost is 3x higher than necessary'}</div>
              </div>
            </div>
          </div>
          <div className={`prob-panel ${activeTab === 'sales' ? 'active' : ''}`}>
            <div className="prob-card">
              <div className="prob-icon">1</div>
              <div>
                <div className="prob-title">{lang === 'ar' ? 'اليوم مبيعات... وغداً لا شيء' : 'Sales Today... Nothing Tomorrow'}</div>
                <div className="prob-desc">{lang === 'ar' ? 'عندما تعتمد مبيعاتك على موسم جيد أو إعلان نجح بالصدفة، فأنت لا تملك نظام نمو حقيقياً. هدفنا بناء منظومة تجعل المبيعات أكثر استقراراً وقابلية للقياس والتطوير، بدلاً من الانتظار لمعرفة ماذا سيحدث الشهر القادم.' : 'When your sales depend on a good season or a lucky ad, you do not have a real growth system. Our goal is to build a system that makes sales more stable, measurable and scalable.'}</div>
                <div className="prob-stat">{lang === 'ar' ? '65% من المتاجر تعاني من تذبذب +50% شهرياً' : '65% of stores suffer from +50% monthly fluctuation'}</div>
              </div>
            </div>
            <div className="prob-card">
              <div className="prob-icon">2</div>
              <div>
                <div className="prob-title">{lang === 'ar' ? 'تشتري العميل مرة واحدة... ثم تخسره' : 'Buy a Customer Once... Then Lose Them'}</div>
                <div className="prob-desc">{lang === 'ar' ? 'اكتساب العميل هو البداية، وليس النهاية. عندما لا توجد استراتيجية لإعادة الشراء، يصبح كل طلب جديد معركة إعلانية جديدة. نساعدك على زيادة قيمة العميل (LTV) وتحويل المشترين السابقين إلى مصدر مستمر للإيرادات.' : 'Customer acquisition is the beginning, not the end. Without a repurchase strategy, every new order becomes a new advertising battle. We help you increase LTV and turn past buyers into a continuous revenue source.'}</div>
                <div className="prob-stat">{lang === 'ar' ? 'تكلفة عميل جديد أعلى 5-7x من إعادة البيع لقديم' : 'New customer cost is 5-7x higher than reselling to existing'}</div>
              </div>
            </div>
          </div>
          <div className={`prob-panel ${activeTab === 'market' ? 'active' : ''}`}>
            <div className="prob-card">
              <div className="prob-icon">1</div>
              <div>
                <div className="prob-title">{lang === 'ar' ? 'تبيع لجمهور لا تفهمهم' : 'Selling to an Audience You Don\'t Understand'}</div>
                <div className="prob-desc">{lang === 'ar' ? 'لا يكفي أن تعرف من هو عميلك؛ يجب أن تعرف لماذا يشتري، ومتى يشتري، وما الذي يؤثر في قراره. اختلاف السوق والثقافة والمواسم والسلوك الشرائي يجعل الاستراتيجيات العامة أقل قدرة على صناعة نتائج محلية قوية.' : 'Knowing who your customer is is not enough. You need to know why they buy, when they buy, and what influences their decision.'}</div>
                <div className="prob-stat">{lang === 'ar' ? 'المتاجر المتخصصة بالسوق المحلي تحقق 2.4x نمو أسرع' : 'Localized stores achieve 2.4x faster growth'}</div>
              </div>
            </div>
            <div className="prob-card">
              <div className="prob-icon">2</div>
              <div>
                <div className="prob-title">{lang === 'ar' ? 'منافسوك يستعدون للموسم... وأنت تبدأ بعد فوات الأوان' : 'Competitors Prep for Season While You Start Late'}</div>
                <div className="prob-desc">{lang === 'ar' ? 'رمضان، العيد، اليوم الوطني، بلاك فرايداي وغيرها ليست أياماً عادية في التقويم؛ إنها نوافذ بيع ضخمة. التخطيط بعد بداية الموسم يعني أنك وصلت متأخراً إلى العملاء الذين بدأ منافسوك في استهدافهم قبل أسابيع.' : 'Ramadan, Eid, National Day, Black Friday are not ordinary days — they are massive sales windows. Planning after the season starts means you arrived late to customers your competitors targeted weeks earlier.'}</div>
                <div className="prob-stat">{lang === 'ar' ? 'المواسم تمثل 60% من مبيعات المتاجر الإلكترونية' : 'Seasons represent 60% of e-commerce sales'}</div>
              </div>
            </div>
          </div>
        </div>

      </section>

      <section id="systems">
        <div className="systems-inner">
          <div className="section-header reveal" style={{ textAlign: 'center' }}>
            <div className="section-eyebrow">️ {lang === 'ar' ? 'نظام النمو الشامل' : 'Comprehensive Growth System'}</div>
            <h2 className="section-title">{lang === 'ar' ? '4 محركات تعمل كمنظومة واحدة... لتدفع متجرك إلى الأمام' : '4 Engines Working as One System to Drive Your Store Forward'}</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>{lang === 'ar' ? 'لا نضيف خدمة جديدة إلى متجرك ثم ننتظر المعجزة. نبني منظومة مترابطة: بيانات تكشف الحقيقة، محتوى يصنع الطلب، SEO يجلب الزيارات، وإعلانات تحوّل الاهتمام إلى مبيعات. كل محرك يدعم الآخر، والهدف واحد: نمو قابل للقياس.' : 'We do not add a service and wait for a miracle. We build an interconnected system: data reveals the truth, content creates demand, SEO drives traffic, and ads turn interest into sales. Each engine supports the others with one goal: measurable growth.'}</p>
          </div>
          <div className="sys-grid">
            <div className="sys-card reveal">
              <span className="sys-icon"></span>
              <div className="sys-title">Data Engine</div>
              <div className="sys-desc">{lang === 'ar' ? 'نضع الأرقام أمامك بوضوح لتعرف ما الذي يربحك، وما الذي يستنزف ميزانيتك، وأين توجد فرصة النمو.' : 'We put the numbers clearly before you to know what makes you money, what drains your budget, and where the growth opportunity lies.'}</div>
              <ul className="sys-feats">
                <li>{lang === 'ar' ? 'لوحة تحكم حية تُحدث يومياً لمتابعة مصادر المبيعات، الإنفاق، التحويل، والربحية الصافية.' : 'Live dashboard updated daily tracking sales sources, spending, conversion, and net profitability.'}</li>
                <li>{lang === 'ar' ? 'تحليل مستمر لسلوك العملاء وتقارير أسبوعية تكشف نقاط التسريب وفرص رفع معدل التحويل.' : 'Continuous customer behavior analysis with weekly reports revealing leak points and conversion rate improvement opportunities.'}</li>
                <li>{lang === 'ar' ? 'قرارات مبنية على بيانات حقيقية لا على التخمين' : 'Decisions based on real data, not guessing'}</li>
              </ul>
              <div className="sys-metric"><span className="sys-metric-label">{lang === 'ar' ? 'وقت التحديث للوحة البيانات' : 'Dashboard Update Time'}</span><span className="sys-metric-val">{lang === 'ar' ? 'مباشر' : 'Live'}</span></div>
              <div className="sys-tags"><span className="sys-tag">GA4</span><span className="sys-tag">Meta Pixel</span><span className="sys-tag">Dashboard</span></div>
            </div>
            <div className="sys-card reveal">
              <span className="sys-icon"></span>
              <div className="sys-title">Content Engine</div>
              <div className="sys-desc">{lang === 'ar' ? 'نصنع محتوى لا يملأ حساباتك فقط؛ بل يجذب الانتباه، يبني الثقة، ويحرّك العميل نحو القرار.' : 'We create content that does not just fill your accounts — it captures attention, builds trust, and moves the customer toward decision.'}</div>
              <ul className="sys-feats">
                <li>{lang === 'ar' ? 'استراتيجية محتوى شهرية كاملة' : 'Full monthly content strategy'}</li>
                <li>{lang === 'ar' ? 'تصميم Reels و Stories احترافية' : 'Professional Reels & Stories'}</li>
                <li>{lang === 'ar' ? 'محتوى يبني الثقة ويحفز قرار الشراء' : 'Content that builds trust and drives purchase decisions'}</li>
                <li>{lang === 'ar' ? 'Influencer Marketing' : 'Influencer Marketing'}</li>
                <li>{lang === 'ar' ? 'جدول نشر منتظم 12 منشور / شهر' : 'Regular 12 posts / month'}</li>
              </ul>
              <div className="sys-metric"><span className="sys-metric-label">{lang === 'ar' ? 'متوسط نمو المتابعين شهرياً' : 'Avg Monthly Follower Growth'}</span><span className="sys-metric-val">+2,400</span></div>
              <div className="sys-tags"><span className="sys-tag">Instagram</span><span className="sys-tag">TikTok</span><span className="sys-tag">X</span><span className="sys-tag">Snapchat</span></div>
            </div>
            <div className="sys-card reveal">
              <span className="sys-icon"></span>
              <div className="sys-title">SEO Engine</div>
              <div className="sys-desc">{lang === 'ar' ? 'نحول Google إلى قناة مستمرة لجذب عملاء يبحثون فعلياً عن منتجاتك وخدماتك.' : 'We turn Google into a continuous channel to attract customers who are actively searching for your products and services.'}</div>
              <ul className="sys-feats">
                <li>{lang === 'ar' ? 'تحسين تقني شامل للموقع (Technical SEO) لمعالجة العوائق التي تؤثر في الظهور وتجربة المستخدم وسرعة التصفح.' : 'Comprehensive Technical SEO to fix barriers affecting visibility, user experience, and browsing speed.'}</li>
                <li>{lang === 'ar' ? 'استراتيجية كلمات مفتاحية وباك لينكات موثوقة' : 'Keyword strategy and trusted backlinks'}</li>
                <li>{lang === 'ar' ? 'تقارير ترتيب دورية لاقتناص فرص الظهور قبل أن تذهب لمنافسيك' : 'Periodic ranking reports to capture visibility opportunities before competitors do'}</li>
              </ul>
              <div className="sys-metric"><span className="sys-metric-label">{lang === 'ar' ? 'متوسط ترتيب الكلمات المستهدفة' : 'Avg Target Keyword Rank'}</span><span className="sys-metric-val">{lang === 'ar' ? 'صفحة #1' : 'Page #1'}</span></div>
              <div className="sys-tags"><span className="sys-tag">Google</span><span className="sys-tag">Bing</span><span className="sys-tag">Local SEO</span></div>
            </div>
            <div className="sys-card reveal">
              <span className="sys-icon"></span>
              <div className="sys-title">Ads Engine</div>
              <div className="sys-desc">{lang === 'ar' ? 'لا نطلق الإعلانات لمجرد الحصول على زيارات؛ نصمم الحملات حول هدف واضح: تحقيق مبيعات بأعلى كفاءة ممكنة.' : 'We do not run ads just for traffic — we design campaigns around a clear goal: achieving sales at maximum efficiency.'}</div>
              <ul className="sys-feats">
                <li>{lang === 'ar' ? 'إدارة حملات متعددة المنصات (Meta, Google, TikTok, Snapchat)' : 'Multi-platform campaign management (Meta, Google, TikTok, Snapchat)'}</li>
                <li>{lang === 'ar' ? 'اختبارات A/B Testing مستمرة لإيقاف ما لا يعمل وتوسيع ما يحقق نتائج' : 'Continuous A/B Testing to stop what does not work and scale what delivers results'}</li>
                <li>{lang === 'ar' ? 'تحسين معدل التحويل (CRO)' : 'Conversion Rate Optimization (CRO)'}</li>
                <li>{lang === 'ar' ? 'Retargeting لاستعادة الزوار' : 'Retargeting to recover visitors'}</li>
              </ul>
              <div className="sys-metric"><span className="sys-metric-label">{lang === 'ar' ? 'متوسط عائد الإعلانات ROAS' : 'Avg ROAS'}</span><span className="sys-metric-val">+270%</span></div>
              <div className="sys-tags"><span className="sys-tag">Meta Ads</span><span className="sys-tag">Google Ads</span><span className="sys-tag">TikTok Ads</span><span className="sys-tag">Snapchat</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="journey">
        <div className="section-header reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-eyebrow">️ {lang === 'ar' ? 'كيف نعمل' : 'How We Work'}</div>
          <h2 className="section-title">{lang === 'ar' ? '4 خطوات مدروسة ومجربة تنقل متجرك من التخمين إلى النمو الحقيقي' : '4 Proven Steps to Take Your Store from Guessing to Real Growth'}</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>{lang === 'ar' ? 'لا نبدأ بالتنفيذ قبل أن نعرف أين تقف وأين توجد فرص النمو. عملية واضحة، شفافة، ومبنية على البيانات – اضغط على كل خطوة لتعرف كيف نحول الأرقام إلى قرارات، والقرارات إلى نمو.' : 'We do not start executing before knowing where you stand and where growth opportunities lie. A clear, transparent, data-driven process — click each step to see how we turn numbers into decisions and decisions into growth.'}</p>
        </div>
        <div className="jflow reveal">
          <div className={`jstep ${activeStep === 0 ? 'active' : ''}`} onClick={() => setActiveStep(0)}>
            <div className="jstep-icon"><span className="jstep-num">1</span></div>
            <div className="jstep-label">{lang === 'ar' ? 'تحليل المتجر' : 'Store Analysis'}</div>
            <div className="jstep-desc">{lang === 'ar' ? 'الأرقام، المنافسون، والجمهور' : 'Numbers, competitors & audience'}</div>
          </div>
          <div className="jarrow">←</div>
          <div className={`jstep ${activeStep === 1 ? 'active' : ''}`} onClick={() => setActiveStep(1)}>
            <div className="jstep-icon"><span className="jstep-num">2</span></div>
            <div className="jstep-label">{lang === 'ar' ? 'بناء الاستراتيجية' : 'Strategy Building'}</div>
            <div className="jstep-desc">{lang === 'ar' ? 'الخطة، القنوات، والميزانية' : 'The plan, channels & budget'}</div>
          </div>
          <div className="jarrow">←</div>
          <div className={`jstep ${activeStep === 2 ? 'active' : ''}`} onClick={() => setActiveStep(2)}>
            <div className="jstep-icon"><span className="jstep-num">3</span></div>
            <div className="jstep-label">{lang === 'ar' ? 'إطلاق الحملات' : 'Launch Campaigns'}</div>
            <div className="jstep-desc">{lang === 'ar' ? 'تنفيذ دقيق يحوّل الاستراتيجية إلى نتائج' : 'Precise execution that turns strategy into results'}</div>
          </div>
          <div className="jarrow">←</div>
          <div className={`jstep ${activeStep === 3 ? 'active' : ''}`} onClick={() => setActiveStep(3)}>
            <div className="jstep-icon"><span className="jstep-num">4</span></div>
            <div className="jstep-label">{lang === 'ar' ? 'تحسين مستمر' : 'Continuous Optimization'}</div>
            <div className="jstep-desc">{lang === 'ar' ? 'نقيس، نختبر، نطور، ثم نكرر' : 'Measure, test, improve, then repeat'}</div>
          </div>
        </div>

        <div className={`j-expand ${activeStep === 0 ? 'active' : ''}`}>
          <div className="aep"><div className="aep-title"> {lang === 'ar' ? 'تدقيق المتجر' : 'Store Audit'}</div><div className="aep-text">{lang === 'ar' ? 'نكشف كل ما يعيق مبيعاتك — فحص تقني وتسويقي شامل لسرعة المتجر، معدل التحويل، تجربة المستخدم (UI/UX)، ومسار الشراء لاكتشاف الثغرات التي تمنع الزوار من التحول إلى عملاء.' : 'We reveal everything blocking your sales — comprehensive technical and marketing audit of store speed, conversion rate, UX, and the purchase path to discover gaps preventing visitors from becoming customers.'}</div></div>
          <div className="aep"><div className="aep-title"> {lang === 'ar' ? 'تحليل المنافسين' : 'Competitor Analysis'}</div><div className="aep-text">{lang === 'ar' ? 'نعرف ماذا يفعل منافسوك ولماذا — نحلل استراتيجياتهم، عروضهم، قنواتهم ورسائلهم التسويقية لاكتشاف الفجوات والفرص التي يمكنك استغلالها لبناء ميزة تنافسية أقوى.' : 'We know what your competitors do and why — analyzing their strategies, offers, channels and marketing messages to discover gaps and opportunities for a stronger competitive edge.'}</div></div>
          <div className="aep"><div className="aep-title"> {lang === 'ar' ? 'دراسة الجمهور' : 'Audience Research'}</div><div className="aep-text">{lang === 'ar' ? 'نحدد العميل الذي يستحق استهدافك — نحدد شرائح جمهورك الأكثر قيمة، دوافع الشراء، الاهتمامات والسلوك الرقمي، وأين يتواجدون فعلياً؛ لتصل رسالتك إلى الأشخاص الأكثر قابلية للتحول إلى عملاء.' : 'We identify the customer worth targeting — defining your most valuable audience segments, purchase motivations, interests, digital behavior, and where they actually are.'}</div></div>
        </div>
        <div className={`j-expand ${activeStep === 1 ? 'active' : ''}`}>
          <div className="aep"><div className="aep-title"> {lang === 'ar' ? 'خطة 90 يوم' : '90-Day Plan'}</div><div className="aep-text">{lang === 'ar' ? 'خارطة طريق من 90 يوماً للنمو — نحوّل نتائج التحليل إلى خطة تنفيذ واضحة بأهداف ومراحل وأولويات قابلة للقياس، حتى تعرف ماذا سنفعل، ولماذا، وما الذي نريد تحقيقه.' : 'A 90-day roadmap for growth — we transform analysis results into a clear implementation plan with measurable goals, stages, and priorities.'}</div></div>
          <div className="aep"><div className="aep-title"> {lang === 'ar' ? 'اختيار القنوات' : 'Channel Selection'}</div><div className="aep-text">{lang === 'ar' ? 'نذهب إلى حيث يوجد عملاؤك — نحدد القنوات التسويقية والإعلانية الأكثر ملاءمة لمنتجاتك وجمهورك وسلوكهم الشرائي، بدلاً من توزيع الميزانية عشوائياً على كل منصة.' : 'We go where your customers are — identifying the most suitable marketing and advertising channels for your products, audience, and buying behavior.'}</div></div>
          <div className="aep"><div className="aep-title">{lang === 'ar' ? 'الميزانية المثلى' : 'Optimal Budget'}</div><div className="aep-text">{lang === 'ar' ? 'كل ريال يجب أن يعرف أين يذهب — نضع تصوراً لتوزيع الميزانية على القنوات والحملات بناءً على البيانات والأهداف، مع التركيز على رفع كفاءة الإنفاق وتحسين ROAS.' : 'Every riyal must know where it goes — we design budget distribution across channels and campaigns based on data and goals, focusing on spending efficiency and ROAS improvement.'}</div></div>
        </div>
        <div className={`j-expand ${activeStep === 2 ? 'active' : ''}`}>
          <div className="aep"><div className="aep-title"> {lang === 'ar' ? 'إطلاق الإعلانات' : 'Launch Ads'}</div><div className="aep-text">{lang === 'ar' ? 'نختبر قبل أن نضاعف الإنفاق — نطلق حملات اختبارية مدروسة لقياس الجمهور، الرسائل، العروض والإبداعات الإعلانية، ثم نوسع الاستثمارات في العناصر التي تثبت قدرتها على تحقيق النتائج.' : 'We test before scaling spend — launching calculated test campaigns to measure audience, messages, offers, and ad creatives, then scaling investments in proven elements.'}</div></div>
          <div className="aep"><div className="aep-title"> {lang === 'ar' ? 'إنتاج المحتوى' : 'Content Production'}</div><div className="aep-text">{lang === 'ar' ? 'محتوى يصنع الرغبة ويحفز الشراء — ننتج محتوى مرئياً ونصياً مصمماً حول رحلة العميل، من جذب الانتباه وبناء الثقة إلى إزالة التردد وتحفيز اتخاذ قرار الشراء.' : 'Content that creates desire and drives purchase — we produce visual and written content designed around the customer journey, from attention capture to removing hesitation.'}</div></div>
          <div className="aep"><div className="aep-title"> {lang === 'ar' ? 'إعداد التتبع' : 'Tracking Setup'}</div><div className="aep-text">{lang === 'ar' ? 'لا قرار بلا بيانات دقيقة — نضبط أدوات التتبع والـPixels وأكواد القياس اللازمة لمتابعة رحلة الزائر، وقياس التحويلات، وفهم أداء الحملات بدقة.' : 'No decision without accurate data — we configure tracking tools, Pixels, and measurement codes needed to follow the visitor journey and measure conversions accurately.'}</div></div>
        </div>
        <div className={`j-expand ${activeStep === 3 ? 'active' : ''}`}>
          <div className="aep"><div className="aep-title"> {lang === 'ar' ? 'تقارير أسبوعية' : 'Weekly Reports'}</div><div className="aep-text">{lang === 'ar' ? 'تعرف أين تقف وإلى أين نتجه — نشاركك تقارير أسبوعية واضحة تعرض أهم مؤشرات الأداء والنتائج، مع توصيات عملية تساعد على تحديد الخطوة التالية.' : 'Know where you stand and where we are heading — we share clear weekly reports showing key performance indicators and results, with practical recommendations for the next step.'}</div></div>
          <div className="aep"><div className="aep-title"> A/B Testing</div><div className="aep-text">{lang === 'ar' ? 'نختبر ما ينجح... ونوقف ما لا ينجح — نختبر باستمرار النصوص، التصاميم، الإعلانات وصفحات الهبوط لمعرفة ما يحقق أفضل استجابة، ثم نستخدم النتائج لتحسين معدلات التحويل.' : 'We test what works and stop what does not — continuously testing texts, designs, ads, and landing pages to find what achieves the best response, then using results to improve conversion rates.'}</div></div>
          <div className="aep"><div className="aep-title"> {lang === 'ar' ? 'توسع مدروس' : 'Calculated Scaling'}</div><div className="aep-text">{lang === 'ar' ? 'نضاعف ما ينجح بحذر وذكاء — لا نرفع الميزانية بشكل عشوائي. نوسع الإنفاق والقنوات تدريجياً عندما تظهر مؤشرات أداء إيجابية وتتحقق أهداف الحملة، مع الحفاظ على كفاءة النمو.' : 'We scale what works carefully and intelligently — not raising budgets randomly. We expand spending and channels gradually when positive performance indicators appear and campaign goals are achieved.'}</div></div>
        </div>
      </section>

      <Tools />

      <section id="pricing">
        <div className="pricing-inner">
          <div className="section-header reveal" style={{ textAlign: 'center' }}>
            <div className="section-eyebrow"> {lang === 'ar' ? 'الباقات' : 'Pricing'}</div>
            <h2 className="section-title">{lang === 'ar' ? 'اختر الباقة المناسبة' : 'Choose Your Plan'}</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>{lang === 'ar' ? 'حلول تناسب كل مرحلة من مراحل نمو متجرك' : 'Solutions tailored for every stage of your store\'s growth'}</p>
          </div>
          <div className="price-grid">
            <div className="pcard reveal">
              <div className="ptier">{lang === 'ar' ? 'للمتاجر الناشئة' : 'For New Stores'}</div>
              <div className="pname">{lang === 'ar' ? 'إنشاء متجر' : 'Store Setup'}</div>
              <div className="pdesc">{lang === 'ar' ? 'نبني متجرك من الصفر بتصميم يحقق أعلى معدلات تحويل في السوق' : 'We build your store from scratch with a high-converting design'}</div>
              <ul className="pfeats">
                <li>{lang === 'ar' ? 'تصميم متجر احترافي (Shopify / Salla / Zid)' : 'Professional Store Design'}</li>
                <li>{lang === 'ar' ? 'إعداد بوابات الدفع والشحن' : 'Payment & Shipping Setup'}</li>
                <li>{lang === 'ar' ? 'هوية بصرية كاملة (Logo + Brand Kit)' : 'Full Brand Identity'}</li>
                <li>{lang === 'ar' ? 'إعداد Google Analytics و Meta Pixel' : 'Analytics & Pixel Setup'}</li>
                <li>{lang === 'ar' ? 'تدريب على إدارة المتجر' : 'Store Management Training'}</li>
              </ul>
              <a href="https://api.whatsapp.com/send/?phone=966546016253" className="btn-ghost" style={{ display: 'block', textAlign: 'center', padding: '.7rem', borderRadius: '50px' }}>{lang === 'ar' ? 'تواصل لمعرفة السعر' : 'Contact for Price'}</a>
            </div>
            <div className="pcard featured reveal">
              <div className="ptier">{lang === 'ar' ? 'للمتاجر النشطة' : 'For Active Stores'}</div>
              <div className="pname">{lang === 'ar' ? 'نظام النمو الكامل' : 'Full Growth System'}</div>
              <div className="pdesc">{lang === 'ar' ? 'نتولى إعلاناتك ومحتواك وبياناتك وSEO كلها معاً في نظام واحد متكامل' : 'We manage your ads, content, data, and SEO all in one integrated system'}</div>
              <ul className="pfeats">
                <li>{lang === 'ar' ? 'إدارة إعلانات Meta + Google + TikTok' : 'Ads Management'}</li>
                <li>{lang === 'ar' ? 'إدارة السوشيال ميديا (12 منشور / شهر)' : 'Social Media Management'}</li>
                <li>{lang === 'ar' ? 'تحسين SEO محلي وتقني' : 'Technical & Local SEO'}</li>
                <li>{lang === 'ar' ? 'لوحة بيانات حية + تقارير أسبوعية' : 'Live Dashboard & Reports'}</li>
                <li>{lang === 'ar' ? 'تحسين معدل التحويل (CRO)' : 'CRO Optimization'}</li>
                <li>{lang === 'ar' ? 'مدير حساب متخصص' : 'Dedicated Account Manager'}</li>
              </ul>
              <a href="https://api.whatsapp.com/send/?phone=966546016253" className="btn-prime" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', padding: '.7rem', borderRadius: '50px' }}>
                {lang === 'ar' ? 'احجز استشارة مجانية' : 'Book Free Consultation'}
                <svg className="btn-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </a>
            </div>
            <div className="pcard reveal">
              <div className="ptier">{lang === 'ar' ? 'حسب احتياجك' : 'As Needed'}</div>
              <div className="pname">{lang === 'ar' ? 'باقة مخصصة' : 'Custom Plan'}</div>
              <div className="pdesc">{lang === 'ar' ? 'نرشحلك بالضبط الخدمات اللي تناسب وضعك وميزانيتك بناءً على تحليل مجاني' : 'We recommend the exact services that fit your situation based on a free audit'}</div>
              <ul className="pfeats">
                <li>{lang === 'ar' ? 'تحليل مجاني لوضعك الحالي' : 'Free Current State Analysis'}</li>
                <li>{lang === 'ar' ? 'خدمات مختارة بدقة حسب أهدافك' : 'Hand-picked services'}</li>
                <li>{lang === 'ar' ? 'سعر يناسب ميزانيتك تماماً' : 'Price that fits your budget'}</li>
                <li>{lang === 'ar' ? 'مرونة تامة — تزيد أو تخفف وقت ما تريد' : 'Total Flexibility'}</li>
              </ul>
              <a href="https://api.whatsapp.com/send/?phone=966546016253" className="btn-ghost" style={{ display: 'block', textAlign: 'center', padding: '.7rem', borderRadius: '50px' }}>{lang === 'ar' ? 'تحدث مع فريقنا' : 'Talk with our team'}</a>
            </div>
          </div>
        </div>
      </section>

      <section id="compare">
        <div className="section-header reveal" style={{ textAlign: 'center' }}>
          <div className="section-eyebrow">️ {lang === 'ar' ? 'المقارنة' : 'Compare'}</div>
          <h2 className="section-title">{lang === 'ar' ? 'نظام لا مجرد خدمة' : 'A System, Not a Service'}</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>{lang === 'ar' ? 'وكالات التسويق تبيعك خدمة. FastGrowth يبني لك نظام نمو يجلب عملاء باستمرار' : 'Marketing agencies sell services. FastGrowth builds a continuous growth system'}</p>
        </div>
        <div className="compare-wrap reveal">
          <table className="compare-table">
            <thead>
              <tr>
                <th>{lang === 'ar' ? 'المعيار' : 'Criteria'}</th>
                <th className="col-them">{lang === 'ar' ? 'وكالة عادية' : 'Normal Agency'}</th>
                <th className="col-us">FastGrowth </th>
              </tr>
            </thead>
            <tbody>
              <tr><td>{lang === 'ar' ? 'ما الذي يُقدَّم؟' : 'What is offered?'}</td><td className="col-them">{lang === 'ar' ? 'خدمة منفردة' : 'Single Service'}</td><td className="col-us">{lang === 'ar' ? '4 محركات متكاملة' : '4 Integrated Engines'}</td></tr>
              <tr><td>{lang === 'ar' ? 'تتبع النتائج' : 'Tracking'}</td><td className="col-them"><span className="x"></span> {lang === 'ar' ? 'تقرير شهري فقط' : 'Monthly Report Only'}</td><td className="col-us">{lang === 'ar' ? 'لوحة بيانات حية يومية' : 'Live Daily Dashboard'}</td></tr>
              <tr><td>{lang === 'ar' ? 'SEO + إعلانات معاً' : 'SEO & Ads'}</td><td className="col-them"><span className="x"></span> {lang === 'ar' ? 'منفصلتان' : 'Separated'}</td><td className="col-us"><span className="chk"></span> {lang === 'ar' ? 'نظام واحد' : 'One System'}</td></tr>
              <tr><td>{lang === 'ar' ? 'خبرة عميقة بالأسواق' : 'Deep Market Knowledge'}</td><td className="col-them"><span className="x"></span> {lang === 'ar' ? 'وكالة عامة' : 'General Agency'}</td><td className="col-us"><span className="chk"></span> {lang === 'ar' ? 'متخصصون فقط' : 'Specialized Only'}</td></tr>
              <tr><td>{lang === 'ar' ? 'وقت أول نتيجة' : 'Time to First Result'}</td><td className="col-them">{lang === 'ar' ? '2-3 أشهر' : '2-3 Months'}</td><td className="col-us">{lang === 'ar' ? '30 يوم مضمونة' : 'Guaranteed in 30 Days'}</td></tr>
              <tr><td>{lang === 'ar' ? 'مدير حساب مخصص' : 'Dedicated Manager'}</td><td className="col-them"><span className="x"></span></td><td className="col-us"><span className="chk"></span></td></tr>
            </tbody>
          </table>
        </div>
      </section>

<section id="clients">
  <div className="section-header reveal" style={{ textAlign: "center" }}>
    <div className="section-eyebrow">
       {lang === "ar" ? "عملاؤنا" : "Our Clients"}
    </div>

    <h2 className="section-title">
      {lang === "ar"
        ? "علامات تجارية وثقت بنا"
        : "Brands that Trusted Us"}
    </h2>
  </div>

  <div className="clients-row reveal">
    {clients.map((client, index) => (
      <div className="client-chip" key={index}    style={{
          
              background:" #fff",
          }}>
        <img
          src={client.image}
          alt={client.name}
          style={{
            width: "140px",
            height: "90px",
            objectFit: "contain",
              background:" #fff",
          }}
        />
      </div>
    ))}
  </div>
</section>

      <section id="cta">
        <div className="cta-glow"></div>
        <div className="reveal" style={{ position: 'relative' }}>
          <div className="section-eyebrow" style={{ margin: '0 auto 1rem', display: 'table' }}> {lang === 'ar' ? 'ابدأ الآن' : 'Start Now'}</div>
          <h2 className="cta-title">{lang === 'ar' ? 'هل متجرك يستحق نمواً أفضل؟' : 'Does Your Store Deserve Better Growth?'}<br /><span style={{ color: 'var(--teal)' }}>{lang === 'ar' ? 'دعنا نكتشف الإجابة معاً.' : 'Let us discover the answer together.'}</span></h2>
          <p className="cta-sub">{lang === 'ar' ? 'استشارة مجانية نحلل فيها وضع متجرك الحالي، نحدد أكبر الفرص المتاحة، ونضع خارطة طريق مبدئية لنمو حقيقي — بدون أي التزام.' : 'A free consultation to analyze your current store, identify the biggest available opportunities, and map an initial roadmap for real growth — zero commitment.'}</p>
          <div className="hero-btns">
            <button onClick={() => setShowLeadForm(true)} className="btn-prime" style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1.1rem' }}>
              {lang === 'ar' ? 'احجز استشارتك المجانية الآن' : 'Book Your Free Consultation Now'}
              <svg className="btn-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <a href="https://api.whatsapp.com/send/?phone=966546016253" target="_blank" className="btn-wa">
              {lang === 'ar' ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
              <svg width="24" height="24" viewBox="0 0 448 512" fill="currentColor" className="wa-icon-anim">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
              </svg>
            </a>
          </div>
          <div className="cta-meta-row">
            <span className="cta-meta">{lang === 'ar' ? 'استشارة مجانية بدون التزام' : 'Free Consultation, Zero Commitment'}</span>
            <span className="cta-meta">{lang === 'ar' ? 'رد خلال ساعة' : 'Response in 1 Hour'}</span>
            <span className="cta-meta">{lang === 'ar' ? 'تحليل حقيقي لمتجرك' : 'Real Store Analysis'}</span>
          </div>
        </div>
      </section>

      <LeadCaptureModal 
        isOpen={showLeadForm} 
        onClose={() => setShowLeadForm(false)} 
        onSuccess={() => setShowLeadForm(false)} 
      />
    </>
  );
};

export default Features;
