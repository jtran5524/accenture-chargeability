import './globals.css';
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: 'Accenture Chargeability & Bench Risk Forecaster',
  description: 'Calculate your chargeability and assess bench risk based on forecasted hours',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
