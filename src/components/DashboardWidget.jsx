import React, { useEffect } from 'react';

const DashboardWidget = () => {
  useEffect(() => {
    // Pulse animation
    const dashRows = document.querySelectorAll('#dashRows .dash-row');
    let dashIdx = 0;
    let interval;
    if(dashRows.length){
      interval = setInterval(()=>{
        dashRows.forEach(r=>r.classList.remove('pulse'));
        dashRows[dashIdx].classList.add('pulse');
        dashIdx=(dashIdx+1)%dashRows.length;
      },2400);
    }
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dash-card reveal visible" style={{ margin: '6rem auto 3rem auto', maxWidth: '950px', display: 'flex', flexDirection: 'column' }}>
      <div className="dash-head">
        <div className="dash-head-left"><span className="dash-logo-dot"></span> FastGrowth System</div>
        <span className="dash-live-badge"><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--teal)', display: 'block', animation: 'blink 1.5s infinite' }}></span> LIVE</span>
      </div>
      <div className="dash-rows" id="dashRows">
        <div className="dash-row" data-bar="86">
          <div className="dash-icon"></div>
          <div className="dash-info"><div className="dash-name">Ads Engine</div><div className="dash-sub">عائد الإعلانات ROAS</div></div>
          <div className="dash-metric"><span className="dash-val" id="dvAds">+270%</span><div className="dash-bar"><span style={{width:'86%'}}></span></div></div>
        </div>
        <div className="dash-row" data-bar="93">
          <div className="dash-icon"></div>
          <div className="dash-info"><div className="dash-name">SEO Engine</div><div className="dash-sub">ترتيب الكلمات المستهدفة</div></div>
          <div className="dash-metric"><span className="dash-val">صفحة #1</span><div className="dash-bar"><span style={{width:'93%'}}></span></div></div>
        </div>
        <div className="dash-row" data-bar="74">
          <div className="dash-icon"></div>
          <div className="dash-info"><div className="dash-name">Content Engine</div><div className="dash-sub">نمو المتابعين شهرياً</div></div>
          <div className="dash-metric"><span className="dash-val">+2,400</span><div className="dash-bar"><span style={{width:'74%'}}></span></div></div>
        </div>
        <div className="dash-row" data-bar="100">
          <div className="dash-icon"></div>
          <div className="dash-info"><div className="dash-name">Data Engine</div><div className="dash-sub">تحديث لوحة البيانات</div></div>
          <div className="dash-metric"><span className="dash-val">مباشر</span><div className="dash-bar"><span style={{width:'100%'}}></span></div></div>
        </div>
      </div>
      <div className="dash-footer">
        <div className="dash-stat"><span className="dash-stat-val" id="dvLeads">12</span><span className="dash-stat-label">عميل جديد اليوم</span></div>
        <div className="dash-stat"><span className="dash-stat-val">98%</span><span className="dash-stat-label">صحة النظام</span></div>
      </div>
    </div>
  );
};

export default DashboardWidget;
