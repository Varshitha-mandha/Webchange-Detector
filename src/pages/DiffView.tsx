import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMonitors } from '@/lib/store';
import { useMemo } from 'react';

function computeDiff(oldText: string, newText: string) {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const result: { type: 'same' | 'added' | 'removed'; text: string }[] = [];

  const maxLen = Math.max(oldLines.length, newLines.length);
  const oldSet = new Set(oldLines);
  const newSet = new Set(newLines);

  // Simple line-by-line diff
  let oi = 0, ni = 0;
  while (oi < oldLines.length || ni < newLines.length) {
    if (oi < oldLines.length && ni < newLines.length && oldLines[oi] === newLines[ni]) {
      result.push({ type: 'same', text: oldLines[oi] });
      oi++; ni++;
    } else if (oi < oldLines.length && !newSet.has(oldLines[oi])) {
      result.push({ type: 'removed', text: oldLines[oi] });
      oi++;
    } else if (ni < newLines.length && !oldSet.has(newLines[ni])) {
      result.push({ type: 'added', text: newLines[ni] });
      ni++;
    } else {
      // Mismatch that exists in both — treat as remove + add
      if (oi < oldLines.length) {
        result.push({ type: 'removed', text: oldLines[oi] });
        oi++;
      }
      if (ni < newLines.length) {
        result.push({ type: 'added', text: newLines[ni] });
        ni++;
      }
    }
  }

  return result;
}

export default function DiffView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const monitors = getMonitors();
  const monitor = monitors.find(m => m.id === id);

  const diff = useMemo(() => {
    if (!monitor?.previousContent || !monitor?.currentContent) return [];
    return computeDiff(monitor.previousContent, monitor.currentContent);
  }, [monitor]);

  if (!monitor) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Monitor not found</p>
          <Button variant="ghost" onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Diff View</h1>
            <p className="text-sm text-muted-foreground">{monitor.url}</p>
          </div>
        </div>

        {diff.length === 0 ? (
          <div className="bg-card/50 rounded-xl border border-border/30 p-12 text-center">
            <p className="text-muted-foreground">No diff available. Run a check first to detect changes.</p>
          </div>
        ) : (
          <div className="bg-card/50 rounded-xl border border-border/30 overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-3 border-b border-border/30">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-sm bg-destructive/30" />
                <span className="text-muted-foreground">Removed</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-sm bg-success/30" />
                <span className="text-muted-foreground">Added</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <pre className="text-sm leading-6 font-mono">
                {diff.map((line, i) => (
                  <div
                    key={i}
                    className={`px-6 ${
                      line.type === 'added'
                        ? 'bg-success/10 text-success'
                        : line.type === 'removed'
                        ? 'bg-destructive/10 text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span className="inline-block w-6 text-right mr-4 opacity-40 select-none">
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                    </span>
                    {line.text}
                  </div>
                ))}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
