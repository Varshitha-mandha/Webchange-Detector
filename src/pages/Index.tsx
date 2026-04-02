import { useState, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { AddMonitorForm } from '@/components/AddMonitorForm';
import { WebsiteTable } from '@/components/WebsiteTable';
import { FilterTabs } from '@/components/FilterTabs';
import { StatsBar } from '@/components/StatsBar';
import { getMonitors } from '@/lib/store';

export default function Index() {
  const [monitors, setMonitors] = useState(getMonitors());
  const [activeTag, setActiveTag] = useState('all');

  const refresh = useCallback(() => {
    setMonitors(getMonitors());
  }, []);

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <StatsBar monitors={monitors} />
        <AddMonitorForm onAdd={() => refresh()} />
        <div className="bg-card/40 rounded-2xl border border-border/30 overflow-hidden">
          <div className="px-6 pt-5 pb-3">
            <FilterTabs monitors={monitors} activeTag={activeTag} onTagChange={setActiveTag} />
          </div>
          <WebsiteTable monitors={monitors} onUpdate={refresh} activeTag={activeTag} />
        </div>
      </main>
    </div>
  );
}
