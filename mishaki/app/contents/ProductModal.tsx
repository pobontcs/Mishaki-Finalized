import { useState } from "react";
import { X, Heart, ShoppingBag, Star, Truck, Shield, Plus, Minus } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { getImageUrl } from "../lib/api";
import Image from "next/image";

interface ProductModalProps {
  product: any;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  
  // Only show sizes that were inputted in admin panel, unless it's dynamic stock
  const allSizes = ['M 38', 'L 40', 'XL 42', 'XL 44', 'XXL 46'];
  const availableSizes = product.is_dynamic_stock 
    ? allSizes 
    : (product.sizes && product.sizes.length > 0 ? product.sizes.map((s: any) => s.size) : []);

  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string | null>(
    product?.images && product.images.length > 0 ? product.images[0].image_url : null
  );
  const [showSizeGuide, setShowSizeGuide] = useState(false);


  if (!product) return null;

  const basePrice = Number(product.price) || 0;
  const safePrice = basePrice + (selectedSize === "XXL 46" ? 100 : 0);
  const originalPrice = (safePrice * 1.2).toFixed(2);

  const handleAddToCart = () => {
    addItem({
      id: Date.now(), // Generate a unique ID for the cart item entry
      product_id: product.id,
      title: product.name || product.title,
      price: safePrice,
      image: product.image || product.main_image,
      variant: selectedSize,
      quantity: quantity
    });
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
            <div className="relative w-full bg-[#f8f9fa] rounded-3xl aspect-square flex items-center justify-center p-8 overflow-hidden">
              <Image 
                src={getImageUrl(activeImage || product.image || product.main_image)} 
                alt={product.title || "Product image"}
                fill
                className="object-contain mix-blend-multiply drop-shadow-2xl transition-all duration-300 p-8"
              />
            </div>
            
            {/* THUMBNAILS */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img: any, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img.image_url)}
                    className={`relative w-20 h-20 rounded-xl flex-shrink-0 bg-[#f8f9fa] border-2 transition-all p-2 ${
                      (activeImage === img.image_url) 
                        ? 'border-red-900 opacity-100' 
                        : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200'
                    }`}
                  >
                    <Image 
                      src={getImageUrl(img.image_url)} 
                      alt={`${product.title || "Product"} - view ${idx + 1}`}
                      fill
                      className="object-contain mix-blend-multiply p-2"
                    />
                  </button>
                ))}
              </div>
            )}
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
              <span className="text-4xl font-extrabold text-gray-900">৳{safePrice.toFixed(2)}</span>
              <span className="text-xl font-medium text-gray-400 line-through">৳{originalPrice}</span>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {product.description}
              </p>
            </div>

            {/* ========================================= */}
            {/* NEW: SIZE SELECTOR */}
            {/* ========================================= */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-900">Select Size</h3>
                  <button onClick={() => setShowSizeGuide(true)} className="text-sm font-bold text-red-900 hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size: string) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[4rem] px-3 h-12 rounded-xl border-2 font-bold transition-all duration-200 ${
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
            )}

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
              ADD TO CART • ৳{(safePrice * quantity).toFixed(2)}
            </button>


          </div>
        </div>
      </div>

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowSizeGuide(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs overflow-hidden border border-gray-100" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Size Guide</h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-gray-400 hover:text-red-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-xs uppercase tracking-wider text-gray-500 font-semibold">Size</th>
                    <th className="py-2 text-xs uppercase tracking-wider text-gray-500 font-semibold text-right">Chest / Fit</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-gray-900">M</td>
                    <td className="py-3 text-gray-600 text-right">38</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-gray-900">L</td>
                    <td className="py-3 text-gray-600 text-right">40</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-gray-900">XL</td>
                    <td className="py-3 text-gray-600 text-right">42</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-gray-900">XL</td>
                    <td className="py-3 text-gray-600 text-right">44</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-gray-900">XXL</td>
                    <td className="py-3 text-gray-600 text-right">46</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 p-3 bg-red-50 rounded-lg text-xs text-red-900 font-medium text-center">
                Note: XXL 46 costs ৳100 extra.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}