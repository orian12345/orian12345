'use client';
import { useEffect, useState } from 'react';

const STATUS_LABELS = { new:'חדש', contacted:'נוצר קשר', done:'בוצע', lost:'אבד' };
const STATUS_COLORS = { new:'#22c55e', contacted:'#3b82f6', done:'#9aa3ad', lost:'#ef4444' };

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editId, setEditId] = useState(null);
  const [editNotes, setEditNotes] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/leads');
    if (res.ok) setLeads(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/leads/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ status }) });
    setLeads(l => l.map(x => x.id===id ? {...x,status} : x));
  };

  const saveNotes = async (id) => {
    await fetch(`/api/leads/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ notes:editNotes }) });
    setLeads(l => l.map(x => x.id===id ? {...x,notes:editNotes} : x));
    setEditId(null);
  };

  const deleteLead = async (id) => {
    if (!confirm('למחוק פנייה זו?')) return;
    await fetch(`/api/leads/${id}`, { method:'DELETE' });
    setLeads(l => l.filter(x => x.id!==id));
  };

  const filtered = filter==='all' ? leads : leads.filter(l=>l.status===filter);

  const stats = Object.fromEntries(Object.keys(STATUS_LABELS).map(k=>[k, leads.filter(l=>l.status===k).length]));

  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontSize:28,fontWeight:800,margin:'0 0 8px' }}>לידים ופניות</h1>
        <p style={{ color:'#9aa3ad',fontSize:14,margin:0 }}>כל הפניות שהגיעו מהאתר</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:32 }}>
        {Object.entries(STATUS_LABELS).map(([k,v])=>(
          <div key={k} style={{ background:'#1a1f2e',border:'1px solid rgba(255,255,255,.06)',borderRadius:12,padding:'20px 24px' }}>
            <div style={{ fontSize:32,fontWeight:800,color:STATUS_COLORS[k] }}>{stats[k]||0}</div>
            <div style={{ fontSize:13,color:'#9aa3ad',marginTop:4 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display:'flex',gap:8,marginBottom:24 }}>
        {[['all','הכל'],['new','חדשים'],['contacted','נוצר קשר'],['done','בוצע'],['lost','אבד']].map(([k,v])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{ padding:'8px 16px',borderRadius:8,fontSize:13,fontWeight:600,background:filter===k?'rgba(200,211,223,.15)':'transparent',color:filter===k?'#c8d3df':'#9aa3ad',border:`1px solid ${filter===k?'rgba(200,211,223,.3)':'rgba(255,255,255,.08)'}`,cursor:'pointer',fontFamily:'inherit' }}>{v}</button>
        ))}
      </div>

      {/* Table */}
      {loading ? <div style={{ color:'#9aa3ad' }}>טוען...</div> : (
        <div style={{ background:'#1a1f2e',border:'1px solid rgba(255,255,255,.06)',borderRadius:12,overflow:'hidden' }}>
          <table style={{ width:'100%',borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'rgba(255,255,255,.03)' }}>
                {['תאריך','שם','טלפון','שירות','הודעה','סטטוס','הערות',''].map(h=>(
                  <th key={h} style={{ padding:'14px 16px',textAlign:'right',fontSize:12,fontWeight:600,color:'#9aa3ad',borderBottom:'1px solid rgba(255,255,255,.06)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 && (
                <tr><td colSpan={8} style={{ padding:40,textAlign:'center',color:'#9aa3ad',fontSize:14 }}>אין פניות{filter!=='all'?' בסטטוס זה':''}</td></tr>
              )}
              {filtered.map(lead=>(
                <tr key={lead.id} style={{ borderBottom:'1px solid rgba(255,255,255,.04)' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.02)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'14px 16px',fontSize:13,color:'#9aa3ad',whiteSpace:'nowrap' }}>{new Date(lead.createdAt).toLocaleDateString('he-IL')}</td>
                  <td style={{ padding:'14px 16px',fontSize:14,fontWeight:600,color:'#f5f7fa' }}>{lead.name||'-'}</td>
                  <td style={{ padding:'14px 16px',fontSize:14 }}>
                    <a href={`tel:${lead.phone}`} style={{ color:'#c8d3df',textDecoration:'none',fontWeight:600 }}>{lead.phone}</a>
                  </td>
                  <td style={{ padding:'14px 16px',fontSize:13,color:'#9aa3ad' }}>{lead.service||'-'}</td>
                  <td style={{ padding:'14px 16px',fontSize:13,color:'#9aa3ad',maxWidth:200 }}>
                    <div style={{ overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:180 }} title={lead.message||''}>{lead.message||'-'}</div>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <select value={lead.status||'new'} onChange={e=>updateStatus(lead.id,e.target.value)} style={{ padding:'6px 10px',borderRadius:8,background:'rgba(255,255,255,.05)',color:STATUS_COLORS[lead.status||'new'],border:`1px solid ${STATUS_COLORS[lead.status||'new']}44`,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit' }}>
                      {Object.entries(STATUS_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                    </select>
                  </td>
                  <td style={{ padding:'14px 16px',fontSize:13 }}>
                    {editId===lead.id ? (
                      <div style={{ display:'flex',gap:6 }}>
                        <input value={editNotes} onChange={e=>setEditNotes(e.target.value)} autoFocus style={{ flex:1,padding:'6px 10px',borderRadius:6,background:'rgba(255,255,255,.05)',color:'#f5f7fa',border:'1px solid rgba(255,255,255,.15)',fontSize:12,fontFamily:'inherit' }}/>
                        <button onClick={()=>saveNotes(lead.id)} style={{ padding:'6px 10px',borderRadius:6,background:'#22c55e',color:'#fff',border:'none',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:'inherit' }}>שמור</button>
                        <button onClick={()=>setEditId(null)} style={{ padding:'6px 10px',borderRadius:6,background:'rgba(255,255,255,.05)',color:'#9aa3ad',border:'1px solid rgba(255,255,255,.1)',cursor:'pointer',fontSize:11,fontFamily:'inherit' }}>ביטול</button>
                      </div>
                    ) : (
                      <span onClick={()=>{setEditId(lead.id);setEditNotes(lead.notes||'');}} style={{ color:lead.notes?'#f5f7fa':'#9aa3ad',cursor:'pointer',fontSize:13 }} title="לחץ לעריכה">{lead.notes||'+ הוסף הערה'}</span>
                    )}
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <button onClick={()=>deleteLead(lead.id)} style={{ padding:'6px 10px',borderRadius:6,background:'rgba(239,68,68,.1)',color:'#fca5a5',border:'1px solid rgba(239,68,68,.2)',cursor:'pointer',fontSize:11,fontFamily:'inherit' }}>מחק</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
