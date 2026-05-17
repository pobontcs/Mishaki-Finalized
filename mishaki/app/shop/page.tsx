"use client";
import { useState } from "react";
// 1. ADD THIS IMPORT for Next.js navigation
import { useRouter } from "next/navigation"; 

import CardModule from "../contents/card";
import ProductModal from "../contents/ProductModal"; 
import { Header } from "../contents/Header";
import { Search, ShoppingCart } from "lucide-react"; 

const demoProducts = [
  { 
    id: 1, 
    title: "Nike Air Max 270", 
    price: 139.99, 
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", 
    variant: "WOMEN SHOES", 
    category: "Western", 
    quantity: 1,
    description: "The Nike Air Max 270 delivers visible air under every step. Updated for modern comfort, it nods to the original 1991 Air Max 180."
  },
  { 
    id: 2, 
    title: "Nike Joyride Run", 
    price: 110.00, 
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&q=80", 
    variant: "RUNNING SHOES", 
    category: "Daily Life", 
    quantity: 1,
    description: "Tiny foam beads underfoot conform to your foot for cushioning that stands up to your mileage. Perfect for daily runs."
  },
  { 
    id: 3, 
    title: "Nike React Infinity", 
    price: 160.00, 
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80", 
    variant: "MEN SHOES", 
    category: "Traditional", 
    quantity: 1,
    description: "Designed to help reduce injury and keep you on the run. More foam and improved upper details provide a secure and cushioned feel."
  },
];

const CATEGORIES = ["All", "Traditional", "Western", "Daily Life"];

export default function Shop() {
  // 2. INITIALIZE THE ROUTER
  const router = useRouter();

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  if (typeof window !== 'undefined') {
    document.body.style.overflow = selectedProduct ? 'hidden' : 'unset';
  }

  const filteredProducts = demoProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8 relative">
      <Header centerText="MISHAKI" className="mb-5 rounded-3xl" />
      
      <div className="mb-8 mt-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 font-medium transition-all outline-none"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300
                ${activeCategory === category 
                  ? 'bg-red-900 text-white shadow-md shadow-red-900/20' 
                  : 'bg-zinc-50 text-gray-500 hover:bg-zinc-100 hover:text-gray-900 border border-transparent hover:border-gray-200'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

      </div>

      <h2 className="text-3xl font-black text-gray-900 mb-8 ml-2">
        {searchQuery ? `Results for "${searchQuery}"` : activeCategory === "All" ? "New Arrivals" : `${activeCategory} Collection`}
      </h2>
      
      {filteredProducts.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {filteredProducts.map((product) => (
            <CardModule 
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              variant={product.variant}
              quantity={product.quantity}
              onClickImage={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      ) : (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <Search size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 max-w-md">We couldn't find anything matching "{searchQuery}" in the {activeCategory} category.</p>
          <button 
            onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
            className="mt-6 px-6 py-3 bg-red-900 text-white font-bold rounded-xl hover:bg-red-950 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      {/* --- FLOATING ACTION BUTTON (CART) --- */}
      <button 
        // 3. USE THE ROUTER TO NAVIGATE ON CLICK
        onClick={() => router.push('/Cart')}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-red-900 text-white p-4 md:p-5 rounded-full shadow-2xl shadow-red-900/40 hover:bg-red-950 hover:-translate-y-1 hover:scale-105 transition-all duration-300 z-40 group"
        aria-label="View Cart"
      >
        <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 group-hover:animate-bounce" />
        
        <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-gray-900 text-white text-xs font-black w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
          2
        </span>
      </button>

    </div>
  );
}