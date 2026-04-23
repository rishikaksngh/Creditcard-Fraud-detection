import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui';
import { TiltCard } from '../ui/tilt-card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, AreaChart, Area } from 'recharts';

const classDistData = [
  { name: 'Legitimate', count: 284315 },
  { name: 'Fraud', count: 492 },
];

const rocData = [
  { fpr: 0, tpr: 0 },
  { fpr: 5, tpr: 80 },
  { fpr: 10, tpr: 88 },
  { fpr: 20, tpr: 94 },
  { fpr: 50, tpr: 98 },
  { fpr: 100, tpr: 100 },
];

const featureImportance = [
  { feature: 'V14', importance: 0.28 },
  { feature: 'V4', importance: 0.15 },
  { feature: 'V12', importance: 0.12 },
  { feature: 'V10', importance: 0.10 },
  { feature: 'V17', importance: 0.08 },
  { feature: 'V11', importance: 0.06 },
];

export function VisualInsights() {
  return (
    <section id="visual-insights" className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10" aria-labelledby="visual-insights-heading">
      <div className="mb-10 text-center sm:text-left">
        <h2 id="visual-insights-heading" className="font-sans text-3xl font-bold tracking-tight">Visual Insights</h2>
        <p className="mt-2 text-[var(--muted-foreground)]">Exploratory data analysis & model explainability.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        
        <TiltCard>
          <Card className="border-[var(--border)] overflow-hidden h-full shadow-sm focus-within:ring-2 focus-within:ring-[var(--primary)]" style={{ transformStyle: 'preserve-3d' }}>
            <CardHeader style={{ transform: "translateZ(20px)" }}>
              <CardTitle className="text-base" id="class-imbalance-title">Transaction Class Imbalance (Log Scale)</CardTitle>
            </CardHeader>
            <CardContent className="h-64 pt-4" style={{ transform: "translateZ(30px)" }} aria-labelledby="class-imbalance-title" role="img" aria-label="Bar chart showing massive class imbalance between legitimate and fraudulent transactions">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classDistData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                  <XAxis type="number" scale="log" domain={['dataMin', 'dataMax']} hide />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={40}>
                    {classDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Fraud' ? 'var(--destructive)' : 'var(--success)'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TiltCard>

        <TiltCard>
          <Card className="border-[var(--border)] overflow-hidden h-full shadow-sm focus-within:ring-2 focus-within:ring-[var(--primary)]" style={{ transformStyle: 'preserve-3d' }}>
            <CardHeader style={{ transform: "translateZ(20px)" }}>
              <CardTitle className="text-base" id="feature-importance-title">Top Feature Importance (Random Forest)</CardTitle>
            </CardHeader>
            <CardContent className="h-64 pt-4" style={{ transform: "translateZ(30px)" }} aria-labelledby="feature-importance-title" role="img" aria-label="Bar chart displaying the top PCA features used by the Random Forest model to determine fraud">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportance} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                  <XAxis dataKey="feature" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Bar dataKey="importance" fill="var(--primary-dark)" radius={[4, 4, 0, 0]} fillOpacity={0.8} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TiltCard>

        <TiltCard className="md:col-span-2 lg:col-span-2">
          <Card className="border-[var(--border)] overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[var(--primary)]" style={{ transformStyle: 'preserve-3d' }}>
            <CardHeader style={{ transform: "translateZ(20px)" }}>
              <CardTitle className="text-base" id="roc-curve-title">ROC Curve (Receiver Operating Characteristic)</CardTitle>
            </CardHeader>
            <CardContent className="h-72 pt-4" style={{ transform: "translateZ(30px)" }} aria-labelledby="roc-curve-title" role="img" aria-label="Area chart showing the ROC curve, illustrating the trade-off between True Positive Rate and False Positive Rate">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rocData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTpr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-dark)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary-dark)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="fpr" tick={{ fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}% FPR`} />
                  <YAxis tick={{ fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} formatter={(value) => [`${value}% TPR`, 'True Positive Rate']} />
                  <Area type="monotone" dataKey="tpr" stroke="var(--primary-dark)" strokeWidth={3} fillOpacity={1} fill="url(#colorTpr)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TiltCard>

      </div>
    </section>
  );
}
