import './globals.css';

export const metadata = {
  title: 'מנחם אלומיניום | תריסים, רשתות ועבודות אלומיניום בכל הארץ',
  description: 'מנחם אלומיניום - תריסי גלילה, תריסים חשמליים, רשתות נגד יתושים, חלונות ופרגולות. עסק משפחתי עם 20 שנות ניסיון, אחריות מלאה והגעה לכל הארץ.',
  keywords: 'תריסים, תריסי גלילה, תריסים חשמליים, רשתות, רשתות יתושים, חלונות אלומיניום, פרגולה, מנחם אלומיניום',
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800;900&family=Assistant:wght@400;600;700&display=swap" rel="stylesheet"/>
        <meta name="theme-color" content="#0b0d10"/>
      </head>
      <body>{children}</body>
    </html>
  );
}
