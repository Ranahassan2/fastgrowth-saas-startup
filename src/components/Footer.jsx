import React from 'react';
import fastLogo from '../assets/fast logo.png';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <>
      <footer>
        <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <img src={fastLogo} alt="Fast Growth" style={{ height: '130px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.2rem', fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>{t('footer.desc')}</span>
        </div>
        <div className="footer-links">
          <a href="#problems">{t('footer.links.problems')}</a><a href="#systems">{t('footer.links.systems')}</a><a href="#journey">{t('footer.links.journey')}</a><a href="#pricing">{t('footer.links.pricing')}</a><a href="#tools">{t('footer.links.tools')}</a><a href="#compare">{t('footer.links.compare')}</a>
        </div>
        <p style={{ margin: 0, paddingBottom: '0.5rem' }}>{t('footer.copy')}</p>

        <div className="social-links">
          <a href="https://www.tiktok.com/@fastgrowth.sa" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
            </svg>
          </a>
          <a href="https://www.instagram.com/fastgrowth.sa/?igsh=MTlvZDQ2OHN2eTE0cg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
