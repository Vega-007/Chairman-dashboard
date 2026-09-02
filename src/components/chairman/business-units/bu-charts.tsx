'use client';

import React from 'react';
import { ChartData } from '@/data/mock/business-units.mock';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart 
} from 'recharts';

interface BUChartsProps {
  charts: ChartData[];
}

export const BUCharts: React.FC<BUChartsProps> = ({ charts }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {charts.map((chart, idx) => (
        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-[350px]">
          <h3 className="text-[15px] font-bold text-slate-800 mb-6">{chart.title}</h3>
          
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              {chart.type === 'line' ? (
                <LineChart data={chart.data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="value1" name={chart.data[0]?.label1 || 'Value'} stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                </LineChart>
              ) : chart.type === 'bar' ? (
                <BarChart data={chart.data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="value1" name={chart.data[0]?.label1 || 'Value'} fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              ) : (
                <ComposedChart data={chart.data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value1" name={chart.data[0]?.label1 || 'Bar'} fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                  <Line type="monotone" dataKey="value2" name={chart.data[0]?.label2 || 'Line'} stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};
