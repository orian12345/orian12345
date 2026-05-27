'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push('/admin/leads');
    } else {
      const d = await res.json();
      setError(d.error || 'שגיאה');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh',background:'#0f1117',display:'grid',placeItems:'center',fontFamily:'system-ui,sans-serif',direction:'rtl' }}>
      <div style={{ background:'#1a1f2e',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,padding:40,width:360,boxShadow:'0 24px 60px rgba(0,0,0,.4)' }}>
        <h1 style={{ color:'#f5f7fa',fontSize:24,fontWeight:800,margin:'0 0 8px',textAlign:'center' }}>מנחם אלומיניום</h1>
        <p style={{ color:'#9aa3ad',fontSize:13,textAlign:'center',margin:'0 0 32px' }}>כניסה לפאנל הניהול</p>
        <form onSubmit={submit} style={{ display:'flex',flexDirection:'column',gap:16 }}>
          <div>
            <label style={{ display:'block',fontSize:12,fontWeight:600,color:'#9aa3ad',marginBottom:8 }}>שם משתמש</label>
            <input value={username} onChange={e=>setUsername(e.target.value)} required autoFocus style={{ width:'100%',padding:'12px 14px',borderRadius:10,background:'#0f1117',color:'#f5f7fa',border:'1px solid rgba(255,255,255,.1)',fontSize:14,fontFamily:'inherit',boxSizing:'border-box' }}/>
          </div>
          <div>
            <label style={{ display:'block',fontSize:12,fontWeight:600,color:'#9aa3ad',marginBottom:8 }}>סיסמה</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{ width:'100%',padding:'12px 14px',borderRadius:10,background:'#0f1117',color:'#f5f7fa',border:'1px solid rgba(255,255,255,.1)',fontSize:14,fontFamily:'inherit',boxSizing:'border-box' }}/>
          </div>
          {error && <div style={{ padding:'10px 14px',borderRadius:8,background:'rgba(239,68,68,.15)',border:'1px solid rgba(239,68,68,.3)',color:'#fca5a5',fontSize:13 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ padding:'14px',borderRadius:10,background:'linear-gradient(135deg,#c8d3df,#7d8d9e)',color:'#0b0d10',fontSize:15,fontWeight:700,border:'none',cursor:'pointer',marginTop:8 }}>
            {loading ? 'נכנס...' : 'כניסה'}
          </button>
        </form>
      </div>
    </div>
  );
}
