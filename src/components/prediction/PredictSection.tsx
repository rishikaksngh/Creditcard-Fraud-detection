import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Label, Button, ManagedTabs, TabsList, TabsTrigger, TabsContent, Badge, Progress, useToast } from '../ui';
import { Upload, Play, AlertTriangle, ShieldCheck, FileSpreadsheet, Activity, Cpu } from 'lucide-react';
import * as motion from 'motion/react-client';

export function PredictSection() {
  const [prediction, setPrediction] = useState<'idle' | 'loading' | 'fraud' | 'safe'>('idle');
  const [prob, setProb] = useState(0);
  const { addToast } = useToast();

  const handlePredict = () => {
    setPrediction('loading');
    addToast({
      title: "Analyzing Transaction",
      description: "Running data through random forest ensemble...",
      variant: "default"
    });
    
    setTimeout(() => {
      // Simulate prediction
      const isFraud = Math.random() > 0.8;
      setPrediction(isFraud ? 'fraud' : 'safe');
      setProb(isFraud ? 85 + Math.random() * 14 : 2 + Math.random() * 10);
      
      if (isFraud) {
        addToast({
          title: "Fraud Detected",
          description: "Transaction flagged with high probability of fraud.",
          variant: "destructive"
        });
      } else {
        addToast({
          title: "Transaction Safe",
          description: "Transaction evaluated as legitimate.",
          variant: "success"
        });
      }
    }, 1500);
  };

  const handleReset = () => {
    setPrediction('idle');
    setProb(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addToast({
        title: "File Uploaded",
        description: `Successfully loaded ${e.target.files[0].name}. Ready for batch processing.`,
        variant: "default"
      });
    }
  };

  return (
    <section id="predict" className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="predict-heading">
      <div className="mb-10 text-center md:text-left">
        <h2 id="predict-heading" className="font-sans text-3xl font-bold tracking-tight">Run Prediction</h2>
        <p className="mt-2 text-[var(--muted-foreground)]">Evaluate transactions using the active Random Forest model.</p>
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
                <div className="text-xs font-mono text-[var(--muted-foreground)] self-end sm:self-auto" aria-live="polite">Model: RF_v2.1 (Active)</div>
              </div>

              <div className="p-4 sm:p-6">
                <TabsContent value="single" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4" role="group" aria-labelledby="transaction-info-heading">
                      <h4 id="transaction-info-heading" className="text-sm font-semibold text-[var(--primary-dark)] uppercase tracking-wider">Transaction Info</h4>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="time">Time (Seconds from start)</Label>
                          <Input id="time" type="number" placeholder="Example: 406.0" defaultValue="120" className="focus-visible:ring-[var(--primary)]" aria-describedby="time-description" />
                          <span id="time-description" className="sr-only">Enter the time in seconds from the start of the transaction.</span>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="amount">Amount ($)</Label>
                          <Input id="amount" type="number" placeholder="Example: 15.99" defaultValue="45.00" className="focus-visible:ring-[var(--primary)]" aria-describedby="amount-description" />
                          <span id="amount-description" className="sr-only">Enter the transaction amount in dollars.</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4" role="group" aria-labelledby="pca-features-heading">
                      <h4 id="pca-features-heading" className="text-sm font-semibold text-[var(--primary-dark)] uppercase tracking-wider">Key PCA Features</h4>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="v14">V14 (Strongest Fraud Indicator)</Label>
                          <Input id="v14" type="number" step="0.01" defaultValue="-1.5" className="focus-visible:ring-[var(--primary)]" aria-describedby="v14-description" />
                          <span id="v14-description" className="sr-only">Enter the value for PCA feature V14, strong indicator of fraud.</span>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="v4">V4</Label>
                          <Input id="v4" type="number" step="0.01" defaultValue="0.2" className="focus-visible:ring-[var(--primary)]" aria-describedby="v4-description" />
                          <span id="v4-description" className="sr-only">Enter the value for PCA feature V4.</span>
                        </div>
                      </div>
                    </div>
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
                      onChange={handleFileUpload} 
                      aria-label="Upload CSV file for batch prediction"
                    />
                    <div className="h-16 w-16 rounded-full bg-[var(--muted)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                      <FileSpreadsheet size={32} className="text-[var(--muted-foreground)] group-hover:text-[var(--primary-dark)] transition-colors" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Select CSV file</h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-6 max-w-sm px-4">
                      Upload a dataset matching the Kaggle credit card fraud schema (Time, V1-V28, Amount, Class).
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
              <CardDescription>Live model output</CardDescription>
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
                  <p>Awaiting transaction data...</p>
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
                  <p className="font-mono text-sm uppercase tracking-widest text-[var(--muted-foreground)] animate-pulse">Running Random Forest Matrix...</p>
                </div>
              )}

              {prediction === 'fraud' && (
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
                       <span className="font-mono font-bold text-[var(--destructive)] text-lg" aria-label={`${prob.toFixed(1)} percent`}>{prob.toFixed(1)}%</span>
                    </div>
                    <Progress value={prob} indicatorClassName="bg-[var(--destructive)]" className="h-2" aria-label="Fraud Probability" />
                  </div>
                  
                  <div className="mt-4 text-sm text-[var(--muted-foreground)] text-left w-full p-4 bg-[var(--muted)] rounded-lg border border-[var(--border)] relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--destructive)]" aria-hidden="true"></div>
                    <span className="font-semibold text-[var(--foreground)]">Reasoning:</span> High anomaly in V14 combined with unusual transaction amount triggers the random forest boundary.
                  </div>
                </motion.div>
              )}

              {prediction === 'safe' && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full" role="status">
                  <div className="w-24 h-24 bg-[var(--success)]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]" aria-hidden="true">
                    <ShieldCheck size={40} className="text-[var(--success)]" />
                  </div>
                  <Badge variant="success" className="mb-4 text-base px-4 py-1.5 shadow-sm bg-[var(--success)] text-[var(--primary-foreground)] hover:bg-[var(--success)]/90 border-transparent">LEGITIMATE</Badge>
                  
                  <div className="w-full space-y-2 mt-4 text-left p-4 bg-[var(--muted)] rounded-lg border border-[var(--success)]/30">
                     <div className="flex justify-between text-sm items-center mb-2">
                       <span className="text-[var(--muted-foreground)]">Fraud Probability</span>
                       <span className="font-mono font-bold text-[var(--success)] text-lg" aria-label={`${prob.toFixed(1)} percent`}>{prob.toFixed(1)}%</span>
                     </div>
                     <Progress value={prob} indicatorClassName="bg-[var(--success)]" className="h-2" aria-label="Fraud Probability" />
                  </div>
                  
                  <div className="mt-4 text-sm text-[var(--muted-foreground)] text-left w-full p-4 bg-[var(--muted)] rounded-lg border border-[var(--border)] relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--success)]" aria-hidden="true"></div>
                    <span className="font-semibold text-[var(--foreground)]">Reasoning:</span> Features fall well within standard legitimate boundaries. No significant anomalies detected.
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
