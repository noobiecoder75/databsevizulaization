import React from 'react';
import { DollarSign } from 'lucide-react';

interface BillingData {
  dueDate: string;
  amount: number;
  estimated: number;
  isPaid: boolean;
  change: number;
  changeLabel: string;
}

interface BillingWidgetProps {
  data: BillingData;
}

export const BillingWidget = ({ data }: BillingWidgetProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-500">Billing</h3>
        <div className="bg-blue-50 rounded-full p-1.5">
          <DollarSign size={16} className="text-blue-600" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-slate-500">Current Balance</span>
            <span className={`text-sm font-medium ${data.isPaid ? 'text-green-600' : 'text-red-600'}`}>
              {data.isPaid ? 'PAID' : `$${data.amount.toFixed(2)}`}
            </span>
          </div>
          {!data.isPaid && (
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-500">Due Date</span>
              <span className="text-xs font-medium text-slate-700">{data.dueDate}</span>
            </div>
          )}
        </div>
        
        <div className="pt-2 border-t border-slate-100">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-slate-500">Estimated Next Bill</span>
            <span className="text-sm font-medium text-slate-800">${data.estimated.toFixed(2)}</span>
          </div>
        </div>
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded transition-colors">
          View Billing History
        </button>
      </div>
    </div>
  );
};