import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Settings, User } from 'lucide-react';

const ChatbotMaker = () => {
    const [config, setConfig] = useState({
        storeName: '',
        storeNiche: '',
        botTone: 'ودية (لهجة عامية)',
        shippingPolicy: '',
        returnPolicy: '',
        offers: '',
        otherRules: ''
    });

    const [chatHistory, setChatHistory] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isTrained, setIsTrained] = useState(false);

    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isTyping]);

    const trainBot = () => {
        if (!config.storeName || !config.storeNiche) {
            alert("يرجى إدخال اسم المتجر ومجاله على الأقل!");
            return;
        }
        setIsTrained(true);
        setChatHistory([{ role: 'model', text: `أهلاً بك! أنا المساعد الذكي لمتجر ${config.storeName}. كيف أقدر أخدمك اليوم؟` }]);
    };

    const sendMessage = async () => {
        if (!chatInput.trim() || isTyping) return;

        const newHistory = [...chatHistory, { role: 'user', text: chatInput }];
        setChatHistory(newHistory);
        setChatInput('');
        setIsTyping(true);

        try {
            const systemInstruction = `أنت الموظف الذكي لخدمة عملاء متجر إلكتروني. اسم المتجر: ${config.storeName}.
ماذا يبيع: ${config.storeNiche}.
نبرة الرد المطلوبة: ${config.botTone}.
سياسة الشحن: ${config.shippingPolicy || 'حسب سياسة المتجر القياسية'}.
سياسة الاسترجاع: ${config.returnPolicy || 'حسب سياسة المتجر القياسية'}.
العروض المميزة: ${config.offers || 'لا يوجد عروض حالية'}.
معلومات إضافية وقوانين: ${config.otherRules || 'لا توجد قوانين إضافية'}.

التعليمات الصارمة لك:
1. التزم تماماً بـ 'نبرة الرد المطلوبة'.
2. أجب على أسئلة العميل باختصار وبشكل مباشر، ولا تخترع أي سياسات من عندك.
3. إذا سألك العميل عن شيء غير موجود في سياستك، اعتذر بلباقة وأخبره أنك ستتحقق من الأمر مع الإدارة.
4. استخدم الإيموجيز بشكل مناسب إذا كانت النبرة تسمح بذلك.`;

            const contents = newHistory.map(msg => ({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));

            const payload = {
                system_instruction: { parts: { text: systemInstruction } },
                contents: contents
            };

            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error.message);

            const botReply = data.candidates[0].content.parts[0].text;
            setChatHistory(prev => [...prev, { role: 'model', text: botReply }]);
        } catch (e) {
            setChatHistory(prev => [...prev, { role: 'model', text: 'عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي: ' + e.message }]);
        }
        setIsTyping(false);
    };

    return (
        <div className="flex flex-row h-full gap-4 xl:gap-6 py-2 xl:py-6 overflow-hidden px-2 xl:px-0" dir="rtl">

            {/* Right Side: Form Inputs */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-[380px] lg:w-[420px] shrink-0 flex flex-col relative"
            >
                <div className="p-6 border-b border-[#D84B1A]/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#D84B1A]/10 border border-[#D84B1A]/20 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-hive-accent" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white">إعدادات الشات بوت</h3>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">

                        <div className="space-y-3">
                            <label className="text-xs font-black text-white uppercase tracking-widest">أساسيات المتجر</label>
                            <input
                                type="text"
                                placeholder="اسم المتجر (مثال: متجر الأناقة)"
                                value={config.storeName}
                                onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
                                className="w-full bg-[#000000]/15 border border-[#D84B1A]/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D84B1A]/50 transition-all text-right"
                            />
                            <textarea
                                placeholder="ماذا يبيع المتجر؟ (مثال: عطور فرنسية أصلية...)"
                                value={config.storeNiche}
                                onChange={(e) => setConfig({ ...config, storeNiche: e.target.value })}
                                className="w-full h-24 bg-[#000000]/15 border border-[#D84B1A]/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D84B1A]/50 transition-all text-right resize-none"
                            />

                            <select
                                value={config.botTone}
                                onChange={(e) => setConfig({ ...config, botTone: e.target.value })}
                                className="w-full bg-[#000000]/15 border border-[#D84B1A]/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D84B1A]/50 transition-all"
                            >
                                <option className="bg-[#111111] text-white" value="ودية (لهجة عامية)">ودية (لهجة عامية)</option>
                                <option className="bg-[#111111] text-white" value="رسمية واحترافية">رسمية واحترافية</option>
                                <option className="bg-[#111111] text-white" value="مرحة وشبابية">مرحة وشبابية</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-white uppercase tracking-widest">السياسات والقوانين</label>
                            <input
                                type="text"
                                placeholder="سياسة الشحن (مثال: بـ 25 ريال خلال 24 ساعة)"
                                value={config.shippingPolicy}
                                onChange={(e) => setConfig({ ...config, shippingPolicy: e.target.value })}
                                className="w-full bg-[#000000]/15 border border-[#D84B1A]/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D84B1A]/50 transition-all text-right"
                            />
                            <input
                                type="text"
                                placeholder="سياسة الاسترجاع (مثال: خلال 7 أيام بشرط عدم الفتح)"
                                value={config.returnPolicy}
                                onChange={(e) => setConfig({ ...config, returnPolicy: e.target.value })}
                                className="w-full bg-[#000000]/15 border border-[#D84B1A]/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D84B1A]/50 transition-all text-right"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-white uppercase tracking-widest">معلومات إضافية (اختياري)</label>
                            <input
                                type="text"
                                placeholder="ميزة تنافسية أو عرض (مثال: خصم 20% بكود KSA20)"
                                value={config.offers}
                                onChange={(e) => setConfig({ ...config, offers: e.target.value })}
                                className="w-full bg-[#000000]/15 border border-[#D84B1A]/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D84B1A]/50 transition-all text-right"
                            />
                            <textarea
                                placeholder="أي قوانين أخرى (مثال: متوفر الدفع عند الاستلام، لا يوجد فروع...)"
                                value={config.otherRules}
                                onChange={(e) => setConfig({ ...config, otherRules: e.target.value })}
                                className="w-full h-24 bg-[#000000]/15 border border-[#D84B1A]/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D84B1A]/50 transition-all text-right resize-none"
                            />
                        </div>

                        <button
                            onClick={trainBot}
                            className="w-full p-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-[#D84B1A] text-[#111111] hover:bg-[#00DFC0] transition-colors shadow-[0_0_20px_rgba(216,75,26,0.3)]"
                        >
                            <Bot className="w-5 h-5" />
                            {isTrained ? 'تحديث تدريب البوت' : 'تدريب الشات بوت الآن'}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Left Side: Chat Simulator */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 relative flex flex-col min-w-0 bg-[#111111] border border-[#D84B1A]/10 rounded-2xl overflow-hidden shadow-2xl"
            >
                {!isTrained ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-24 h-24 rounded-full bg-[#000000]/20 border border-[#D84B1A]/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(216,75,26,0.1)]">
                            <Bot className="w-12 h-12 text-[#D84B1A] opacity-50" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">بانتظار البيانات...</h2>
                        <p className="text-[#D84B1A]/60 text-sm tracking-widest uppercase">أدخل سياسات متجرك على اليمين لبدء المحاكي</p>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">

                        {/* Chat Header */}
                        <div className="p-4 border-b border-[#D84B1A]/10 bg-[#111111]/90 backdrop-blur flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#D84B1A]/20 flex items-center justify-center relative">
                                <Bot className="w-5 h-5 text-[#D84B1A]" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111111]"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">{config.storeName || 'المساعد الذكي'}</h3>
                                <p className="text-xs text-[#D84B1A]/60">متصل الآن - {config.botTone}</p>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'model' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${msg.role === 'model'
                                            ? 'bg-[#000000]/40 border border-[#D84B1A]/20 text-white rounded-tr-none'
                                            : 'bg-[#D84B1A] text-[#111111] font-medium rounded-tl-none'
                                        }`}>
                                        {msg.text.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-[#000000]/40 border border-[#D84B1A]/20 rounded-2xl p-4 rounded-tr-none flex gap-1">
                                        <div className="w-2 h-2 bg-[#D84B1A] rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-[#D84B1A] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-[#D84B1A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 bg-[#111111]/90 backdrop-blur border-t border-[#D84B1A]/10">
                            <div className="flex items-center gap-3 bg-[#000000]/15 border border-[#D84B1A]/20 rounded-full p-1 pl-4">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="اكتب استفسارك لتجربة البوت..."
                                    className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder-[#D84B1A]/40"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={isTyping || !chatInput.trim()}
                                    className="w-10 h-10 rounded-full bg-[#D84B1A] text-[#111111] flex items-center justify-center hover:bg-[#00DFC0] transition-colors disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4 mr-1" />
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ChatbotMaker;
