/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/dashboard/Hero';
import { OverviewCards } from './components/dashboard/OverviewCards';
import { PredictSection } from './components/prediction/PredictSection';
import { ModelComparison } from './components/models/ModelComparison';
import { VisualInsights } from './components/insights/VisualInsights';
import { ExplainabilityPanel } from './components/explanation/Explainability';
import { Footer } from './components/layout/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)] font-sans flex flex-col pt-16 sm:pt-24 md:pt-0">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <OverviewCards />
        <PredictSection />
        <ModelComparison />
        <VisualInsights />
        <ExplainabilityPanel />
      </main>
      <Footer />
    </div>
  );
}
