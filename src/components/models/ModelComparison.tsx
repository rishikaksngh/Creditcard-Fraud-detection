import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Progress } from '../ui';
import { CheckCircle2, TrendingUp } from 'lucide-react';
import { TiltCard } from '../ui/tilt-card';
import * as motion from 'motion/react-client';

const models = [
  {
    name: "Random Forest",
    description: "Ensemble of decision trees",
    recommended: true,
    metrics: { accuracy: 99.96, precision: 95.0, recall: 82.5, f1: 88.3, roc: 98.7 }
  },
  {
    name: "Gradient Boosting",
    description: "Sequential tree building",
    recommended: false,
    metrics: { accuracy: 99.94, precision: 90.0, recall: 80.0, f1: 84.7, roc: 99.1 }
  },
  {
    name: "Logistic Regression",
    description: "Linear probability model",
    recommended: false,
    metrics: { accuracy: 99.92, precision: 87.0, recall: 61.0, f1: 71.7, roc: 97.4 }
  },
  {
    name: "Decision Tree",
    description: "Single tree split",
    recommended: false,
    metrics: { accuracy: 99.91, precision: 75.0, recall: 76.0, f1: 75.5, roc: 88.0 }
  }
];

function MetricBar({ label, value, isBest }: { label: string, value: number, isBest: boolean }) {
  return (
    <div className="space-y-1 py-1">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--muted-foreground)] uppercase tracking-wider">{label}</span>
        <span className={`font-mono font-medium ${isBest ? 'text-[var(--primary-dark)]' : 'text-[var(--foreground)]'}`}>
          {(value).toFixed(1)}%
        </span>
      </div>
      <Progress value={value} indicatorClassName={isBest ? "bg-[var(--primary)]" : "bg-[var(--muted-foreground)]/50"} className="h-1.5" />
    </div>
  );
}

export function ModelComparison() {
  return (
    <section id="models" className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="models-heading">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 id="models-heading" className="font-sans text-3xl font-bold tracking-tight">Model Performance</h2>
          <p className="mt-2 text-[var(--muted-foreground)]">Comparing baseline and ensemble learning approaches.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10" role="list" aria-label="Machine learning models comparison">
        {models.map((model, idx) => (
          <motion.div 
            key={model.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="h-full"
            role="listitem"
          >
            <TiltCard className="h-full" role="article" aria-labelledby={`model-heading-${idx}`}>
              <Card className={`h-full relative transition-all duration-300 ${model.recommended ? 'border-[var(--primary-dark)] border-2 shadow-[0_0_15px_rgba(182,236,244,0.3)]' : 'border-[var(--border)] bg-[var(--card)]'} cursor-default focus-within:ring-2 focus-within:ring-[var(--primary)]`} style={{ transformStyle: 'preserve-3d' }}>
                {model.recommended && (
                  <div className="absolute top-0 right-0 z-20" style={{ transform: "translateZ(30px)" }}>
                    <div className="bg-[var(--primary)] text-[var(--primary-foreground)] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg rounded-tr-lg flex items-center gap-1 shadow-sm" role="status" aria-label="Recommended model">
                      <CheckCircle2 size={12} aria-hidden="true" /> Recommended
                    </div>
                  </div>
                )}
                
                <CardHeader className="pb-4" style={{ transform: "translateZ(20px)" }}>
                  <CardTitle id={`model-heading-${idx}`} className="text-lg">{model.name}</CardTitle>
                  <p className="text-xs text-[var(--muted-foreground)]">{model.description}</p>
                </CardHeader>
                <CardContent className="space-y-3" style={{ transform: "translateZ(30px)" }}>
                  <MetricBar label="Accuracy" value={model.metrics.accuracy} isBest={model.recommended} />
                  <MetricBar label="Precision" value={model.metrics.precision} isBest={model.recommended} />
                  <MetricBar label="Recall" value={model.metrics.recall} isBest={model.name === "Gradient Boosting"} />
                  <MetricBar label="F1-Score" value={model.metrics.f1} isBest={model.recommended} />
                  <MetricBar label="ROC-AUC" value={model.metrics.roc} isBest={model.name === "Gradient Boosting"} />
                </CardContent>
              </Card>
            </TiltCard>
          </motion.div>
        ))}
      </div>
      
      <Card className="mt-8 border-[var(--border)] bg-[var(--muted)] relative z-0" role="region" aria-label="Recommendation explanation">
        <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex bg-[var(--primary)]/30 p-3 rounded-full text-[var(--primary-dark)]" aria-hidden="true">
            <TrendingUp size={24} />
          </div>
          <div>
            <h4 className="font-semibold mb-1">Why Random Forest?</h4>
            <p className="text-sm text-[var(--muted-foreground)]">
              In highly imbalanced datasets like credit card fraud (0.17% fraud rate), <strong>Accuracy is misleading</strong>. 
              Random Forest achieves the best <strong>F1-Score (balance of precision and recall)</strong>, meaning it catches fraud effectively without blocking too many legitimate transactions.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
