import React, { useEffect, useState } from 'react';
import SiteAnalyzer from './SiteAnalyzer';
import LeadCaptureModal from './LeadCaptureModal';
import { useLanguage } from '../context/LanguageContext';

const Hero = ({ onOpenDesigner }) => {
  const { t, lang } = useLanguage();
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const [analysisUrl, setAnalysisUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    if (showLeadForm || showAnalyzer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLeadForm, showAnalyzer]);

  useEffect(() => {
    // Reveal Observer
    const obs = new IntersectionObserver(e => e.forEach(x => {
      if (x.isIntersecting) {
        x.target.classList.add('visible');
        x.target.querySelectorAll('.counter').forEach(c => {
          if (!c.dataset.done) {
            c.dataset.done = '1';
            const t = +c.dataset.target;
            const suf = c.dataset.suffix || '';
            let count = 0;
            const s = Math.max(t / 60, 1);
            if (c.tm) clearInterval(c.tm);
            c.tm = setInterval(() => {
              count = Math.min(count + s, t);
              c.textContent = ~~count + suf;
              if (count >= t) clearInterval(c.tm);
            }, 25);
          }
        });
      } else {
        x.target.classList.remove('visible');
        x.target.querySelectorAll('.counter').forEach(c => {
          c.dataset.done = '';
          c.textContent = '0' + (c.dataset.suffix || '');
          if (c.tm) clearInterval(c.tm);
        });
      }
    }), { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }, []);

  return (
    <section id="hero">
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div className="hero-eyebrow reveal visible"><span></span>{t('hero.eyebrow')}</div>
        <h1 className="hero-title reveal visible">
          {t('hero.title')}
        </h1>
        <p className="hero-desc reveal visible">{t('hero.desc1')}</p>
        <p className="hero-desc reveal visible" style={{ marginTop: '-1.5rem', marginBottom: '2.5rem' }}>{t('hero.desc2')}</p>
        
        <div style={{ position: 'relative', maxWidth: '650px', margin: '2.5rem auto 2.5rem auto' }}>
          <div className={`hero-analyze-form reveal visible ${urlError ? 'error' : ''}`}>
            <input 
              type="text" 
              placeholder={t('hero.placeholder')} 
              value={analysisUrl}
              onChange={(e) => {
                setAnalysisUrl(e.target.value);
                if (urlError) setUrlError('');
              }}
              dir="ltr" 
              style={{ textAlign: lang === 'ar' && !analysisUrl ? 'right' : 'left' }}
            />
            <button 
              onClick={() => {
                if (!analysisUrl.trim() || !analysisUrl.includes('.')) {
                  setUrlError(t('hero.errorUrl'));
                  return;
                }
                setUrlError('');
                setShowLeadForm(true);
              }} 
              className="btn-prime" 
            >
              {t('hero.analyzeBtn')}
              <svg className="btn-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: 0 }}>
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
          </div>
          {urlError && (
            <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'right', paddingRight: '1rem', animation: 'fadeIn 0.3s ease' }}>
              {urlError}
            </div>
          )}
        </div>
        <div className="hero-btns" style={{ marginTop: '6rem' }}>
          <a href="#tools" className="btn-prime" style={{ border: 'none', fontFamily: 'inherit', textDecoration: 'none' }}>
            ابدأ مجاناً
            <svg className="btn-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </a>
          <a href="#journey" className="btn-ghost">
            {t('hero.howItWorksBtn')}
            <svg className="btn-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </a>
        </div>

      </div>
      
      <LeadCaptureModal 
        isOpen={showLeadForm} 
        onClose={() => setShowLeadForm(false)} 
        onSuccess={() => {
          setShowLeadForm(false);
          setShowAnalyzer(true);
        }} 
        extraData={{ url: analysisUrl }}
      />

      {showAnalyzer && (
        <SiteAnalyzer 
          initialUrl={analysisUrl} 
          onClose={() => setShowAnalyzer(false)} 
        />
      )}
    </section>
  );
};

export default Hero;
