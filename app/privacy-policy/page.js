'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="main">
      <div className="stars"></div>
      <div className="container">
        <header className="header">
          <div className="logo-glow"></div>
          <h1 className="title">Privacy Policy</h1>
          <div className="header-buttons">
            <Link href="/" className="pill pill-link">
              Accenture · North America
            </Link>
            <Link href="/india" className="pill pill-faq">
              Accenture · India
            </Link>
            <Link href="/europe" className="pill pill-faq">
              Accenture · Europe
            </Link>
            <Link href="/faq" className="pill pill-faq">
              FAQ
            </Link>
            <Link href="/other-countries" className="pill pill-faq">
              Other Countries
            </Link>
            <span className="pill pill-static">Privacy Policy</span>
          </div>
        </header>

        <div className="policy-container">
          <div className="policy-card">
            <p className="policy-updated">Last updated: November 30, 2025</p>
            
            <p className="policy-intro">
              This website provides informational tools for users and is independently operated. We respect your privacy and are committed to being transparent about the data that may be collected while you use this website.
            </p>

            <section className="policy-section">
              <h2>Advertising and Cookies</h2>
              <p>
                This website uses third-party advertising networks, including Google AdSense, to display ads. These networks may use cookies, web beacons, or similar technologies to:
              </p>
              <ul>
                <li>Deliver personalized and non-personalized ads</li>
                <li>Measure ad performance</li>
                <li>Prevent ad fraud</li>
              </ul>
              <p>
                Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this or other websites.
              </p>
              <p>
                Users may opt out of personalized advertising by visiting Google's Ads Settings:<br />
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                  https://www.google.com/settings/ads
                </a>
              </p>
              <p>
                For more information about how Google uses data in advertising:<br />
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
                  https://policies.google.com/technologies/ads
                </a>
              </p>
            </section>

            <section className="policy-section">
              <h2>Information We Collect</h2>
              <p>
                This website does not collect or store personal information such as names, emails, passwords, phone numbers, login credentials, or account details.
              </p>
              <p>
                However, non-personally identifiable information may be automatically collected for analytics and performance, including:
              </p>
              <ul>
                <li>Browser type</li>
                <li>Device type</li>
                <li>General geographic region (country/city)</li>
                <li>Pages visited</li>
                <li>Time spent on the website</li>
              </ul>
              <p>
                This information cannot be used to personally identify you.
              </p>
            </section>

            <section className="policy-section">
              <h2>External Links</h2>
              <p>
                This website may contain links to external third-party websites. We are not responsible for the content or privacy practices of those websites.
              </p>
            </section>

            <section className="policy-section">
              <h2>Children's Policy</h2>
              <p>
                This website is not intended for individuals under 13 years of age. We do not knowingly collect personal information from children. If you believe we may have collected information about a minor, please contact us for removal.
              </p>
            </section>

            <section className="policy-section">
              <h2>Contact</h2>
              <p>
                If you have questions or privacy concerns, you may contact us at:
              </p>
              <p className="contact-email">
                📧 <a href="mailto:tranj3441@gmail.com">tranj3441@gmail.com</a>
              </p>
            </section>
          </div>

          <div className="back-section">
            <Link href="/" className="back-btn">
              ← Back to Calculator
            </Link>
          </div>
        </div>

        <footer className="disclaimer">
          <p>
            ⚠️ This is a heuristic for personal planning only. It is not official HR logic.
          </p>
        </footer>
      </div>
    </main>
  );
}

