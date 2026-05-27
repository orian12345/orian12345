'use client';
import { useEffect, useState } from 'react';
import { CONTENT_DEFAULTS } from '@/lib/defaults';

export default function ContentPage() {
  const [values, setValues] = useState({});
  const [saved, setSaved] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content').then(r=>r.json()).then(rows=>{
      const map = {};
      rows.forEach(r=>{ map[r.key]=r.value; });
      setValues(map);
      setLoading(false);
    });
  }, []);

  const save = async (key) => {
    const val = values[key] ?? CONTENT_DEFAULTS[key]?.value ?? '';
    const res = await fetch('/api/content', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ key, value:val }) });
    if (res.ok) { setSaved(s=>({...s,[key]:true})); setTimeout(()=>setSaved(s=>({...s,[key]:false})),2000); }
  };

  const val = (key) => values[key] ?? CONTENT_DEFAULTS[key]?.value ?? '';

  const inputStyle = (key) => ({ width:'100%',padding:'10px 14px',borderRadius:8,background:'#0f1117',color:'#f5f7fa',border:'1px solid rgba(255,255,255,.1)',fontSize:14,fontFamily:'inherit',boxSizing:'border-box',resize:CONTENT_DEFAULTS[key]?.type==='textarea'?'vertical':'none' });

  const groups = [
    { label:'פרטי העסק', keys:['businessName','phone','whatsapp','email'] },
    { label:'הירו', keys:['heroTitle','heroSubtitle','yearsExperience','totalInstallations','googleRating'] },
    { label:'באנר מבצע', keys:['promoBannerActive','promoBannerText'] },
    { label:'תצוגה', keys:['showPriceEstimator'] },
  ];

  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontSize:28,fontWeight:800,margin:'0 0 8px' }}>עריכת תכנים</h1>
        <p style={{ color:'#9aa3ad',fontSize:14,margin:0 }}>ערוך את תכני האתר. השינויים יכנסו לתוקף מיידית.</p>
      </div>
      {loading ? <div style={{ color:'#9aa3ad' }}>טוען...</div> : groups.map(g=>(
        <div key={g.label} style={{ background:'#1a1f2e',border:'1px solid rgba(255,255,255,.06)',borderRadius:12,padding:28,marginBottom:24 }}>
          <h2 style={{ fontSize:16,fontWeight:700,color:'#c8d3df',margin:'0 0 24px',paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,.06)' }}>{g.label}</h2>
          <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
            {g.keys.map(key=>{
              const def = CONTENT_DEFAULTS[key];
              if (!def) return null;
              return (
                <div key={key}>
                  <label style={{ display:'block',fontSize:12,fontWeight:600,color:'#9aa3ad',marginBottom:8 }}>{def.label}</label>
                  {def.type==='boolean' ? (
                    <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                      <button onClick={()=>setValues(v=>({...v,[key]:val(key)==='false'?'true':'false'}))} style={{ padding:'8px 20px',borderRadius:8,background:val(key)!=='false'?'rgba(34,197,94,.2)':'rgba(255,255,255,.05)',color:val(key)!=='false'?'#22c55e':'#9aa3ad',border:`1px solid ${val(key)!=='false'?'rgba(34,197,94,.3)':'rgba(255,255,255,.1)'}`,cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:600 }}>{val(key)!=='false'?'✓ מופעל':'כבוי'}</button>
                      <button onClick={()=>save(key)} style={{ padding:'8px 16px',borderRadius:8,background:saved[key]?'#22c55e':'rgba(200,211,223,.15)',color:saved[key]?'#fff':'#c8d3df',border:'1px solid rgba(200,211,223,.2)',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:'inherit' }}>{saved[key]?'✓ נשמר':'שמור'}</button>
                    </div>
                  ) : def.type==='textarea' ? (
                    <div style={{ display:'flex',gap:12 }}>
                      <textarea value={val(key)} rows={3} onChange={e=>setValues(v=>({...v,[key]:e.target.value}))} style={inputStyle(key)}/>
                      <button onClick={()=>save(key)} style={{ alignSelf:'flex-start',padding:'10px 16px',borderRadius:8,background:saved[key]?'#22c55e':'rgba(200,211,223,.15)',color:saved[key]?'#fff':'#c8d3df',border:'1px solid rgba(200,211,223,.2)',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:'inherit',whiteSpace:'nowrap' }}>{saved[key]?'✓ נשמר':'שמור'}</button>
                    </div>
                  ) : (
                    <div style={{ display:'flex',gap:12 }}>
                      <input value={val(key)} onChange={e=>setValues(v=>({...v,[key]:e.target.value}))} style={inputStyle(key)}/>
                      <button onClick={()=>save(key)} style={{ padding:'10px 16px',borderRadius:8,background:saved[key]?'#22c55e':'rgba(200,211,223,.15)',color:saved[key]?'#fff':'#c8d3df',border:'1px solid rgba(200,211,223,.2)',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:'inherit',whiteSpace:'nowrap' }}>{saved[key]?'✓ נשמר':'שמור'}</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
