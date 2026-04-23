import React from 'react';
import { ShieldAlert, Fingerprint, Network, Scale } from 'lucide-react';
import { TiltCard } from '../ui';

export function ExplainabilityPanel() {
  return (
    <section id="insights" className="py-16 bg-[var(--muted)]/20 border-y border-[var(--border)]" aria-labelledby="insights-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h2 id="insights-heading" className="font-sans text-3xl font-bold tracking-tight">How it works</h2>
          <p className="mt-2 text-[var(--muted-foreground)]">Understanding machine learning decisions in fraud detection.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" role="list">
          <TiltCard role="listitem">
            <div className="space-y-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm h-full hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-[var(--primary)]" style={{ transformStyle: 'preserve-3d' }}>
              <div className="w-12 h-12 rounded-lg bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[var(--primary-dark)]" style={{ transform: "translateZ(40px)" }} aria-hidden="true">
                <Fingerprint size={24} />
              </div>
              <div style={{ transform: "translateZ(20px)" }}>
                <h3 className="text-lg font-semibold">1. Feature Extraction</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mt-2">
                  Transactions are broken down into principal components (PCA). Features like <strong>V14</strong>, <strong>V12</strong>, and <strong>V4</strong> hold the strongest mathematical signals for fraudulent patterns.
                </p>
              </div>
            </div>
          </TiltCard>

          <TiltCard role="listitem">
            <div className="space-y-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm h-full hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-[var(--primary)]" style={{ transformStyle: 'preserve-3d' }}>
              <div className="w-12 h-12 rounded-lg bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[var(--primary-dark)]" style={{ transform: "translateZ(40px)" }} aria-hidden="true">
                <Network size={24} />
              </div>
              <div style={{ transform: "translateZ(20px)" }}>
                <h3 className="text-lg font-semibold">2. Ensemble Analysis</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mt-2">
                  The <strong>Random Forest model</strong> feeds the transaction data through 100 individual decision trees. Each tree votes on whether the transaction looks safe or suspicious.
                </p>
              </div>
            </div>
          </TiltCard>

          <TiltCard role="listitem">
            <div className="space-y-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm h-full hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-[var(--primary)]" style={{ transformStyle: 'preserve-3d' }}>
              <div className="w-12 h-12 rounded-lg bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[var(--primary-dark)]" style={{ transform: "translateZ(40px)" }} aria-hidden="true">
                <Scale size={24} />
              </div>
              <div style={{ transform: "translateZ(20px)" }}>
                <h3 className="text-lg font-semibold">3. Probability Scoring</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mt-2">
                  Votes are aggregated into a final <strong>Fraud Probability</strong>. If over 50% of the trees flag the transaction, the system categorizes it as a potential security risk.
                </p>
              </div>
            </div>
          </TiltCard>

          <TiltCard role="listitem">
            <div className="space-y-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm h-full hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-[var(--primary)]" style={{ transformStyle: 'preserve-3d' }}>
              <div className="w-12 h-12 rounded-lg bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[var(--primary-dark)]" style={{ transform: "translateZ(40px)" }} aria-hidden="true">
                <ShieldAlert size={24} />
              </div>
              <div style={{ transform: "translateZ(20px)" }}>
                <h3 className="text-lg font-semibold">4. F1-Score Focus</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mt-2">
                   We prioritize the <strong>F1 metric</strong> to minimize False Positives (declining a legitimate user) while maximizing Recall (catching actual fraud).
                </p>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
