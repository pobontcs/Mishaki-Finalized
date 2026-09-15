"use client";

import { Header } from "../contents/Header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Orders from "../admin/orders";
import Analysis from "../admin/analysis";
import ProductPage from "../admin/product";
import SettingsPage from "../admin/settings";
import LandingSettingsPage from "../admin/landing_settings";
import { LayoutDashboard, ShoppingBag, LineChart, Package, Settings, FileText, MonitorPlay } from 'lucide-react';
import { getDashboardOverview, getOrders, DashboardOverview, OrderData } from "../lib/api";

export default function Admin() {
  const router = useRouter();
  
  // Navigation State
  const [activePage, setActivePage] = useState("Overview");
  
  // Dashboard State
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth protection & Data loading
  useEffect(() => {
    const token = localStorage.getItem("mishaki_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    let isMounted = true;
    if (activePage === "Overview") {
      loadDashboardData(isMounted);
    }
    return () => { isMounted = false; };
  }, [router, activePage]);

  async function loadDashboardData(isMounted: boolean = true) {
    try {
      setIsLoading(true);
      setError(null);
      const [overviewData, ordersData] = await Promise.all([
        getDashboardOverview(),
        getOrders()
      ]);
      if (isMounted) {
        setOverview(overviewData);
        setRecentOrders(ordersData);
      }
    } catch (err: any) {
      if (isMounted) {
        console.error("Failed to load dashboard data", err);
        setError(err.message || "Failed to load dashboard data");
      }
    } finally {
      if (isMounted) setIsLoading(false);
    }
  }

  // Filtering Logic for the Overview Table
  const filteredOrders = filterStatus === "All" 
    ? recentOrders 
    : recentOrders.filter(order => order.status === filterStatus);

  // ==========================================
  // --- PAGE CONTENT CONSTANTS ---
  // ==========================================

  const OverviewPage = (
    <div className="animate-slide-up flex flex-col gap-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <div className="animate-spin w-8 h-8 border-4 border-red-900 border-t-transparent rounded-full mb-4"></div>
          <p className="text-base font-medium text-gray-900">Loading dashboard...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <p className="text-base font-medium text-red-600">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-200 hover:shadow-md transition-shadow">
              <p className="text-gray-500 text-sm font-medium">Current Stock</p>
              <h3 className="text-3xl font-bold text-red-900 mt-2">{overview?.current_stock || 0}</h3>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-200 hover:shadow-md transition-shadow">
              <p className="text-gray-500 text-sm font-medium">Pending Orders</p>
              <h3 className="text-3xl font-bold text-red-900 mt-2">{overview?.pending_orders || 0}</h3>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-200 hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
              <p className="text-gray-500 text-sm font-medium">Pending Shipments</p>
              <h3 className="text-3xl font-bold text-red-900 mt-2">{overview?.pending_shipments || 0}</h3>
            </div>
          </div>

          {/* ORDER HISTORY TABLE SECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50">
              <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
              <div className="flex items-center gap-2">
                <label htmlFor="status-filter" className="text-sm font-medium text-gray-500 whitespace-nowrap">Filter by:</label>
                <select 
                  id="status-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white border border-zinc-200 text-black text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block px-3 py-2 cursor-pointer outline-none transition-colors shadow-sm w-full sm:w-auto"
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
                    filteredOrders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{order.order_number}</td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600 font-medium">{order.customer_name}</div>
                          {order.phone && <div className="text-xs text-gray-400 mt-0.5">{order.phone}</div>}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">৳{order.total_amount.toFixed(2)}</div>
                          {order.transaction_id && <div className="text-xs text-pink-600 font-medium mt-1">Trx: {order.transaction_id}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border
                            ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                            ${order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                            ${order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' : ''}
                          `}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="w-8 h-8 mb-2 text-gray-300" />
                          <p>No orders found for this status.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // --- 6) LANDING SETTINGS PAGE ---
  const LandingSettingsContent = (
    <div className="animate-slide-up">
      <LandingSettingsPage />
    </div>
  );

  // ==========================================
  // --- MAIN RENDER ---
  // ==========================================

  return (
    <div className="flex flex-col bg-zinc-50 min-h-screen">
      <Header centerText="Admin" showOptions={false} />

      <div className="flex flex-col lg:flex-row flex-1">
        
        {/* SIDEBAR */}
        <div className="w-full lg:w-56 bg-gradient-to-b from-red-950 via-red-800 to-red-600 text-white p-4 lg:p-6 shadow-xl relative z-10 border-b lg:border-r border-red-900/50">
          
          <h2 className="text-sm font-extrabold mb-6 hidden lg:block text-white/80 uppercase tracking-widest">
            Dashboard
          </h2>
          
          <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden">
            
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

            <button 
              type="button"
              onClick={() => setActivePage("Landing Settings")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg whitespace-nowrap border group
                ${activePage === "Landing Settings" 
                  ? "bg-white/20 border-white/40 shadow-md font-bold text-white" 
                  : "bg-white/10 border-white/5 hover:border-white/20 font-medium text-white/80"}`}
            >
              <MonitorPlay className={`w-5 h-5 transition-colors ${activePage === "Landing Settings" ? "text-white" : "text-white/70 group-hover:text-white"}`} />
              <span className="text-sm">Landing Settings</span>
            </button>
            
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
          
          {activePage === "Overview" && OverviewPage}
          {activePage === "Orders" && <Orders/>}
          {activePage === "Revenue" && <Analysis/>}
          {activePage === "Products" && <ProductPage/>}
          {activePage === "Settings" && <SettingsPage/>}
          {activePage === "Landing Settings" && LandingSettingsContent}

        </div>
      </div>
    </div>
  );
}