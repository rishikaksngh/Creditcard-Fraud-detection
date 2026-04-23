import React from 'react';
import { Card, CardContent } from '../ui';
import { TiltCard } from '../ui/tilt-card';
import { Activity, ShieldCheck, AlertOctagon, TrendingUp, Cpu, Database, CheckCircle } from 'lucide-react';
import * as motion from 'motion/react-client';

const metrics = [
  {
    title: "Total Transactions",
    value: "284,807",
    subtitle: "Kaggle Dataset",
    icon: <Database size={20} className="text-[var(--muted-foreground)]" />,
    trend: null
  },
  {
    title: "Fraud Rate",
    value: "0.17%",
    subtitle: "492 Fraudulent",
    icon: <AlertOctagon size={20} className="text-[var(--destructive)]" />,
    trend: "Highly Imbalanced"
  },
  {
    title: "Best F1-Score",
    value: "0.85",
    subtitle: "Random Forest",
    icon: <Cpu size={20} className="text-[var(--primary-dark)]" />,
    trend: "+2% vs Baseline"
  },
  {
    title: "Recommended Model",
    value: "Random Forest",
    subtitle: "Optimal for precision",
    icon: <CheckCircle size={20} className="text-[var(--success)]" />,
    trend: null
  }
];

export function OverviewCards() {
  return (
    <section id="overview" className="py-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Key Performance Indicators">
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
    </section>
  );
}
