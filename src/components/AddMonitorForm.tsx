import { useState } from 'react';
import { Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addMonitor } from '@/lib/store';
import { WebsiteMonitor } from '@/types/monitor';

interface AddMonitorFormProps {
  onAdd: (monitor: WebsiteMonitor) => void;
}

export function AddMonitorForm({ onAdd }: AddMonitorFormProps) {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    const monitor = addMonitor(url.trim(), label.trim());
    onAdd(monitor);
    setUrl('');
    setLabel('');
  };

  return (
    <div className="gradient-card rounded-2xl p-8 glow-primary border border-border/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <Eye className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Add a new website monitor</h2>
          <p className="text-sm text-muted-foreground">Enter a URL to start tracking changes</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-secondary/50 border-border/50 h-11 text-foreground placeholder:text-muted-foreground"
          required
        />
        <Input
          placeholder="Label / tag (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="sm:w-48 bg-secondary/50 border-border/50 h-11 text-foreground placeholder:text-muted-foreground"
        />
        <div className="flex gap-2">
          <Button type="submit" className="gradient-primary border-0 h-11 px-6 font-semibold">
            <Plus className="w-4 h-4 mr-2" /> Watch
          </Button>
        </div>
      </form>
    </div>
  );
}
