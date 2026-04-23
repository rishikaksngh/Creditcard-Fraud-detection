import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui';
import { TiltCard } from '../ui/tilt-card';
import { Database, AlertOctagon, Cpu, CheckCircle } from 'lucide-react';
import * as motion from 'motion/react-client';

interface SummaryData {
  total_transactions: number;
  legitimate_transactions: number;
  fraud_transactions: number;
  fraud_percentage: number;
  feature_count: number;
  best_f1_model: string;
  best_f1_score: number;
  best_auc_model: string;
  best_auc_score: number;
  recommended_model: string;
}

export function OverviewCards() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/summary')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const metrics = data ? [
    {
      title: "Total Transactions",
      value: data.total_transactions.toLocaleString(),
      subtitle: "Dataset",
      icon: <Database size={20} className="text-[var(--muted-foreground)]" />,
      trend: null
    },
    {
      title: "Fraud Rate",
      value: `${data.fraud_percentage}%`,
      subtitle: `${data.fraud_transactions.toLocaleString()} Fraudulent`,
      icon: <AlertOctagon size={20} className="text-[var(--destructive)]" />,
      trend: "Live Data"
    },
    {
      title: "Best F1-Score",
      value: data.best_f1_score.toFixed(2),
      subtitle: data.best_f1_model,
      icon: <Cpu size={20} className="text-[var(--primary-dark)]" />,
      trend: "Live Model"
    },
    {
      title: "Recommended Model",
      value: data.recommended_model,
      subtitle: "Based on F1-Score",
      icon: <CheckCircle size={20} className="text-[var(--success)]" />,
      trend: null
    }
  ] : [];

  if (error) {
    return (
      <section id="overview" className="py-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-red-500">Error loading data: {error}</div>
      </section>
    );
  }

  return (
    <section id="overview" className="py-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Key Performance Indicators">
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" role="list">
          {metrics.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="h-full"
              role="listitem"
            >
              <TiltCard className="h-full">
                <Card className="hover:border-[var(--primary)] transition-colors bg-[var(--card)] shadow-md h-full cursor-default focus-within:ring-2 focus-within:ring-[var(--primary)]" style={{ transformStyle: 'preserve-3d' }}>
                  <CardContent className="p-6 h-full flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
                    <div className="flex items-center justify-between space-y-0 pb-2">
                      <p className="text-sm font-medium text-[var(--muted-foreground)]" style={{ transform: "translateZ(20px)" }} id={`metric-${i}-title`}>
                        {m.title}
                      </p>
                      <div className="p-2 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)]" style={{ transform: "translateZ(40px)" }} aria-hidden="true">
                        {m.icon}
                      </div>
                    </div>
                    <div className="mt-4" style={{ transform: "translateZ(20px)" }}>
                      <div className="text-3xl font-bold tracking-tight font-mono" aria-labelledby={`metric-${i}-title`}>
                        {m.value}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-[var(--muted-foreground)] font-medium">
                        <span>{m.subtitle}</span>
                        {m.trend && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)]" aria-hidden="true"></span>
                            <span className={m.title === "Fraud Rate" ? "text-[var(--destructive)] shadow-sm" : "text-[var(--primary-dark)] shadow-sm"}>
                              <span className="sr-only">Trend: </span>{m.trend}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}