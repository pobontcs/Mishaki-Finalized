"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Activity, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Download
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

// --- MOCK DATA ---
const revenueData = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
  { name: 'Aug', revenue: 4490, expenses: 2300 },
  { name: 'Sep', revenue: 5490, expenses: 3400 },
  { name: 'Oct', revenue: 6490, expenses: 4500 },
  { name: 'Nov', revenue: 7490, expenses: 5600 },
  { name: 'Dec', revenue: 8900, expenses: 6700 },
];

const categoryData = [
  { name: 'Electronics', sales: 4500 },
  { name: 'Clothing', sales: 3200 },
  { name: 'Accessories', sales: 2800 },
  { name: 'Home', sales: 2100 },
  { name: 'Beauty', sales: 1500 },
];

const kpiData = [
  { title: "Total Revenue", amount: "$1,245,563.00", change: "+14.5%", isPositive: true, icon: DollarSign },
  { title: "Average Order Value", amount: "$84.20", change: "+5.2%", isPositive: true, icon: Activity },
  { title: "Total Expenses", amount: "$42,150.00", change: "-2.4%", isPositive: false, icon: CreditCard },
  { title: "Net Profit Margin", amount: "24.5%", change: "+1.2%", isPositive: true, icon: TrendingUp },
];

export default function Analysis() {
  const [timeframe, setTimeframe] = useState("Yearly");

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
            className="bg-white border border-zinc-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block px-3 py-2 cursor-pointer outline-none shadow-sm"
          >
            <option value="Weekly">Last 7 Days</option>
            <option value="Monthly">Last 30 Days</option>
            <option value="Yearly">This Year</option>
          </select>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-500">
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                kpi.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
              }`}>
                {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpi.amount}</h3>
            </div>
          </div>
        ))}
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
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
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
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#3f3f46', fontSize: 12, fontWeight: 500}} />
                <Tooltip 
                  cursor={{fill: '#f4f4f5'}}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7' }}
                />
                <Bar dataKey="sales" fill="#b91c1c" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}