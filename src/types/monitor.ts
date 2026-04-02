export type MonitorStatus = 'idle' | 'checking' | 'changed' | 'unchanged' | 'error';

export interface WebsiteMonitor {
  id: string;
  url: string;
  label: string;
  status: MonitorStatus;
  statusMessage: string;
  lastChecked: string | null;
  lastChanged: string | null;
  previousContent: string | null;
  currentContent: string | null;
  tags: string[];
  createdAt: string;
  checkInterval: number; // minutes
  errorCount: number;
}

export interface DiffResult {
  monitorId: string;
  oldContent: string;
  newContent: string;
  timestamp: string;
}

export interface ActivityLogEntry {
  id: string;
  monitorId: string;
  url: string;
  action: string;
  timestamp: string;
  details?: string;
}
