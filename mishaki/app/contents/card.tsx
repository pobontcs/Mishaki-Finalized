import { ShoppingBagIcon, Plus, Minus, Heart } from "lucide-react";
import { getImageUrl } from "../lib/api";
import Image from "next/image";

interface CartItemProps {
  id: string | number;
  title: string;
  price: number | string;
  image: string;
  quantity: number;
  variant?: string; 
  onUpdateQuantity?: (id: string | number, newQuantity: number) => void;
  onAddToCart?: (id: string | number) => void;
  onClickImage: () => void; // THIS IS THE TRIGGER FOR THE POPUP
}

export default function CardModule({
  id,
  title,
  price,
  image,
  quantity = 1,
  variant = "WOMEN SHOES",
  onUpdateQuantity,
  onAddToCart,
  onClickImage,
}: CartItemProps) {
  
  const safePrice = Number(price) || 0;
  const originalPrice = (safePrice * 1.2).toFixed(2); 

  return (
    <div 
      onClick={onClickImage}
      className="bg-white rounded-[2rem] p-4 w-full max-w-[340px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-zinc-100 m-2 transition-transform duration-300 group cursor-pointer"
    >
      
      {/* 1. IMAGE CONTAINER */}
      <div className="relative w-full bg-[#f8f9fa] rounded-3xl aspect-square flex items-center justify-center p-6 mb-5 group-hover:shadow-md transition-shadow overflow-hidden">
        <button 
          onClick={(e) => e.stopPropagation()} 
          className="absolute top-4 right-4 text-red-900 hover:scale-110 transition-transform z-10"
        >
          <Heart className="w-6 h-6 fill-current opacity-20 hover:opacity-100" />
        </button>
        
        <Image 
          src={getImageUrl(image)} 
          alt={title || "Product image"}
          fill
          className="object-contain mix-blend-multiply drop-shadow-xl group-hover:scale-105 transition-transform duration-500 p-6"
        />
      </div>

      {/* 2. TEXT & INFO AREA */}
      <div className="px-2">
        <h3 className="text-xl font-extrabold text-gray-900 leading-tight">{title}</h3>
        <span className="inline-block mt-2 px-3 py-1 bg-red-50 text-red-900 text-xs font-bold uppercase tracking-wider rounded-lg">
          {variant}
        </span>

        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-2xl font-extrabold text-gray-900">৳{safePrice.toFixed(2)}</span>
          <span className="text-sm font-medium text-gray-400 line-through">৳{originalPrice}</span>
        </div>

      </div>
    </div>
  );
}