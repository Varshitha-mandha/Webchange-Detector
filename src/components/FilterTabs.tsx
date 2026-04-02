import { WebsiteMonitor } from '@/types/monitor';

interface FilterTabsProps {
  monitors: WebsiteMonitor[];
  activeTag: string;
  onTagChange: (tag: string) => void;
}

export function FilterTabs({ monitors, activeTag, onTagChange }: FilterTabsProps) {
  const tags = new Set<string>();
  monitors.forEach(m => {
    if (m.label) tags.add(m.label);
    m.tags.forEach(t => tags.add(t));
  });

  const allTags = ['all', ...Array.from(tags)];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {allTags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            activeTag === tag
              ? 'gradient-primary text-primary-foreground'
              : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary'
          }`}
        >
          {tag === 'all' ? 'All' : tag}
          {tag === 'all' && (
            <span className="ml-1.5 text-xs opacity-70">{monitors.length}</span>
          )}
        </button>
      ))}
    </div>
  );
}
