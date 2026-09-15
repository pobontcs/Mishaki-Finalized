import { useState, useEffect } from "react";
import { Search, MoreVertical, FileText, X } from 'lucide-react';
import { getOrders, OrderData, updateOrderStatus, getImageUrl, cancelOrderItems, sendOrderEmail } from "../lib/api";
import Image from "next/image";

export default function Orders() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown state for actions
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  
  // Modal state for order history
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  // Modal state for partial cancellation
  const [cancelOrder, setCancelOrder] = useState<OrderData | null>(null);
  const [cancelQuantities, setCancelQuantities] = useState<Record<number, number>>({});
  const [isCancelling, setIsCancelling] = useState(false);

  // Bkash TrxID input state
  const [trxInputs, setTrxInputs] = useState<Record<number, string>>({});

  // Email draft state
  const [draftEmailOpen, setDraftEmailOpen] = useState<OrderData | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Array of tabs for easy rendering
  const tabs = ["All", "Pending", "Completed", "Cancelled"];

  async function loadOrders() {
    try {
      setIsLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      setOpenDropdownId(null);
      await loadOrders(); // Refresh orders after update
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  const handleVerifyAndConfirm = async (order: OrderData) => {
    const inputTrx = trxInputs[order.id] || "";
    if (inputTrx.trim() === order.transaction_id) {
      await handleUpdateStatus(order.id, 'Confirmed');
    } else {
      alert("Transaction ID does not match. Please verify and try again.");
    }
  };

  const openEmailDraft = (order: OrderData) => {
    const subject = `Mishaki - Order Confirmed (${order.order_number})`;
    let body = `Dear ${order.customer_name},\n\nGreat news! Your order ${order.order_number} has been confirmed.\n\nTotal Amount: ৳${order.total_amount.toFixed(2)}\n\nShipping Details:\n`;
    if (order.house_number) body += `House/Name: ${order.house_number}\n`;
    body += `${order.street_address}\n`;
    if (order.address_description) body += `Instructions: ${order.address_description}\n`;
    body += `${order.city}, ${order.postal_code}\n\nThank you for shopping with Mishaki!\n`;

    setEmailSubject(subject);
    setEmailBody(body);
    setDraftEmailOpen(order);
    setOpenDropdownId(null);
  };

  const handleSendEmail = async () => {
    if (!draftEmailOpen) return;
    try {
      setIsSendingEmail(true);
      await sendOrderEmail(draftEmailOpen.id, emailSubject, emailBody);
      alert("Email sent successfully!");
      setDraftEmailOpen(null);
    } catch (error) {
      console.error("Failed to send email", error);
      alert("Failed to send email. Please check your SMTP configuration.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleOpenCancelModal = (order: OrderData) => {
    setCancelOrder(order);
    setOpenDropdownId(null);
    const initialQty: Record<number, number> = {};
    order.items?.forEach(item => {
      initialQty[item.id] = 0; // Default 0 cancellation
    });
    setCancelQuantities(initialQty);
  };

  const handlePartialCancel = async () => {
    if (!cancelOrder) return;
    
    // Check if any items are being cancelled
    const itemsToCancel = Object.entries(cancelQuantities)
      .map(([id, qty]) => ({ item_id: parseInt(id), cancel_quantity: qty }))
      .filter(i => i.cancel_quantity > 0);
      
    if (itemsToCancel.length === 0) {
      alert("Please select at least one item to cancel.");
      return;
    }
    
    try {
      setIsCancelling(true);
      await cancelOrderItems(cancelOrder.id, itemsToCancel);
      setCancelOrder(null);
      await loadOrders(); // Refresh orders after update
    } catch (error) {
      console.error("Failed to cancel items", error);
      alert("Failed to cancel items. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Filter logic: apply status filter, then search query
  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === "All" || 
                          order.status === filter || 
                          (filter === "Pending" && order.status === "Confirmed");
    const matchesSearch = order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.order_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="animate-slide-up flex flex-col gap-6 relative">
      
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
                placeholder="Search orders by customer or ID..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 text-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="animate-spin w-8 h-8 border-4 border-red-900 border-t-transparent rounded-full mb-4"></div>
                      <p className="text-base font-medium text-gray-900">Loading orders...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-zinc-50 hover:bg-zinc-50/80 transition-colors group">
                    
                    {/* Order ID & Items */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{order.order_number}</p>
                          <p className="text-xs text-gray-500">{order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'item' : 'items'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{order.email}</p>
                      {order.phone && <p className="text-xs text-gray-500 mt-0.5">{order.phone}</p>}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>

                    {/* Total Amount & TrxID */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">৳{order.total_amount.toFixed(2)}</p>
                      {order.transaction_id && (
                        <p className="text-xs text-pink-700 font-medium mt-1">Trx: {order.transaction_id}</p>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border
                        ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                        ${order.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                        ${order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                        ${order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="px-6 py-4 text-right relative">
                      {order.status === 'Completed' ? (
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-lg opacity-80 hover:opacity-100 hover:bg-gray-200 transition-all"
                        >
                          Order History
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={() => setOpenDropdownId(openDropdownId === order.id ? null : order.id)}
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-zinc-100 rounded-lg transition-colors focus:outline-none"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {openDropdownId === order.id && (
                            <div className="absolute right-6 top-12 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-10 py-2 px-2 text-left">
                              {order.status === 'Pending' && (
                                <div className="mb-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    {order.payment_method === 'Cash on Delivery' ? 'Verify COD Pre-payment TrxID' : 'Verify bKash TrxID'}
                                  </label>
                                  <input 
                                    type="text" 
                                    placeholder={order.payment_method === 'Cash on Delivery' ? "Paste TRX for COD Pre-delivery charge" : "Paste TRX number from your bkash"}
                                    value={trxInputs[order.id] || ""}
                                    onChange={(e) => setTrxInputs({...trxInputs, [order.id]: e.target.value})}
                                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md mb-2 focus:outline-none focus:border-red-400 text-black"
                                  />
                                  <button 
                                    onClick={() => handleVerifyAndConfirm(order)}
                                    className="w-full text-center px-3 py-1.5 text-sm font-bold text-white bg-red-900 hover:bg-red-950 rounded-md transition-colors"
                                  >
                                    Verify & Confirm
                                  </button>
                                </div>
                              )}

                              {order.status === 'Confirmed' && (
                                <>
                                  <button 
                                    onClick={() => handleUpdateStatus(order.id, 'Completed')}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors rounded-lg mb-1"
                                  >
                                    Mark as Delivered
                                  </button>
                                  <button 
                                    onClick={() => openEmailDraft(order)}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors rounded-lg mb-1"
                                  >
                                    Draft & Send Email
                                  </button>
                                </>
                              )}

                              <button 
                                onClick={() => handleOpenCancelModal(order)}
                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                              >
                                Cancel Order
                              </button>
                            </div>
                          )}
                        </>
                      )}
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

      {/* PARTIAL CANCEL MODAL */}
      {cancelOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={() => !isCancelling && setCancelOrder(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Cancel Order Items</h2>
                <p className="text-sm text-gray-500 mt-1">{cancelOrder.order_number}</p>
              </div>
              <button 
                onClick={() => !isCancelling && setCancelOrder(null)}
                disabled={isCancelling}
                className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-900 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 bg-zinc-50/50">
              <p className="text-sm text-gray-600 mb-4">
                Select the quantity of each item you want to cancel. Cancelled items will be restocked to inventory.
              </p>
              
              <div className="space-y-4">
                {cancelOrder.items?.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg bg-zinc-100 overflow-hidden shrink-0">
                      <Image 
                        src={getImageUrl(item.image_url)} 
                        alt={item.product_name || "Product image"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{item.product_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                          Size: {item.variant}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          ৳{item.unit_price} x {item.quantity}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cancel Qty</label>
                      <input 
                        type="number"
                        min={0}
                        max={item.quantity}
                        value={cancelQuantities[item.id] || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          if (val >= 0 && val <= item.quantity) {
                            setCancelQuantities({ ...cancelQuantities, [item.id]: val });
                          }
                        }}
                        className="w-16 px-2 py-1 text-center border border-gray-200 rounded-md text-sm text-black focus:outline-none focus:border-red-400"
                        disabled={isCancelling}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setCancelOrder(null)}
                disabled={isCancelling}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={handlePartialCancel}
                disabled={isCancelling}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* EMAIL DRAFT MODAL */}
      {draftEmailOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={() => !isSendingEmail && setDraftEmailOpen(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Draft Confirmation Email</h2>
                <p className="text-sm text-gray-500 mt-1">Editing email for {draftEmailOpen.customer_name} ({draftEmailOpen.email})</p>
              </div>
              <button 
                onClick={() => setDraftEmailOpen(null)}
                disabled={isSendingEmail}
                className="p-2 text-gray-400 bg-gray-50 rounded-full hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Editor */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  disabled={isSendingEmail}
                  className="w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Message Body</label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  disabled={isSendingEmail}
                  rows={12}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-3xl">
              <button
                onClick={() => setDraftEmailOpen(null)}
                disabled={isSendingEmail}
                className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isSendingEmail}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSendingEmail ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  "Send Email"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDER HISTORY MODAL */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedOrder.order_number}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-900 hover:bg-red-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Customer Details */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Customer Details</h3>
                  <div className="space-y-1.5 text-sm text-gray-600">
                    <p><span className="font-medium text-gray-900">Name:</span> {selectedOrder.customer_name}</p>
                    <p><span className="font-medium text-gray-900">Email:</span> {selectedOrder.email}</p>
                    <p><span className="font-medium text-gray-900">Phone:</span> {selectedOrder.phone}</p>
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Delivery Info</h3>
                  <div className="space-y-1.5 text-sm text-gray-600">
                    {selectedOrder.house_number && (
                      <p><span className="font-medium text-gray-900">House/Name:</span> {selectedOrder.house_number}</p>
                    )}
                    <p><span className="font-medium text-gray-900">Address:</span> {selectedOrder.street_address}</p>
                    {selectedOrder.address_description && (
                      <p><span className="font-medium text-gray-900">Description:</span> {selectedOrder.address_description}</p>
                    )}
                    <p><span className="font-medium text-gray-900">City:</span> {selectedOrder.city}, {selectedOrder.postal_code}</p>
                    <p><span className="font-medium text-gray-900">Payment:</span> {selectedOrder.payment_method} ({selectedOrder.payment_status})</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Ordered Items</h3>
              <div className="space-y-4 mb-8">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1 relative">
                      <Image src={getImageUrl(item.image_url)} alt={item.product_name || "Product image"} fill className="object-contain mix-blend-multiply p-1" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.product_name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Variant: {item.variant} • Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-gray-900 text-right min-w-[80px]">
                      ৳{item.total_price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span>৳{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 font-medium">
                  <span>Shipping Fee</span>
                  <span>৳{selectedOrder.shipping_fee.toFixed(2)}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between items-center text-sm text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-৳{selectedOrder.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                  <span className="text-lg font-bold text-gray-900">Total Paid</span>
                  <span className="text-2xl font-black text-red-900">৳{selectedOrder.total_amount.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}