import React from 'react';

export function Footer() {
  return (
    <footer id="about" className="py-12 md:py-16 text-center border-t border-[var(--border)] bg-[var(--muted)]/40 mt-8 relative overflow-hidden" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">About this project</h2>
      <div className="mx-auto max-w-4xl px-6 lg:px-8 flex flex-col items-center">
        <div className="inline-flex text-[10px] uppercase font-bold tracking-widest text-[var(--primary-dark)] bg-white px-3 py-1 rounded-full mb-4 shadow-sm border border-[var(--border)]" aria-hidden="true">
          College Project
        </div>
        
        <h3 className="text-lg md:text-xl font-bold text-[var(--foreground)] mb-2">Machine Learning Subject</h3>
        
        <p className="max-w-2xl text-[var(--muted-foreground)] text-sm md:text-base mb-8 border-b border-[var(--border)] pb-8 px-4">
          This was a college project for a machine learning subject developed by <strong className="text-[var(--foreground)] font-semibold">Vaibhav Sharma</strong>, <strong className="text-[var(--foreground)] font-semibold">Laksh Sharma</strong>, and <strong className="text-[var(--foreground)] font-semibold">Rishika Singh</strong>.
        </p>

        <p className="max-w-2xl text-xs md:text-sm text-[var(--muted-foreground)] mb-6 px-4 leading-relaxed">
          The dashboard visualizes a machine learning project trained on the <a href="https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--primary-dark)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-sm">Kaggle Credit Card Fraud Detection</a> dataset. 
          The dataset contains transactions made by European cardholders in September 2013, presenting 492 frauds out of 284,807 transactions over two days.
        </p>

        <div className="bg-white/50 border border-[var(--border)] rounded-lg p-4 max-w-xl w-full text-left mx-6 sm:mx-0 shadow-sm mb-6 text-xs sm:text-sm">
          <h4 className="font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide text-[10px]">Target Class Definition</h4>
          <ul className="text-[var(--muted-foreground)] space-y-1.5 list-disc pl-4">
            <li><strong>Class 0 (Negative):</strong> Legitimate, normal transaction (99.828%).</li>
            <li><strong>Class 1 (Positive):</strong> Fraudulent, malicious transaction (0.172%).</li>
          </ul>
        </div>
        
        <p className="text-[10px] md:text-xs text-[var(--muted-foreground)] opacity-70 mt-6" aria-label="Copyright">
          © {new Date().getFullYear()} FraudLens.ai — Enterprise ML Security.
        </p>
      </div>
    </footer>
  );
}
