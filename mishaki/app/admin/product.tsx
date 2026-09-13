"use client";

import { useState } from "react";
import { 
  Package, 
  History, 
  Upload, 
  Plus, 
  Shirt, 
  Image as ImageIcon,
  ArrowRightLeft,
  Tag,
  X,
  Percent
} from 'lucide-react';

// --- MOCK DATA ---
const mockShelf = [
  { id: "SKU-C001", name: "Classic Cotton T-Shirt", price: "$24.99", stock: 145, color: "Navy" },
  { id: "SKU-C002", name: "Denim Trucker Jacket", price: "$89.00", stock: 32, color: "Vintage Blue" },
  { id: "SKU-C003", name: "Fleece Jogger Pants", price: "$45.50", stock: 78, color: "Heather Grey" },
];

const mockHistory = [
  { date: "Oct 26, 2023", type: "Output", product: "Classic Cotton T-Shirt", qty: -2, refId: "Sold ID: #ORD-9021", status: "Shipped" },
  { date: "Oct 25, 2023", type: "Output", product: "Denim Trucker Jacket", qty: -1, refId: "Sold ID: #ORD-9020", status: "Pending" },
  { date: "Oct 24, 2023", type: "Input", product: "Fleece Jogger Pants", qty: 50, refId: "PO-RESTOCK-089", status: "Received" },
  { date: "Oct 22, 2023", type: "Output", product: "Classic Cotton T-Shirt", qty: -1, refId: "Sold ID: #ORD-9018", status: "Shipped" },
];

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductPage() {
  const [activeTab, setActiveTab] = useState("management");

  // --- STATE FOR DYNAMIC SIZES & QUANTITIES ---
  const [sizeConfig, setSizeConfig] = useState(
    AVAILABLE_SIZES.reduce((acc, size) => ({ ...acc, [size]: { selected: false, qty: 0 } }), {})
  );

  // --- STATE FOR DISCOUNT MODAL ---
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discountValue, setDiscountValue] = useState("");

  const toggleSize = (size) => {
    setSizeConfig(prev => ({
      ...prev,
      [size]: { 
        selected: !prev[size].selected, 
        qty: !prev[size].selected ? 1 : 0 // Default to 1 if selecting, reset to 0 if deselecting
      }
    }));
  };

  const updateSizeQty = (size, quantity) => {
    setSizeConfig(prev => ({
      ...prev,
      [size]: { ...prev[size], qty: Math.max(0, parseInt(quantity) || 0) }
    }));
  };

  // --- MODAL HANDLERS ---
  const handleOpenDiscount = (product) => {
    setSelectedProduct(product);
    setDiscountValue(""); // Reset input on open
    setDiscountModalOpen(true);
  };

  const handleCloseDiscount = () => {
    setDiscountModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 200); // Clear after animation
  };

  const handleApplyDiscount = () => {
    // Add your backend/save logic here
    console.log(`Applying ${discountValue}% discount to ${selectedProduct.name}`);
    handleCloseDiscount();
  };

  // Check if any sizes are currently selected to render the quantity UI
  const hasSelectedSizes = AVAILABLE_SIZES.some(size => sizeConfig[size].selected);

  return (
    <div className="animate-slide-up flex flex-col gap-6">
      
      {/* PAGE HEADER & TABS */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your clothing catalog, images, and inventory logs.</p>
      </div>

      <div className="flex flex-row gap-6 border-b border-zinc-200">
        <button
          onClick={() => setActiveTab("management")}
          className={`pb-4 text-sm font-medium transition-colors relative flex items-center gap-2
            ${activeTab === "management" ? "text-red-700" : "text-gray-500 hover:text-gray-900"}`}
        >
          <Package className="w-4 h-4" />
          Catalog & Media
          {activeTab === "management" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full"></span>}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-4 text-sm font-medium transition-colors relative flex items-center gap-2
            ${activeTab === "history" ? "text-red-700" : "text-gray-500 hover:text-gray-900"}`}
        >
          <History className="w-4 h-4" />
          Input / Output History
          {activeTab === "history" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full"></span>}
        </button>
      </div>

      {/* ==========================================
          TAB 1: CATALOG & MEDIA 
          ========================================== */}
      {activeTab === "management" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
          
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* SECTION A: Product Input */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shirt className="w-5 h-5 text-red-700" />
                <h2 className="text-lg font-bold text-gray-900">Add New Clothing Item</h2>
              </div>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input type="text" placeholder="e.g. Heavyweight Hoodie" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                  <input type="number" placeholder="0.00" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <input type="text" placeholder="e.g. 100% Organic Cotton" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                  <textarea rows={3} placeholder="Briefly describe the product, fit, and care instructions..." className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image(s) <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input type="file" multiple accept="image/*" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer transition-colors" />
                </div>

                {/* SIZES AND QUANTITIES SECTION */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                  <div className="flex flex-wrap gap-3">
                    {AVAILABLE_SIZES.map(size => (
                      <button 
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`flex items-center justify-center w-12 h-12 rounded-xl border text-sm font-bold transition-all
                          ${sizeConfig[size].selected 
                            ? 'border-red-600 bg-red-50 text-red-700 shadow-sm' 
                            : 'border-zinc-200 bg-zinc-50 text-gray-500 hover:border-red-300 hover:text-red-500'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Quantity Inputs (Only shows if a size is selected) */}
                  {hasSelectedSizes && (
                    <div className="mt-4 p-5 bg-zinc-50 border border-zinc-200 rounded-xl animate-slide-up">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Set Starting Inventory</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {AVAILABLE_SIZES.filter(size => sizeConfig[size].selected).map(size => (
                          <div key={`qty-${size}`} className="flex items-center gap-3 bg-white p-2 border border-zinc-200 rounded-lg shadow-sm">
                            <span className="w-8 text-center text-sm font-bold text-gray-900">{size}</span>
                            <input 
                              type="number" 
                              min="0"
                              value={sizeConfig[size].qty}
                              onChange={(e) => updateSizeQty(size, e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-200 rounded text-center text-sm font-medium py-1 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 mt-4">
                  <button type="button" className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <Plus className="w-5 h-5" />
                    Save Product to Shelf
                  </button>
                </div>
              </form>
            </div>

            {/* SECTION B: Landing Page Media */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-red-700" />
                  <h2 className="text-lg font-bold text-gray-900">Landing Page Media (5 Slots)</h2>
                </div>
                <span className="text-xs font-medium bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md">1 Main, 4 Gallery</span>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2 row-span-2 aspect-square border-2 border-dashed border-zinc-300 rounded-xl flex flex-col items-center justify-center text-zinc-400 bg-zinc-50 hover:bg-zinc-100 hover:border-red-400 hover:text-red-500 transition-all cursor-pointer group">
                  <Upload className="w-8 h-8 mb-2 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-sm font-medium">Main Image</span>
                </div>
                
                {[2, 3, 4, 5].map((num) => (
                  <div key={num} className="aspect-square border-2 border-dashed border-zinc-300 rounded-xl flex flex-col items-center justify-center text-zinc-400 bg-zinc-50 hover:bg-zinc-100 hover:border-red-400 hover:text-red-500 transition-all cursor-pointer">
                    <Plus className="w-6 h-6" />
                    <span className="text-xs mt-1">Img {num}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Shelf */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 h-full">
              <div className="flex items-center gap-2 mb-6">
                <Tag className="w-5 h-5 text-red-700" />
                <h2 className="text-lg font-bold text-gray-900">Current Shelf</h2>
              </div>
              
              <div className="flex flex-col gap-4">
                {mockShelf.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleOpenDiscount(item)}
                    className="p-4 border border-zinc-100 rounded-xl bg-zinc-50 hover:border-red-200 hover:bg-red-50/30 transition-colors group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-red-700 transition-colors">{item.name}</h3>
                      <span className="font-semibold text-gray-900 text-sm">{item.price}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="bg-white px-2 py-1 rounded border border-zinc-200">{item.id}</span>
                      <span>Color: {item.color}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-emerald-600 font-medium">{item.stock} in stock</span>
                      {/* e.stopPropagation() prevents the modal from opening when clicking edit specifically */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Edit clicked");
                        }} 
                        className="text-gray-400 hover:text-red-600 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: HISTORY 
          ========================================== */}
      {activeTab === "history" && (
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden animate-slide-up">
          <div className="p-6 border-b border-zinc-100 flex items-center gap-2 bg-zinc-50/50">
            <ArrowRightLeft className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-bold text-gray-900">Inventory Ledger</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-zinc-100">
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Movement</th>
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Qty Change</th>
                  <th className="px-6 py-4 font-semibold">Reference / Sold ID</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {mockHistory.map((log, index) => (
                  <tr key={index} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{log.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide
                        ${log.type === 'Input' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}
                      `}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{log.product}</td>
                    <td className={`px-6 py-4 font-bold ${log.qty > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {log.qty > 0 ? `+${log.qty}` : log.qty}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{log.refId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================
          DISCOUNT MODAL
          ========================================== */}
      {discountModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up border border-zinc-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/80">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-red-600" />
                Add Discount
              </h3>
              <button 
                onClick={handleCloseDiscount} 
                className="text-gray-400 hover:text-gray-700 bg-white hover:bg-zinc-100 rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-5">
                Apply a promotional discount to <br/>
                <strong className="text-gray-900">{selectedProduct.name}</strong>.
              </p>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Discount Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium"
                  />
                  <Percent className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={handleCloseDiscount} 
                  className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApplyDiscount} 
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-600/20 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}