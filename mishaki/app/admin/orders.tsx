import { useState } from "react";
import { Search, MoreVertical, FileText } from 'lucide-react';

// --- MOCK DATA ---
const mockOrders = [
  { id: "#ORD-9021", customer: "Sarah Jenkins", email: "sarah.j@example.com", date: "Oct 24, 2023", items: 3, total: "$124.00", status: "Completed" },
  { id: "#ORD-9020", customer: "Marcus Torres", email: "marcus.t@example.com", date: "Oct 24, 2023", items: 1, total: "$89.50", status: "Pending" },
  { id: "#ORD-9019", customer: "Emily Chen", email: "emily.c@example.com", date: "Oct 23, 2023", items: 5, total: "$349.99", status: "Cancelled" },
  { id: "#ORD-9018", customer: "David Smith", email: "d.smith@example.com", date: "Oct 22, 2023", items: 2, total: "$45.00", status: "Completed" },
  { id: "#ORD-9017", customer: "Jessica Alba", email: "jalba@example.com", date: "Oct 21, 2023", items: 4, total: "$210.00", status: "Pending" },
  { id: "#ORD-9016", customer: "Michael Chang", email: "m.chang@example.com", date: "Oct 20, 2023", items: 1, total: "$29.99", status: "Completed" },
];

export default function Orders() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Array of tabs for easy rendering
  const tabs = ["All", "Pending", "Completed", "Cancelled"];

  // Filter logic: apply status filter, then search query
  const filteredOrders = mockOrders.filter(order => {
    const matchesFilter = filter === "All" || order.status === filter;
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="animate-slide-up flex flex-col gap-6">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-sm text-gray-500 mt-1">View, track, and manage all customer orders.</p>
      </div>

      {/* MAIN CONTAINER */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        
        {/* TOP BAR: Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 px-6 pt-2">
          
          {/* TAB NAVIGATION */}
          <div className="flex flex-row gap-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`py-4 text-sm font-medium transition-colors relative whitespace-nowrap
                  ${filter === tab 
                    ? "text-red-700" 
                    : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                {tab}
                {/* Active Tab Indicator */}
                {filter === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* SEARCH INPUT */}
          <div className="py-3 sm:py-0">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-black bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-zinc-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-zinc-100">
                <th className="px-6 py-4 font-semibold">Order Details</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-zinc-50 hover:bg-zinc-50/80 transition-colors group">
                    
                    {/* Order ID & Items */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-500">{order.items} {order.items === 1 ? 'item' : 'items'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.email}</p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>

                    {/* Total Amount */}
                    <td className="px-6 py-4 font-bold text-gray-900">{order.total}</td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border
                        ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                        ${order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                        ${order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-zinc-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                
                /* EMPTY STATE */
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FileText className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-base font-medium text-gray-900">No orders found</p>
                      <p className="text-sm">We couldn't find any orders matching your criteria.</p>
                      <button 
                        onClick={() => { setFilter("All"); setSearchQuery(""); }}
                        className="mt-4 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}