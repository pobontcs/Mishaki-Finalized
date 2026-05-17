import { ShoppingBagIcon, Plus, Minus, Heart } from "lucide-react";

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
    <div className="bg-white rounded-[2rem] p-4 w-full max-w-[340px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-zinc-100 m-2 transition-transform duration-300 group">
      
      {/* 1. IMAGE CONTAINER (ONLY THIS PART IS CLICKABLE) */}
      <div 
        onClick={onClickImage} 
        className="relative w-full bg-[#f8f9fa] rounded-3xl aspect-square flex items-center justify-center p-6 mb-5 cursor-pointer hover:shadow-md transition-shadow"
      >
        <button 
          onClick={(e) => e.stopPropagation()} 
          className="absolute top-4 right-4 text-red-900 hover:scale-110 transition-transform z-10"
        >
          <Heart className="w-6 h-6 fill-current opacity-20 hover:opacity-100" />
        </button>
        
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* 2. TEXT & INFO AREA */}
      <div className="px-2">
        <h3 className="text-xl font-extrabold text-gray-900 leading-tight">{title}</h3>
        <span className="inline-block mt-2 px-3 py-1 bg-red-50 text-red-900 text-xs font-bold uppercase tracking-wider rounded-lg">
          {variant}
        </span>

        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-2xl font-extrabold text-gray-900">${safePrice.toFixed(2)}</span>
          <span className="text-sm font-medium text-gray-400 line-through">${originalPrice}</span>
        </div>

        {/* 3. ACTION BUTTONS ROW */}
        <div className="flex items-center justify-between gap-3 mt-6">
          <div className="flex items-center justify-between w-32 bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-3">
            <button 
              onClick={() => onUpdateQuantity && onUpdateQuantity(id, Math.max(1, quantity - 1))} 
              className="text-gray-400 hover:text-red-900 transition-colors p-1"
            >
              <Minus size={18} strokeWidth={3} />
            </button>
            <span className="font-bold text-gray-900 text-lg tabular-nums">{quantity}</span>
            <button 
              onClick={() => onUpdateQuantity && onUpdateQuantity(id, quantity + 1)} 
              className="text-gray-400 hover:text-red-900 transition-colors p-1"
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>

          <button 
            onClick={() => onAddToCart && onAddToCart(id)}
            className="flex-1 bg-red-900 hover:bg-red-950 text-white font-bold rounded-2xl py-3.5 px-1 flex justify-center items-center gap-2 shadow-lg shadow-red-900/20 transition-all active:scale-95"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}