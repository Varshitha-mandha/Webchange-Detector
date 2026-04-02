import { Settings, Download, Upload, Github, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportData, importData } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

export function Navbar() {
  const { toast } = useToast();

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-detector-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Backup exported', description: 'Your data has been downloaded.' });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const success = importData(ev.target?.result as string);
        toast({
          title: success ? 'Import successful' : 'Import failed',
          description: success ? 'Monitors have been imported.' : 'Invalid file format.',
          variant: success ? 'default' : 'destructive',
        });
        if (success) window.location.reload();
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold gradient-text">Smart Detector</h1>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleImport} title="Import">
              <Upload className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleExport} title="Backup / Export">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Settings">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
