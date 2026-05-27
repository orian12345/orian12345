export const CONTENT_DEFAULTS = {
  businessName:      { value: 'מנחם אלומיניום',                  label: 'שם העסק',                        type: 'text' },
  phone:             { value: '050-5345601',                       label: 'טלפון (לתצוגה)',                  type: 'text' },
  whatsapp:          { value: '972505345601',                      label: 'וואטסאפ (פורמט: 972XXXXXXXXX)',  type: 'text' },
  email:             { value: 'info@menahem-aluminum.co.il',       label: 'אימייל',                          type: 'text' },
  heroTitle:         { value: 'תריסים, רשתות ועבודות אלומיניום בסטנדרט גבוה.', label: 'כותרת הירו',       type: 'text' },
  heroSubtitle:      { value: 'למעלה מ-20 שנה אנחנו מתקינים, מתקנים ומחדשים תריסים, רשתות, חלונות ופרגולות בכל רחבי הארץ. עבודה מקצועית, חומרים איכותיים ואחריות מלאה.', label: 'תיאור קצר בהירו', type: 'textarea' },
  promoBannerText:   { value: 'מבצע סוף חודש: 15% הנחה על כל מנוע חשמלי + התקנה ללא עלות', label: 'טקסט באנר מבצע', type: 'text' },
  promoBannerActive: { value: 'true',                              label: 'הצג באנר מבצע',                  type: 'boolean' },
  yearsExperience:   { value: '20+',                               label: 'שנות ניסיון (הירו)',              type: 'text' },
  totalInstallations:{ value: '4,800+',                            label: 'מספר התקנות (הירו)',              type: 'text' },
  googleRating:      { value: '5★',                                label: 'דירוג גוגל (הירו)',               type: 'text' },
  showPriceEstimator:{ value: 'true',                              label: 'הצג מחשבון מחיר',                 type: 'boolean' },
};

export function mergeWithDefaults(dbContent) {
  const result = {};
  for (const [key, def] of Object.entries(CONTENT_DEFAULTS)) {
    const dbRow = dbContent?.find(r => r.key === key);
    result[key] = dbRow ? dbRow.value : def.value;
  }
  return result;
}
