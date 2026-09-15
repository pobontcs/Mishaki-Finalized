"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Activity, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  List,
  X
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { getFinancialAnalysis, FinancialAnalysisData } from '../lib/api';

export default function Analysis() {
  const [timeframe, setTimeframe] = useState("Yearly");
  const [data, setData] = useState<FinancialAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedData = await getFinancialAnalysis(timeframe);
        if (isMounted) setData(fetchedData);
      } catch (err: any) {
        if (isMounted) {
          console.error("Failed to load financial analysis", err);
          setError(err.message || "Failed to load data.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [timeframe]);

  const handleExport = () => {
    if (!data) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Revenue Data
    csvContent += "Revenue & Expenses\n";
    csvContent += "Month,Revenue,Expenses\n";
    data.revenue_chart.forEach(row => {
      csvContent += `${row.name},${row.revenue},${row.expenses}\n`;
    });
    
    csvContent += "\nSales by Category\n";
    csvContent += "Category,Sales\n";
    data.category_sales.forEach(row => {
      csvContent += `${row.name},${row.sales}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `financial_report_${timeframe.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <div className="animate-spin w-8 h-8 border-4 border-red-900 border-t-transparent rounded-full mb-4"></div>
        <p className="text-base font-medium text-gray-900">Loading analysis data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <p className="text-base font-medium text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <p className="text-base font-medium text-red-600">Failed to load data. Please refresh.</p>
      </div>
    );
  }

  // Map icons to KPIs based on index or title (since backend just returns strings)
  const icons = [DollarSign, Activity, CreditCard, TrendingUp];

  return (
    <div className="animate-slide-up flex flex-col gap-6">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Analysis</h1>
          <p className="text-sm text-gray-500 mt-1">Track your revenue, expenses, and overall business growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-white border border-zinc-200 text-black text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block px-3 py-2 cursor-pointer outline-none shadow-sm"
          >
            <option value="Weekly">Last 7 Days</option>
            <option value="Monthly">Last 30 Days</option>
            <option value="Yearly">This Year</option>
          </select>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.kpis.map((kpi, index) => {
          const IconComponent = icons[index % icons.length];
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-500">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  kpi.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                }`}>
                  {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </span>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpi.amount}</h3>
                </div>
                {kpi.title === "Total Expenses" && (
                  <button
                    onClick={() => setShowExpenseModal(true)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                    title="View Expense History"
                  >
                    <List className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MAIN CHART: REVENUE VS EXPENSES */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Revenue & Expenses</h2>
              <p className="text-xs text-gray-500">Monthly breakdown for the current year</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span className="text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
                <span className="text-gray-600">Expenses</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenue_chart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} tickFormatter={(value) => `৳${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" stroke="#d4d4d8" strokeWidth={3} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECONDARY CHART: CATEGORY SALES */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 lg:col-span-1">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Sales by Category</h2>
            <p className="text-xs text-gray-500">Top performing product categories</p>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.category_sales} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#3f3f46', fontSize: 12, fontWeight: 500}} width={80} />
                <Tooltip 
                  cursor={{fill: '#f4f4f5'}}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7' }}
                  formatter={(value: any) => [`৳${value}`, "Sales"]}
                />
                <Bar dataKey="sales" fill="#b91c1c" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* EXPENSE BREAKDOWN MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Expense Breakdown</h2>
              <button 
                onClick={() => setShowExpenseModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {data.expense_breakdown && data.expense_breakdown.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-sm font-semibold text-gray-600">
                        <th className="p-3">Date</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Stock Type</th>
                        <th className="p-3">Quantity</th>
                        <th className="p-3 text-right">Unit Cost</th>
                        <th className="p-3 text-right">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                      {data.expense_breakdown.map((exp, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3">{exp.date}</td>
                          <td className="p-3 font-medium">{exp.product_name}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              {exp.stock_type}
                            </span>
                          </td>
                          <td className="p-3">{exp.quantity}</td>
                          <td className="p-3 text-right">৳{exp.unit_cost.toFixed(2)}</td>
                          <td className="p-3 text-right font-bold">৳{exp.total_cost.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No expense records found for this timeframe.
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end rounded-b-2xl">
              <button 
                onClick={() => setShowExpenseModal(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}