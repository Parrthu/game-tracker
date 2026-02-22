import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
}

export function StatsCard({ title, value, icon: Icon, color, subtitle }: StatsCardProps) {
  return (
    <div className="glass-panel p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-text-primary mt-2">{value}</h3>
          {subtitle && (
            <p className="text-text-muted text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}
