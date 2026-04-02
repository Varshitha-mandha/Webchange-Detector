import { WebsiteMonitor, ActivityLogEntry } from '@/types/monitor';

const MONITORS_KEY = 'smart-detector-monitors';
const LOG_KEY = 'smart-detector-log';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function getMonitors(): WebsiteMonitor[] {
  const data = localStorage.getItem(MONITORS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveMonitors(monitors: WebsiteMonitor[]): void {
  localStorage.setItem(MONITORS_KEY, JSON.stringify(monitors));
}

export function addMonitor(url: string, label: string, tags: string[] = []): WebsiteMonitor {
  const monitors = getMonitors();
  const monitor: WebsiteMonitor = {
    id: generateId(),
    url: url.startsWith('http') ? url : `https://${url}`,
    label: label || new URL(url.startsWith('http') ? url : `https://${url}`).hostname,
    status: 'idle',
    statusMessage: 'Waiting for first check',
    lastChecked: null,
    lastChanged: null,
    previousContent: null,
    currentContent: null,
    tags,
    createdAt: new Date().toISOString(),
    checkInterval: 60,
    errorCount: 0,
  };
  monitors.unshift(monitor);
  saveMonitors(monitors);
  addLog(monitor.id, monitor.url, 'Added monitor');
  return monitor;
}

export function removeMonitor(id: string): void {
  const monitors = getMonitors().filter(m => m.id !== id);
  saveMonitors(monitors);
}

export function updateMonitor(id: string, updates: Partial<WebsiteMonitor>): WebsiteMonitor | null {
  const monitors = getMonitors();
  const idx = monitors.findIndex(m => m.id === id);
  if (idx === -1) return null;
  monitors[idx] = { ...monitors[idx], ...updates };
  saveMonitors(monitors);
  return monitors[idx];
}

export async function checkWebsite(id: string): Promise<WebsiteMonitor | null> {
  const monitors = getMonitors();
  const idx = monitors.findIndex(m => m.id === id);
  if (idx === -1) return null;

  const monitor = monitors[idx];
  monitor.status = 'checking';
  monitor.statusMessage = 'Checking...';
  saveMonitors(monitors);

  await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));

  const now = new Date().toISOString();
  
  const rand = Math.random();
  if (rand < 0.15) {
    monitor.status = 'error';
    monitor.statusMessage = rand < 0.07 ? 'HTTP 403 Forbidden' : 'HTTP 404 Not Found';
    monitor.errorCount += 1;
    monitor.lastChecked = now;
    addLog(monitor.id, monitor.url, 'Check failed', monitor.statusMessage);
  } else if (rand < 0.45 || !monitor.currentContent) {
    const oldContent = monitor.currentContent || generateFakeContent(monitor.url, 'old');
    const newContent = generateFakeContent(monitor.url, 'new');
    monitor.previousContent = oldContent;
    monitor.currentContent = newContent;
    monitor.status = 'changed';
    monitor.statusMessage = 'Change detected!';
    monitor.lastChecked = now;
    monitor.lastChanged = now;
    monitor.errorCount = 0;
    addLog(monitor.id, monitor.url, 'Change detected');
  } else {
    if (!monitor.currentContent) {
      monitor.currentContent = generateFakeContent(monitor.url, 'old');
    }
    monitor.status = 'unchanged';
    monitor.statusMessage = 'No changes detected';
    monitor.lastChecked = now;
    monitor.errorCount = 0;
    addLog(monitor.id, monitor.url, 'No changes');
  }

  monitors[idx] = monitor;
  saveMonitors(monitors);
  return monitor;
}

function generateFakeContent(url: string, variant: 'old' | 'new'): string {
  const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();
  if (variant === 'old') {
    return `<!DOCTYPE html>
<html>
<head><title>${domain} - Page</title></head>
<body>
  <header>
    <h1>Welcome to ${domain}</h1>
    <nav>Home | About | Contact</nav>
  </header>
  <main>
    <p>This is the main content of the page.</p>
    <p>Last updated: January 2024</p>
    <ul>
      <li>Feature A - Available</li>
      <li>Feature B - Coming Soon</li>
      <li>Feature C - Beta</li>
    </ul>
    <p>Price: $29.99/month</p>
  </main>
  <footer>Copyright 2024 ${domain}</footer>
</body>
</html>`;
  }
  return `<!DOCTYPE html>
<html>
<head><title>${domain} - Page (Updated)</title></head>
<body>
  <header>
    <h1>Welcome to ${domain}</h1>
    <nav>Home | About | Blog | Contact</nav>
  </header>
  <main>
    <p>This is the updated content of the page.</p>
    <p>Last updated: April 2026</p>
    <ul>
      <li>Feature A - Available</li>
      <li>Feature B - Now Available!</li>
      <li>Feature C - Stable Release</li>
      <li>Feature D - New!</li>
    </ul>
    <p>Price: $34.99/month (New pricing)</p>
    <p>Special offer: 20% off annual plans</p>
  </main>
  <footer>Copyright 2026 ${domain}</footer>
</body>
</html>`;
}

export function getActivityLog(): ActivityLogEntry[] {
  const data = localStorage.getItem(LOG_KEY);
  return data ? JSON.parse(data) : [];
}

function addLog(monitorId: string, url: string, action: string, details?: string): void {
  const log = getActivityLog();
  log.unshift({
    id: generateId(),
    monitorId,
    url,
    action,
    timestamp: new Date().toISOString(),
    details,
  });
  localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(0, 100)));
}

export function exportData(): string {
  return JSON.stringify({
    monitors: getMonitors(),
    log: getActivityLog(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (data.monitors) saveMonitors(data.monitors);
    return true;
  } catch {
    return false;
  }
}
