import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { WebsiteMonitor } from '@/types/monitor';

interface StatsBarProps {
  monitors: WebsiteMonitor[];
}

export function StatsBar({ monitors }: StatsBarProps) {
  const total = monitors.length;
  const changed = monitors.filter(m => m.status === 'changed').length;
  const errors = monitors.filter(m => m.status === 'error').length;
  const checked = monitors.filter(m => m.lastChecked).length;

  const stats = [
    { label: 'Total Monitors', value: total, icon: Activity, color: 'text-primary' },
    { label: 'Changes Detected', value: changed, icon: CheckCircle, color: 'text-success' },
    { label: 'Errors', value: errors, icon: AlertTriangle, color: 'text-destructive' },
    { label: 'Checked', value: checked, icon: Clock, color: 'text-accent' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-card/50 rounded-xl p-4 border border-border/30">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      ))}
    </div>
  );
}
