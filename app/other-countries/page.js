'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const regions = ['Europe', 'India', 'Philippines', 'Latin America'];

export default function OtherCountriesPage() {
  const [votes, setVotes] = useState({});
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Check if user already voted (stored in localStorage)
  useEffect(() => {
    const hasVoted = localStorage.getItem('accenture-poll-voted');
    if (hasVoted) {
      setVoted(true);
      setSelectedRegion(hasVoted);
    }
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const res = await fetch('/api/votes');
      const data = await res.json();
      setVotes(data);
    } catch (error) {
      console.error('Failed to fetch votes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (region) => {
    if (voted) return;

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setVotes(data.votes);
        setVoted(true);
        setSelectedRegion(region);
        localStorage.setItem('accenture-poll-voted', region);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const getPercentage = (count) => {
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 100);
  };

  return (
    <main className="main">
      <div className="stars"></div>
      <div className="container">
        <header className="header">
          <div className="logo-glow"></div>
          <h1 className="title">Other Countries</h1>
          <div className="header-buttons">
            <Link href="/" className="pill pill-link">
              Accenture · North America
            </Link>
            <Link href="/india" className="pill pill-india">
              Accenture · India
            </Link>
            <Link href="/europe" className="pill pill-europe">
              Accenture · Europe
            </Link>
            <Link href="/faq" className="pill pill-faq">
              FAQ
            </Link>
            <span className="pill pill-static">Other Countries</span>
            <Link href="/privacy-policy" className="pill pill-faq">
              Privacy Policy
            </Link>
          </div>
          <p className="subtitle">
            Chargeability calculators for other Accenture regions.
          </p>
        </header>

        <div className="construction-container">
          <div className="construction-card">
            <div className="construction-icon">🚧</div>
            <h2 className="construction-title">Under Construction</h2>
            <p className="construction-text">
              We're working on adding chargeability calculators for other Accenture regions.
            </p>
            
            <div className="poll-section">
              <h3 className="poll-title">
                {voted ? "Thanks for voting! Here are the results:" : "Which region should we build next?"}
              </h3>
              <p className="poll-subtitle">
                {voted ? `You voted for ${selectedRegion}` : "Your vote helps us prioritize development"}
              </p>
              
              {loading ? (
                <p className="poll-loading">Loading poll...</p>
              ) : (
                <div className="poll-options">
                  {regions.map((region) => (
                    <button
                      key={region}
                      className={`poll-option ${voted ? 'voted' : ''} ${selectedRegion === region ? 'selected' : ''}`}
                      onClick={() => handleVote(region)}
                      disabled={voted}
                    >
                      <span className="poll-region">{region}</span>
                      {voted && (
                        <>
                          <div 
                            className="poll-bar" 
                            style={{ width: `${getPercentage(votes[region])}%` }}
                          />
                          <span className="poll-count">
                            {votes[region]} votes ({getPercentage(votes[region])}%)
                          </span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              )}
              
              {voted && (
                <p className="poll-total">Total votes: {totalVotes}</p>
              )}
            </div>

            <Link href="/" className="back-btn">
              ← Back to NA Calculator
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
