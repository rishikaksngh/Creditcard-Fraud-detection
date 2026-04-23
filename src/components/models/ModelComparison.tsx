import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Progress } from '../ui';
import { CheckCircle2, TrendingUp } from 'lucide-react';
import { TiltCard } from '../ui/tilt-card';
import * as motion from 'motion/react-client';

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
}

interface MetricsData {
  [model: string]: ModelMetrics;
}

interface SummaryData {
  recommended_model: string;
  best_f1_model: string;
  best_auc_model: string;
  fraud_percentage: number;
}

function MetricBar({ label, value, isBest }: { label: string, value: number, isBest: boolean }) {
  return (
    <div className="space-y-1 py-1">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--muted-foreground)] uppercase tracking-wider">{label}</span>
        <span className={`font-mono font-medium ${isBest ? 'text-[var(--primary-dark)]' : 'text-[var(--foreground)]'}`}>
          {(value * 100).toFixed(1)}%
        </span>
      </div>
      <Progress value={value * 100} indicatorClassName={isBest ? "bg-[var(--primary)]" : "bg-[var(--muted-foreground)]/50"} className="h-1.5" />
    </div>
  );
}

const modelDescriptions: Record<string, string> = {
  "Random Forest": "Ensemble of 100 decision trees",
  "Gradient Boosting": "Sequential tree building",
  "Logistic Regression": "Linear probability model",
  "Decision Tree": "Single tree split"
};

export function ModelComparison() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/api/metrics').then(r => r.json()),
      fetch('http://localhost:8000/api/summary').then(r => r.json())
    ])
      .then(([metricsData, summaryData]) => {
        setMetrics(metricsData);
        setSummary(summaryData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <section id="models" className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-red-500">Error loading metrics: {error}</div>
      </section>
    );
  }

  if (loading || !metrics || !summary) {
    return (
      <section id="models" className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">Loading metrics...</div>
      </section>
    );
  }

  const modelList = Object.entries(metrics).map(([name, m]) => ({
    name,
    metrics: m,
    recommended: name === summary.recommended_model,
    isBestF1: name === summary.best_f1_model,
    isBestAUC: name === summary.best_auc_model
  }));

  return (
    <section id="models" className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="models-heading">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 id="models-heading" className="font-sans text-3xl font-bold tracking-tight">Model Performance</h2>
          <p className="mt-2 text-[var(--muted-foreground)]">Live model metrics from backend API.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10" role="list" aria-label="Machine learning models comparison">
        {modelList.map((model, idx) => (
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
                  <p className="text-xs text-[var(--muted-foreground)]">{modelDescriptions[model.name] || "ML Model"}</p>
                </CardHeader>
                <CardContent className="space-y-3" style={{ transform: "translateZ(30px)" }}>
                  <MetricBar label="Accuracy" value={model.metrics.accuracy} isBest={model.isBestAUC} />
                  <MetricBar label="Precision" value={model.metrics.precision} isBest={model.isBestF1} />
                  <MetricBar label="Recall" value={model.metrics.recall} isBest={model.isBestF1} />
                  <MetricBar label="F1-Score" value={model.metrics.f1} isBest={model.isBestF1} />
                  <MetricBar label="ROC-AUC" value={model.metrics.roc_auc} isBest={model.isBestAUC} />
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
            <h4 className="font-semibold mb-1">Why {summary.recommended_model}?</h4>
            <p className="text-sm text-[var(--muted-foreground)]">
              In highly imbalanced datasets like credit card fraud ({summary.fraud_percentage}% fraud rate), <strong>Accuracy is misleading</strong>. 
              {summary.recommended_model} achieves the best <strong>F1-Score</strong>, meaning it catches fraud effectively without blocking too many legitimate transactions.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}