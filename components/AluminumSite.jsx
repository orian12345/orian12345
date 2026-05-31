'use client';
import { useState, useEffect, useRef, useMemo } from 'react';

// ============ WA HELPERS ============
function openWhatsApp(phone, text) {
  const url = `https://wa.me/${phone}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  let opened = false;
  try { const w = window.open(url, "_blank", "noopener"); if (w) opened = true; } catch (e) {}
  if (!opened) {
    try { navigator.clipboard?.writeText(url); } catch (e) {}
    showToast(`הקישור הועתק. הדבק בדפדפן או פתח את WhatsApp ידנית.`, url);
  }
  return opened;
}
function showToast(msg, url) {
  const existing = document.getElementById("__wa_toast");
  if (existing) existing.remove();
  const el = document.createElement("div");
  el.id = "__wa_toast";
  el.innerHTML = `<div style="font-weight:700;margin-bottom:6px;font-size:14px;">${msg}</div>${url ? `<div style="font-size:11px;opacity:.85;direction:ltr;word-break:break-all;background:rgba(0,0,0,.25);padding:6px 8px;border-radius:6px;margin-top:4px;">${url}</div>` : ""}`;
  Object.assign(el.style, { position:"fixed",bottom:"100px",left:"24px",zIndex:9999,maxWidth:"320px",padding:"14px 16px",borderRadius:"12px",background:"linear-gradient(135deg, #25d366, #128c7e)",color:"#fff",boxShadow:"0 12px 40px rgba(0,0,0,.4)",fontFamily:"'Heebo', sans-serif",direction:"rtl",cursor:"pointer",animation:"fadeUp .3s ease" });
  el.onclick = () => el.remove();
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 6000);
}
function waClick(e, phone, text) { e.preventDefault(); openWhatsApp(phone, text); }

// ============ PALETTE ============
const P = {
  bg:"#0b0d10",bg2:"#13171c",surface:"#181d24",surface2:"#1f262f",
  border:"rgba(255,255,255,0.08)",text:"#f5f7fa",muted:"#9aa3ad",
  accent:"#c8d3df",accent2:"#7d8d9e",glow:"rgba(200,211,223,0.35)"
};

// ============ STATIC CONTENT ============
const SERVICES = [
  { id:"trissim-galila", title:"תריסי גלילה", desc:"תריסי גלילה ידניים וחשמליים, איכותיים ועמידים, עם בידוד חום ואקוסטי.", icon:"shutter", tags:["חשמלי","ידני","אלומיניום"] },
  { id:"trissim-hashmal", title:"תריסים חשמליים", desc:"התקנה והחלפת מנועים, שלטים חכמים ושילוב עם בית חכם.", icon:"remote", tags:["סומפי","שליטה מהטלפון"] },
  { id:"reshatot-yatushim", title:"רשתות נגד יתושים", desc:"רשתות נגללות, נפתחות וקבועות לחלונות ודלתות - מותאמות אישית.", icon:"net", tags:["נגללת","פליסה","מגנט"] },
  { id:"reshatot-betihut", title:"רשתות בטיחות", desc:"רשתות מחוזקות לילדים וחתולים, עומדות בתקן ומונעות נפילה.", icon:"shield", tags:["ילדים","חיות מחמד","תקן"] },
  { id:"halonot", title:"חלונות אלומיניום", desc:"חלונות בלגיים, הזזה, קיפ, ויטרינות - בכל גודל וצבע.", icon:"window", tags:["בלגי","הזזה","קליל"] },
  { id:"soragim", title:"סורגים ומעקות", desc:"סורגי בטיחות דקורטיביים, מעקות למרפסות וגרמי מדרגות.", icon:"bars", tags:["בטיחות","עיצוב"] },
  { id:"miklahonim", title:"מקלחונים", desc:"מקלחוני זכוכית בהתאמה אישית, פתיחה / הזזה / קבועים.", icon:"shower", tags:["זכוכית","מותאם אישית"] },
  { id:"pergolot", title:"פרגולות אלומיניום", desc:"פרגולות ביו-קלימטיות, גגונים וסככות לחצר ולמרפסת.", icon:"pergola", tags:["ביו-קלימטי","מתכוונן"] }
];
const FEATURES_LIST = [
  { t:"מעל 20 שנות ניסיון", s:"אלפי לקוחות מרוצים בכל הארץ", i:"award" },
  { t:"אחריות מלאה", s:"אחריות יצרן + שירות שנים אחרי ההתקנה", i:"check" },
  { t:"הגעה לכל הארץ", s:"מהצפון ועד הדרום, ללא עלות הגעה", i:"pin" },
  { t:"הצעת מחיר מיידית", s:"תוך 24 שעות, ללא התחייבות", i:"bolt" },
  { t:"ייצור ישראלי", s:"פרופילי אלומיניום מובילים בתקן", i:"factory" },
  { t:"עבודה נקייה", s:"מסיימים, מנקים, ועוזבים בית מסודר", i:"spark" }
];
const TESTIMONIALS = [
  { n:"רונית כהן", l:"ראשון לציון", t:"החליפו לי את כל התריסים בבית. עבודה מדהימה, נקייה ומהירה. ממליצה בחום!", r:5 },
  { n:"אבי לוי", l:"חיפה", t:"הזמנתי רשתות לכל הבית בגלל החתול. הגיעו בזמן, התקינו תוך שעתיים. שירות מעולה.", r:5 },
  { n:"משפחת אזולאי", l:"באר שבע", t:"פרגולה ביו-קלימטית מושלמת. מנחם איש מקצוע אמיתי, נתן ייעוץ והכל יצא בדיוק כמו שדמיינו.", r:5 },
  { n:"שרה ב.", l:"תל אביב", t:"התקנת חלונות בלגיים בדירה ישנה - שדרוג של פעם. מחיר הוגן והקפדה על כל פרט.", r:5 }
];
const AREAS = ["מרכז","תל אביב","רמת גן","גבעתיים","פתח תקווה","ראשון לציון","חולון","בת ים","רחובות","נס ציונה","רעננה","כפר סבא","הרצליה","נתניה","אשדוד","אשקלון","באר שבע","ירושלים","חיפה","קריות","חדרה","מודיעין","בית שמש","אילת"];
const FAQ = [
  { q:"כמה זמן לוקחת התקנה?", a:"התקנה ממוצעת של תריס או רשת אורכת 1-3 שעות. פרויקטים גדולים יותר - בין יום לשלושה ימי עבודה." },
  { q:"האם אתם מגיעים גם לפריפריה?", a:"כן, אנחנו מגיעים לכל הארץ ללא עלות הגעה - מקריית שמונה ועד אילת." },
  { q:"מה האחריות על המוצרים?", a:"אחריות יצרן של 5 שנים על הפרופיל, 3 שנים על המנוע החשמלי, ושנה מלאה על העבודה." },
  { q:"אפשר לקבל הצעת מחיר ללא התחייבות?", a:"בהחלט. שולחים תמונה או מודדים במקום - ההצעה אצלך תוך 24 שעות." },
  { q:"האם אתם מטפלים גם בתיקונים?", a:"כן. תיקון תריסים תקועים, החלפת רצועות, מנועים ושלטים - שירות תוך 48 שעות." },
  { q:"איך משלמים?", a:"מזומן, אשראי, ביט והעברה בנקאית. אפשרות לפריסה עד 12 תשלומים ללא ריבית." }
];
const REGIONS = [
  { id:"north", name:"צפון", cities:"חיפה, קריות, נהריה, עכו, כרמיאל", x:165, y:130, r:50 },
  { id:"center", name:"מרכז וגוש דן", cities:"תל אביב, רמת גן, פתח תקווה, ראשון לציון, הרצליה", x:130, y:280, r:55 },
  { id:"sharon", name:"שרון", cities:"נתניה, רעננה, כפר סבא, חדרה", x:145, y:220, r:40 },
  { id:"jerusalem", name:"ירושלים והסביבה", cities:"ירושלים, בית שמש, מודיעין, מעלה אדומים", x:200, y:310, r:42 },
  { id:"south", name:"דרום", cities:"באר שבע, אשדוד, אשקלון, נתיבות", x:145, y:410, r:55 },
  { id:"eilat", name:"ערבה ואילת", cities:"אילת, ערבה, מצפה רמון", x:180, y:540, r:35 }
];
const BLOG = [
  { id:"shutter-types", cat:"מדריך", title:"איך לבחור תריס לבית? המדריך המלא", excerpt:"תריס חשמלי או ידני? אלומיניום או PVC? במאמר נסקור את כל סוגי התריסים ונעזור לכם לבחור את הנכון לבית שלכם.", read:"5 דק׳", color:"#7c9eff", body:"תריסים הם השכבה השנייה של הבית - הם שומרים על הטמפרטורה, הפרטיות והאבטחה. בחירת תריס נכון יכולה לחסוך לכם עד 30% בחשבון החשמל ולהאריך את חיי הבית. המלצתנו: לחדרי שינה תריס מבודד תרמית עם מילוי PU, לסלון תריס חשמלי עם שלט ולחדרים שמש פנורמי שמכניס אור." },
  { id:"screen-care", cat:"תחזוקה", title:"תחזוקת רשתות נגד יתושים", excerpt:"ניקוי שגרתי, החלפת פיברגלס, ותיקוני קצוות - איך מאריכים את חיי הרשת.", read:"3 דק׳", color:"#22c55e", body:"רשתות מצברות אבק ואלרגנים שצריך לנקות פעמיים בשנה. השתמשו במברשת רכה ומים פושרים, ללא חומרים חזקים. אם הרשת קרועה - אפשר להחליף רק את הפיברגלס ולא את כל המסגרת." },
  { id:"smart-home", cat:"טכנולוגיה", title:"תריסים חכמים - מהפכת הבית החכם", excerpt:"שליטה מהאפליקציה, סצנות אוטומטיות וחיסכון בחשמל - האם זה שווה את ההשקעה?", read:"4 דק׳", color:"#e08b4a", body:"תריסים חכמים מתחברים לאפליקציה (Tahoma של Somfy) ומאפשרים שליטה מכל מקום. אפשר לתזמן פתיחה אוטומטית בבוקר, סגירה בשעות שיא של שמש. ההשקעה הנוספת מעל מנוע רגיל היא כ-30% והיא משתלמת תוך שנתיים." },
  { id:"pergola-guide", cat:"פרגולות", title:"פרגולה ביו-קלימטית מול סוכך", excerpt:"השוואה בין סוכך נשלף, פרגולת אלומיניום קבועה ופרגולה ביו-קלימטית.", read:"6 דק׳", color:"#c8d3df", body:"פרגולה ביו-קלימטית היא הגרסה המודרנית - פנלים מתכווננים שמאפשרים שליטה על כמות הצל. היא יקרה יותר אבל מחזיקה 20+ שנה ומוסיפה ערך לנכס. סוכך נשלף זול יותר אבל דורש החלפת בד כל 5-7 שנים." }
];
const SHUTTER_TYPES = [
  { id:"manual-roll", name:"תריס גלילה ידני", desc:"תריס קלאסי עם רצועה. אמין, חסכוני וקל לתחזוקה.", features:["רצועה / קפיץ","מילוי קלקר","בידוד בסיסי","מחיר חסכוני"], price:'מ-450 ₪ למ"ר', pop:false, color:"#9aa3ad" },
  { id:"electric-roll", name:"תריס גלילה חשמלי", desc:"פתיחה וסגירה בלחיצה. מנוע סומפי איכותי עם שלט.", features:["מנוע סומפי","שלט אלחוטי","מתג קיר","אחריות 3 שנים על המנוע"], price:'מ-850 ₪ למ"ר', pop:true, color:"#c8d3df" },
  { id:"smart-shutter", name:"תריס חכם (Smart)", desc:"שליטה מהטלפון, אינטגרציה עם בית חכם, תזמונים אוטומטיים.", features:["שליטה מהאפליקציה","אלקסה / גוגל הום","סצנות וטיימרים","חיישן שמש ורוח"], price:'מ-1,400 ₪ למ"ר', pop:true, color:"#7c9eff" },
  { id:"thermal", name:"תריס מבודד תרמי", desc:"מילוי PU מוקצף, חוסך עד 30% בחשמל.", features:["מילוי פוליאוריתן","בידוד תרמי גבוה","בידוד אקוסטי","חיסכון בחשמל"], price:'מ-1,100 ₪ למ"ר', pop:false, color:"#e08b4a" },
  { id:"panoramic", name:"תריס פנורמי", desc:"פתחי אוורור גדולים שמאפשרים אור ואוויר כשהתריס סגור.", features:["פתחי אוורור","תאורה טבעית","חצי שקוף","אבטחה גבוהה"], price:'מ-1,250 ₪ למ"ר', pop:false, color:"#9aa3ad" },
  { id:"louvers", name:"תריסי רפפה (לוברים)", desc:"רפפות מתכווננות לשליטה מדויקת על אור ופרטיות.", features:["רפפות אלומיניום","זווית מתכווננת","חיצוני / פנימי","מראה מודרני"], price:'מ-1,600 ₪ למ"ר', pop:false, color:"#c8d3df" }
];
const NET_TYPES = [
  { id:"roller-net", name:"רשת נגללת", desc:"נגללת אנכית בתוך תיבה צרה. אלגנטית ומסתתרת כשלא בשימוש.", features:["תיבה נסתרת","סגירה רכה","פיברגלס שחור","מתאימה לחלונות"], price:'מ-280 ₪ למ"ר', pop:true, color:"#c8d3df" },
  { id:"pleated", name:"רשת פליסה", desc:"אקורדיון אופקי - אידיאלי לדלתות ופתחים רחבים.", features:["פתיחה צידית","עד 6 מטר רוחב","ללא ספים גבוהים","נעילה מגנטית"], price:'מ-550 ₪ למ"ר', pop:true, color:"#7c9eff" },
  { id:"magnetic", name:"רשת מגנטית", desc:"פתיחה אוטומטית במגע, סגירה מגנטית מהירה.", features:["סגירה אוטומטית","התקנה DIY","מתאים למרפסת","ללא חורים בקיר"], price:"מ-180 ₪ ליחידה", pop:false, color:"#9aa3ad" },
  { id:"fixed", name:"רשת קבועה", desc:"מסגרת אלומיניום מותקנת בקבע. הפתרון הזול והאמין ביותר.", features:["מסגרת אלומיניום","התקנה קבועה","ניתנת להסרה לניקוי","עמידות מירבית"], price:'מ-220 ₪ למ"ר', pop:false, color:"#e08b4a" },
  { id:"safety", name:"רשת בטיחות לילדים", desc:"רשת מחוזקת בתקן ישראלי - מונעת נפילת ילדים מחלונות גבוהים.", features:["עומדת בתקן 1142","חוטי פלדה מצופים","התקנה מקצועית","שקופה כמעט לחלוטין"], price:'מ-380 ₪ למ"ר', pop:true, color:"#22c55e" },
  { id:"pet", name:"רשת לחיות מחמד", desc:"רשת מחוזקת בעמידות גבוהה לציפורניים.", features:["פיברגלס מחוזק","עמידה בקריעות","אלרגנים מסוננים","צבע שחור דיסקרטי"], price:'מ-340 ₪ למ"ר', pop:false, color:"#c8d3df" }
];

// ============ ICON ============
function Icon({ name, size=24, stroke="currentColor" }) {
  const p = { width:size, height:size, viewBox:"0 0 24 24", fill:"none", stroke, strokeWidth:1.6, strokeLinecap:"round", strokeLinejoin:"round" };
  switch(name) {
    case "shutter": return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 7h18M3 11h18M3 15h18M3 19h18"/></svg>;
    case "remote": return <svg {...p}><rect x="8" y="2" width="8" height="20" rx="2"/><circle cx="12" cy="7" r="1"/><path d="M10 11h4M10 14h4M10 17h4"/></svg>;
    case "net": return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>;
    case "shield": return <svg {...p}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>;
    case "window": return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M12 3v18M3 12h18"/></svg>;
    case "bars": return <svg {...p}><path d="M4 3v18M9 3v18M14 3v18M19 3v18M3 7h18M3 17h18"/></svg>;
    case "shower": return <svg {...p}><path d="M6 4h12v16H6z"/><path d="M9 9v8M14 9v8"/></svg>;
    case "pergola": return <svg {...p}><path d="M2 7l10-4 10 4M4 7v13M20 7v13M2 20h20M8 7v13M16 7v13M12 7v13"/></svg>;
    case "award": return <svg {...p}><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/></svg>;
    case "check": return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>;
    case "pin": return <svg {...p}><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    case "bolt": return <svg {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>;
    case "factory": return <svg {...p}><path d="M3 21V10l5 3V10l5 3V10l8 5v6H3z"/><path d="M7 16h2M12 16h2M17 16h2"/></svg>;
    case "spark": return <svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>;
    case "wa": return <svg width={size} height={size} viewBox="0 0 24 24" fill={stroke}><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.3.2-.6.1c-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.5-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1.1 1.1-1.1 2.6 1.1 3 1.3 3.2c.2.2 2.2 3.4 5.4 4.7.7.3 1.3.5 1.8.6.7.2 1.4.2 2 .1.6-.1 1.8-.7 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>;
    case "arrow": return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "phone": return <svg {...p}><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.5 2.7.7a2 2 0 011.7 2z"/></svg>;
    case "mail": return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>;
    case "menu": return <svg {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case "close": return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case "plus": return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case "minus": return <svg {...p}><path d="M5 12h14"/></svg>;
    case "star": return <svg width={size} height={size} viewBox="0 0 24 24" fill={stroke}><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>;
    default: return null;
  }
}

// ============ SECTION HEAD ============
function SectionHead({ eyebrow, title, sub, align="right" }) {
  return (
    <div style={{ textAlign:align, maxWidth:720, margin:align==="center"?"0 auto":0 }}>
      <div style={{ display:"inline-flex",alignItems:"center",gap:8,fontSize:13,color:P.accent,fontWeight:600,marginBottom:16,textTransform:"uppercase",letterSpacing:1 }}>
        <span style={{ width:24,height:1,background:P.accent }}/>{eyebrow}
      </div>
      <h2 style={{ fontSize:"clamp(32px, 4vw, 52px)",fontWeight:800,lineHeight:1.1,letterSpacing:-1,margin:"0 0 16px",color:P.text }}>{title}</h2>
      {sub && <p style={{ fontSize:18,color:P.muted,lineHeight:1.6,margin:0 }}>{sub}</p>}
    </div>
  );
}

// ============ PROMO BANNER ============
function PromoBanner({ t }) {
  const [show, setShow] = useState(true);
  useEffect(() => { if (localStorage.getItem("__promo_dismissed_v2")) setShow(false); }, []);
  useEffect(() => { document.documentElement.style.setProperty("--promo-h", show?"44px":"0px"); }, [show]);
  if (!t.promoBannerActive || t.promoBannerActive==="false" || !show) return null;
  const dismiss = (e) => { e.stopPropagation(); localStorage.setItem("__promo_dismissed_v2","1"); setShow(false); };
  return (
    <div onClick={(e)=>waClick(e,t.whatsapp,"ראיתי את המבצע באתר")} style={{ position:"fixed",top:0,left:0,right:0,zIndex:60,background:"linear-gradient(90deg,#25d366,#128c7e)",color:"#fff",padding:"10px 48px",display:"flex",alignItems:"center",justifyContent:"center",gap:12,fontSize:13.5,fontWeight:600,cursor:"pointer",boxShadow:"0 4px 16px rgba(37,211,102,.3)",flexWrap:"wrap",textAlign:"center" }}>
      <span style={{ fontSize:16 }}>🎉</span>
      <span>{t.promoBannerText || 'מבצע מיוחד - צרו קשר לפרטים'}</span>
      <span style={{ fontWeight:800,textDecoration:"underline" }}>קבל הצעה ←</span>
      <button onClick={dismiss} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,.2)",border:"none",color:"#fff",width:26,height:26,borderRadius:"50%",cursor:"pointer",display:"grid",placeItems:"center",fontSize:14 }}>×</button>
    </div>
  );
}

// ============ NAV ============
function Nav({ t, setOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn=()=>setScrolled(window.scrollY>30); window.addEventListener("scroll",fn); return()=>window.removeEventListener("scroll",fn); },[]);
  const links = [{ t:"שירותים",h:"#services" },{ t:"מוצרים",h:"#types" },{ t:"גלריה",h:"#gallery" },{ t:"מחיר",h:"#estimate" },{ t:"טיפים",h:"#blog" },{ t:"צור קשר",h:"#contact" }];
  return (
    <nav style={{ position:"fixed",top:"var(--promo-h, 0px)",left:0,right:0,zIndex:50,transition:"all .35s ease, top .25s ease",background:scrolled?`${P.bg}cc`:"transparent",backdropFilter:scrolled?"blur(20px) saturate(150%)":"none",WebkitBackdropFilter:scrolled?"blur(20px) saturate(150%)":"none",borderBottom:scrolled?`1px solid ${P.border}`:"1px solid transparent",padding:scrolled?"12px 0":"20px 0" }}>
      <div style={{ maxWidth:1280,margin:"0 auto",padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:24 }}>
        <a href="#top" style={{ display:"flex",alignItems:"center",gap:12,textDecoration:"none",color:P.text }}>
          <div style={{ width:38,height:38,borderRadius:10,background:`linear-gradient(135deg, ${P.accent}, ${P.accent2})`,display:"grid",placeItems:"center",color:P.bg,fontWeight:800,fontSize:20,letterSpacing:-0.5 }}>מ</div>
          <div style={{ display:"flex",flexDirection:"column",lineHeight:1.1 }}>
            <span style={{ fontWeight:800,fontSize:17,letterSpacing:-0.3 }}>{t.businessName}</span>
            <span style={{ fontSize:11,color:P.muted,fontWeight:500 }}>תריסים · רשתות · אלומיניום</span>
          </div>
        </a>
        <div className="nav-links" style={{ display:"flex",alignItems:"center",gap:6 }}>
          {links.map(l=>(
            <a key={l.h} href={l.h} style={{ color:P.muted,textDecoration:"none",fontSize:14,fontWeight:500,padding:"8px 14px",borderRadius:8,transition:"all .2s" }}
               onMouseEnter={e=>{e.currentTarget.style.color=P.text;e.currentTarget.style.background=P.surface;}}
               onMouseLeave={e=>{e.currentTarget.style.color=P.muted;e.currentTarget.style.background="transparent";}}>{l.t}</a>
          ))}
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <a href={`tel:${t.phone}`} className="cta-phone" style={{ color:P.text,textDecoration:"none",fontSize:14,fontWeight:600,padding:"10px 16px",borderRadius:10,border:`1px solid ${P.border}`,display:"flex",alignItems:"center",gap:8 }}>
            <Icon name="phone" size={16}/> {t.phone}
          </a>
          <a href={`https://wa.me/${t.whatsapp}`} target="_blank" rel="noopener" onClick={(e)=>waClick(e,t.whatsapp)} style={{ color:"#fff",textDecoration:"none",fontSize:14,fontWeight:700,padding:"10px 18px",borderRadius:10,background:"linear-gradient(135deg,#25d366,#128c7e)",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 16px rgba(37,211,102,.35)" }}>
            <Icon name="wa" size={16} stroke="#fff"/> הזמן עכשיו
          </a>
          <button className="nav-menu-btn" onClick={()=>setOpen(true)} style={{ display:"none",background:"transparent",border:`1px solid ${P.border}`,color:P.text,padding:10,borderRadius:10,cursor:"pointer" }}>
            <Icon name="menu" size={20}/>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ============ MOBILE MENU ============
function MobileMenu({ t, open, setOpen }) {
  if (!open) return null;
  const links = [{ t:"שירותים",h:"#services" },{ t:"מוצרים",h:"#types" },{ t:"גלריה",h:"#gallery" },{ t:"מחיר",h:"#estimate" },{ t:"טיפים",h:"#blog" },{ t:"צור קשר",h:"#contact" }];
  return (
    <div style={{ position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,.7)",backdropFilter:"blur(4px)" }} onClick={()=>setOpen(false)}>
      <div onClick={e=>e.stopPropagation()} style={{ position:"absolute",top:0,right:0,bottom:0,width:280,background:P.surface,borderLeft:`1px solid ${P.border}`,display:"flex",flexDirection:"column",padding:24,gap:8,animation:"fadeUp .25s ease" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
          <span style={{ fontWeight:800,fontSize:18,color:P.text }}>{t.businessName}</span>
          <button onClick={()=>setOpen(false)} style={{ background:"transparent",border:`1px solid ${P.border}`,color:P.text,width:36,height:36,borderRadius:8,cursor:"pointer",display:"grid",placeItems:"center" }}><Icon name="close" size={18}/></button>
        </div>
        {links.map(l=>(
          <a key={l.h} href={l.h} onClick={()=>setOpen(false)} style={{ color:P.text,textDecoration:"none",fontSize:18,fontWeight:600,padding:"14px 16px",borderRadius:10,background:P.bg,border:`1px solid ${P.border}` }}>{l.t}</a>
        ))}
        <div style={{ marginTop:"auto",display:"flex",flexDirection:"column",gap:10 }}>
          <a href={`tel:${t.phone}`} style={{ color:P.text,textDecoration:"none",fontSize:16,fontWeight:600,padding:"14px 16px",borderRadius:10,border:`1px solid ${P.border}`,display:"flex",alignItems:"center",gap:8,justifyContent:"center" }}><Icon name="phone" size={18}/>{t.phone}</a>
          <a href={`https://wa.me/${t.whatsapp}`} target="_blank" rel="noopener" onClick={(e)=>{waClick(e,t.whatsapp);setOpen(false);}} style={{ color:"#fff",textDecoration:"none",fontSize:16,fontWeight:700,padding:"14px 16px",borderRadius:10,background:"linear-gradient(135deg,#25d366,#128c7e)",display:"flex",alignItems:"center",gap:8,justifyContent:"center" }}><Icon name="wa" size={18} stroke="#fff"/>הצעת מחיר בוואטסאפ</a>
        </div>
      </div>
    </div>
  );
}

// ============ PRODUCT PREVIEW SVGs ============
function ProductPreview({ kind, height=180 }) {
  if (kind==="shutter") return (
    <div style={{ height,background:`linear-gradient(135deg,${P.bg2},${P.surface2})`,position:"relative",overflow:"hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 240 180" preserveAspectRatio="xMidYMid slice">
        <defs><linearGradient id="alu1" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={P.accent} stopOpacity="0.9"/><stop offset="0.5" stopColor={P.accent2} stopOpacity="0.6"/><stop offset="1" stopColor={P.accent} stopOpacity="0.9"/></linearGradient></defs>
        <rect x="30" y="20" width="180" height="140" fill={P.bg} stroke={P.border} strokeWidth="2"/>
        {Array.from({length:12}).map((_,i)=><rect key={i} x="34" y={24+i*11} width="172" height="9" fill="url(#alu1)" opacity={0.4+(i%3)*0.15}/>)}
        <rect x="30" y="155" width="180" height="6" fill={P.accent} opacity="0.8"/>
      </svg>
    </div>
  );
  if (kind==="net") return (
    <div style={{ height,background:`linear-gradient(135deg,${P.bg2},${P.surface2})`,position:"relative",overflow:"hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 240 180" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="20" width="200" height="140" fill={P.bg2} stroke={P.accent} strokeWidth="2"/>
        <g stroke={P.muted} strokeWidth="0.5" opacity="0.6">
          {Array.from({length:24}).map((_,i)=><line key={i} x1={20+i*8.5} y1="20" x2={20+i*8.5} y2="160"/>)}
          {Array.from({length:17}).map((_,i)=><line key={i} x1="20" y1={20+i*8.5} x2="220" y2={20+i*8.5}/>)}
        </g>
      </svg>
    </div>
  );
  if (kind==="pergola") return (
    <div style={{ height,background:`linear-gradient(135deg,${P.bg2},${P.surface2})`,position:"relative",overflow:"hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 240 180" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="40" width="200" height="20" fill={P.accent} opacity="0.7"/>
        {Array.from({length:10}).map((_,i)=><rect key={i} x={28+i*20} y="60" width="6" height="80" fill={P.accent2} opacity="0.6"/>)}
        <rect x="30" y="140" width="6" height="30" fill={P.accent}/>
        <rect x="204" y="140" width="6" height="30" fill={P.accent}/>
      </svg>
    </div>
  );
  return <div style={{ height,background:P.bg2 }}/>;
}

// ============ HERO ============
function Hero({ t }) {
  return (
    <section id="top" style={{ position:"relative",minHeight:"100vh",overflow:"hidden",background:`radial-gradient(ellipse 80% 60% at 70% 30%, ${P.glow} 0%, transparent 60%), linear-gradient(180deg,${P.bg} 0%,${P.bg2} 100%)`,display:"flex",alignItems:"center",paddingTop:100 }}>
      <div style={{ position:"absolute",top:"10%",right:"5%",width:400,height:400,background:`radial-gradient(circle,${P.accent}22,transparent 70%)`,filter:"blur(60px)",borderRadius:"50%",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",bottom:"5%",left:"10%",width:300,height:300,background:`radial-gradient(circle,${P.accent2}33,transparent 70%)`,filter:"blur(60px)",borderRadius:"50%",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",inset:0,backgroundImage:`linear-gradient(${P.border} 1px, transparent 1px), linear-gradient(90deg, ${P.border} 1px, transparent 1px)`,backgroundSize:"60px 60px",maskImage:"radial-gradient(ellipse 60% 50% at 50% 50%, black 0%, transparent 80%)",WebkitMaskImage:"radial-gradient(ellipse 60% 50% at 50% 50%, black 0%, transparent 80%)",opacity:0.5 }}/>
      <div style={{ maxWidth:1280,margin:"0 auto",padding:"0 32px",position:"relative",zIndex:2,width:"100%" }}>
        <div className="hero-grid" style={{ display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:60,alignItems:"center" }}>
          <div>
            <div style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"6px 14px",borderRadius:100,background:P.surface,border:`1px solid ${P.border}`,fontSize:13,color:P.muted,marginBottom:24 }}>
              <span style={{ width:8,height:8,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 12px #22c55e" }}/>
              זמינים עכשיו · מתקשרים חזרה תוך 10 דקות
            </div>
            <h1 style={{ fontSize:"clamp(40px, 6vw, 76px)",fontWeight:800,lineHeight:1.02,letterSpacing:-1.5,margin:"0 0 24px",color:P.text }}>
              {t.heroTitle || 'תריסים, רשתות\nועבודות אלומיניום'}
            </h1>
            <p style={{ fontSize:19,color:P.muted,lineHeight:1.6,maxWidth:540,margin:"0 0 36px",fontWeight:400 }}>
              {t.heroSubtitle || 'למעלה מ-20 שנה אנחנו מתקינים, מתקנים ומחדשים תריסים, רשתות, חלונות ופרגולות בכל רחבי הארץ.'}
            </p>
            <div style={{ display:"flex",gap:12,flexWrap:"wrap",marginBottom:40 }}>
              <a href={`https://wa.me/${t.whatsapp}?text=${encodeURIComponent("שלום, אשמח להצעת מחיר")}`} target="_blank" rel="noopener" onClick={(e)=>waClick(e,t.whatsapp,"שלום, אשמח להצעת מחיר")} style={{ padding:"16px 28px",borderRadius:12,fontSize:16,fontWeight:700,background:"linear-gradient(135deg,#25d366,#128c7e)",color:"#fff",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:10,boxShadow:"0 12px 32px rgba(37,211,102,.35)" }}>
                <Icon name="wa" size={20} stroke="#fff"/> הצעת מחיר בוואטסאפ <Icon name="arrow" size={18} stroke="#fff"/>
              </a>
              <a href="#estimate" style={{ padding:"16px 28px",borderRadius:12,fontSize:16,fontWeight:600,background:P.surface,color:P.text,border:`1px solid ${P.border}`,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:10 }}>מחשבון מחיר מהיר</a>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,maxWidth:520 }}>
              {[{n:t.yearsExperience||"20+",l:"שנות ניסיון"},{n:t.totalInstallations||"4,800+",l:"התקנות"},{n:t.googleRating||"5★",l:"דירוג בגוגל"}].map((s,i)=>(
                <div key={i} style={{ borderRight:i<2?`1px solid ${P.border}`:"none",paddingRight:16 }}>
                  <div style={{ fontSize:32,fontWeight:800,color:P.text,letterSpacing:-1 }}>{s.n}</div>
                  <div style={{ fontSize:13,color:P.muted,marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual" style={{ position:"relative",height:540 }}>
            {[
              { top:0, right:0, delay:0, width:280, kind:"shutter", label:"תריס חשמלי חכם", sub:"פופולרי", price:"החל מ-1,200 ₪" },
              { top:180, right:220, delay:0.2, width:220, kind:"net", label:"רשת נגללת", sub:"נגד יתושים" },
              { top:360, right:40, delay:0.4, width:260, kind:"pergola", label:"פרגולת אלומיניום", sub:"ביו-קלימטית" }
            ].map((card,i)=>(
              <div key={i} style={{ position:"absolute",top:card.top,right:card.right,width:card.width,background:P.surface,border:`1px solid ${P.border}`,borderRadius:16,overflow:"hidden",boxShadow:`0 24px 48px rgba(0,0,0,.4)`,animation:`float 5s ease-in-out infinite ${card.delay}s` }}>
                <ProductPreview kind={card.kind} height={i===0?160:120}/>
                <div style={{ padding:i===0?"16px 18px":"12px 16px" }}>
                  {card.sub && <div style={{ fontSize:12,color:P.muted,marginBottom:4 }}>{card.sub}</div>}
                  <div style={{ fontSize:i===0?16:14,fontWeight:700,color:P.text }}>{card.label}</div>
                  {card.price && <div style={{ fontSize:13,color:P.accent,marginTop:6,fontWeight:600 }}>{card.price}</div>}
                </div>
              </div>
            ))}
            <div style={{ position:"absolute",top:80,right:280,padding:"8px 14px",borderRadius:100,background:P.accent,color:P.bg,fontSize:12,fontWeight:700,transform:"rotate(-6deg)",boxShadow:`0 8px 24px ${P.glow}`,animation:"float 4s ease-in-out infinite" }}>✓ אחריות 5 שנים</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ SERVICES ============
function Services({ t }) {
  const [active, setActive] = useState(null);
  return (
    <section id="services" style={{ padding:"120px 32px",background:P.bg,position:"relative" }}>
      <div style={{ maxWidth:1280,margin:"0 auto" }}>
        <SectionHead eyebrow="השירותים שלנו" title="כל מה שצריך מעסק אחד" sub="עבודות אלומיניום מקצה לקצה - מהמדידה ועד ההתקנה והאחריות. הכל בבית, בלי לרוץ בין ספקים."/>
        <div className="services-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginTop:56 }}>
          {SERVICES.map((s,i)=>(
            <div key={s.id} onMouseEnter={()=>setActive(i)} onMouseLeave={()=>setActive(null)} style={{ background:active===i?P.surface2:P.surface,border:`1px solid ${active===i?P.accent+"55":P.border}`,borderRadius:16,padding:24,cursor:"pointer",transition:"all .3s cubic-bezier(.2,.8,.2,1)",transform:active===i?"translateY(-6px)":"translateY(0)",boxShadow:active===i?`0 20px 40px rgba(0,0,0,.3)`:"none",position:"relative",overflow:"hidden" }}>
              <div style={{ width:48,height:48,borderRadius:12,background:`linear-gradient(135deg,${P.accent}22,${P.accent2}22)`,border:`1px solid ${P.border}`,display:"grid",placeItems:"center",color:P.accent,marginBottom:16 }}><Icon name={s.icon} size={22} stroke={P.accent}/></div>
              <h3 style={{ fontSize:18,fontWeight:700,color:P.text,margin:"0 0 8px" }}>{s.title}</h3>
              <p style={{ fontSize:13,color:P.muted,lineHeight:1.55,margin:"0 0 14px" }}>{s.desc}</p>
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {s.tags.map(tag=><span key={tag} style={{ fontSize:11,color:P.muted,padding:"3px 8px",background:P.bg2,borderRadius:6,border:`1px solid ${P.border}` }}>{tag}</span>)}
              </div>
              <a href={`https://wa.me/${t.whatsapp}?text=${encodeURIComponent("שלום, מעוניין ב"+s.title)}`} target="_blank" rel="noopener" onClick={(e)=>waClick(e,t.whatsapp,"שלום, מעוניין ב"+s.title)} style={{ marginTop:16,fontSize:13,color:P.accent,fontWeight:600,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:6 }}>
                לפרטים והצעת מחיר <Icon name="arrow" size={14} stroke={P.accent}/>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ PRODUCT TYPES ============
function ProductTypes({ t }) {
  const [tab, setTab] = useState("shutters");
  const items = tab==="shutters"?SHUTTER_TYPES:NET_TYPES;
  return (
    <section id="types" style={{ padding:"120px 32px",background:P.bg2,position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"20%",right:"-15%",width:500,height:500,background:`radial-gradient(circle,${P.accent}11,transparent 70%)`,filter:"blur(80px)",borderRadius:"50%",pointerEvents:"none" }}/>
      <div style={{ maxWidth:1280,margin:"0 auto",position:"relative" }}>
        <SectionHead eyebrow="קטלוג מוצרים" title="סוגי תריסים ורשתות" sub="מגוון רחב של פתרונות - לכל חלון, לכל תקציב, ולכל סגנון."/>
        <div style={{ marginTop:40,display:"inline-flex",gap:4,padding:6,background:P.surface,borderRadius:14,border:`1px solid ${P.border}` }}>
          {[{id:"shutters",label:"תריסים",count:SHUTTER_TYPES.length},{id:"nets",label:"רשתות",count:NET_TYPES.length}].map(x=>(
            <button key={x.id} onClick={()=>setTab(x.id)} style={{ padding:"12px 24px",borderRadius:10,fontSize:15,fontWeight:700,background:tab===x.id?`linear-gradient(135deg,${P.accent},${P.accent2})`:"transparent",color:tab===x.id?P.bg:P.muted,border:"none",cursor:"pointer",transition:"all .25s",display:"flex",alignItems:"center",gap:8 }}>
              {x.label} <span style={{ padding:"2px 8px",borderRadius:100,fontSize:11,background:tab===x.id?`${P.bg}40`:P.bg2,color:tab===x.id?P.bg:P.muted }}>{x.count}</span>
            </button>
          ))}
        </div>
        <div className="types-grid" style={{ marginTop:32,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20 }}>
          {items.map(it=><ProductTypeCard key={it.id} t={t} item={it} kind={tab==="shutters"?"shutter":"net"}/>)}
        </div>
      </div>
    </section>
  );
}

function ProductTypeCard({ t, item, kind }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{ background:P.surface,border:`1px solid ${hover?item.color+"55":P.border}`,borderRadius:16,overflow:"hidden",transition:"all .3s",transform:hover?"translateY(-4px)":"translateY(0)",display:"flex",flexDirection:"column",position:"relative" }}>
      {item.pop && <div style={{ position:"absolute",top:12,right:12,zIndex:1,fontSize:11,fontWeight:700,color:"#fff",padding:"3px 10px",borderRadius:100,background:item.color }}>פופולרי</div>}
      <div style={{ height:180,background:P.bg,position:"relative",overflow:"hidden" }}>
        <ProductPreview kind={kind} height={180}/>
      </div>
      <div style={{ padding:22,display:"flex",flexDirection:"column",flex:1 }}>
        <h3 style={{ fontSize:19,fontWeight:700,color:P.text,margin:"0 0 8px" }}>{item.name}</h3>
        <p style={{ fontSize:13.5,color:P.muted,lineHeight:1.55,margin:"0 0 16px" }}>{item.desc}</p>
        <div style={{ display:"flex",flexDirection:"column",gap:7,marginBottom:18,flex:1 }}>
          {item.features.map((f,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:8,fontSize:12.5,color:P.text }}>
              <span style={{ width:16,height:16,borderRadius:"50%",background:`${item.color}22`,color:item.color,display:"grid",placeItems:"center",fontSize:10,fontWeight:800 }}>✓</span>{f}
            </div>
          ))}
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:16,borderTop:`1px solid ${P.border}` }}>
          <div>
            <div style={{ fontSize:10,color:P.muted,marginBottom:1 }}>החל מ-</div>
            <div style={{ fontSize:14,fontWeight:700,color:item.color }}>{item.price}</div>
          </div>
          <a href={`https://wa.me/${t.whatsapp}?text=${encodeURIComponent("שלום, אשמח להצעת מחיר עבור: "+item.name)}`} target="_blank" rel="noopener" onClick={(e)=>waClick(e,t.whatsapp,"שלום, אשמח להצעת מחיר עבור: "+item.name)} style={{ padding:"8px 14px",borderRadius:8,fontSize:12.5,fontWeight:700,background:hover?item.color:P.bg2,color:hover?P.bg:P.text,textDecoration:"none",border:`1px solid ${hover?item.color:P.border}`,transition:"all .25s",display:"inline-flex",alignItems:"center",gap:6 }}>
            הצעת מחיר <Icon name="arrow" size={12} stroke={hover?P.bg:P.text}/>
          </a>
        </div>
      </div>
    </div>
  );
}

// ============ WHY US ============
function WhyUs() {
  return (
    <section id="why" style={{ padding:"120px 32px",background:P.bg2 }}>
      <div style={{ maxWidth:1280,margin:"0 auto" }}>
        <SectionHead eyebrow="למה אנחנו" title="עסק משפחתי, מקצוענות אמיתית" sub="לא קבלן משנה. לא מתווכים. אנחנו אלה שמודדים, מייצרים ומתקינים אצלך."/>
        <div className="why-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginTop:56 }}>
          {FEATURES_LIST.map((f,i)=>(
            <div key={i} style={{ padding:28,borderRadius:16,background:`linear-gradient(135deg,${P.surface},${P.surface2})`,border:`1px solid ${P.border}`,position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:-20,left:-20,width:100,height:100,background:`radial-gradient(circle,${P.accent}11,transparent 70%)`,borderRadius:"50%" }}/>
              <div style={{ width:52,height:52,borderRadius:14,background:`linear-gradient(135deg,${P.accent}22,${P.accent2}22)`,border:`1px solid ${P.border}`,display:"grid",placeItems:"center",color:P.accent,marginBottom:20 }}><Icon name={f.i} size={24} stroke={P.accent}/></div>
              <h3 style={{ fontSize:20,fontWeight:700,color:P.text,margin:"0 0 10px",letterSpacing:-0.3 }}>{f.t}</h3>
              <p style={{ fontSize:14,color:P.muted,lineHeight:1.6,margin:0 }}>{f.s}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ PRICE ESTIMATOR ============
function PriceEstimator({ t }) {
  const [type, setType] = useState("shutter");
  const [width, setWidth] = useState(120);
  const [height, setHeight] = useState(150);
  const [qty, setQty] = useState(1);
  const [electric, setElectric] = useState(false);
  const [installation, setInstallation] = useState(true);
  const TYPES = [
    { id:"shutter",name:"תריס גלילה",base:350,perSqm:1 },
    { id:"net",name:"רשת נגד יתושים",base:200,perSqm:0.5 },
    { id:"window",name:"חלון אלומיניום",base:600,perSqm:1.5 },
    { id:"pergola",name:"פרגולה",base:800,perSqm:2 },
    { id:"shower",name:"מקלחון",base:1200,perSqm:1.2 }
  ];
  const calc = useMemo(()=>{
    const tp = TYPES.find(x=>x.id===type);
    const sqm=(width/100)*(height/100);
    let unit=tp.base+sqm*800*tp.perSqm;
    if(electric) unit+=600;
    let total=unit*qty;
    if(installation) total+=250*qty;
    return { min:Math.floor(total*0.85/50)*50, max:Math.ceil(total*1.15/50)*50, sqm:sqm.toFixed(2) };
  },[type,width,height,qty,electric,installation]);
  const msg=`שלום מנחם, אני מעוניין בהצעת מחיר ל-${qty}x ${TYPES.find(x=>x.id===type)?.name} במידות ${width}x${height} ס"מ${electric?", עם מנוע חשמלי":""}${installation?", כולל התקנה":""}. ראיתי שהטווח המשוער ${calc.min}-${calc.max} ₪.`;
  const btnStyle={ width:40,height:40,borderRadius:8,background:P.surface,color:P.text,border:`1px solid ${P.border}`,cursor:"pointer",display:"grid",placeItems:"center" };
  return (
    <section id="estimate" style={{ padding:"120px 32px",background:P.bg2,position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"10%",left:"-10%",width:500,height:500,background:`radial-gradient(circle,${P.accent}11,transparent 70%)`,filter:"blur(80px)",borderRadius:"50%",pointerEvents:"none" }}/>
      <div style={{ maxWidth:1100,margin:"0 auto",position:"relative" }}>
        <SectionHead eyebrow="מחשבון מחיר" title="כמה זה עולה?" sub="הזן את המידות וקבל טווח מחיר משוער תוך שניות."/>
        <div className="estimator-grid" style={{ marginTop:56,display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:32,background:`linear-gradient(135deg,${P.surface},${P.surface2})`,borderRadius:24,padding:40,border:`1px solid ${P.border}` }}>
          <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:"block",fontSize:13,fontWeight:600,color:P.text,marginBottom:10 }}>סוג מוצר</label>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8 }}>
                {TYPES.map(x=><button key={x.id} onClick={()=>setType(x.id)} style={{ padding:"12px 8px",borderRadius:10,fontSize:13,fontWeight:600,background:type===x.id?P.accent:P.bg,color:type===x.id?P.bg:P.text,border:`1px solid ${type===x.id?P.accent:P.border}`,cursor:"pointer",transition:"all .2s" }}>{x.name}</button>)}
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              {[{label:`רוחב (ס"מ): ${width}`,val:width,setVal:setWidth},{label:`גובה (ס"מ): ${height}`,val:height,setVal:setHeight}].map((sl,i)=>(
                <div key={i} style={{ marginBottom:20 }}>
                  <label style={{ display:"block",fontSize:13,fontWeight:600,color:P.text,marginBottom:10 }}>{sl.label}</label>
                  <input type="range" min="50" max="300" value={sl.val} onChange={e=>sl.setVal(+e.target.value)} style={{ width:"100%",accentColor:P.accent }}/>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:"block",fontSize:13,fontWeight:600,color:P.text,marginBottom:10 }}>כמות: {qty}</label>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <button onClick={()=>setQty(Math.max(1,qty-1))} style={btnStyle}><Icon name="minus" size={16}/></button>
                <div style={{ flex:1,height:40,borderRadius:8,background:P.bg,border:`1px solid ${P.border}`,display:"grid",placeItems:"center",color:P.text,fontWeight:700 }}>{qty}</div>
                <button onClick={()=>setQty(qty+1)} style={btnStyle}><Icon name="plus" size={16}/></button>
              </div>
            </div>
            <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
              {[{on:electric,setOn:setElectric,label:"מנוע חשמלי (+600 ₪)"},{on:installation,setOn:setInstallation,label:"כולל התקנה (+250 ₪)"}].map((tg,i)=>(
                <button key={i} onClick={()=>tg.setOn(!tg.on)} style={{ padding:"10px 14px",borderRadius:10,fontSize:13,fontWeight:600,background:tg.on?P.accent+"22":P.bg,color:tg.on?P.accent:P.muted,border:`1px solid ${tg.on?P.accent:P.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:8,flex:1 }}>
                  <span style={{ width:16,height:16,borderRadius:4,background:tg.on?P.accent:"transparent",border:`1.5px solid ${tg.on?P.accent:P.muted}`,display:"grid",placeItems:"center",color:P.bg,fontSize:10 }}>{tg.on?"✓":""}</span>{tg.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ background:P.bg,borderRadius:16,padding:28,border:`1px solid ${P.accent}33`,display:"flex",flexDirection:"column",justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:13,color:P.muted,marginBottom:6 }}>טווח מחיר משוער</div>
              <div style={{ fontSize:44,fontWeight:800,color:P.text,letterSpacing:-1.5,lineHeight:1,background:`linear-gradient(135deg,${P.accent},${P.text})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>{calc.min.toLocaleString()}–{calc.max.toLocaleString()}</div>
              <div style={{ fontSize:16,color:P.muted,marginTop:4 }}>שקלים, כולל מע"מ</div>
              <div style={{ marginTop:24,padding:16,background:P.surface,borderRadius:12,border:`1px solid ${P.border}` }}>
                {[{k:'שטח',v:`${calc.sqm} מ"ר`},{k:"כמות",v:`${qty} יחידות`},...(electric?[{k:"מנוע חשמלי",v:"✓"}]:[]),...(installation?[{k:"התקנה",v:"✓"}]:[])].map((r,i)=>(
                  <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:13 }}><span style={{ color:P.muted }}>{r.k}</span><span style={{ color:P.text,fontWeight:600 }}>{r.v}</span></div>
                ))}
              </div>
            </div>
            <div>
              <a href={`https://wa.me/${t.whatsapp}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener" onClick={(e)=>waClick(e,t.whatsapp,msg)} style={{ marginTop:20,padding:"16px 20px",borderRadius:12,fontSize:15,fontWeight:700,background:"linear-gradient(135deg,#25d366,#128c7e)",color:"#fff",textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:"0 12px 32px rgba(37,211,102,.35)" }}>
                <Icon name="wa" size={18} stroke="#fff"/> קבל הצעת מחיר מדויקת
              </a>
              <div style={{ fontSize:11,color:P.muted,marginTop:10,textAlign:"center",lineHeight:1.5 }}>* המחיר משוער בלבד. מחיר סופי לאחר מדידה במקום.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ GALLERY ============
const GALLERY_PLACEHOLDERS = [
  { id:"g1",kind:"shutter",title:"תריס חשמלי - תל אביב",h:320 },
  { id:"g2",kind:"pergola",title:"פרגולה ביו-קלימטית - הרצליה",h:380 },
  { id:"g3",kind:"net",title:"רשתות נגללות - רעננה",h:280 },
  { id:"g4",kind:"shutter",title:"תריסי גלילה - חיפה",h:360 },
  { id:"g5",kind:"pergola",title:"גגון אלומיניום - באר שבע",h:320 },
  { id:"g6",kind:"net",title:"רשת בטיחות - רמת גן",h:340 }
];

function Gallery({ galleryItems = [] }) {
  const items = galleryItems.length > 0 ? galleryItems : null;
  const placeholders = GALLERY_PLACEHOLDERS;
  return (
    <section id="gallery" style={{ padding:"120px 32px",background:P.bg }}>
      <div style={{ maxWidth:1280,margin:"0 auto" }}>
        <SectionHead eyebrow="פרויקטים אחרונים" title="גלריית עבודות" sub="דוגמאות מפרויקטים אחרונים שביצענו ברחבי הארץ."/>
        <div className="gallery-grid" style={{ marginTop:56,columnCount:3,columnGap:16 }}>
          {items ? items.map((it,i)=>(
            <div key={it.id} style={{ breakInside:"avoid",marginBottom:16,borderRadius:16,overflow:"hidden",border:`1px solid ${P.border}`,position:"relative",transition:"transform .3s" }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              <img src={it.url} alt={it.title} style={{ width:"100%",display:"block",minHeight:200,objectFit:"cover" }}/>
              <div style={{ position:"absolute",bottom:0,left:0,right:0,background:`linear-gradient(to top,${P.bg}ee,transparent)`,padding:"40px 20px 16px",color:P.text,fontWeight:600,fontSize:14,pointerEvents:"none" }}>{it.title}</div>
            </div>
          )) : placeholders.map((it,i)=>(
            <div key={i} style={{ breakInside:"avoid",marginBottom:16,borderRadius:16,overflow:"hidden",border:`1px solid ${P.border}`,position:"relative",transition:"transform .3s" }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              <ProductPreview kind={it.kind} height={it.h}/>
              <div style={{ position:"absolute",bottom:0,left:0,right:0,background:`linear-gradient(to top,${P.bg}ee,transparent)`,padding:"40px 20px 16px",color:P.text,fontWeight:600,fontSize:14,pointerEvents:"none" }}>{it.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ ISRAEL MAP ============
function IsraelMap({ t }) {
  const [active, setActive] = useState(null);
  return (
    <section style={{ padding:"120px 32px",background:P.bg }}>
      <div style={{ maxWidth:1280,margin:"0 auto" }}>
        <SectionHead eyebrow="פריסה ארצית" title="מגיעים אליך בכל מקום בארץ" sub="לחץ על אזור במפה לראות ערים ולקבל הצעת מחיר מיידית באזורך." align="center"/>
        <div className="israelmap-grid" style={{ marginTop:56,display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center" }}>
          <div style={{ display:"grid",placeItems:"center" }}>
            <svg viewBox="0 0 320 620" style={{ width:"100%",maxWidth:380,height:"auto" }}>
              <defs>
                <linearGradient id="israelGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={P.surface}/><stop offset="1" stopColor={P.surface2}/></linearGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <path d="M 140 50 L 175 60 L 195 90 L 195 130 L 180 170 L 175 200 L 180 230 L 145 260 L 130 290 L 145 320 L 175 340 L 195 370 L 180 410 L 155 450 L 130 490 L 145 520 L 165 560 L 180 590 L 155 600 L 130 580 L 120 540 L 105 490 L 100 440 L 110 390 L 115 340 L 105 290 L 110 250 L 120 210 L 115 170 L 110 130 L 120 90 Z" fill="url(#israelGrad)" stroke={P.border} strokeWidth="1.5"/>
              {REGIONS.map(r=>(
                <g key={r.id} onMouseEnter={()=>setActive(r.id)} onClick={()=>setActive(r.id)} style={{ cursor:"pointer" }}>
                  <circle cx={r.x} cy={r.y} r={r.r*0.5} fill={active===r.id?P.accent:P.accent+"33"} opacity={active===r.id?0.4:0.25} style={{ transition:"all .3s" }}/>
                  <circle cx={r.x} cy={r.y} r="6" fill={active===r.id?P.accent:P.accent+"aa"} filter={active===r.id?"url(#glow)":"none"} style={{ transition:"all .3s" }}/>
                  {active===r.id && <circle cx={r.x} cy={r.y} r="12" fill="none" stroke={P.accent} strokeWidth="1.5"><animate attributeName="r" from="6" to="24" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" from="1" to="0" dur="1.5s" repeatCount="indefinite"/></circle>}
                  <text x={r.x+15} y={r.y+4} fontSize="13" fontWeight="700" fill={active===r.id?P.text:P.muted} style={{ transition:"all .3s",pointerEvents:"none",fontFamily:"Heebo, sans-serif" }}>{r.name}</text>
                </g>
              ))}
            </svg>
          </div>
          <div>
            {active ? (
              <div style={{ background:P.surface,border:`1px solid ${P.accent}55`,borderRadius:16,padding:28,animation:"fadeUp .3s ease" }}>
                <div style={{ fontSize:13,color:P.accent,fontWeight:700,marginBottom:8 }}>אזור שירות</div>
                <h3 style={{ fontSize:28,fontWeight:800,color:P.text,margin:"0 0 12px",letterSpacing:-0.5 }}>{REGIONS.find(r=>r.id===active)?.name}</h3>
                <p style={{ fontSize:15,color:P.muted,lineHeight:1.7,margin:"0 0 20px" }}><strong style={{ color:P.text }}>ערים עיקריות:</strong><br/>{REGIONS.find(r=>r.id===active)?.cities}</p>
                <div style={{ display:"flex",gap:12,alignItems:"center",padding:"12px 16px",background:P.bg,borderRadius:10,marginBottom:16 }}>
                  <span style={{ width:10,height:10,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 8px #22c55e" }}/>
                  <span style={{ fontSize:13,color:P.text }}>זמין באזור · הגעה תוך 24-48 שעות</span>
                </div>
                <a href={`https://wa.me/${t.whatsapp}?text=${encodeURIComponent("שלום, אני באזור "+(REGIONS.find(r=>r.id===active)?.name||"")+" ואשמח להצעת מחיר")}`} target="_blank" rel="noopener" onClick={(e)=>waClick(e,t.whatsapp,"שלום, אני באזור "+(REGIONS.find(r=>r.id===active)?.name||"")+" ואשמח להצעת מחיר")} style={{ padding:"14px 22px",borderRadius:12,fontSize:15,fontWeight:700,background:"linear-gradient(135deg,#25d366,#128c7e)",color:"#fff",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:10 }}>
                  <Icon name="wa" size={18} stroke="#fff"/> הזמן באזור {REGIONS.find(r=>r.id===active)?.name}
                </a>
              </div>
            ) : (
              <div style={{ padding:28,borderRadius:16,border:`1px dashed ${P.border}`,color:P.muted,fontSize:16,lineHeight:1.7,textAlign:"center" }}>
                <div style={{ fontSize:40,marginBottom:12 }}>📍</div>
                <strong style={{ color:P.text }}>בחר אזור במפה</strong>
                <p style={{ margin:"8px 0 0",fontSize:14 }}>נציג את הערים בהן אנו פועלים ונשלח אותך ישירות לוואטסאפ</p>
              </div>
            )}
            <div style={{ marginTop:24,padding:20,borderRadius:12,background:`linear-gradient(135deg,${P.surface},${P.surface2})`,border:`1px solid ${P.border}`,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
              {[{n:"24h",l:"תגובה מהירה"},{n:"0₪",l:"עלות הגעה"},{n:"100%",l:"כיסוי ארצי"}].map((s,i)=>(
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:22,fontWeight:800,color:P.accent }}>{s.n}</div>
                  <div style={{ fontSize:11,color:P.muted,marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ TESTIMONIALS ============
function Testimonials() {
  return (
    <section id="testimonials" style={{ padding:"120px 32px",background:P.bg }}>
      <div style={{ maxWidth:1280,margin:"0 auto" }}>
        <SectionHead eyebrow="המלצות" title='מה אומרים עלינו' sub='דירוג 4.9★ בגוגל מתוך 380+ ביקורות אמיתיות.'/>
        <div className="testimonials-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginTop:56 }}>
          {TESTIMONIALS.map((t,i)=>(
            <div key={i} style={{ padding:24,borderRadius:16,background:P.surface,border:`1px solid ${P.border}`,display:"flex",flexDirection:"column",gap:14 }}>
              <div style={{ display:"flex",gap:2,color:"#fbbf24" }}>{Array.from({length:t.r}).map((_,j)=><Icon key={j} name="star" size={14} stroke="#fbbf24"/>)}</div>
              <p style={{ fontSize:14,color:P.text,lineHeight:1.6,margin:0,flex:1 }}>"{t.t}"</p>
              <div style={{ display:"flex",alignItems:"center",gap:12,paddingTop:14,borderTop:`1px solid ${P.border}` }}>
                <div style={{ width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${P.accent},${P.accent2})`,display:"grid",placeItems:"center",color:P.bg,fontWeight:700,fontSize:14 }}>{t.n[0]}</div>
                <div><div style={{ fontSize:14,fontWeight:700,color:P.text }}>{t.n}</div><div style={{ fontSize:12,color:P.muted }}>{t.l}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ AREAS ============
function AreasSection() {
  return (
    <section style={{ padding:"80px 32px",background:P.bg2 }}>
      <div style={{ maxWidth:1280,margin:"0 auto" }}>
        <SectionHead eyebrow="מגיעים אליך" title="פריסה ארצית · ללא עלות הגעה" sub="מקריית שמונה ועד אילת. שירות מהיר בכל אזור."/>
        <div style={{ marginTop:48,display:"flex",flexWrap:"wrap",gap:10 }}>
          {AREAS.map(a=><span key={a} style={{ padding:"10px 16px",borderRadius:100,background:P.surface,border:`1px solid ${P.border}`,fontSize:13,color:P.text,fontWeight:500,display:"inline-flex",alignItems:"center",gap:6 }}><Icon name="pin" size={12} stroke={P.accent}/> {a}</span>)}
          <span style={{ padding:"10px 16px",borderRadius:100,background:P.accent+"22",border:`1px solid ${P.accent}`,fontSize:13,color:P.accent,fontWeight:700 }}>+ עוד</span>
        </div>
      </div>
    </section>
  );
}

// ============ FAQ ============
function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <section style={{ padding:"120px 32px",background:P.bg }}>
      <div style={{ maxWidth:880,margin:"0 auto" }}>
        <SectionHead eyebrow="שאלות נפוצות" title="שאלות שכבר שאלו אותנו" align="center"/>
        <div style={{ marginTop:48 }}>
          {FAQ.map((f,i)=>(
            <div key={i} style={{ borderBottom:`1px solid ${P.border}`,padding:"20px 0" }}>
              <button onClick={()=>setOpen(open===i?-1:i)} style={{ width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",background:"transparent",border:"none",color:P.text,fontSize:17,fontWeight:600,cursor:"pointer",textAlign:"right",padding:0 }}>
                {f.q}
                <span style={{ width:28,height:28,borderRadius:8,background:P.surface,display:"grid",placeItems:"center",color:P.text,transition:"transform .3s",transform:open===i?"rotate(45deg)":"rotate(0)" }}><Icon name="plus" size={14}/></span>
              </button>
              <div style={{ maxHeight:open===i?200:0,overflow:"hidden",transition:"max-height .4s ease",color:P.muted,fontSize:15,lineHeight:1.7 }}>
                <div style={{ paddingTop:12 }}>{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ BLOG ============
function BlogSection({ t }) {
  const [open, setOpen] = useState(null);
  return (
    <section id="blog" style={{ padding:"120px 32px",background:P.bg2 }}>
      <div style={{ maxWidth:1280,margin:"0 auto" }}>
        <SectionHead eyebrow="טיפים ומדריכים" title="מדריכים שיעזרו לכם להחליט" sub="מאמרים מהשטח - מה לבחור, איך לתחזק, ומה כדאי לדעת לפני שמזמינים."/>
        <div className="blog-grid" style={{ marginTop:56,display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:24 }}>
          {BLOG.map(b=>(
            <article key={b.id} onClick={()=>setOpen(b)} style={{ background:P.surface,border:`1px solid ${P.border}`,borderRadius:16,padding:28,cursor:"pointer",transition:"all .3s",display:"flex",flexDirection:"column",gap:14 }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor=b.color+"66";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=P.border;}}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:12 }}>
                <span style={{ fontSize:11,fontWeight:700,color:b.color,padding:"4px 10px",borderRadius:100,background:b.color+"22",border:`1px solid ${b.color}44` }}>{b.cat}</span>
                <span style={{ fontSize:12,color:P.muted }}>קריאה {b.read}</span>
              </div>
              <h3 style={{ fontSize:22,fontWeight:700,color:P.text,margin:0,lineHeight:1.3,letterSpacing:-0.3 }}>{b.title}</h3>
              <p style={{ fontSize:14,color:P.muted,lineHeight:1.6,margin:0 }}>{b.excerpt}</p>
              <div style={{ marginTop:4,fontSize:13,color:b.color,fontWeight:600,display:"flex",alignItems:"center",gap:6 }}>המשך לקרוא <Icon name="arrow" size={12} stroke={b.color}/></div>
            </article>
          ))}
        </div>
      </div>
      {open && (
        <div onClick={()=>setOpen(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:200,display:"grid",placeItems:"center",padding:24,animation:"fadeUp .25s ease" }}>
          <div onClick={e=>e.stopPropagation()} style={{ maxWidth:720,width:"100%",maxHeight:"85vh",overflow:"auto",background:P.surface,border:`1px solid ${P.border}`,borderRadius:20,padding:40,position:"relative" }}>
            <button onClick={()=>setOpen(null)} style={{ position:"absolute",top:16,left:16,width:36,height:36,borderRadius:10,background:P.bg2,border:`1px solid ${P.border}`,color:P.text,cursor:"pointer",display:"grid",placeItems:"center" }}><Icon name="close" size={16}/></button>
            <span style={{ fontSize:11,fontWeight:700,color:open.color,padding:"4px 10px",borderRadius:100,background:open.color+"22",border:`1px solid ${open.color}44` }}>{open.cat}</span>
            <h2 style={{ fontSize:32,fontWeight:800,color:P.text,margin:"16px 0 20px",lineHeight:1.2,letterSpacing:-0.5 }}>{open.title}</h2>
            <p style={{ fontSize:17,color:P.text,lineHeight:1.8,marginBottom:24 }}>{open.excerpt}</p>
            <p style={{ fontSize:15,color:P.muted,lineHeight:1.8 }}>{open.body}</p>
            <a href={`https://wa.me/${t.whatsapp}?text=${encodeURIComponent("שלום, קראתי את המאמר על "+open.title+" ויש לי שאלה")}`} target="_blank" rel="noopener" onClick={(e)=>waClick(e,t.whatsapp,"שלום, קראתי את המאמר על "+open.title+" ויש לי שאלה")} style={{ marginTop:28,padding:"14px 24px",borderRadius:12,fontSize:15,fontWeight:700,background:"linear-gradient(135deg,#25d366,#128c7e)",color:"#fff",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:10 }}>
              <Icon name="wa" size={18} stroke="#fff"/> שאל אותנו על {open.cat}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

// ============ CONTACT ============
function Contact({ t }) {
  const [form, setForm] = useState({ name:"", phone:"", service:"תריס גלילה", msg:"" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, service: form.service, message: form.msg }),
      });
    } catch {}
    const text = `שלום מנחם!\nשם: ${form.name}\nטלפון: ${form.phone}\nשירות: ${form.service}\n\n${form.msg}`;
    openWhatsApp(t.whatsapp, text);
    setSent(true);
    setLoading(false);
    setTimeout(() => setSent(false), 3000);
  };

  const inputStyle = { width:"100%",padding:"12px 14px",borderRadius:10,background:P.bg,color:P.text,border:`1px solid ${P.border}`,fontSize:14,fontFamily:"inherit" };

  return (
    <section id="contact" style={{ padding:"120px 32px",background:P.bg2,position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:0,right:"-10%",width:500,height:500,background:`radial-gradient(circle,${P.glow},transparent 60%)`,filter:"blur(80px)",pointerEvents:"none" }}/>
      <div style={{ maxWidth:1100,margin:"0 auto",position:"relative" }}>
        <div className="contact-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:60,alignItems:"center" }}>
          <div>
            <SectionHead eyebrow="צור קשר" title="מוכן לשדרג את הבית?" sub="ספר לנו מה צריך - נחזור אליך תוך שעה עם הצעת מחיר."/>
            <div style={{ marginTop:40,display:"flex",flexDirection:"column",gap:16 }}>
              {[
                { icon:"wa",label:"וואטסאפ",v:"לחץ לשליחת הודעה",href:`https://wa.me/${t.whatsapp}`,onClick:(e)=>waClick(e,t.whatsapp),accent:true },
                { icon:"phone",label:"טלפון",v:t.phone,href:`tel:${t.phone}` },
                { icon:"mail",label:"אימייל",v:t.email||"info@menahem-aluminum.co.il",href:`mailto:${t.email||"info@menahem-aluminum.co.il"}` },
                { icon:"pin",label:"שעות פעילות",v:"א'-ה' 7:00-19:00 · ו' 7:00-13:00" }
              ].map((row,i)=>{
                const inner=(
                  <div style={{ display:"flex",alignItems:"center",gap:16,padding:18,borderRadius:14,background:row.accent?`linear-gradient(135deg,#25d36622,#128c7e22)`:P.surface,border:`1px solid ${row.accent?"#25d36655":P.border}`,cursor:row.href?"pointer":"default",transition:"all .2s" }}>
                    <div style={{ width:44,height:44,borderRadius:10,background:row.accent?"linear-gradient(135deg,#25d366,#128c7e)":P.bg,display:"grid",placeItems:"center",color:row.accent?"#fff":P.accent }}>
                      <Icon name={row.icon} size={20} stroke={row.accent?"#fff":P.accent}/>
                    </div>
                    <div style={{ flex:1 }}><div style={{ fontSize:12,color:P.muted }}>{row.label}</div><div style={{ fontSize:15,color:P.text,fontWeight:600,marginTop:2 }}>{row.v}</div></div>
                  </div>
                );
                return row.href ? <a key={i} href={row.href} target={row.href.startsWith("http")?"_blank":undefined} rel="noopener" onClick={row.onClick} style={{ textDecoration:"none" }}>{inner}</a> : <div key={i}>{inner}</div>;
              })}
            </div>
          </div>
          <form onSubmit={send} style={{ background:`linear-gradient(135deg,${P.surface},${P.surface2})`,border:`1px solid ${P.border}`,borderRadius:24,padding:32,boxShadow:"0 30px 80px rgba(0,0,0,.3)" }}>
            <h3 style={{ fontSize:22,fontWeight:700,color:P.text,margin:"0 0 24px" }}>שלח לנו הודעה</h3>
            {[{label:"שם מלא *",type:"text",val:form.name,set:v=>setForm({...form,name:v}),req:true},{label:"מספר טלפון *",type:"tel",val:form.phone,set:v=>setForm({...form,phone:v}),req:true}].map((f,i)=>(
              <div key={i} style={{ marginBottom:20 }}>
                <label style={{ display:"block",fontSize:13,fontWeight:600,color:P.text,marginBottom:10 }}>{f.label}</label>
                <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} required={f.req} style={inputStyle}/>
              </div>
            ))}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:"block",fontSize:13,fontWeight:600,color:P.text,marginBottom:10 }}>סוג השירות</label>
              <select value={form.service} onChange={e=>setForm({...form,service:e.target.value})} style={inputStyle}>
                {SERVICES.map(s=><option key={s.id}>{s.title}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:"block",fontSize:13,fontWeight:600,color:P.text,marginBottom:10 }}>פרטים נוספים</label>
              <textarea value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} rows={3} style={{ ...inputStyle,resize:"vertical" }}/>
            </div>
            <button type="submit" disabled={loading} style={{ width:"100%",padding:16,borderRadius:12,fontSize:16,fontWeight:700,background:sent?"#22c55e":"linear-gradient(135deg,#25d366,#128c7e)",color:"#fff",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:"0 12px 32px rgba(37,211,102,.35)",transition:"all .3s" }}>
              {sent?"✓ נשלח! פותח וואטסאפ...":loading?"שולח...":<><Icon name="wa" size={20} stroke="#fff"/> שלח דרך וואטסאפ</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer({ t }) {
  return (
    <footer style={{ padding:"60px 32px 30px",background:P.bg,borderTop:`1px solid ${P.border}` }}>
      <div style={{ maxWidth:1280,margin:"0 auto" }}>
        <div className="footer-grid" style={{ display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr",gap:40,marginBottom:40 }}>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
              <div style={{ width:38,height:38,borderRadius:10,background:`linear-gradient(135deg,${P.accent},${P.accent2})`,display:"grid",placeItems:"center",color:P.bg,fontWeight:800,fontSize:20 }}>מ</div>
              <span style={{ fontWeight:800,fontSize:18,color:P.text }}>{t.businessName}</span>
            </div>
            <p style={{ fontSize:14,color:P.muted,lineHeight:1.7,margin:0,maxWidth:320 }}>עסק משפחתי עם למעלה מ-20 שנות ניסיון בתחום האלומיניום. תריסים, רשתות, חלונות, פרגולות וכל מה שביניהם - בכל הארץ.</p>
          </div>
          <div>
            <h4 style={{ fontSize:14,fontWeight:700,color:P.text,margin:"0 0 16px" }}>שירותים</h4>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>{SERVICES.slice(0,6).map(s=><span key={s.id} style={{ fontSize:14,color:P.muted }}>{s.title}</span>)}</div>
          </div>
          <div>
            <h4 style={{ fontSize:14,fontWeight:700,color:P.text,margin:"0 0 16px" }}>ניווט</h4>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>{["שירותים","למה אנחנו","גלריה","מחיר","המלצות","צור קשר"].map(l=><a key={l} href={`#${l==="שירותים"?"services":l==="גלריה"?"gallery":l==="מחיר"?"estimate":l==="צור קשר"?"contact":"why"}`} style={{ fontSize:14,color:P.muted,textDecoration:"none" }}>{l}</a>)}</div>
          </div>
          <div>
            <h4 style={{ fontSize:14,fontWeight:700,color:P.text,margin:"0 0 16px" }}>צור קשר</h4>
            <div style={{ display:"flex",flexDirection:"column",gap:10,fontSize:14,color:P.muted }}>
              <a href={`tel:${t.phone}`} style={{ color:P.muted,textDecoration:"none" }}>{t.phone}</a>
              <a href={`https://wa.me/${t.whatsapp}`} target="_blank" rel="noopener" onClick={(e)=>waClick(e,t.whatsapp)} style={{ color:P.muted,textDecoration:"none" }}>וואטסאפ</a>
              <span>א'-ה' 7:00-19:00</span><span>ו' 7:00-13:00</span>
            </div>
          </div>
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",paddingTop:24,borderTop:`1px solid ${P.border}`,fontSize:12,color:P.muted,flexWrap:"wrap",gap:16 }}>
          <span>© {new Date().getFullYear()} {t.businessName}. כל הזכויות שמורות.</span>
          <span>בנייה: מעוצב עם דגש על מקצועיות ושירות</span>
        </div>
      </div>
    </footer>
  );
}

// ============ FLOATING WA ============
function FloatingWA({ t }) {
  const [pulse, setPulse] = useState(true);
  useEffect(()=>{ const x=setTimeout(()=>setPulse(false),8000); return()=>clearTimeout(x); },[]);
  return (
    <a href={`https://wa.me/${t.whatsapp}?text=${encodeURIComponent("שלום, ראיתי את האתר ואשמח להצעת מחיר")}`} target="_blank" rel="noopener" onClick={(e)=>waClick(e,t.whatsapp,"שלום, ראיתי את האתר ואשמח להצעת מחיר")} style={{ position:"fixed",bottom:24,left:24,zIndex:100,width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#25d366,#128c7e)",display:"grid",placeItems:"center",color:"#fff",textDecoration:"none",boxShadow:"0 12px 32px rgba(37,211,102,.5)",animation:pulse?"wapulse 1.6s ease-out infinite":"none" }}>
      <Icon name="wa" size={30} stroke="#fff"/>
    </a>
  );
}

// ============ AI CHAT ============
function getCannedReply(msg, whatsapp) {
  const m = msg.toLowerCase();
  if (/מחיר|כמה עולה|עלות|תקציב/.test(m)) return 'המחיר תלוי במידות ובסוג. טווחים משוערים:\n• תריס גלילה ידני: מ-450 ₪/מ"ר\n• תריס חשמלי: מ-850 ₪/מ"ר\n• רשת נגד יתושים: מ-280 ₪/מ"ר\n\nלמחיר מדויק שלחו לנו וואטסאפ 👇';
  if (/חשמלי|מנוע|חכם|אפליקציה|שלט/.test(m)) return 'תריסים חשמליים שלנו כוללים מנוע סומפי איכותי + שלט אלחוטי, אחריות 3 שנים על המנוע. רוצים לשמוע פרטים? שלחו לנו וואטסאפ 👇';
  if (/רשת|יתושים|חתול|כלב|ילד|בטיחות/.test(m)) return 'יש לנו רשתות נגללות, פליסה, מגנט, וגם רשתות בטיחות לילדים ולחיות מחמד. בואו נדבר על מה שמתאים לכם 👇';
  if (/אזור|הגעה|מתי|זמן/.test(m)) return 'אנחנו מגיעים לכל הארץ ללא עלות הגעה - בדרך כלל תוך 24-48 שעות. שלחו לנו את הכתובת ונתאם זמן 👇';
  if (/אחריות|שנים|תקלה|תיקון/.test(m)) return 'אחריות יצרן 5 שנים על הפרופיל, 3 שנים על המנוע, שנה מלאה על העבודה. תיקונים תוך 48 שעות 👇';
  if (/שלום|היי|הי|אהלן/.test(m)) return 'שלום! 😊 אני כאן לעזור עם כל שאלה על תריסים, רשתות או הצעת מחיר. מה הייתם רוצים לדעת?';
  if (/תודה/.test(m)) return 'בבקשה! 🙏 לכל שאלה נוספת אנחנו זמינים בוואטסאפ 👇';
  return 'תודה על השאלה! עדיף לדבר עם מנחם ישירות שיוכל לתת לכם תשובה מפורטת 👇';
}

function AIChat({ t }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role:"bot",text:"שלום! 👋 אני העוזר הווירטואלי של מנחם אלומיניום.\nאיך אפשר לעזור היום?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  useEffect(()=>{ if(scrollRef.current) scrollRef.current.scrollTop=scrollRef.current.scrollHeight; },[messages,loading]);
  const send = async () => {
    if (!input.trim()||loading) return;
    const userMsg=input.trim(); setInput("");
    setMessages(m=>[...m,{role:"user",text:userMsg}]); setLoading(true);
    await new Promise(r=>setTimeout(r,600));
    setMessages(m=>[...m,{role:"bot",text:getCannedReply(userMsg,t.whatsapp)}]);
    setLoading(false);
  };
  return (
    <>
      <button onClick={()=>setOpen(!open)} style={{ position:"fixed",bottom:24,right:24,zIndex:100,width:60,height:60,borderRadius:"50%",background:open?P.surface:`linear-gradient(135deg,${P.accent},${P.accent2})`,color:open?P.text:P.bg,border:`1px solid ${P.border}`,cursor:"pointer",display:"grid",placeItems:"center",boxShadow:"0 12px 32px rgba(0,0,0,.4)",transition:"all .25s" }}>
        {open?<Icon name="close" size={22}/>:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={P.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>}
      </button>
      {open && (
        <div style={{ position:"fixed",bottom:96,right:24,zIndex:100,width:380,maxWidth:"calc(100vw - 48px)",height:540,maxHeight:"calc(100vh - 140px)",background:P.bg2,border:`1px solid ${P.border}`,borderRadius:20,overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 24px 60px rgba(0,0,0,.5)",animation:"fadeUp .25s ease" }}>
          <div style={{ padding:"18px 20px",background:`linear-gradient(135deg,${P.surface},${P.surface2})`,borderBottom:`1px solid ${P.border}`,display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:`linear-gradient(135deg,${P.accent},${P.accent2})`,display:"grid",placeItems:"center",color:P.bg,fontWeight:800,fontSize:18,position:"relative" }}>
              מ<span style={{ position:"absolute",bottom:2,left:2,width:10,height:10,borderRadius:"50%",background:"#22c55e",border:`2px solid ${P.surface}`,boxShadow:"0 0 8px #22c55e" }}/>
            </div>
            <div><div style={{ fontSize:15,fontWeight:700,color:P.text }}>עוזר וירטואלי</div><div style={{ fontSize:11,color:P.muted }}>מענה מיידי · 24/7</div></div>
          </div>
          <div ref={scrollRef} style={{ flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12 }}>
            {messages.map((m,i)=>(
              <div key={i} style={{ alignSelf:m.role==="user"?"flex-start":"flex-end",maxWidth:"85%",padding:"10px 14px",borderRadius:14,background:m.role==="user"?P.accent:P.surface,color:m.role==="user"?P.bg:P.text,fontSize:14,lineHeight:1.55,whiteSpace:"pre-wrap",border:m.role==="user"?"none":`1px solid ${P.border}`,borderBottomLeftRadius:m.role==="user"?14:4,borderBottomRightRadius:m.role==="user"?4:14 }}>{m.text}</div>
            ))}
            {loading && <div style={{ alignSelf:"flex-end",padding:"12px 16px",borderRadius:14,background:P.surface,border:`1px solid ${P.border}`,display:"flex",gap:4 }}>{[0,1,2].map(i=><span key={i} style={{ width:6,height:6,borderRadius:"50%",background:P.muted,animation:`pulse 1.4s ease-in-out ${i*0.2}s infinite` }}/>)}</div>}
          </div>
          <div style={{ padding:12,borderTop:`1px solid ${P.border}`,display:"flex",gap:8 }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="כתוב שאלה..." style={{ flex:1,padding:"10px 14px",borderRadius:10,background:P.surface,color:P.text,border:`1px solid ${P.border}`,fontSize:14,fontFamily:"inherit",outline:"none" }}/>
            <button onClick={send} style={{ padding:"10px 16px",borderRadius:10,background:`linear-gradient(135deg,${P.accent},${P.accent2})`,color:P.bg,border:"none",cursor:"pointer",fontWeight:700,fontSize:14 }}>שלח</button>
          </div>
          <div style={{ padding:"8px 16px 12px",textAlign:"center" }}>
            <a href={`https://wa.me/${t.whatsapp}`} target="_blank" rel="noopener" onClick={(e)=>waClick(e,t.whatsapp)} style={{ fontSize:12,color:"#25d366",fontWeight:600,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:4 }}><Icon name="wa" size={14} stroke="#25d366"/>מעדיף לדבר ישירות? וואטסאפ</a>
          </div>
        </div>
      )}
    </>
  );
}

// ============ MAIN EXPORT ============
export default function AluminumSite({ settings = {}, galleryItems = [] }) {
  const t = {
    businessName: settings.businessName || 'מנחם אלומיניום',
    phone:        settings.phone        || '050-5345601',
    whatsapp:     settings.whatsapp     || '972505345601',
    email:        settings.email        || 'info@menahem-aluminum.co.il',
    heroTitle:    settings.heroTitle    || 'תריסים, רשתות ועבודות אלומיניום בסטנדרט גבוה.',
    heroSubtitle: settings.heroSubtitle || 'למעלה מ-20 שנה אנחנו מתקינים, מתקנים ומחדשים תריסים, רשתות, חלונות ופרגולות בכל רחבי הארץ.',
    promoBannerText:   settings.promoBannerText   || 'מבצע מיוחד - צרו קשר לפרטים',
    promoBannerActive: settings.promoBannerActive,
    yearsExperience:   settings.yearsExperience   || '20+',
    totalInstallations: settings.totalInstallations || '4,800+',
    googleRating:      settings.googleRating       || '5★',
    showPriceEstimator: settings.showPriceEstimator !== 'false',
  };

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.background = P.bg;
    document.body.style.background = P.bg;
    document.body.style.color = P.text;
  }, []);

  return (
    <div style={{ background:P.bg, minHeight:"100vh", direction:"rtl", fontFamily:"'Heebo','Assistant',system-ui,sans-serif" }}>
      <PromoBanner t={t}/>
      <Nav t={t} setOpen={setMenuOpen}/>
      <Hero t={t}/>
      <Services t={t}/>
      <ProductTypes t={t}/>
      <WhyUs/>
      {t.showPriceEstimator && <PriceEstimator t={t}/>}
      <Gallery galleryItems={galleryItems}/>
      <IsraelMap t={t}/>
      <Testimonials/>
      <BlogSection t={t}/>
      <AreasSection/>
      <FAQSection/>
      <Contact t={t}/>
      <Footer t={t}/>
      <FloatingWA t={t}/>
      <AIChat t={t}/>
      <MobileMenu t={t} open={menuOpen} setOpen={setMenuOpen}/>
    </div>
  );
}
