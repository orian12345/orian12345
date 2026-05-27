'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin/leads',   label: 'לידים ופניות',  icon: '📋' },
  { href: '/admin/content', label: 'עריכת תכנים',  icon: '✏️' },
  { href: '/admin/gallery', label: 'גלריית תמונות', icon: '🖼️' },
];

export default function AdminLayoutClient({ children }) {
  const path = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div style={{ minHeight:'100vh',display:'flex',background:'#0f1117',fontFamily:'system-ui,sans-serif',direction:'rtl',color:'#f5f7fa' }}>
      {/* Sidebar */}
      <aside style={{ width:240,background:'#1a1f2e',borderLeft:'1px solid rgba(255,255,255,.06)',display:'flex',flexDirection:'column',padding:'24px 16px',flexShrink:0 }}>
        <div style={{ padding:'0 8px 24px',borderBottom:'1px solid rgba(255,255,255,.08)',marginBottom:24 }}>
          <div style={{ fontSize:18,fontWeight:800,color:'#f5f7fa' }}>מנחם אלומיניום</div>
          <div style={{ fontSize:12,color:'#9aa3ad',marginTop:4 }}>פאנל ניהול</div>
        </div>
        <nav style={{ flex:1,display:'flex',flexDirection:'column',gap:4 }}>
          {NAV.map(n=>(
            <Link key={n.href} href={n.href} style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:10,textDecoration:'none',fontSize:14,fontWeight:600,background:path.startsWith(n.href)?'rgba(200,211,223,.12)':'transparent',color:path.startsWith(n.href)?'#c8d3df':'#9aa3ad',transition:'all .2s' }}>
              <span style={{ fontSize:18 }}>{n.icon}</span>{n.label}
            </Link>
          ))}
        </nav>
        <div style={{ borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:16 }}>
          <a href="/" target="_blank" style={{ display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:10,textDecoration:'none',fontSize:13,color:'#9aa3ad',marginBottom:8 }}>🌐 צפה באתר</a>
          <button onClick={logout} style={{ width:'100%',padding:'10px 14px',borderRadius:10,background:'transparent',border:'1px solid rgba(255,255,255,.08)',color:'#9aa3ad',fontSize:13,cursor:'pointer',textAlign:'right',fontFamily:'inherit' }}>🚪 יציאה</button>
        </div>
      </aside>
      {/* Main */}
      <main style={{ flex:1,overflow:'auto',padding:32 }}>
        {children}
      </main>
    </div>
  );
}
