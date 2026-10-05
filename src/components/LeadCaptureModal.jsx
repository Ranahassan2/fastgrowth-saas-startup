import React, { useState, useEffect } from 'react';
import { saveToolDataToSupabase } from '../supabaseClient';

export const countryCodes = [
  { code: '+966', name: 'السعودية ', regex: /^[5][0-9]{8}$/, errorMsg: 'رقم الجوال السعودي يجب أن يبدأ بـ 5 ويتكون من 9 أرقام' },
  { code: '+971', name: 'الإمارات ', regex: /^[5][0-9]{8}$/, errorMsg: 'رقم الجوال الإماراتي يجب أن يبدأ بـ 5 ويتكون من 9 أرقام' },
  { code: '+965', name: 'الكويت ', regex: /^[0-9]{8}$/, errorMsg: 'رقم الجوال الكويتي يتكون من 8 أرقام' },
  { code: '+974', name: 'قطر ', regex: /^[0-9]{8}$/, errorMsg: 'رقم الجوال القطري يتكون من 8 أرقام' },
  { code: '+968', name: 'عمان ', regex: /^[0-9]{8}$/, errorMsg: 'رقم الجوال العماني يتكون من 8 أرقام' },
  { code: '+973', name: 'البحرين ', regex: /^[33][0-9]{7}$/, errorMsg: 'رقم الجوال البحريني يتكون من 8 أرقام' },
  { code: '+20', name: 'مصر ', regex: /^[1][0-9]{9}$/, errorMsg: 'رقم الجوال المصري يجب أن يبدأ بـ 1 ويتكون من 10 أرقام' },
  { code: '+962', name: 'الأردن ', regex: /^[7][0-9]{8}$/, errorMsg: 'رقم الجوال الأردني يجب أن يبدأ بـ 7 ويتكون من 9 أرقام' },
  { code: '+964', name: 'العراق ', regex: /^[7][0-9]{9}$/, errorMsg: 'رقم الجوال العراقي يجب أن يبدأ بـ 7 ويتكون من 10 أرقام' },
  { code: '+212', name: 'المغرب ', regex: /^[567][0-9]{8}$/, errorMsg: 'رقم الجوال المغربي يتكون من 9 أرقام' },
  { code: '+213', name: 'الجزائر ', regex: /^[567][0-9]{8}$/, errorMsg: 'رقم الجوال الجزائري يتكون من 9 أرقام' },
  { code: '+216', name: 'تونس ', regex: /^[2459][0-9]{7}$/, errorMsg: 'رقم الجوال التونسي يتكون من 8 أرقام' },
  { code: '+970', name: 'فلسطين ', regex: /^[5][0-9]{8}$/, errorMsg: 'رقم الجوال الفلسطيني يتكون من 9 أرقام' },
  { code: '+961', name: 'لبنان ', regex: /^[0-9]{7,8}$/, errorMsg: 'رقم الجوال اللبناني يتكون من 7 أو 8 أرقام' },
  { code: '+967', name: 'اليمن ', regex: /^[7][0-9]{8}$/, errorMsg: 'رقم الجوال اليمني يتكون من 9 أرقام' },
  { code: '+249', name: 'السودان ', regex: /^[19][0-9]{8}$/, errorMsg: 'رقم الجوال السوداني يتكون من 9 أرقام' },
  { code: '+218', name: 'ليبيا ', regex: /^[9][0-9]{8}$/, errorMsg: 'رقم الجوال الليبي يتكون من 9 أرقام' },
  { code: '+963', name: 'سوريا ', regex: /^[9][0-9]{8}$/, errorMsg: 'رقم الجوال السوري يتكون من 9 أرقام' },
  { code: '+1', name: 'أمريكا/كندا ', regex: /^[0-9]{10}$/, errorMsg: 'الرقم يتكون من 10 أرقام' },
  { code: '+44', name: 'بريطانيا ', regex: /^[0-9]{10}$/, errorMsg: 'الرقم يتكون من 10 أرقام' },
];

const LeadCaptureModal = ({ isOpen, onClose, onSuccess, title = 'خطوة أخيرة قبل الاستمرار!', extraData = {} }) => {
  const [leadData, setLeadData] = useState({ name: '', phone: '', email: '', countryCode: '+966' });
  const [phoneError, setPhoneError] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', zIndex: 9999, padding: '16px', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div style={{ position: 'relative', backgroundColor: '#111111', borderRadius: '24px', width: '100%', maxWidth: '450px', border: '1px solid rgba(216,75,26,0.3)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', boxSizing: 'border-box', margin: 'auto', display: 'flex', flexDirection: 'column', maxHeight: '100%', overflow: 'hidden' }} onClick={e => e.stopPropagation()} dir="rtl">
        {/* Sticky Header */}
        <div style={{ flexShrink: 0, padding: '2rem 1.5rem 1.5rem', borderBottom: '1px solid rgba(216,75,26,0.1)', position: 'relative' }}>
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 50, width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
          >
            
          </button>
          <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center', fontWeight: 'bold', padding: '0 2rem' }}>{title}</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: 0, textAlign: 'center', lineHeight: '1.6' }}>نحتاج لبعض التفاصيل البسيطة لإرسال التقرير الشامل لك والتواصل معك لمناقشة النتائج.</p>
        </div>
        
        {/* Scrollable Form Body */}
        <div className="custom-scrollbar" style={{ overflowY: 'auto', padding: '1.5rem', flex: 1, minHeight: 0 }}>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          if(!leadData.name || !leadData.phone || !leadData.email) {
            alert('الرجاء إكمال جميع الحقول');
            return;
          }
          const selectedCountry = countryCodes.find(c => c.code === leadData.countryCode);
          const normalizedPhone = leadData.phone.replace(/^0+/, '');
          if (selectedCountry && selectedCountry.regex) {
            if (!selectedCountry.regex.test(normalizedPhone)) {
              setPhoneError(selectedCountry.errorMsg);
              return;
            }
          } else {
            const defaultRegex = /^[0-9]{8,15}$/;
            if (!defaultRegex.test(normalizedPhone)) {
              setPhoneError('الرجاء إدخال رقم هاتف صحيح');
              return;
            }
          }
          localStorage.setItem('leadCaptured', 'true');
          const finalLeadData = {
            name: leadData.name,
            phone: leadData.countryCode + leadData.phone,
            email: leadData.email,
          };
          localStorage.setItem('leadData', JSON.stringify(finalLeadData));
          
          // Save to Supabase immediately as well
          saveToolDataToSupabase('تسجيل مبدئي', { source: title, ...extraData }, 'تم إدخال البيانات ولم يبدأ الأداة بعد');
          
          onSuccess();
        }} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>الاسم الكامل</label>
            <input required type="text" name="name" autoComplete="name" placeholder="مثال: أحمد محمد" value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#02080e', border: '1px solid rgba(216,75,26,0.2)', color: '#fff', outline: 'none', fontSize: '16px' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>رقم الهاتف (واتساب)</label>
            <div style={{ display: 'flex', gap: '0.5rem', direction: 'ltr', width: '100%' }}>
              <div style={{ position: 'relative', width: '110px', flexShrink: 0 }}>
                <div 
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  style={{ padding: '1rem 0.5rem', borderRadius: '12px', background: '#02080e', border: '1px solid rgba(216,75,26,0.2)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  <span style={{fontSize: '0.9rem'}}>{countryCodes.find(c => c.code === leadData.countryCode)?.name.split(' ').pop()} {leadData.countryCode}</span>
                </div>
                {showCountryDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem', background: '#02080e', border: '1px solid rgba(216,75,26,0.4)', borderRadius: '12px', overflow: 'hidden', zIndex: 10, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                    <div className="custom-scrollbar" style={{ maxHeight: '150px', overflowY: 'auto', scrollSnapType: 'y mandatory' }}>
                      {countryCodes.map(c => (
                        <div 
                          key={c.name}
                          onClick={() => {
                            setLeadData({...leadData, countryCode: c.code});
                            setShowCountryDropdown(false);
                          }}
                          style={{ padding: '0 0.5rem', height: '50px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'ltr', color: '#fff', transition: 'background 0.2s', scrollSnapAlign: 'start' }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(216,75,26,0.1)'}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span style={{ fontSize: '1rem' }}>{c.name.split(' ').pop()}</span>
                          <span style={{ opacity: 0.8, fontSize: '0.8rem' }}>{c.code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <input 
                required 
                type="tel" 
                name="phone"
                autoComplete="tel"
                placeholder="XXXXXXXXX" 
                value={leadData.phone} 
                onChange={e => {
                  // Prevent typing zero at the beginning
                  const val = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
                  setLeadData({...leadData, phone: val});
                  setPhoneError('');
                }} 
                style={{ flex: 1, minWidth: 0, width: '100%', padding: '1rem', borderRadius: '12px', background: '#02080e', border: `1px solid ${phoneError ? '#ef4444' : 'rgba(216,75,26,0.2)'}`, color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '16px' }} 
              />
            </div>
            {phoneError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', direction: 'rtl' }}>{phoneError}</p>}
          </div>

          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>البريد الإلكتروني</label>
            <input required type="email" name="email" autoComplete="email" placeholder="مثال: ahmed@example.com" value={leadData.email} onChange={e => setLeadData({...leadData, email: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#02080e', border: '1px solid rgba(216,75,26,0.2)', color: '#fff', outline: 'none', direction: 'ltr', fontSize: '16px' }} />
          </div>

          <button type="submit" className="btn-prime" style={{ width: '100%', padding: '1rem', marginTop: '1rem', borderRadius: '12px', fontSize: '1.1rem', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
            الاستمرار الآن
            <svg className="btn-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: 0 }}>
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
