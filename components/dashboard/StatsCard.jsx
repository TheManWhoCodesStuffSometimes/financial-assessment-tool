/* components/dashboard/StatsCard.jsx */

import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ title, value, change, positive, icon: Icon, gradient }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${gradient} p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="w-6 h-6" />
          </div>
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${positive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium opacity-90">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/5 rounded-full"></div>
    </div>
  );
}
