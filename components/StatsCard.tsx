import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  colorClass?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, colorClass = "bg-white" }) => {
  return (
    <div className={`${colorClass} p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between transition-transform hover:scale-[1.02]`}>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {trend && <p className="text-xs text-emerald-600 mt-2 font-medium">{trend}</p>}
      </div>
      <div className="p-3 bg-slate-50 rounded-lg">
        <Icon className="w-6 h-6 text-slate-600" />
      </div>
    </div>
  );
};
