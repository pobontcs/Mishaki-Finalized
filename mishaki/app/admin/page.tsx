"use client";

import { Header } from "../contents/Header";
import { useState } from "react";
import Orders from "../admin/orders";
import { LayoutDashboard, ShoppingBag, LineChart, Package, Settings } from 'lucide-react';

// --- MOCK DATA ---
const mockOrders = [
  { id: "#ORD-9021", customer: "Sarah Jenkins", date: "Oct 24, 2023", amount: "$124.00", status: "Completed" },
  { id: "#ORD-9020", customer: "Marcus Torres", date: "Oct 24, 2023", amount: "$89.50", status: "Pending" },
  { id: "#ORD-9019", customer: "Emily Chen", date: "Oct 23, 2023", amount: "$349.99", status: "Cancelled" },
  { id: "#ORD-9018", customer: "David Smith", date: "Oct 22, 2023", amount: "$45.00", status: "Completed" },
  { id: "#ORD-9017", customer: "Jessica Alba", date: "Oct 21, 2023", amount: "$210.00", status: "Completed" },
];

export default function Admin() {
  // --- STATE MANAGEMENT ---
  const [sales, setSales] = useState(500);
  const [filterStatus, setFilterStatus] = useState("All");
  
  // This state tracks which page is currently selected in the sidebar
  const [activePage, setActivePage] = useState("Overview");

  // Filtering Logic for the Overview Table
  const filteredOrders = filterStatus === "All" 
    ? mockOrders 
    : mockOrders.filter(order => order.status === filterStatus);

  // ==========================================
  // --- PAGE CONTENT CONSTANTS ---
  // ==========================================

  const OverviewPage = (
    <div className="animate-slide-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-200 hover:shadow-md transition-shadow">
          <p className="text-gray-500 text-sm font-medium">Current Stock</p>
          <h3 className="text-3xl font-bold text-red-900 mt-2">{sales}</h3>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-200 hover:shadow-md transition-shadow">
          <p className="text-gray-500 text-sm font-medium">Pending Orders</p>
          <h3 className="text-3xl font-bold text-red-900 mt-2">124</h3>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-200 hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
          <p className="text-gray-500 text-sm font-medium">Pending Shipments</p>
          <h3 className="text-3xl font-bold text-red-900 mt-2">78</h3>
        </div>
      </div>

      {/* ORDER HISTORY TABLE SECTION */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50">
          <h2 className="text-xl font-bold text-gray-800">Order History</h2>
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-500 whitespace-nowrap">Filter by:</label>
            <select 
              id="status-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block px-3 py-2 cursor-pointer outline-none transition-colors w-full sm:w-auto"
            >
              <option value="All">All Orders</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white text-gray-500 text-sm border-b border-zinc-100">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={index} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide
                        ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : ''}
                        ${order.status === 'Pending' ? 'bg-amber-100 text-amber-800' : ''}
                        ${order.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No orders found for this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const RevenuePage = (
    <div className="animate-slide-up flex flex-col items-center justify-center h-[60vh] bg-white rounded-2xl border border-zinc-200 shadow-sm text-center p-8">
      <div className="w-20 h-20 bg-red-100 text-red-800 rounded-full flex items-center justify-center mb-6">
        <LineChart className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Financial Analytics</h2>
      <p className="text-gray-500 max-w-md">Your revenue charts, profit margins, and financial reports will live on this page.</p>
    </div>
  );

  const ProductsPage = (
    <div className="animate-slide-up flex flex-col items-center justify-center h-[60vh] bg-white rounded-2xl border border-zinc-200 shadow-sm text-center p-8">
      <div className="w-20 h-20 bg-red-100 text-red-800 rounded-full flex items-center justify-center mb-6">
        <Package className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Inventory System</h2>
      <p className="text-gray-500 max-w-md">Manage your catalog, add new items, and update stock quantities here.</p>
    </div>
  );

  const SettingsPage = (
    <div className="animate-slide-up flex flex-col items-center justify-center h-[60vh] bg-white rounded-2xl border border-zinc-200 shadow-sm text-center p-8">
      <div className="w-20 h-20 bg-red-100 text-red-800 rounded-full flex items-center justify-center mb-6">
        <Settings className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Store Settings</h2>
      <p className="text-gray-500 max-w-md">Configure your store details, shipping zones, and admin permissions here.</p>
    </div>
  );

  // ==========================================
  // --- MAIN RENDER ---
  // ==========================================

  return (
    <div className="flex flex-col bg-zinc-50 min-h-screen">
      <Header centerText="Admin" showOptions={false} />

      <div className="flex flex-col lg:flex-row flex-1">
        
        {/* SIDEBAR - Inlined directly into the return block, changed to <div> */}
        <div className="w-full lg:w-56 bg-gradient-to-b from-red-950 via-red-800 to-red-600 text-white p-4 lg:p-6 shadow-xl relative z-10 border-b lg:border-r border-red-900/50">
          
          <h2 className="text-sm font-extrabold mb-6 hidden lg:block text-white/80 uppercase tracking-widest">
            Dashboard
          </h2>
          
          <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden">
            
            {/* OVERVIEW BUTTON */}
            <button 
              type="button"
              onClick={() => setActivePage("Overview")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg whitespace-nowrap border group
                ${activePage === "Overview" 
                  ? "bg-white/20 border-white/40 shadow-md font-bold text-white" 
                  : "bg-white/10 border-white/5 hover:border-white/20 font-medium text-white/80"}`}
            >
              <LayoutDashboard className={`w-5 h-5 transition-colors ${activePage === "Overview" ? "text-white" : "text-white/70 group-hover:text-white"}`} />
              <span className="text-sm">Overview</span>
            </button>

            {/* ORDERS BUTTON */}
            <button 
              type="button"
              onClick={() => setActivePage("Orders")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg whitespace-nowrap border group
                ${activePage === "Orders" 
                  ? "bg-white/20 border-white/40 shadow-md font-bold text-white" 
                  : "bg-white/10 border-white/5 hover:border-white/20 font-medium text-white/80"}`}
            >
              <ShoppingBag className={`w-5 h-5 transition-colors ${activePage === "Orders" ? "text-white" : "text-white/70 group-hover:text-white"}`} />
              <span className="text-sm">Orders</span>
            </button>

            {/* REVENUE BUTTON */}
            <button 
              type="button"
              onClick={() => setActivePage("Revenue")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg whitespace-nowrap border group
                ${activePage === "Revenue" 
                  ? "bg-white/20 border-white/40 shadow-md font-bold text-white" 
                  : "bg-white/10 border-white/5 hover:border-white/20 font-medium text-white/80"}`}
            >
              <LineChart className={`w-5 h-5 transition-colors ${activePage === "Revenue" ? "text-white" : "text-white/70 group-hover:text-white"}`} />
              <span className="text-sm">Revenue</span>
            </button>

            {/* PRODUCTS BUTTON */}
            <button 
              type="button"
              onClick={() => setActivePage("Products")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg whitespace-nowrap border group
                ${activePage === "Products" 
                  ? "bg-white/20 border-white/40 shadow-md font-bold text-white" 
                  : "bg-white/10 border-white/5 hover:border-white/20 font-medium text-white/80"}`}
            >
              <Package className={`w-5 h-5 transition-colors ${activePage === "Products" ? "text-white" : "text-white/70 group-hover:text-white"}`} />
              <span className="text-sm">Products</span>
            </button>

            {/* SETTINGS BUTTON */}
            <button 
              type="button"
              onClick={() => setActivePage("Settings")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg whitespace-nowrap border group
                ${activePage === "Settings" 
                  ? "bg-white/20 border-white/40 shadow-md font-bold text-white" 
                  : "bg-white/10 border-white/5 hover:border-white/20 font-medium text-white/80"}`}
            >
              <Settings className={`w-5 h-5 transition-colors ${activePage === "Settings" ? "text-white" : "text-white/70 group-hover:text-white"}`} />
              <span className="text-sm">Settings</span>
            </button>
            
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
          
          {activePage === "Overview" && OverviewPage}
          {activePage === "Orders" && <Orders/>}
          {activePage === "Revenue" && RevenuePage}
          {activePage === "Products" && ProductsPage}
          {activePage === "Settings" && SettingsPage}

        </div>
      </div>
    </div>
  );
}