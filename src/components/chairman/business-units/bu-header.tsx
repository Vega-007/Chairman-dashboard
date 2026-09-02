import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface BUHeaderProps {
  name: string;
  description: string;
}

export const BUHeader: React.FC<BUHeaderProps> = ({ name, description }) => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <Link 
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors w-fit"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Command Center
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {name} Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            {description}
          </p>
        </div>
        
        {/* Optional Date/Time Filter placeholder */}
        <div className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm shrink-0">
          <span className="text-[13px] font-semibold text-slate-600">
            Current Academic Year
          </span>
        </div>
      </div>
    </div>
  );
};
