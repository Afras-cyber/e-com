'use client';

import { motion } from 'framer-motion';

interface ChartData {
  label: string;
  value: number;
}

export default function DashboardCharts({ data }: { data: ChartData[] }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="p-6">
      <h3 className="font-semibold leading-none tracking-tight mb-8">Revenue Overview (Last 7 Days)</h3>
      <div className="flex items-end justify-between h-[200px] gap-2 pt-4">
        {data.map((day, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
            <div className="relative w-full flex justify-center h-full items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.value / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                className="w-full max-w-[40px] bg-primary rounded-t-lg relative group-hover:bg-primary/80 transition-colors"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap z-20">
                  LKR {day.value.toLocaleString()}
                </div>
              </motion.div>
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
              {day.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
