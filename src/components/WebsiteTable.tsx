import { useState } from 'react';
import { RefreshCw, Eye, FileText, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { WebsiteMonitor } from '@/types/monitor';
import { checkWebsite, removeMonitor } from '@/lib/store';
import { useNavigate } from 'react-router-dom';

interface WebsiteTableProps {
  monitors: WebsiteMonitor[];
  onUpdate: () => void;
  activeTag: string;
}

function StatusBadge({ status, message }: { status: string; message: string }) {
  const variants: Record<string, string> = {
    idle: 'bg-muted text-muted-foreground',
    checking: 'bg-primary/20 text-primary animate-pulse',
    changed: 'bg-success/20 text-success',
    unchanged: 'bg-secondary text-secondary-foreground',
    error: 'bg-destructive/20 text-destructive',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${variants[status] || variants.idle}`}>
      {status === 'checking' && <Loader2 className="w-3 h-3 animate-spin" />}
      {status === 'changed' && <span className="w-1.5 h-1.5 rounded-full bg-success" />}
      {status === 'error' && <span className="w-1.5 h-1.5 rounded-full bg-destructive" />}
      {message}
    </span>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function WebsiteTable({ monitors, onUpdate, activeTag }: WebsiteTableProps) {
  const navigate = useNavigate();
  const [checkingIds, setCheckingIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = activeTag === 'all'
    ? monitors
    : monitors.filter(m => m.label.toLowerCase().includes(activeTag.toLowerCase()) || m.tags.includes(activeTag));

  const handleCheck = async (id: string) => {
    setCheckingIds(prev => new Set(prev).add(id));
    await checkWebsite(id);
    setCheckingIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    onUpdate();
  };

  const handleDelete = (id: string) => {
    removeMonitor(id);
    onUpdate();
  };

  const handleDiff = (id: string) => {
    navigate(`/diff/${id}`);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Eye className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">No monitors yet</p>
        <p className="text-sm">Add a URL above to start monitoring</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider w-8" />
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Website</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Last Checked</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Last Changed</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((monitor) => {
            const isChecking = checkingIds.has(monitor.id) || monitor.status === 'checking';
            return (
              <tr
                key={monitor.id}
                className="border-b border-border/30 hover:bg-secondary/30 transition-colors group"
              >
                <td className="py-3 px-4">
                  <Checkbox
                    checked={selected.has(monitor.id)}
                    onCheckedChange={() => toggleSelect(monitor.id)}
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1">
                    <a
                      href={monitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      {monitor.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </a>
                    {monitor.label && (
                      <Badge variant="secondary" className="w-fit text-[10px] px-2 py-0">
                        {monitor.label}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={isChecking ? 'checking' : monitor.status} message={isChecking ? 'Checking...' : monitor.statusMessage} />
                </td>
                <td className="py-3 px-4 hidden md:table-cell text-sm text-muted-foreground">
                  {formatDate(monitor.lastChecked)}
                </td>
                <td className="py-3 px-4 hidden lg:table-cell text-sm text-muted-foreground">
                  {formatDate(monitor.lastChanged)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCheck(monitor.id)}
                      disabled={isChecking}
                      title="Recheck"
                    >
                      {isChecking ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDiff(monitor.id)}
                      disabled={!monitor.previousContent}
                      title="View Diff"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => window.open(monitor.url, '_blank')}
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive/70 hover:text-destructive"
                      onClick={() => handleDelete(monitor.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
