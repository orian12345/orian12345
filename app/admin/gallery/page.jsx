'use client';
import { useEffect, useState } from 'react';

const CATEGORIES = ['כללי','תריסים','רשתות','פרגולות','חלונות','מקלחונים','סורגים'];

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title:'', url:'', category:'כללי' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/gallery');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addItem = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/gallery', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    if (res.ok) { const item=await res.json(); setItems(i=>[...i,item]); setForm({title:'',url:'',category:'כללי'}); setAdding(false); }
    setSaving(false);
  };

  const toggleVisible = async (id, visible) => {
    await fetch(`/api/gallery/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ visible:!visible }) });
    setItems(i=>i.map(x=>x.id===id?{...x,visible:!visible}:x));
  };

  const deleteItem = async (id) => {
    if (!confirm('למחוק תמונה זו?')) return;
    await fetch(`/api/gallery/${id}`, { method:'DELETE' });
    setItems(i=>i.filter(x=>x.id!==id));
  };

  const inputStyle = { width:'100%',padding:'10px 14px',borderRadius:8,background:'#0f1117',color:'#f5f7fa',border:'1px solid rgba(255,255,255,.1)',fontSize:14,fontFamily:'inherit',boxSizing:'border-box' };

  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:32 }}>
        <div>
          <h1 style={{ fontSize:28,fontWeight:800,margin:'0 0 8px' }}>גלריית תמונות</h1>
          <p style={{ color:'#9aa3ad',fontSize:14,margin:0 }}>נהל את תמונות הגלריה באתר. הוסף URL של תמונה.</p>
        </div>
        <button onClick={()=>setAdding(true)} style={{ padding:'12px 24px',borderRadius:10,background:'linear-gradient(135deg,#c8d3df,#7d8d9e)',color:'#0b0d10',fontSize:14,fontWeight:700,border:'none',cursor:'pointer',fontFamily:'inherit' }}>+ הוסף תמונה</button>
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ background:'#1a1f2e',border:'1px solid rgba(200,211,223,.2)',borderRadius:12,padding:28,marginBottom:24 }}>
          <h3 style={{ fontSize:16,fontWeight:700,color:'#c8d3df',margin:'0 0 20px' }}>הוספת תמונה חדשה</h3>
          <form onSubmit={addItem} style={{ display:'flex',flexDirection:'column',gap:16 }}>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
              <div>
                <label style={{ display:'block',fontSize:12,fontWeight:600,color:'#9aa3ad',marginBottom:8 }}>כותרת *</label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required placeholder="למשל: תריס חשמלי - תל אביב" style={inputStyle}/>
              </div>
              <div>
                <label style={{ display:'block',fontSize:12,fontWeight:600,color:'#9aa3ad',marginBottom:8 }}>קטגוריה</label>
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={inputStyle}>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display:'block',fontSize:12,fontWeight:600,color:'#9aa3ad',marginBottom:8 }}>כתובת תמונה (URL) *</label>
              <input value={form.url} onChange={e=>setForm(f=>({...f,url:e.target.value}))} required placeholder="https://..." style={inputStyle}/>
            </div>
            {form.url && (
              <div>
                <div style={{ fontSize:12,color:'#9aa3ad',marginBottom:8 }}>תצוגה מקדימה:</div>
                <img src={form.url} alt="preview" style={{ height:160,borderRadius:8,objectFit:'cover',border:'1px solid rgba(255,255,255,.1)' }} onError={e=>e.currentTarget.style.display='none'}/>
              </div>
            )}
            <div style={{ display:'flex',gap:12 }}>
              <button type="submit" disabled={saving} style={{ padding:'12px 24px',borderRadius:8,background:'linear-gradient(135deg,#c8d3df,#7d8d9e)',color:'#0b0d10',fontSize:14,fontWeight:700,border:'none',cursor:'pointer',fontFamily:'inherit' }}>{saving?'שומר...':'הוסף לגלריה'}</button>
              <button type="button" onClick={()=>{setAdding(false);setForm({title:'',url:'',category:'כללי'});}} style={{ padding:'12px 24px',borderRadius:8,background:'transparent',color:'#9aa3ad',border:'1px solid rgba(255,255,255,.1)',cursor:'pointer',fontSize:14,fontFamily:'inherit' }}>ביטול</button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery grid */}
      {loading ? <div style={{ color:'#9aa3ad' }}>טוען...</div> : items.length===0 ? (
        <div style={{ background:'#1a1f2e',border:'1px dashed rgba(255,255,255,.08)',borderRadius:12,padding:60,textAlign:'center' }}>
          <div style={{ fontSize:40,marginBottom:12 }}>🖼️</div>
          <div style={{ fontSize:16,fontWeight:600,color:'#f5f7fa',marginBottom:8 }}>אין תמונות בגלריה</div>
          <div style={{ fontSize:14,color:'#9aa3ad' }}>לחץ על "הוסף תמונה" כדי להתחיל</div>
        </div>
      ) : (
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20 }}>
          {items.map(item=>(
            <div key={item.id} style={{ background:'#1a1f2e',border:`1px solid ${item.visible?'rgba(255,255,255,.06)':'rgba(239,68,68,.2)'}`,borderRadius:12,overflow:'hidden' }}>
              <div style={{ position:'relative',height:180,background:'#0f1117' }}>
                <img src={item.url} alt={item.title} style={{ width:'100%',height:'100%',objectFit:'cover',opacity:item.visible?1:0.4 }} onError={e=>{e.currentTarget.parentElement.style.background='#1a1f2e';e.currentTarget.style.display='none';}}/>
                {!item.visible && <div style={{ position:'absolute',inset:0,display:'grid',placeItems:'center',fontSize:13,color:'#fca5a5',fontWeight:600 }}>מוסתר</div>}
                <div style={{ position:'absolute',top:8,right:8 }}>
                  <span style={{ padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:700,background:'rgba(0,0,0,.7)',color:'#c8d3df' }}>{item.category}</span>
                </div>
              </div>
              <div style={{ padding:'14px 16px' }}>
                <div style={{ fontSize:14,fontWeight:600,color:'#f5f7fa',marginBottom:12 }}>{item.title}</div>
                <div style={{ display:'flex',gap:8 }}>
                  <button onClick={()=>toggleVisible(item.id,item.visible)} style={{ flex:1,padding:'8px',borderRadius:8,background:item.visible?'rgba(34,197,94,.1)':'rgba(239,68,68,.1)',color:item.visible?'#22c55e':'#fca5a5',border:`1px solid ${item.visible?'rgba(34,197,94,.2)':'rgba(239,68,68,.2)'}`,cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:'inherit' }}>{item.visible?'✓ מוצג':'הסתר'}</button>
                  <button onClick={()=>deleteItem(item.id)} style={{ padding:'8px 14px',borderRadius:8,background:'rgba(239,68,68,.1)',color:'#fca5a5',border:'1px solid rgba(239,68,68,.2)',cursor:'pointer',fontSize:12,fontFamily:'inherit' }}>מחק</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
