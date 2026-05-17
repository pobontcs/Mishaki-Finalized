"use client";
import { useState } from "react";
import { Header } from "../contents/Header";
// Combined all the icons into a single, clean import
import { CreditCard, MapPin, Package, ShieldCheck, User, Banknote, Smartphone } from "lucide-react";

// --- DUMMY CART DATA ---
const dummyCartItems = [
  { 
    id: 1, 
    title: "Nike Air Max 270", 
    price: 139.99, 
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80", 
    variant: "WOMEN SHOES", 
    quantity: 1 
  },
  { 
    id: 2, 
    title: "Nike Joyride Run", 
    price: 110.00, 
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=200&q=80", 
    variant: "RUNNING SHOES", 
    quantity: 2 
  },
];

export default function Cart() {
  // --- STATE & CALCULATIONS ---
  const [paymentMethod, setPaymentMethod] = useState('Card');
  
  const subtotal = dummyCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 15.00; // Flat rate shipping
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <Header centerText="Checkout" className="mb-8 rounded-3xl" />

      {/* MAIN LAYOUT WRAPPER (Grid) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ========================================= */}
        {/* --- LEFT SIDE: THE FORMS (Spans 2 columns) --- */}
        {/* ========================================= */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* 1. Shipping Details Box */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-50 text-red-900 rounded-xl">
                <MapPin size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Shipping Details</h2>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 relative">
                <User className="absolute top-4 left-4 text-gray-400" size={20} />
                <input type="text" placeholder="Full Name" className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
              </div>
              <div className="md:col-span-2 relative">
                <input type="email" placeholder="Email Address" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
              </div>
              <div className="md:col-span-2 relative">
                <input type="numeric" placeholder="Contact No" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
              </div>
              <div className="md:col-span-2 relative">
                <input type="text" placeholder="Street Address" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
              </div>
              <div className="relative">
                <input type="text" placeholder="City" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
              </div>
              <div className="relative">
                <input type="text" placeholder="ZIP / Postal Code" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
              </div>
            </form>
          </div>

          {/* 2. Payment Details Box */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-50 text-red-900 rounded-xl">
                <CreditCard size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Payment Info</h2>
            </div>

            {/* --- PAYMENT METHOD SELECTOR --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              <button 
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${paymentMethod === 'Card' ? 'border-red-900 bg-red-50 text-red-900' : 'border-zinc-100 bg-white text-gray-500 hover:border-gray-300'}`}
              >
                <CreditCard size={24} className="mb-2" />
                <span className="font-bold text-sm">Card</span>
              </button>
              
              <button 
                type="button"
                onClick={() => setPaymentMethod('Bkash')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${paymentMethod === 'Bkash' ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-zinc-100 bg-white text-gray-500 hover:border-gray-300'}`}
              >
                <Smartphone size={24} className="mb-2" />
                <span className="font-bold text-sm">bKash</span>
              </button>

              <button 
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${paymentMethod === 'COD' ? 'border-green-600 bg-green-50 text-green-700' : 'border-zinc-100 bg-white text-gray-500 hover:border-gray-300'}`}
              >
                <Banknote size={24} className="mb-2" />
                <span className="font-bold text-sm text-center">Cash on Delivery</span>
              </button>
            </div>

            {/* --- CONDITIONAL INPUTS --- */}
            {paymentMethod === 'Card' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 relative">
                  <input type="text" placeholder="Card Number" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
                </div>
                <div className="relative">
                  <input type="text" placeholder="MM/YY" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
                </div>
                <div className="relative">
                  <input type="text" placeholder="CVC" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
                </div>
              </div>
            )}

            {paymentMethod === 'Bkash' && (
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100 mb-2">
                  <p className="text-sm text-pink-900 font-medium text-center">
                    Please send the total amount to our bKash Merchant Number: <br/>
                    <span className="font-black text-lg tracking-wider">017XX-XXXXXX</span>
                  </p>
                </div>
                <div className="relative">
                  <input type="text" placeholder="Your bKash Number" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-pink-600 focus:ring-4 focus:ring-pink-600/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
                </div>
                <div className="relative">
                  <input type="text" placeholder="Transaction ID (TrxID)" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-pink-600 focus:ring-4 focus:ring-pink-600/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
                </div>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="p-6 bg-green-50 rounded-2xl border border-green-100 flex flex-col items-center text-center">
                <Banknote className="text-green-600 mb-3 w-12 h-12" />
                <h3 className="font-bold text-green-900 text-xl mb-2">Pay at your doorstep</h3>
                <p className="text-sm text-green-800 font-medium">
                  You will pay the delivery rider in cash when your package arrives. No upfront payment required!
                </p>
              </div>
            )}

          </div>
        </div> 
        {/* ^ THIS CLOSING DIV WAS MISSING IN YOUR CODE! It closes the Left Column. */}
        {/* ========================================= */}


        {/* ========================================= */}
        {/* --- RIGHT SIDE / BOTTOM: ORDER SUMMARY --- */}
        {/* ========================================= */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 lg:sticky lg:top-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-50 text-red-900 rounded-xl">
              <Package size={24} />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Order Summary</h2>
          </div>

          {/* Product List */}
          <div className="flex flex-col gap-4 mb-6">
            {dummyCartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-zinc-50 rounded-2xl">
                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1">
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 leading-tight">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{item.variant} • Qty {item.quantity}</p>
                </div>

                <div className="font-black text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Receipt Math */}
          <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-3xl font-black text-red-900">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button 
            type="button" 
            onClick={() => alert(`Order Placed Successfully using ${paymentMethod}!`)}
            className="w-full bg-red-900 hover:bg-red-950 text-white text-lg font-black rounded-2xl py-5 shadow-xl shadow-red-900/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
          >
            <ShieldCheck size={22} />
            PLACE ORDER
          </button>

          <p className="text-center text-xs text-gray-400 mt-4 font-medium flex items-center justify-center gap-1">
            Payments are secure and encrypted.
          </p>
        </div>

      </div>
    </div>
  );
}