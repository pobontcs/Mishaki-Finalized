import { useState } from "react"; // 1. IMPORT useState
import { X, Heart, ShoppingBag, Star, Truck, Shield, Plus, Minus } from "lucide-react"; // 2. IMPORT Plus and Minus

interface ProductModalProps {
  product: any;
  onClose: () => void;
}

// Fallback sizes if your product data doesn't have them yet
const AVAILABLE_SIZES = ['US 6', 'US 7', 'US 8', 'US 9', 'US 10'];

export default function ProductModal({ product, onClose }: ProductModalProps) {
  // 3. ADD STATE for Size and Quantity
  const [selectedSize, setSelectedSize] = useState<string>(AVAILABLE_SIZES[1]); // Default to second size
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) return null;

  const safePrice = Number(product.price) || 0;
  const originalPrice = (safePrice * 1.2).toFixed(2);

  // 4. Handle Adding to Cart
  const handleAddToCart = () => {
    alert(`Added to Cart: ${quantity}x ${product.title} (Size: ${selectedSize})`);
    // In the future, this is where you trigger your global cart function!
    onClose(); 
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full text-gray-400 hover:text-red-900 hover:bg-red-50 transition-colors shadow-sm border border-gray-100"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col lg:flex-row p-6 md:p-8 gap-8 lg:gap-12">
          
          {/* IMAGE SECTION */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative w-full bg-[#f8f9fa] rounded-3xl aspect-square flex items-center justify-center p-8">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl"
              />
            </div>
          </div>

          {/* PRODUCT DETAILS SECTION */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <span className="text-red-900 font-bold tracking-widest text-sm uppercase mb-2">
              {product.variant}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-extrabold text-gray-900">${safePrice.toFixed(2)}</span>
              <span className="text-xl font-medium text-gray-400 line-through">${originalPrice}</span>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {product.description}
              </p>
            </div>

            {/* ========================================= */}
            {/* NEW: SIZE SELECTOR */}
            {/* ========================================= */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-gray-900">Select Size</h3>
                <button className="text-sm font-bold text-red-900 hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {AVAILABLE_SIZES.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-16 h-12 rounded-xl border-2 font-bold transition-all duration-200 ${
                      selectedSize === size 
                        ? 'border-red-900 bg-red-900 text-white shadow-md shadow-red-900/20' 
                        : 'border-gray-200 text-gray-700 hover:border-red-900 hover:text-red-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ========================================= */}
            {/* NEW: QUANTITY SELECTOR */}
            {/* ========================================= */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center justify-between w-36 bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="text-gray-400 hover:text-red-900 transition-colors p-1"
                >
                  <Minus size={18} strokeWidth={3} />
                </button>
                
                <span className="font-bold text-gray-900 text-lg tabular-nums">
                  {quantity}
                </span>
                
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="text-gray-400 hover:text-red-900 transition-colors p-1"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* ADD TO CART BUTTON */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-red-900 hover:bg-red-950 text-white text-lg font-black rounded-2xl py-4 flex justify-center items-center gap-3 shadow-xl shadow-red-900/20 transition-all active:scale-[0.98] mb-6"
            >
              <ShoppingBag size={22} />
              ADD TO CART • ${(safePrice * quantity).toFixed(2)}
            </button>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                <Truck className="text-red-900" size={20} /> Free Delivery
              </div>
              <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                <Shield className="text-red-900" size={20} /> 1 Year Warranty
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}