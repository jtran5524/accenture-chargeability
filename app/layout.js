import './globals.css';
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

export const metadata = {
  title: 'Accenture Chargeability & Bench Risk Forecaster',
  description: 'Calculate your chargeability and assess bench risk based on forecasted hours',
  other: {
    'google-adsense-account': 'ca-pub-6582503154261059',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6582503154261059"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
