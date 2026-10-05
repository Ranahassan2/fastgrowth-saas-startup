import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Code2, Monitor, Smartphone, X } from 'lucide-react';
import AnimaStoreTemplate from './AnimaStoreTemplate';

const CodingAI = ({ hasBooked, onBooking, onClose }) => {
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
    const [showMobilePreview, setShowMobilePreview] = useState(false);

    const handleSend = async () => {
        setIsGenerating(true);
        setHasGenerated(false);
        setGeneratedCode(null);
        setShowMobilePreview(true); // Switch to preview on mobile
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
        <div
            className="flex flex-col-reverse lg:flex-row h-full gap-4 xl:gap-6 py-2 xl:py-6 overflow-hidden px-2 xl:px-0"
            dir="rtl"
        >
            {/* ===== RIGHT SIDEBAR: إعدادات التصميم ===== */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                className={`w-full lg:w-[420px] shrink-0 flex-col relative h-full overflow-hidden ${showMobilePreview ? 'hidden lg:flex' : 'flex'}`}
            >
                {/* Header */}
                <div className="p-6 border-b border-[#D84B1A]/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-black text-white">تصميم متجرك</h3>
                    </div>
                    {hasGenerated && (
                        <button
                            onClick={() =>
                                setViewMode(viewMode === 'preview' ? 'code' : 'preview')
                            }
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-hive-accent hover:bg-hive-accent/10 transition-all"
                        >
                            {viewMode === 'preview' ? (
                                <Code2 className="w-4 h-4" />
                            ) : (
                                <Monitor className="w-4 h-4" />
                            )}
                        </button>
                    )}
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                    <div className="p-6 space-y-6">
                        {/* ---- أساسيات المشروع ---- */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-white uppercase tracking-widest">
                                أساسيات المشروع
                            </label>
                            <input
                                type="text"
                                placeholder="اسم المشروع"
                                value={config.projectName}
                                onChange={(e) =>
                                    setConfig({ ...config, projectName: e.target.value })
                                }
                                className="w-full bg-[#000000]/15 border border-[#D84B1A]/50 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D84B1A]/50 transition-all text-right"
                                dir="rtl"
                            />
                            <input
                                type="text"
                                placeholder="نوع المنتجات (مثال: عطور، ملابس، ساعات...)"
                                value={config.niche}
                                onChange={(e) =>
                                    setConfig({ ...config, niche: e.target.value })
                                }
                                className="w-full bg-[#000000]/15 border border-[#D84B1A]/50 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D84B1A]/50 transition-all text-right"
                                dir="rtl"
                            />
                            <input
                                type="text"
                                placeholder="رابط المتجر الحالي (إن وجد)"
                                value={config.url}
                                onChange={(e) =>
                                    setConfig({ ...config, url: e.target.value })
                                }
                                className="w-full bg-[#000000]/15 border border-[#D84B1A]/50 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D84B1A]/50 transition-all text-right"
                                dir="rtl"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    value={config.activityType}
                                    onChange={(e) =>
                                        setConfig({ ...config, activityType: e.target.value })
                                    }
                                    className="bg-[#000000]/15 border border-[#D84B1A]/50 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D84B1A]/50 transition-all"
                                >
                                    <option className="bg-[#111111] text-white" value="business">شركة خدمات</option>
                                    <option className="bg-[#111111] text-white" value="salla">متجر على منصة سلة</option>
                                    <option className="bg-[#111111] text-white" value="zid">متجر على منصة زد</option>
                                    <option className="bg-[#111111] text-white" value="shopify">متجر شوبيفاي</option>
                                    <option className="bg-[#111111] text-white" value="store">متجر إلكتروني خاص</option>
                                    <option className="bg-[#111111] text-white" value="portfolio">بورتفوليو شخصي</option>
                                </select>
                                <select
                                    value={config.language}
                                    onChange={(e) =>
                                        setConfig({ ...config, language: e.target.value })
                                    }
                                    className="bg-[#000000]/15 border border-[#D84B1A]/50 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D84B1A]/50 transition-all"
                                >
                                    <option className="bg-[#111111] text-white" value="Arabic">العربية</option>
                                    <option className="bg-[#111111] text-white" value="English">English</option>
                                </select>
                            </div>
                        </div>

                        {/* ---- التصميم ---- */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-white uppercase tracking-widest">
                                التصميم
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-slate-500">Primary Color</span>
                                    <input
                                        type="color"
                                        value={config.primaryColor}
                                        onChange={(e) =>
                                            setConfig({ ...config, primaryColor: e.target.value })
                                        }
                                        className="w-full h-10 bg-[#000000]/15 border border-[#D84B1A]/50 rounded-xl p-1 outline-none cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-slate-500">Secondary Color</span>
                                    <input
                                        type="color"
                                        value={config.secondaryColor}
                                        onChange={(e) =>
                                            setConfig({ ...config, secondaryColor: e.target.value })
                                        }
                                        className="w-full h-10 bg-[#000000]/15 border border-[#D84B1A]/50 rounded-xl p-1 outline-none cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    value={config.style}
                                    onChange={(e) =>
                                        setConfig({ ...config, style: e.target.value })
                                    }
                                    className="bg-[#000000]/15 border border-[#D84B1A]/50 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D84B1A]/50 transition-all"
                                >
                                    <option className="bg-[#111111] text-white" value="modern">Modern</option>
                                    <option className="bg-[#111111] text-white" value="minimal">Minimal</option>
                                    <option className="bg-[#111111] text-white" value="luxury">Luxury</option>
                                    <option className="bg-[#111111] text-white" value="playful">Playful</option>
                                </select>
                                <select
                                    value={config.fontStyle}
                                    onChange={(e) =>
                                        setConfig({ ...config, fontStyle: e.target.value })
                                    }
                                    className="bg-[#000000]/15 border border-[#D84B1A]/50 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D84B1A]/50 transition-all"
                                >
                                    <option className="bg-[#111111] text-white" value="sans">Sans</option>
                                    <option className="bg-[#111111] text-white" value="serif">Serif</option>
                                </select>
                            </div>
                        </div>

                        {/* ---- المحتوى ---- */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-white uppercase tracking-widest">
                                المحتوى
                            </label>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-slate-500">
                                    <span>عدد الصفحات</span>
                                    <span>{config.pageCount}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="15"
                                    value={config.pageCount}
                                    onChange={(e) =>
                                        setConfig({ ...config, pageCount: parseInt(e.target.value) })
                                    }
                                    className="w-full accent-[#D84B1A]"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="hasBlog"
                                    checked={config.hasBlog}
                                    onChange={(e) =>
                                        setConfig({ ...config, hasBlog: e.target.checked })
                                    }
                                    className="w-4 h-4 rounded border-[#D84B1A]/20 bg-[#000000]/15 text-[#D84B1A] focus:ring-[#D84B1A]"
                                />
                                <label htmlFor="hasBlog" className="text-xs text-slate-300">
                                    إضافة Blog للموقع
                                </label>
                            </div>
                        </div>

                        {/* ---- وصف إضافي ---- */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-white uppercase tracking-widest">
                                وصف إضافي (اختياري)
                            </label>
                            <div className="relative bg-[#000000]/15 border border-[#D84B1A]/50 rounded-2xl p-2 focus-within:border-[#D84B1A]/50 transition-all">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="أضف تفاصيل أخرى تريدها في التصميم..."
                                    className="w-full bg-transparent p-3 text-xs text-white outline-none resize-none h-24"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* زر الإنشاء */}
                <div className="p-6 pb-8">
                    <button
                        onClick={handleSend}
                        disabled={isGenerating}
                        className="group w-full text-white font-bold py-3.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#D84B1A]/30 disabled:opacity-50 flex items-center justify-center gap-3 bg-[#D84B1A]"
                    >
                        <span>إنشاء التصميم الآن</span>
                        <motion.div
                            animate={{ x: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </motion.div>
                    </button>
                </div>
            </motion.div>

            {/* ===== LEFT: منطقة المعاينة ===== */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex-1 h-full flex-col bg-[#0A0A0A] border border-[#D84B1A]/50 rounded-[2.5rem] overflow-hidden shadow-[0_0_40px_rgba(5,180,111,0.15)] relative ml-2 xl:ml-0 ${showMobilePreview ? 'flex' : 'hidden lg:flex'}`}
            >
                {/* شريط المتصفح */}
                <div className="p-5 border-b border-hive-border flex justify-between items-center bg-black/40">
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-hive-border rounded-lg text-[10px] font-bold text-white">
                            معاينة التصميم
                        </button>
                        <button 
                            onClick={() => setShowMobilePreview(false)}
                            className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-[#D84B1A]/20 border border-[#D84B1A] rounded-lg text-[10px] font-bold text-[#D84B1A] hover:bg-[#D84B1A] hover:text-white transition-colors"
                        >
                            الإعدادات
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-black/60 p-1 rounded-xl border border-hive-border ml-16">
                        <button
                            onClick={() => setDevice('mobile')}
                            className={`p-2 rounded-lg transition-all ${
                                device === 'mobile'
                                    ? 'bg-[#D84B1A]/10 border border-[#D84B1A] text-white'
                                    : 'text-slate-500 border border-transparent hover:text-white'
                            }`}
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setDevice('desktop')}
                            className={`p-2 rounded-lg transition-all ${
                                device === 'desktop'
                                    ? 'bg-[#D84B1A]/10 border border-[#D84B1A] text-white'
                                    : 'text-slate-500 border border-transparent hover:text-white'
                            }`}
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* منطقة العرض */}
                <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-[#050505]">
                    {/* Loading Overlay */}
                    {isGenerating && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center space-y-6 bg-black/80 backdrop-blur-md">
                            <div className="relative">
                                <Code2 className="w-20 h-20 text-[#D84B1A] animate-pulse" />
                                <div className="absolute -inset-4 border-2 border-[#D84B1A]/20 border-t-[#D84B1A] rounded-full animate-spin" />
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-white">جاري إنشاء المتجر...</p>
                                <p className="text-[#D84B1A]/60 text-sm animate-pulse">
                                    يتم الآن تحويل الوصف إلى كود برمجي متكامل في ثوانٍ...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!hasGenerated && !isGenerating ? (
                        <div className="flex flex-col items-center justify-center space-y-8 opacity-20">
                            <div className="relative">
                                <div className="w-32 h-32 bg-[#D84B1A]/5 border border-[#D84B1A]/20 rounded-full flex items-center justify-center">
                                    <Monitor className="w-16 h-16 text-[#D84B1A] drop-shadow-[0_0_15px_rgba(5,180,111,0.5)]" />
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-[#D84B1A] rounded-full flex items-center justify-center text-black font-black text-xs"
                                >
                                    ?
                                </motion.div>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-2xl font-black text-white tracking-widest uppercase">
                                    بانتظار البيانات...
                                </p>
                                <p className="text-[10px] text-slate-500 font-mono tracking-[0.4em] uppercase">
                                    READY TO TRANSFORM YOUR VISION INTO CODE
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Preview / Code View */
                        <div
                            className={`w-full h-full transition-all duration-700 flex items-center justify-center ${
                                device === 'mobile' ? 'max-w-[375px]' : 'max-w-full'
                            }`}
                        >
                            {viewMode === 'preview' ? (
                                <div className="w-full h-full bg-white rounded-t-xl md:rounded-none overflow-hidden relative">
                                    {generatedCode ? (
                                        <iframe
                                            srcDoc={generatedCode}
                                            title="Anima AI Generated Preview"
                                            className="w-full h-full border-none"
                                            sandbox="allow-scripts allow-same-origin allow-popups"
                                        />
                                    ) : (
                                        <AnimaStoreTemplate config={config} prompt={prompt} />
                                    )}
                                </div>
                            ) : (
                                <div
                                    className="w-full h-full p-6 overflow-auto font-mono text-xs text-slate-300 bg-[#0a0a0a]"
                                    dir="ltr"
                                >
                                    <pre>
                                        {generatedCode
                                            ? generatedCode
                                            : '// كود React (قالب AnimaStoreTemplate) يعمل حالياً في الخلفية.'}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default CodingAI;
