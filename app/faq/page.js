'use client';

import Link from 'next/link';

const faqs = [
  {
    question: "What is chargeability and why does it matter?",
    answer: "Chargeability is the percentage of your total work hours that are billed to client projects. At Accenture, it's a key metric used to evaluate utilization and is factored into performance reviews, staffing decisions, and workforce planning. Higher chargeability generally indicates strong demand for your skills."
  },
  {
    question: "Where do I find my YTD hours?",
    answer: "Go to portal.accenture.com/#/myinfo and find the Chargeability section. Click the + button under 'Chargeability' to expand it, then select 'Year to Date' to see your YTD hours. You'll see your chargeability percentage and the 'As of' date—use that date in this calculator. Make sure you're viewing Year to Date, not Month-to-Date."
  },
  {
    question: "What counts as 'bench' time?",
    answer: "Bench time refers to hours coded as 'Suspended & Unassigned' (S&U) in your timesheet. This is time when you're not assigned to any billable client project. It's different from PTO, training, or internal work—those have separate charge codes."
  },
  {
    question: "How does this calculator handle PTO and absences?",
    answer: "This calculator treats PTO and absences as neutral—they don't affect your chargeability calculation or risk assessment. In reality, Accenture's systems may handle PTO differently, but for personal planning purposes, we exclude it to keep the model simple and focused on billable vs. bench time."
  },
  {
    question: "What are the chargeability targets by level?",
    answer: "Based on typical Accenture North America expectations: Analyst targets around 80%, Senior Analyst around 85%, Consultant around 88%, and Manager around 90%. These can vary by market, practice, and business conditions. The 'critical' thresholds (where risk increases significantly) are typically 10-15% below target."
  },
  {
    question: "Why does 4+ weeks of bench increase my risk?",
    answer: "Extended bench time is a visibility trigger at Accenture. At 4+ weeks, you may appear on staffing reports reviewed by leadership. At 8+ weeks, you're typically flagged for more active management attention. This calculator reflects these thresholds in its risk assessment."
  },
  {
    question: "What's the difference between 'Current' and 'Projected' chargeability?",
    answer: "Current chargeability is your actual percentage as of today, based on hours already logged. Projected chargeability estimates what your percentage will be after adding the future bench weeks you've forecasted. This helps you see the potential impact before it happens."
  },
  {
    question: "Is this tool official Accenture HR logic?",
    answer: "No. This is a personal planning heuristic only. Actual HR decisions involve many factors not captured here: performance ratings, skill demand, market conditions, project pipeline, manager advocacy, and more. Use this tool to understand your chargeability trajectory, not to predict employment outcomes."
  },
  {
    question: "What should I do if my risk shows as HIGH?",
    answer: "Consider these actions: (1) Proactively reach out to your Career Counselor and Staffing, (2) Update your skills profile and availability, (3) Network with project managers in your practice, (4) Consider internal training or certifications that could expand your staffable skills, (5) Document any client work or proposals you're supporting that may not be captured in billable hours."
  },
  {
    question: "How accurate is this forecast?",
    answer: "The math is accurate based on your inputs. However, the future is uncertain—you might get staffed sooner than expected, or bench could extend longer. Use this as a planning tool to understand potential scenarios, not as a prediction. Re-run the calculator as your situation changes."
  },
];

export default function FAQPage() {
  return (
    <main className="main">
      <div className="stars"></div>
      <div className="container">
        <header className="header">
          <div className="logo-glow"></div>
          <h1 className="title">Frequently Asked Questions</h1>
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
            <span className="pill pill-static">FAQ</span>
            <Link href="/other-countries" className="pill pill-faq">
              Other Countries
            </Link>
            <Link href="/privacy-policy" className="pill pill-faq">
              Privacy Policy
            </Link>
          </div>
          <p className="subtitle">
            Everything you need to know about chargeability, bench time, and how this forecaster works.
          </p>
        </header>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-card">
              <h3 className="faq-question">{faq.question}</h3>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="back-section">
          <Link href="/" className="back-btn">
            ← Back to Calculator
          </Link>
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

