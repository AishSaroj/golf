import React from 'react';
import { Navbar } from '../../components/layout/Navbar';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-obsidian text-text-primary">
      <Navbar />
      <div className="pt-32 max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-display font-bold mb-8">How it Works</h1>
        <div className="space-y-6 text-text-secondary leading-relaxed">
          <p>
            When you subscribe to Golf Charity Platform, a portion of your subscription goes directly
            to your chosen charity. The rest goes into our massive monthly prize pool.
          </p>
          <div className="p-6 bg-surface-2 rounded-xl mt-8 border border-border">
             <h3 className=" text-black font-bold mb-4 font-display">1. Play Golf and Enter Scores</h3>
             <p>Submit up to 5 Stableford scores per month from any official course. Your scores form your "ticket" for the monthly draw.</p>
          </div>
          <div className="p-6 bg-surface-2 rounded-xl mt-4 border border-border">
             <h3 className="text-black font-bold mb-4 font-display">2. Support Charities</h3>
             <p>Select which verified golf-affiliated charity receives your monthly direct contribution percentage.</p>
          </div>
          <div className="p-6 bg-surface-2 rounded-xl mt-4 border border-border">
             <h3 className="text-black font-bold mb-4 font-display">3. Match and Win</h3>
             <p>At the end of the month, 5 numbers are drawn. Match 3, 4, or all 5 numbers from your scores to win huge cash prizes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
