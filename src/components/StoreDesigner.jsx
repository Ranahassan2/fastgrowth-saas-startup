import React, { useState } from 'react';
import { Monitor, Smartphone, X, ChevronDown, ArrowLeft, Code2 } from 'lucide-react';
import AnimaStoreTemplate from './AnimaStoreTemplate';
import './StoreDesigner.css';

const StoreDesigner = ({ onClose }) => {
  const [config, setConfig] = useState({
    projectName: '',
    niche: '',
    url: '',
    activityType: 'business',
    language: 'Arabic',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e293b',
    style: 'modern',
    fontStyle: 'sans',
    pageCount: 1,
    sections: ['hero', 'features', 'contact'],
    hasBlog: false,
  });
  const [prompt, setPrompt] = useState('');
  const [device, setDevice] = useState('desktop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [viewMode, setViewMode] = useState('preview');
  const [generatedCode, setGeneratedCode] = useState(null);

  const handleSend = async () => {
    setIsGenerating(true);
    setHasGenerated(false);
    setGeneratedCode(null);
    try {
        const urlContext = config.url
            ? ` The user has an existing website at ${config.url}. Please use this website as a reference to understand their brand identity, products, and core ideas, but completely redesign and evolve it into a much better, modern, ultra-premium, and high-converting version.`
            : '';
        const promptContext = `Create an ultra-premium e-commerce landing page. Project: ${config.projectName}. Niche: ${config.niche}. Activity Type: ${config.activityType}. Colors: primary ${config.primaryColor}, secondary ${config.secondaryColor}. Typography: ${config.fontStyle}. Language: ${config.language}. Style: ${config.style}. The design MUST contain exactly ${config.pageCount} distinct sections/pages. ${config.hasBlog ? 'Include a dedicated Blog section.' : ''}${urlContext} Additional requirements: ${prompt}`;
        
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptContext }),
        });
        
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || 'فشل الاتصال بـ Anima AI');
        }
        
        const data = await response.json();
        if (data.files && data.files['index.html']) {
            const fileData = data.files['index.html'];
            const htmlContent =
                typeof fileData === 'string'
                    ? fileData
                    : fileData.content || fileData.code || '';
            setGeneratedCode(htmlContent);
            setHasGenerated(true);
            setViewMode('preview');
        } else {
            throw new Error('Anima لم يُرجع أي كود HTML');
        }
    } catch (error) {
        console.error('Design Generation Error:', error);
        if (error.message.includes('Limit') || error.message.includes('402')) {
            alert(
                'تم استنفاد الرصيد المجاني لمفتاح Anima (Usage Exceeds Limit). يرجى ترقية الحساب أو استخدام مفتاح جديد.'
            );
        } else {
            alert('حدث خطأ أثناء الاتصال بـ Anima: ' + error.message);
        }
        setHasGenerated(false);
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="sd-wrapper" onClick={(e) => {
        if (e.target.classList.contains('sd-wrapper') && onClose) {
            onClose();
        }
    }}>
      <div className="sd-card" onClick={(e) => e.stopPropagation()}>
        {/* RIGHT SECTION: Form */}
        <div className="sd-sidebar">
          <div className="sd-header">
            <button className="sd-header-close-btn" onClick={onClose}><X size={18} strokeWidth={3} /></button>
            <h2>تصميم متجرك</h2>
          </div>
          
          <div className="sd-form">
            <div className="sd-section">
              <label className="sd-section-title">أساسيات المشروع</label>
              <input 
                type="text" 
                className="sd-input" 
                placeholder="اسم المشروع" 
                value={config.projectName}
                onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
              />
              <input 
                type="text" 
                className="sd-input" 
                placeholder="نوع المنتجات (مثال: عطور، ملابس، ساعات...)" 
                value={config.niche}
                onChange={(e) => setConfig({ ...config, niche: e.target.value })}
              />
              <input 
                type="text" 
                className="sd-input" 
                placeholder="رابط المتجر الحالي (إن وجد)" 
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
              />
              <div className="sd-row">
                <div className="sd-select-wrapper">
                  <select 
                    className="sd-select"
                    value={config.activityType}
                    onChange={(e) => setConfig({ ...config, activityType: e.target.value })}
                  >
                    <option value="business">شركة خدمات</option>
                    <option value="salla">متجر على منصة سلة</option>
                    <option value="zid">متجر على منصة زد</option>
                    <option value="shopify">متجر شوبيفاي</option>
                    <option value="store">متجر إلكتروني خاص</option>
                    <option value="portfolio">بورتفوليو شخصي</option>
                  </select>
                  <ChevronDown className="sd-select-icon" size={14} />
                </div>
                <div className="sd-select-wrapper">
                  <select 
                    className="sd-select"
                    value={config.language}
                    onChange={(e) => setConfig({ ...config, language: e.target.value })}
                  >
                    <option value="Arabic">العربية</option>
                    <option value="English">English</option>
                  </select>
                  <ChevronDown className="sd-select-icon" size={14} />
                </div>
              </div>
            </div>

            <div className="sd-section">
              <label className="sd-section-title">التصميم</label>
              <div className="sd-row">
                <div className="sd-color-picker">
                   <label>Secondary Color</label>
                   <input 
                     type="color" 
                     value={config.secondaryColor} 
                     onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                   />
                </div>
                <div className="sd-color-picker">
                   <label>Primary Color</label>
                   <input 
                     type="color" 
                     value={config.primaryColor} 
                     onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                   />
                </div>
              </div>
              <div className="sd-row">
                <div className="sd-select-wrapper">
                  <select 
                    className="sd-select"
                    value={config.fontStyle}
                    onChange={(e) => setConfig({ ...config, fontStyle: e.target.value })}
                  >
                    <option value="sans">Sans</option>
                    <option value="serif">Serif</option>
                  </select>
                  <ChevronDown className="sd-select-icon" size={14} />
                </div>
                <div className="sd-select-wrapper">
                  <select 
                    className="sd-select"
                    value={config.style}
                    onChange={(e) => setConfig({ ...config, style: e.target.value })}
                  >
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                    <option value="luxury">Luxury</option>
                    <option value="playful">Playful</option>
                  </select>
                  <ChevronDown className="sd-select-icon" size={14} />
                </div>
              </div>
            </div>

            <div className="sd-section">
              <label className="sd-section-title">المحتوى</label>
              
              <div className="sd-range-wrapper">
                <div className="sd-range-header">
                  <span>عدد الصفحات</span>
                  <span>{config.pageCount}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="15" 
                  value={config.pageCount}
                  onChange={(e) => setConfig({ ...config, pageCount: parseInt(e.target.value) })}
                  className="sd-range"
                />
              </div>

              <div className="sd-checkbox-wrapper">
                <input 
                  type="checkbox" 
                  id="hasBlog" 
                  checked={config.hasBlog}
                  onChange={(e) => setConfig({ ...config, hasBlog: e.target.checked })}
                  className="sd-checkbox"
                />
                <label htmlFor="hasBlog">إضافة Blog للموقع</label>
              </div>
            </div>
          </div>

          <div className="sd-footer">
            <button 
              className="sd-submit-btn" 
              onClick={handleSend} 
              disabled={isGenerating}
            >
               <span>{isGenerating ? 'جاري الإنشاء...' : 'إنشاء التصميم الآن'}</span>
               <ArrowLeft size={18} />
            </button>
          </div>
        </div>

        {/* LEFT SECTION: Preview */}
        <div className="sd-preview">
          
          <div className="sd-preview-content">
             {isGenerating && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
                   <Code2 size={64} color="#d84b1a" />
                   <h3 style={{ color: 'white', marginTop: '20px', fontWeight: 'bold' }}>جاري إنشاء المتجر...</h3>
                   <p style={{ color: 'rgba(216,75,26,0.8)', fontSize: '12px' }}>يتم الآن تحويل الوصف إلى كود برمجي متكامل في ثوانٍ...</p>
                </div>
             )}

             {!hasGenerated && !isGenerating ? (
                <div className="sd-empty-state">
                   <div className="sd-empty-icon-wrapper">
                      <Monitor size={48} className="sd-empty-icon" />
                      <div className="sd-empty-badge">?</div>
                   </div>
                   <h3>بانتظار البيانات...</h3>
                   <p>READY TO TRANSFORM YOUR VISION INTO CODE</p>
                </div>
             ) : (
                <div style={{ width: '100%', height: '100%', transition: 'all 0.5s ease', maxWidth: device === 'mobile' ? '375px' : '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   {viewMode === 'preview' ? (
                      <div style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
                         {generatedCode ? (
                            <iframe
                               srcDoc={generatedCode}
                               title="Anima AI Generated Preview"
                               style={{ width: '100%', height: '100%', border: 'none' }}
                               sandbox="allow-scripts allow-same-origin allow-popups"
                            />
                         ) : (
                            <AnimaStoreTemplate config={config} prompt={prompt} />
                         )}
                      </div>
                   ) : (
                      <div style={{ width: '100%', height: '100%', padding: '24px', overflow: 'auto', backgroundColor: '#0a0a0a', color: '#c4aadd', fontFamily: 'monospace', fontSize: '12px', direction: 'ltr', textAlign: 'left' }}>
                         <pre>
                            {generatedCode ? generatedCode : '// كود React (قالب AnimaStoreTemplate) يعمل حالياً في الخلفية.'}
                         </pre>
                      </div>
                   )}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDesigner;
