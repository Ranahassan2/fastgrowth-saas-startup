import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const AnimaStoreTemplate = ({ config, prompt }) => {
    const isRtl = config.language === 'Arabic';
    
    // Inject dynamic colors using style
    const dynamicStyles = {
        '--color-primary': config.primaryColor || '#3b82f6',
        '--color-secondary': config.secondaryColor || '#1e293b',
    };

    // Helper to get hex with opacity for glassmorphism
    const hexToRgba = (hex, alpha) => {
        if(!hex || !hex.startsWith('#')) return `rgba(59, 130, 246, ${alpha})`;
        const r = parseInt(hex.slice(1, 3), 16) || 0;
        const g = parseInt(hex.slice(3, 5), 16) || 0;
        const b = parseInt(hex.slice(5, 7), 16) || 0;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const primaryLight = hexToRgba(config.primaryColor, 0.1);
    const primaryGlow = hexToRgba(config.primaryColor, 0.3);

    const getHeroText = () => {
        switch(config.activityType) {
            case 'restaurant': return isRtl ? 'تجربة طعام لا تُنسى' : 'An Unforgettable Dining Experience';
            case 'business': return isRtl ? 'ارتقِ بأعمالك للمستوى التالي' : 'Elevate Your Business to the Next Level';
            case 'portfolio': return isRtl ? 'معرض أعمالي الإبداعية' : 'My Creative Portfolio';
            default: return isRtl ? 'اكتشف منتجاتنا الحصرية والمميزة' : 'Discover Our Exclusive & Premium Products';
        }
    };

    // AI Image Generator Helper using Pollinations AI
    const getAiImageUrl = (description, width = 800, height = 600) => {
        const keyword = config.niche || config.projectName || 'modern e-commerce store';
        const contextPrompt = prompt ? ` (${prompt})` : '';
        const fullQuery = `high quality photography, ${description}, ${keyword}${contextPrompt}`;
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(fullQuery)}?width=${width}&height=${height}&nologo=true`;
    };

    return (
        <div 
            style={dynamicStyles} 
            className={`w-full h-full overflow-y-auto bg-white text-slate-900 ${config.fontStyle === 'serif' ? 'font-serif' : 'font-sans'}`}
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                    {/* Logo & Name */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                            <ShoppingBag className="w-4 h-4" />
                        </div>
                        <span className="font-black text-lg tracking-tight truncate max-w-[120px] sm:max-w-[250px]" style={{ color: 'var(--color-secondary)' }}>
                            {config.projectName || (isRtl ? 'المتجر المتميز' : 'Premium Store')}
                        </span>
                    </div>
                    
                    {/* Navigation - Flex-1 takes remaining space, allows scrolling if squished, NEVER overlaps */}
                    <nav className="flex-1 flex items-center justify-end overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-slate-600 min-w-max px-2">
                            <a href="#" className="hover:text-slate-900 transition-colors whitespace-nowrap">{isRtl ? 'الرئيسية' : 'Home'}</a>
                            <a href="#" className="hover:text-slate-900 transition-colors whitespace-nowrap">{isRtl ? 'المنتجات' : 'Products'}</a>
                            {config.hasBlog && <a href="#" className="hover:text-slate-900 transition-colors whitespace-nowrap">{isRtl ? 'المدونة' : 'Blog'}</a>}
                            <a href="#" className="hover:text-slate-900 transition-colors whitespace-nowrap">{isRtl ? 'تواصل معنا' : 'Contact'}</a>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-32">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ backgroundColor: 'var(--color-secondary)' }}></div>
                
                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border backdrop-blur-sm"
                        style={{ backgroundColor: primaryLight, borderColor: primaryGlow, color: 'var(--color-primary)' }}
                    >

                        <span className="text-xs font-black uppercase tracking-wider">{isRtl ? 'تصميم حصري عالي الدقة' : 'Ultra Premium Design'}</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-tight"
                    >
                        {getHeroText()}
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl font-medium"
                    >
                        {isRtl 
                            ? 'نقدم لك أفضل الحلول والتجارب التي تناسب احتياجاتك وتفوق توقعاتك. اكتشف عالماً من الجودة والإتقان في كل تفصيلة.' 
                            : 'We provide the best solutions and experiences that fit your needs and exceed your expectations. Discover a world of quality in every detail.'}
                    </motion.p>
                    
                    {prompt && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 mb-10 max-w-xl text-center shadow-sm"
                        >
                            <p className="text-slate-600 font-medium italic text-sm">
                                "{prompt}"
                            </p>
                        </motion.div>
                    )}
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <button 
                            className="px-8 py-4 rounded-full text-white font-bold text-lg transition-transform hover:-translate-y-1 shadow-2xl flex items-center justify-center gap-2"
                            style={{ backgroundColor: 'var(--color-primary)', boxShadow: `0 20px 40px -10px ${primaryGlow}` }}
                        >
                            {isRtl ? 'ابدأ الاستكشاف' : 'Start Exploring'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button 
                            className="px-8 py-4 rounded-full font-bold text-lg transition-colors border-2 hover:bg-slate-50"
                            style={{ borderColor: 'var(--color-secondary)', color: 'var(--color-secondary)' }}
                        >
                            {isRtl ? 'تعرف علينا أكثر' : 'Learn More'}
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Features / Value Proposition */}
            <section className="py-24 bg-slate-50 border-y border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: 'var(--color-secondary)' }}>
                            {isRtl ? 'لماذا نحن الخيار الأفضل؟' : 'Why Choose Us?'}
                        </h2>
                        <div className="w-24 h-1.5 mx-auto rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: ShieldCheck, title: isRtl ? 'جودة مضمونة' : 'Guaranteed Quality', desc: isRtl ? 'نلتزم بأعلى معايير الجودة في كل تفصيلة، لضمان تجربة لا مثيل لها لك ولعملائك.' : 'We commit to the highest quality standards.' },
                            { icon: Zap, title: isRtl ? 'سرعة استثنائية' : 'Exceptional Speed', desc: isRtl ? 'أداء فائق وسرعة لا تضاهى، لأننا نقدر وقتك ونسعى لتقديم الأفضل.' : 'Fast execution and delivery without compromising performance.' },
                            { icon: Star, title: isRtl ? 'تقييم ممتاز' : 'Excellent Reviews', desc: isRtl ? 'آلاف العملاء الراضين عن خدماتنا ومنتجاتنا حول العالم يثقون بنا.' : 'Thousands of satisfied customers worldwide trust us.' },
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group"
                            >
                                <div 
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3"
                                    style={{ backgroundColor: primaryLight, color: 'var(--color-primary)' }}
                                >
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black mb-4 text-slate-900">{item.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dynamic Pages based on pageCount */}
            {Array.from({ length: Math.max(0, config.pageCount - 1) }).map((_, idx) => {
                const sectionTypes = ['products', 'categories', 'newsletter', 'stats', 'gallery', 'faq', 'contact', 'about', 'testimonials'];
                const currentType = sectionTypes[idx % sectionTypes.length];
                
                return (
                <section key={idx} className={`py-24 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: 'var(--color-secondary)' }}>
                                {isRtl ? `محتوى الصفحة ${idx + 2}` : `Page Content ${idx + 2}`}
                            </h2>
                            <div className="w-24 h-1.5 mx-auto rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                        </div>
                        
                        {currentType === 'products' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[1, 2, 3, 4].map(item => (
                                    <div key={item} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                                        <div className="w-full h-48 rounded-2xl bg-slate-100 mb-4 overflow-hidden relative">
                                            <img src={getAiImageUrl(`single product item ${item} isolated`, 400, 400)} alt="Product" className="w-full h-full object-cover" loading="lazy" />
                                            <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-transparent" style={{ '--tw-gradient-to': 'var(--color-primary)' }}></div>
                                        </div>
                                        <h4 className="font-bold text-slate-800 mb-1">{isRtl ? 'منتج مميز' : 'Premium Product'} {item}</h4>
                                        <p className="text-slate-400 text-sm mb-3 font-medium">99.99$</p>
                                        <button className="w-full py-2 rounded-xl text-sm font-bold transition-colors" style={{ backgroundColor: primaryLight, color: 'var(--color-primary)' }}>
                                            {isRtl ? 'إضافة للسلة' : 'Add to Cart'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentType === 'categories' && (
                            <div className="flex flex-wrap justify-center gap-8">
                                {[1, 2, 3, 4, 5].map(item => (
                                    <div key={item} className="flex flex-col items-center gap-3 group cursor-pointer">
                                        <div className="w-24 h-24 rounded-full flex items-center justify-center transition-transform group-hover:-translate-y-2 group-hover:shadow-lg" style={{ backgroundColor: 'white', border: `2px solid ${primaryLight}`, color: 'var(--color-primary)' }}>
                                            <Star className="w-8 h-8" />
                                        </div>
                                        <span className="font-bold text-slate-700">{isRtl ? 'تصنيف' : 'Category'} {item}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentType === 'newsletter' && (
                            <div className="w-full rounded-[2.5rem] p-12 text-center relative overflow-hidden" style={{ backgroundColor: 'var(--color-secondary)' }}>
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, var(--color-primary) 0%, transparent 50%)` }}></div>
                                <h3 className="text-3xl font-black text-white mb-4 relative z-10">{isRtl ? 'انضم إلى قائمتنا البريدية' : 'Join Our Newsletter'}</h3>
                                <p className="text-slate-300 mb-8 max-w-lg mx-auto relative z-10">{isRtl ? 'احصل على أحدث العروض والمنتجات الحصرية مباشرة في صندوق الوارد الخاص بك.' : 'Get the latest offers and exclusive products directly in your inbox.'}</p>
                                <div className="flex max-w-md mx-auto relative z-10">
                                    <input type="email" placeholder={isRtl ? 'بريدك الإلكتروني' : 'Your email address'} className="flex-1 px-6 py-4 rounded-l-full outline-none text-slate-800" dir={isRtl ? 'rtl' : 'ltr'} />
                                    <button className="px-8 py-4 rounded-r-full text-white font-bold transition-transform hover:scale-105" style={{ backgroundColor: 'var(--color-primary)' }}>{isRtl ? 'اشتراك' : 'Subscribe'}</button>
                                </div>
                            </div>
                        )}

                        {currentType === 'stats' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { num: '+5000', label: isRtl ? 'عميل سعيد' : 'Happy Clients' },
                                    { num: '+200', label: isRtl ? 'منتج مميز' : 'Premium Products' },
                                    { num: '24/7', label: isRtl ? 'دعم فني' : 'Support' },
                                    { num: '100%', label: isRtl ? 'جودة مضمونة' : 'Guaranteed Quality' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100">
                                        <div className="text-4xl font-black mb-2" style={{ color: 'var(--color-primary)' }}>{stat.num}</div>
                                        <div className="text-slate-500 font-bold">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentType === 'gallery' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map(item => (
                                    <div key={item} className="w-full aspect-square rounded-2xl overflow-hidden relative group bg-slate-100">
                                        <img src={getAiImageUrl(`beautiful gallery photo variation ${item}`, 600, 600)} alt="Gallery" className="w-full h-full object-cover" loading="lazy" />
                                        <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity bg-gradient-to-br from-transparent" style={{ '--tw-gradient-to': 'var(--color-primary)' }}></div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentType === 'faq' && (
                            <div className="max-w-3xl mx-auto space-y-4">
                                {[1, 2, 3, 4].map(item => (
                                    <div key={item} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                        <h4 className="font-bold text-slate-800 mb-2 flex justify-between items-center">
                                            <span>{isRtl ? 'سؤال متكرر حول خدماتنا ومنتجاتنا؟' : 'Frequently asked question about our services?'}</span>
                                            <span className="text-xl" style={{ color: 'var(--color-primary)' }}>+</span>
                                        </h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            {isRtl 
                                                ? 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.'
                                                : 'This is a sample text that can be replaced in the same space. This text has been generated from an Arabic text generator, where you can generate such text or many other texts.'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentType === 'contact' && (
                            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-12">
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-2xl font-black text-slate-800">{isRtl ? 'دعنا نتحدث!' : 'Let\'s Talk!'}</h3>
                                    <p className="text-slate-500">{isRtl ? 'نحن هنا لمساعدتك والإجابة على استفساراتك. لا تتردد في التواصل معنا في أي وقت.' : 'We are here to help and answer your questions. Feel free to contact us anytime.'}</p>
                                    <div className="space-y-4">
                                        <input type="text" placeholder={isRtl ? 'الاسم الكريم' : 'Your Name'} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-slate-300" />
                                        <input type="email" placeholder={isRtl ? 'البريد الإلكتروني' : 'Your Email'} className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-slate-300" />
                                        <textarea placeholder={isRtl ? 'رسالتك' : 'Your Message'} rows="4" className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-slate-300 resize-none"></textarea>
                                        <button className="w-full py-4 rounded-xl text-white font-bold transition-transform hover:-translate-y-1" style={{ backgroundColor: 'var(--color-primary)' }}>{isRtl ? 'إرسال الرسالة' : 'Send Message'}</button>
                                    </div>
                                </div>
                                <div className="flex-1 rounded-2xl bg-slate-100 overflow-hidden relative min-h-[300px]">
                                    <img src={getAiImageUrl(`customer service support or elegant store front`, 800, 800)} alt="Contact" className="w-full h-full object-cover" loading="lazy" />
                                    <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-transparent" style={{ '--tw-gradient-to': 'var(--color-secondary)' }}></div>
                                </div>
                            </div>
                        )}

                        {currentType === 'about' && (
                            <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
                                <div className="flex-1 w-full aspect-square max-h-[400px] rounded-[3rem] bg-slate-100 overflow-hidden relative">
                                    <img src={getAiImageUrl(`team working workspace or lifestyle`, 800, 800)} alt="About Us" className="w-full h-full object-cover" loading="lazy" />
                                    <div className="absolute inset-0 opacity-30 bg-gradient-to-bl from-transparent" style={{ '--tw-gradient-to': 'var(--color-primary)' }}></div>
                                </div>
                                <div className="flex-1 space-y-6 text-center md:text-start">
                                    <h3 className="text-3xl font-black text-slate-800">{isRtl ? 'من نحن؟' : 'About Us'}</h3>
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        {isRtl 
                                            ? 'نحن فريق شغوف نسعى لتقديم الأفضل دائماً. نؤمن بأن الجودة والتفاصيل هي ما يصنع الفارق في تجربة عملائنا. منذ انطلاقنا، كان هدفنا الأول هو بناء الثقة والمصداقية من خلال تقديم منتجات مبتكرة وخدمة عملاء استثنائية.'
                                            : 'We are a passionate team always striving to provide the best. We believe that quality and details are what make the difference in our customers\' experience. Since our launch, our primary goal has been to build trust and credibility.'}
                                    </p>
                                    <button className="px-8 py-4 rounded-full font-bold transition-colors border-2" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                                        {isRtl ? 'اكتشف قصتنا' : 'Discover Our Story'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentType === 'testimonials' && (
                            <div className="grid md:grid-cols-3 gap-6">
                                {[1, 2, 3].map(item => (
                                    <div key={item} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative">
                                        <div className="absolute top-8 right-8 text-6xl opacity-10 font-serif" style={{ color: 'var(--color-primary)' }}>"</div>
                                        <div className="flex gap-1 mb-6 text-yellow-400">
                                            <Star className="w-5 h-5 fill-current" />
                                            <Star className="w-5 h-5 fill-current" />
                                            <Star className="w-5 h-5 fill-current" />
                                            <Star className="w-5 h-5 fill-current" />
                                            <Star className="w-5 h-5 fill-current" />
                                        </div>
                                        <p className="text-slate-600 italic mb-8 relative z-10">
                                            {isRtl ? 'تجربة رائعة جداً! المنتجات ذات جودة عالية والتوصيل كان سريعاً. سأكون عميلاً دائماً بالتأكيد.' : 'Very wonderful experience! The products are of high quality and delivery was fast. I will definitely be a regular customer.'}
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                                            <div>
                                                <div className="font-bold text-slate-800">{isRtl ? 'عميل مميز' : 'Valued Customer'} {item}</div>
                                                <div className="text-xs text-slate-500">{isRtl ? 'مشتري مؤكد' : 'Verified Buyer'}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
                );
            })}

            {/* Blog Section if hasBlog is true */}
            {config.hasBlog && (
                <section className="py-24 bg-white border-t border-slate-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: 'var(--color-secondary)' }}>
                                {isRtl ? 'أحدث المقالات (المدونة)' : 'Latest Articles (Blog)'}
                            </h2>
                            <div className="w-24 h-1.5 mx-auto rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {[1, 2].map((item) => (
                                <motion.div 
                                    key={item} 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:shadow-lg transition-shadow"
                                >
                                    <div className="w-full h-48 rounded-2xl mb-6 bg-slate-200 flex items-center justify-center overflow-hidden">
                                        <img src={getAiImageUrl(`blog article header image variation ${item}`, 800, 400)} alt="Blog" className="w-full h-full object-cover" loading="lazy" />
                                    </div>
                                    <div className="w-20 h-6 rounded-full mb-4 flex items-center justify-center text-[10px] font-black tracking-widest" style={{ backgroundColor: primaryLight, color: 'var(--color-primary)' }}>
                                        ARTICLE
                                    </div>
                                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-12 border-t border-slate-200 text-center bg-white relative z-10">
                <p className="text-slate-400 font-medium text-sm">
                     2026 {config.projectName || (isRtl ? 'المتجر المتميز' : 'Premium Store')}. {isRtl ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <span className="text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full bg-slate-50 text-slate-400">
                        Designed with Anima Architecture
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default AnimaStoreTemplate;
