"use client";

import { useState, useEffect } from "react";
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
  Percent,
  RefreshCcw,
  Trash2
} from 'lucide-react';
import {
  getProducts,
  createProduct,
  deleteProduct,
  applyProductDiscount,
  getCategories,
  uploadProductImage,
  ProductData,
  ProductCreateInput,
  CategoryData,
  getImageUrl,
  getInventoryLogs,
  InventoryLogData
} from "../lib/api";
import Image from "next/image";

const AVAILABLE_SIZES = ['M 38', 'L 40', 'XL 42', 'XL 44', 'XXL 46'];

export default function ProductPage() {
  const [activeTab, setActiveTab] = useState("management");

  // --- API DATA ---
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- CREATE FORM STATE ---
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    buying_price: "",
    selling_price: "",
    material: "",
    color: "",
    category_id: "",
    is_dynamic_stock: false,
  });
  const [saving, setSaving] = useState(false);

  // --- STATE FOR DYNAMIC SIZES & QUANTITIES ---
  const [sizeConfig, setSizeConfig] = useState<Record<string, { selected: boolean; qty: number }>>(
    AVAILABLE_SIZES.reduce((acc, size) => ({ ...acc, [size]: { selected: false, qty: 0 } }), {})
  );

  // --- IMAGE UPLOAD STATE ---
  const [uploadedImages, setUploadedImages] = useState<{ image_url: string; is_main: boolean; sort_order: number }[]>([]);
  const [uploading, setUploading] = useState(false);

  // --- STATE FOR DISCOUNT MODAL ---
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [discountValue, setDiscountValue] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData, logsData] = await Promise.all([
        getProducts(),
        getCategories(),
        getInventoryLogs()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setInventoryLogs(logsData);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSize = (size: string) => {
    setSizeConfig(prev => ({
      ...prev,
      [size]: {
        selected: !prev[size].selected,
        qty: !prev[size].selected ? 1 : 0
      }
    }));
  };

  const updateSizeQty = (size: string, quantity: string) => {
    setSizeConfig(prev => ({
      ...prev,
      [size]: { ...prev[size], qty: Math.max(0, parseInt(quantity) || 0) }
    }));
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.selling_price) {
      alert("Name and Selling Price are required.");
      return;
    }

    setSaving(true);
    try {
      const selectedSizes = Object.keys(sizeConfig)
        .filter(size => sizeConfig[size].selected)
        .map(size => ({ size, stock: sizeConfig[size].qty }));

      let totalStock = selectedSizes.reduce((acc, s) => acc + s.stock, 0);

      const newProduct: ProductCreateInput = {
        name: formData.name,
        sku: formData.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
        description: formData.description,
        buying_price: parseFloat(formData.buying_price) || 0,
        selling_price: parseFloat(formData.selling_price) || 0,
        price: parseFloat(formData.selling_price) || 0, // Fallback/alias
        material: formData.material,
        color: formData.color,
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
        stock_quantity: formData.is_dynamic_stock ? 0 : totalStock,
        sizes: formData.is_dynamic_stock ? [] : selectedSizes,
        images: uploadedImages,
        is_active: true,
        is_dynamic_stock: formData.is_dynamic_stock
      };

      await createProduct(newProduct);

      // Reset form
      setFormData({
        name: "",
        sku: "",
        description: "",
        buying_price: "",
        selling_price: "",
        material: "",
        color: "",
        category_id: "",
        is_dynamic_stock: false,
      });
      setSizeConfig(AVAILABLE_SIZES.reduce((acc, size) => ({ ...acc, [size]: { selected: false, qty: 0 } }), {}));
      setUploadedImages([]);

      await fetchProducts();
    } catch (err: any) {
      alert("Error saving product: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    try {
      const files = Array.from(e.target.files);
      const newImages = [...uploadedImages];

      for (const file of files) {
        const result = await uploadProductImage(file);
        // If it's the first image uploaded, make it the main one
        const isMain = newImages.length === 0;
        newImages.push({
          image_url: result.image_url,
          is_main: isMain,
          sort_order: newImages.length
        });
      }

      setUploadedImages(newImages);
      // clear the input
      e.target.value = '';
    } catch (err: any) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    // If we removed the main image, make the first one the main
    if (newImages.length > 0 && !newImages.some(img => img.is_main)) {
      newImages[0].is_main = true;
    }
    setUploadedImages(newImages);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  // --- MODAL HANDLERS ---
  const handleOpenDiscount = (product: ProductData) => {
    setSelectedProduct(product);
    setDiscountValue(product.discount_percentage ? product.discount_percentage.toString() : "");
    setDiscountModalOpen(true);
  };

  const handleCloseDiscount = () => {
    setDiscountModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 200);
  };

  const handleApplyDiscount = async () => {
    if (!selectedProduct) return;
    try {
      await applyProductDiscount(selectedProduct.id, parseFloat(discountValue) || 0);
      handleCloseDiscount();
      await fetchProducts();
    } catch (err: any) {
      alert("Failed to apply discount: " + err.message);
    }
  };

  const hasSelectedSizes = AVAILABLE_SIZES.some(size => sizeConfig[size].selected);

  return (
    <div className="animate-slide-up flex flex-col gap-6">

      {/* PAGE HEADER & TABS */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your clothing catalog, inventory logs, and product variants.</p>
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
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Heavyweight Hoodie" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="e.g. SKU-1234" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input type="text" name="color" value={formData.color} onChange={handleInputChange} placeholder="e.g. Vintage Blue" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select name="category_id" value={formData.category_id} onChange={handleInputChange as any} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                    <option value="">Select Category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buying Price (USD)</label>
                  <input type="number" name="buying_price" value={formData.buying_price} onChange={handleInputChange} placeholder="0.00" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (USD)</label>
                  <input type="number" name="selling_price" value={formData.selling_price} onChange={handleInputChange} placeholder="0.00" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-1">Material</label>
                  <input type="text" name="material" value={formData.material} onChange={handleInputChange} placeholder="e.g. 100% Organic Cotton" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm-black focus:outline-none focus:ring-2 focus:ring-red-500/20  focus:border-red-500" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                  <textarea rows={3} name="description" value={formData.description} onChange={handleInputChange} placeholder="Briefly describe the product, fit, and care instructions..." className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image(s) <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className={`w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-zinc-200 file:text-zinc-700 ${uploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:file:bg-zinc-300'}`}
                  />
                  {uploading && <div className="text-sm text-red-600 mt-2 flex items-center gap-2"><RefreshCcw className="w-4 h-4 animate-spin" /> Uploading...</div>}

                  {/* Image Previews */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-4">
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-zinc-200 w-24 h-24">
                          <Image src={getImageUrl(img.image_url)} alt="preview" fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="bg-white text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors shadow-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {img.is_main && (
                            <div className="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                              MAIN
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* DYNAMIC STOCK TOGGLE */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-100 transition-colors">
                    <input 
                      type="checkbox"
                      checked={formData.is_dynamic_stock}
                      onChange={(e) => setFormData({...formData, is_dynamic_stock: e.target.checked})}
                      className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">Enable Dynamic Stock</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">If checked, all sizes will appear on the product page. Stock tracking and upfront expenses are bypassed.</p>
                    </div>
                  </label>
                </div>

                {/* SIZES AND QUANTITIES SECTION */}
                {!formData.is_dynamic_stock && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes & Starting Inventory</label>
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

                  {/* Dynamic Quantity Inputs */}
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
                              className="w-full bg-zinc-50 border border-zinc-200 rounded text-center text-sm text-black font-medium py-1 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                )}

                <div className="md:col-span-2 mt-4">
                  <button onClick={handleSaveProduct} disabled={saving} type="button" className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
                    {saving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    Save Product to Shelf
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Shelf */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-red-700" />
                  <h2 className="text-lg font-bold text-gray-900">Current Shelf</h2>
                </div>
                <button onClick={fetchProducts} className="text-gray-400 hover:text-red-600">
                  <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {loading && products.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Loading shelf...</div>
              ) : error ? (
                <div className="flex-1 flex items-center justify-center text-sm text-red-500">{error}</div>
              ) : products.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Shelf is empty</div>
              ) : (
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 max-h-[800px]">
                  {products.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenDiscount(item)}
                      className="p-4 border border-zinc-100 rounded-xl bg-zinc-50 hover:border-red-200 hover:bg-red-50/30 transition-colors group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 text-sm group-hover:text-red-700 transition-colors line-clamp-1">{item.name}</h3>
                        <span className="font-semibold text-gray-900 text-sm shrink-0 whitespace-nowrap ml-2">
                          ${item.selling_price?.toFixed(2) || item.price?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="bg-white px-2 py-0.5 rounded border border-zinc-200 font-mono">{item.sku}</span>
                        {item.color && <span>{item.color}</span>}
                        {item.discount_percentage > 0 && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">-{item.discount_percentage}%</span>}
                      </div>
                      <div className="mt-3 pt-3 border-t border-zinc-100/50 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${item.total_stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {item.total_stock} in stock
                          </span>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(item.id);
                            }}
                            className="text-gray-400 hover:text-red-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                {inventoryLogs.map((log) => (
                  <tr key={log.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{log.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide
                        ${log.type === 'Input' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}
                      `}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{log.product_name} {log.size ? `(${log.size})` : ''}</td>
                    <td className={`px-6 py-4 font-bold ${log.qty > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {log.qty > 0 ? `+${log.qty}` : log.qty}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{log.ref_id}</td>
                  </tr>
                ))}
                {inventoryLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No inventory history found.
                    </td>
                  </tr>
                )}
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

            <div className="p-6">
              <div className="flex gap-4 mb-5 items-center">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <div className="relative w-16 h-16 rounded-lg bg-zinc-100 overflow-hidden shrink-0">
                    <Image src={getImageUrl(selectedProduct.images[0].image_url)} alt={selectedProduct.name || "Product image"} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-zinc-100 flex items-center justify-center">
                    <Tag className="w-6 h-6 text-zinc-300" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{selectedProduct.name}</h4>
                  <p className="text-xs text-gray-500">SKU: {selectedProduct.sku}</p>
                  <p className="text-xs text-gray-500">Regular Price: ৳{selectedProduct.selling_price || selectedProduct.price}</p>
                </div>
              </div>

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
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-4 pr-10 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium"
                  />
                  <Percent className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" />
                </div>
                
                {discountValue && parseFloat(discountValue) > 0 && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <p className="text-xs text-emerald-800 font-medium flex justify-between items-center">
                      <span>New Adjusted Price:</span>
                      <span className="font-bold text-emerald-600 text-lg">
                        ৳{((selectedProduct.selling_price || selectedProduct.price || 0) * (1 - (parseFloat(discountValue) || 0) / 100)).toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}
              </div>

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