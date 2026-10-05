import React, { useState, useRef } from 'react';

const MODELS = [
  { id: 'stabilityai/stable-diffusion-2-1',          name: 'Stable Diffusion 2.1  (موثوق)' },
  { id: 'runwayml/stable-diffusion-v1-5',             name: 'Stable Diffusion 1.5 (سريع)' },
  { id: 'stabilityai/stable-diffusion-xl-base-1.0',  name: 'Stable Diffusion XL (جودة عالية)' },
  { id: 'prompthero/openjourney',                     name: 'OpenJourney (ستايل Midjourney)' },
];

const SIZES = [
  { label: 'مربع 512×512',    w: 512,  h: 512  },
  { label: 'مربع 768×768',    w: 768,  h: 768  },
  { label: 'أفقي 768×512',    w: 768,  h: 512  },
  { label: 'عمودي 512×768',   w: 512,  h: 768  },
];

const EXAMPLE_PROMPTS = [
  'A futuristic city at night with neon lights, ultra realistic, 8K',
  'A majestic lion in golden savanna at sunset, photorealistic',
  'Cyberpunk robot warrior, detailed armor, dramatic lighting',
  'Cherry blossom garden in Japan, spring morning, soft light',
  'Deep ocean with bioluminescent jellyfish, cinematic, 4K',
];

const ENV_KEY = import.meta.env.VITE_HF_API_KEY || '';

export default function ImageGenerator() {
  const [apiKey, setApiKey]       = useState(ENV_KEY);
  const [showKey, setShowKey]     = useState(false);
  const [prompt, setPrompt]       = useState('');
  const [negPrompt, setNegPrompt] = useState('');
  const [model, setModel]         = useState(MODELS[0].id);
  const [size, setSize]           = useState(SIZES[0]);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [status, setStatus]       = useState('');   // status message during loading
  const [error, setError]         = useState('');
  const [history, setHistory]     = useState([]);
  const abortRef                  = useRef(null);

  /* ── call HF API with retry on model-loading ─────────────────── */
  const callHF = async (retries = 8) => {
    const body = {
      inputs: prompt.trim(),
      parameters: {
        negative_prompt: negPrompt.trim() || undefined,
        width: size.w,
        height: size.h,
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
    };

    const res = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method : 'POST',
        headers: {
          Authorization : `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: abortRef.current,
      }
    );

    // Model is loading — wait and retry
    if (res.status === 503) {
      const json = await res.json().catch(() => ({}));
      const wait = Math.ceil(json.estimated_time || 20);
      if (retries <= 0) throw new Error('الموديل لم يستجب بعد أكثر من محاولة، جرب مرة أخرى');

      setStatus(` الموديل بيصحى... انتظر ${wait} ثانية (${retries} محاولات متبقية)`);
      await new Promise(r => setTimeout(r, Math.min(wait * 1000, 25000)));
      setStatus(` جاري إعادة المحاولة...`);
      return callHF(retries - 1);
    }

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error || `خطأ ${res.status}`);
    }

    return res.blob();
  };

  /* ── main generate ────────────────────────────────────────────── */
  const generate = async () => {
    if (!apiKey.trim()) { setError('️ أدخل API Key من Hugging Face أولاً'); return; }
    if (!prompt.trim()) { setError('️ اكتب وصف الصورة أولاً'); return; }

    abortRef.current = new AbortController().signal;
    setLoading(true);
    setError('');
    setResult(null);
    setStatus(' جاري إرسال الطلب...');

    try {
      setStatus(' جاري توليد الصورة...');
      const blob   = await callHF();
      const imgUrl = URL.createObjectURL(blob);

      setResult(imgUrl);
      setHistory(prev => [{ url: imgUrl, prompt, model }, ...prev].slice(0, 6));
      setStatus('');
    } catch (e) {
      if (e.name === 'AbortError') return;
      setError(` ${e.message}`);
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = `hf-generated-${Date.now()}.png`;
    a.click();
  };

  const handleKey = (e) => { if (e.key === 'Enter' && e.ctrlKey) generate(); };

  /* ── UI ───────────────────────────────────────────────────────── */
  return (
    <section className="ig-section" id="image-generator">
      <div className="ig-container">

        {/* Header */}
        <div className="ig-header">
          <div className="ig-icon-wrap">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
          </div>
          <div>
            <h2 className="ig-title">AI Image Generator</h2>
            <p className="ig-subtitle">
              اكتب وصف الصورة واحصل على نتيجة بالذكاء الاصطناعي
              <span className="ig-free-badge"> Hugging Face Free</span>
            </p>
          </div>
        </div>

        <div className="ig-grid">

          {/* ── Controls Panel ── */}
          <div className="ig-panel">

            {/* API Key — show only if NOT set via env */}
            {!ENV_KEY && (
              <div className="ig-field">
                <label className="ig-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                  Hugging Face API Key
                  <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="ig-link">
                    احصل عليه مجاناً ↗
                  </a>
                </label>
                <div className="ig-key-wrap">
                  <input
                    type={showKey ? 'text' : 'password'}
                    className="ig-input"
                    placeholder="hf_xxxxxxxxxxxxxxxxxxxx"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    dir="ltr"
                  />
                  <button className="ig-eye" onClick={() => setShowKey(s => !s)}>
                    {showKey ? '' : '️'}
                  </button>
                </div>
                <div className="ig-info-box">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  سجّل على huggingface.co ← Settings ← Access Tokens ← New Token (Read)
                </div>
              </div>
            )}

            {/* Connected badge — shown when key is loaded from env */}
            {ENV_KEY && (
              <div className="ig-connected-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                متصل بـ Hugging Face — API Key محمّل تلقائياً 
              </div>
            )}

            {/* Prompt */}
            <div className="ig-field">
              <label className="ig-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                وصف الصورة (Prompt)
                <small style={{marginRight:'auto',color:'var(--text-dim)',fontSize:'.72rem'}}>Ctrl+Enter للتوليد</small>
              </label>
              <textarea
                className="ig-input ig-textarea"
                rows={4}
                placeholder="مثال: A beautiful sunset over the mountains, golden hour, photorealistic, 8K, cinematic..."
                value={prompt}
                onChange={e => { setPrompt(e.target.value); setError(''); }}
                onKeyDown={handleKey}
                dir="auto"
              />
              <div className="ig-examples">
                {EXAMPLE_PROMPTS.slice(0, 3).map((ex, i) => (
                  <button key={i} className="ig-example-chip" onClick={() => { setPrompt(ex); setError(''); }}>
                    {ex.slice(0, 38)}…
                  </button>
                ))}
              </div>
            </div>

            {/* Negative Prompt */}
            <div className="ig-field">
              <label className="ig-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                تجنب (Negative Prompt) — اختياري
              </label>
              <input
                type="text"
                className="ig-input"
                placeholder="blurry, low quality, watermark, ugly, deformed..."
                value={negPrompt}
                onChange={e => setNegPrompt(e.target.value)}
                dir="ltr"
              />
            </div>

            {/* Model & Size */}
            <div className="ig-two-col">
              <div className="ig-field">
                <label className="ig-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  النموذج
                </label>
                <select className="ig-input ig-select" value={model} onChange={e => setModel(e.target.value)}>
                  {MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              <div className="ig-field">
                <label className="ig-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                  الحجم
                </label>
                <select
                  className="ig-input ig-select"
                  value={`${size.w}x${size.h}`}
                  onChange={e => {
                    const [w, h] = e.target.value.split('x').map(Number);
                    setSize(SIZES.find(s => s.w === w && s.h === h));
                  }}
                >
                  {SIZES.map(s => (
                    <option key={`${s.w}x${s.h}`} value={`${s.w}x${s.h}`}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error */}
            {error && <div className="ig-error">{error}</div>}

            {/* Generate */}
            <button
              className={`ig-btn${loading ? ' ig-btn--loading' : ''}`}
              onClick={generate}
              disabled={loading}
              id="ig-generate-btn"
            >
              {loading
                ? <><span className="ig-spinner"/> {status || 'جاري التوليد...'}</>
                : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> توليد الصورة</>
              }
            </button>

            {/* Status (when loading) */}
            {loading && status && (
              <div className="ig-status-box">
                <span className="ig-status-dot"/>
                {status}
              </div>
            )}

          </div>

          {/* ── Result Panel ── */}
          <div className="ig-result-panel">
            {result ? (
              <div className="ig-result-wrap">
                <div className="ig-result-header">
                  <span className="ig-badge"> تم التوليد بنجاح</span>
                  <button className="ig-download" onClick={download}>️ تحميل PNG</button>
                </div>
                <img src={result} alt="Generated" className="ig-result-img"/>
                <p className="ig-result-prompt">"{prompt}"</p>
              </div>
            ) : (
              <div className="ig-placeholder">
                <div className="ig-placeholder-icon">
                  {loading
                    ? <div className="ig-big-spinner"/>
                    : <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                  }
                </div>
                <h3>{loading ? 'يتم توليد الصورة...' : 'الصورة ستظهر هنا'}</h3>
                <p style={{maxWidth:'260px'}}>
                  {loading
                    ? (status || 'قد يستغرق ذلك 20-60 ثانية')
                    : 'أدخل الـ API Key ووصف الصورة ثم اضغط توليد'}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="ig-history">
            <h3 className="ig-history-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
              الصور السابقة
            </h3>
            <div className="ig-history-grid">
              {history.map((item, i) => (
                <div key={i} className="ig-hist-item" onClick={() => setResult(item.url)}>
                  <img src={item.url} alt={item.prompt}/>
                  <div className="ig-hist-overlay"><span>عرض</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
