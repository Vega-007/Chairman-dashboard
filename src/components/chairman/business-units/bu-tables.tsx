import React from 'react';
import { TableData } from '@/data/mock/business-units.mock';
import { cn } from '@/lib/utils';

interface BUTablesProps {
  table?: TableData;
}

export const BUTables: React.FC<BUTablesProps> = ({ table }) => {
  if (!table) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-[15px] font-bold text-slate-800">{table.title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {table.headers.map((header, idx) => (
                <th 
                  key={idx} 
                  className="px-5 py-3 text-[12px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-100"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIdx) => (
              <tr 
                key={rowIdx} 
                className={cn(
                  "border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                )}
              >
                {table.headers.map((header, colIdx) => (
                  <td 
                    key={colIdx} 
                    className={cn(
                      "px-5 py-3.5 text-[13px]",
                      colIdx === 0 ? "font-semibold text-slate-800" : "text-slate-600 font-medium"
                    )}
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
