import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Label, Button, ManagedTabs, TabsList, TabsTrigger, TabsContent, Badge, Progress, useToast } from '../ui';
import { Upload, Play, AlertTriangle, ShieldCheck, FileSpreadsheet, Activity, Cpu } from 'lucide-react';
import * as motion from 'motion/react-client';

interface PredictionResult {
  predicted_class: number;
  predicted_label: string;
  fraud_probability: number;
  confidence: number;
  model_used: string;
  risk_level: string;
  short_reason: string;
}

interface SampleTransaction {
  Time: number;
  V1: number;
  V2: number;
  V3: number;
  V4: number;
  V5: number;
  V6: number;
  V7: number;
  V8: number;
  V9: number;
  V10: number;
  V11: number;
  V12: number;
  V13: number;
  V14: number;
  V15: number;
  V16: number;
  V17: number;
  V18: number;
  V19: number;
  V20: number;
  V21: number;
  V22: number;
  V23: number;
  V24: number;
  V25: number;
  V26: number;
  V27: number;
  V28: number;
  Amount: number;
}

const featureFields = [
  { id: 'Time', label: 'Time (Seconds)', defaultValue: 120 },
  { id: 'V1', label: 'V1', defaultValue: -1.5 },
  { id: 'V2', label: 'V2', defaultValue: 0.2 },
  { id: 'V3', label: 'V3', defaultValue: -0.5 },
  { id: 'V4', label: 'V4', defaultValue: 0.4 },
  { id: 'V5', label: 'V5', defaultValue: 0.3 },
  { id: 'V6', label: 'V6', defaultValue: -0.1 },
  { id: 'V7', label: 'V7', defaultValue: 0.2 },
  { id: 'V8', label: 'V8', defaultValue: -0.3 },
  { id: 'V9', label: 'V9', defaultValue: 0.1 },
  { id: 'V10', label: 'V10', defaultValue: -0.2 },
  { id: 'V11', label: 'V11', defaultValue: 0.3 },
  { id: 'V12', label: 'V12', defaultValue: -0.4 },
  { id: 'V13', label: 'V13', defaultValue: 0.2 },
  { id: 'V14', label: 'V14', defaultValue: -1.2 },
  { id: 'V15', label: 'V15', defaultValue: 0.1 },
  { id: 'V16', label: 'V16', defaultValue: -0.3 },
  { id: 'V17', label: 'V17', defaultValue: -0.8 },
  { id: 'V18', label: 'V18', defaultValue: 0.2 },
  { id: 'V19', label: 'V19', defaultValue: 0.1 },
  { id: 'V20', label: 'V20', defaultValue: 0.3 },
  { id: 'V21', label: 'V21', defaultValue: 0.2 },
  { id: 'V22', label: 'V22', defaultValue: -0.1 },
  { id: 'V23', label: 'V23', defaultValue: 0.1 },
  { id: 'V24', label: 'V24', defaultValue: 0.2 },
  { id: 'V25', label: 'V25', defaultValue: -0.3 },
  { id: 'V26', label: 'V26', defaultValue: 0.1 },
  { id: 'V27', label: 'V27', defaultValue: 0.2 },
  { id: 'V28', label: 'V28', defaultValue: -0.1 },
  { id: 'Amount', label: 'Amount ($)', defaultValue: 45 },
];

export function PredictSection() {
  const [prediction, setPrediction] = useState<'idle' | 'loading' | 'fraud' | 'safe'>('idle');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    featureFields.forEach(f => { initial[f.id] = f.defaultValue; });
    return initial;
  });
  const { addToast } = useToast();

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  const handleLoadSample = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/sample-transaction');
      const data = await res.json();
      const sample = data.transaction || data;
      const newForm: Record<string, number> = {};
      featureFields.forEach(f => { newForm[f.id] = sample[f.id] ?? f.defaultValue; });
      setFormData(newForm);
      addToast({ title: "Sample Loaded", description: "Sample transaction loaded from test set", variant: "default" });
    } catch (err) {
      addToast({ title: "Error", description: "Failed to load sample", variant: "destructive" });
    }
  };

  const handlePredict = async () => {
    setPrediction('loading');
    addToast({ title: "Analyzing Transaction", description: "Running data through ML model...", variant: "default" });

    try {
      const res = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Prediction failed');
      const data = await res.json();
      setResult(data);
      setPrediction(data.predicted_class === 1 ? 'fraud' : 'safe');

      if (data.predicted_class === 1) {
        addToast({ title: "Fraud Detected", description: `${(data.fraud_probability * 100).toFixed(1)}% probability`, variant: "destructive" });
      } else {
        addToast({ title: "Transaction Safe", description: "LEGITIMATE", variant: "success" });
      }
    } catch (err) {
      setPrediction('idle');
      addToast({ title: "Error", description: "Prediction failed", variant: "destructive" });
    }
  };

  const handleReset = () => {
    setPrediction('idle');
    setResult(null);
    const initial: Record<string, number> = {};
    featureFields.forEach(f => { initial[f.id] = f.defaultValue; });
    setFormData(initial);
  };

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData2 = new FormData();
    formData2.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/batch-predict', {
        method: 'POST',
        body: formData2
      });
      const data = await res.json();
      addToast({
        title: "Batch Complete",
        description: `${data.flagged_rows} of ${data.total_rows} flagged as fraud`,
        variant: data.flagged_rows > 0 ? "destructive" : "success"
      });
    } catch (err) {
      addToast({ title: "Error", description: "Batch prediction failed", variant: "destructive" });
    }
  };

  return (
    <section id="predict" className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="predict-heading">
      <div className="mb-10 text-center md:text-left">
        <h2 id="predict-heading" className="font-sans text-3xl font-bold tracking-tight">Run Prediction</h2>
        <p className="mt-2 text-[var(--muted-foreground)]">Evaluate transactions using live ML model predictions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <Card className="border-[var(--border)] overflow-hidden">
            <ManagedTabs defaultValue="single" className="w-full">
              <div className="border-b border-[var(--border)] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[var(--muted)] gap-4">
                <TabsList className="w-full sm:w-auto grid grid-cols-2" aria-label="Prediction mode selection">
                  <TabsTrigger value="single">Single Transaction</TabsTrigger>
                  <TabsTrigger value="batch">Batch Upload</TabsTrigger>
                </TabsList>
                <div className="text-xs font-mono text-[var(--muted-foreground)] self-end sm:self-auto" aria-live="polite">
                  Model: {result?.model_used || "Random Forest (Live)"}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <TabsContent value="single" className="mt-0 space-y-6">
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={handleLoadSample}>
                      Load Sample Transaction
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {featureFields.slice(0, 12).map(field => (
                      <div key={field.id} className="space-y-1">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <Input
                          id={field.id}
                          type="number"
                          step="0.01"
                          value={formData[field.id]}
                          onChange={e => handleInputChange(field.id, e.target.value)}
                          className="focus-visible:ring-[var(--primary)]"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button variant="ghost" onClick={handleReset} className="w-full sm:w-auto" aria-label="Clear all form fields">Clear Form</Button>
                    <Button onClick={handlePredict} disabled={prediction === 'loading'} className="w-full sm:w-auto px-8 flex gap-2 group shadow-md hover:shadow-lg transition-all" aria-live="polite">
                      {prediction === 'loading' ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-[var(--primary-foreground)] animate-spin" aria-hidden="true"></span>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Play size={16} className="group-hover:scale-110 transition-transform" aria-hidden="true" /> Predict Fraud
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="batch" className="mt-0">
                  <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center hover:bg-[var(--muted)] hover:border-[var(--primary)] transition-all cursor-pointer group relative focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--primary)]">
                    <input
                      type="file"
                      accept=".csv"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleBatchUpload}
                      aria-label="Upload CSV file for batch prediction"
                    />
                    <div className="h-16 w-16 rounded-full bg-[var(--muted)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                      <FileSpreadsheet size={32} className="text-[var(--muted-foreground)] group-hover:text-[var(--primary-dark)] transition-colors" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Select CSV file</h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-6 max-w-sm px-4">
                      Upload a dataset with Time, V1-V28, Amount columns
                    </p>
                    <Button variant="outline" className="gap-2 group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors pointer-events-none">
                      <Upload size={16} aria-hidden="true" /> Browse Files
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </ManagedTabs>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full border-[var(--border)] bg-[var(--card)] shadow-sm flex flex-col overflow-hidden" aria-live="polite" aria-atomic="true">
            <CardHeader className="bg-[var(--muted)]/50 border-b border-[var(--border)]">
              <CardTitle>Prediction Result</CardTitle>
              <CardDescription>Live API prediction</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[300px]">
              {prediction === 'idle' && (
                <div className="text-[var(--muted-foreground)] flex flex-col items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    aria-hidden="true"
                  >
                    <Activity size={48} className="opacity-20" />
                  </motion.div>
                  <p>Enter transaction data or load a sample...</p>
                </div>
              )}

              {prediction === 'loading' && (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative flex items-center justify-center" style={{ perspective: '1000px' }} aria-hidden="true">
                    <div className="w-24 h-24 border-4 border-[var(--border)] rounded-full absolute"></div>
                    <div className="w-24 h-24 border-4 border-t-[var(--primary-dark)] border-r-transparent border-b-transparent border-l-transparent rounded-full absolute animate-spin"></div>
                    <motion.div animate={{ rotateY: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                      <Cpu size={32} className="text-[var(--primary-dark)]" />
                    </motion.div>
                  </div>
                  <p className="font-mono text-sm uppercase tracking-widest text-[var(--muted-foreground)] animate-pulse">Running Model...</p>
                </div>
              )}

              {prediction === 'fraud' && result && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full" role="alert">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 bg-[var(--destructive)]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                    aria-hidden="true"
                  >
                    <AlertTriangle size={40} className="text-[var(--destructive)]" />
                  </motion.div>
                  <Badge variant="destructive" className="mb-4 text-base px-4 py-1.5 shadow-sm">FRAUDULENT</Badge>

                  <div className="w-full space-y-2 mt-4 text-left p-4 bg-[var(--muted)] rounded-lg border border-[var(--destructive)]/30">
                    <div className="flex justify-between text-sm items-center mb-2">
                      <span className="text-[var(--muted-foreground)] pb-1">Fraud Probability</span>
                      <span className="font-mono font-bold text-[var(--destructive)] text-lg">{(result.fraud_probability * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={result.fraud_probability * 100} indicatorClassName="bg-[var(--destructive)]" className="h-2" />
                  </div>

                  <div className="mt-4 text-sm text-[var(--muted-foreground)] text-left w-full p-4 bg-[var(--muted)] rounded-lg border border-[var(--border)] relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--destructive)]" aria-hidden="true"></div>
                    <span className="font-semibold text-[var(--foreground)]">Reasoning:</span> {result.short_reason || result.risk_level}
                  </div>
                </motion.div>
              )}

              {prediction === 'safe' && result && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full" role="status">
                  <div className="w-24 h-24 bg-[var(--success)]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]" aria-hidden="true">
                    <ShieldCheck size={40} className="text-[var(--success)]" />
                  </div>
                  <Badge variant="success" className="mb-4 text-base px-4 py-1.5 shadow-sm bg-[var(--success)] text-[var(--primary-foreground)] hover:bg-[var(--success)]/90 border-transparent">LEGITIMATE</Badge>

                  <div className="w-full space-y-2 mt-4 text-left p-4 bg-[var(--muted)] rounded-lg border border-[var(--success)]/30">
                    <div className="flex justify-between text-sm items-center mb-2">
                      <span className="text-[var(--muted-foreground)]">Fraud Probability</span>
                      <span className="font-mono font-bold text-[var(--success)] text-lg">{(result.fraud_probability * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={result.fraud_probability * 100} indicatorClassName="bg-[var(--success)]" className="h-2" />
                  </div>

                  <div className="mt-4 text-sm text-[var(--muted-foreground)] text-left w-full p-4 bg-[var(--muted)] rounded-lg border border-[var(--border)] relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--success)]" aria-hidden="true"></div>
                    <span className="font-semibold text-[var(--foreground)]">Reasoning:</span> {result.short_reason || "No significant anomalies detected"}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}