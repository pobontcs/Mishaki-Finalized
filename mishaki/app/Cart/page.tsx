"use client";
import { useState } from "react";
import { Header } from "../contents/Header";
// Combined all the icons into a single, clean import
import { CreditCard, MapPin, Package, ShieldCheck, User, Banknote, Smartphone, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { getImageUrl } from "../lib/api";
import { createOrder, OrderCreateInput } from "../lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Cart() {
  // --- STATE & CALCULATIONS ---
  const { items, cartTotal, clearCart, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState('Bkash');
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    houseNumber: "",
    address: "",
    addressDescription: "",
    city: "",
    postalCode: "",
    bkashNumber: "",
    trxId: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal = cartTotal;
  const isChittagong = formData.city.toLowerCase().includes('chittagong');
  const shipping = isChittagong ? 80.00 : 150.00;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      setIsSubmitting(true);
      const orderPayload: OrderCreateInput = {
        customer_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        house_number: formData.houseNumber,
        street_address: formData.address,
        address_description: formData.addressDescription,
        city: formData.city,
        postal_code: formData.postalCode,
        payment_method: paymentMethod,
        bkash_number: formData.bkashNumber,
        transaction_id: formData.trxId,
        subtotal: subtotal,
        shipping_fee: shipping,
        total_amount: total,
        items: items.map(item => ({
          product_id: item.product_id,
          product_name: item.title,
          variant: item.variant,
          unit_price: item.price,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
          image_url: item.image
        }))
      };

      await createOrder(orderPayload);
      
      setOrderSuccess(true);
      clearCart();
    } catch (error: any) {
      alert(error.message || "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-zinc-50 p-4 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck size={48} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-8 text-lg">
          Thank you for your purchase. We've received your order and a <strong>confirmation email will be sent</strong> to you shortly!
        </p>
        <button 
          onClick={() => router.push('/shop')}
          className="px-8 py-4 bg-red-900 text-white font-bold rounded-2xl shadow-xl shadow-red-900/20 hover:bg-red-950 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

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

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 relative">
                <User className="absolute top-4 left-4 text-gray-400" size={20} />
                <input name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" placeholder="Full Name" className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
              </div>
              <div className="md:col-span-2 relative">
                <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email Address" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
              </div>
              <div className="md:col-span-2 relative">
                <input name="phone" value={formData.phone} onChange={handleInputChange} type="numeric" placeholder="Contact No" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
              </div>
              <div className="md:col-span-2 relative">
                <input name="houseNumber" value={formData.houseNumber} onChange={handleInputChange} type="text" placeholder="House number/name" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
              </div>
              <div className="md:col-span-2 relative">
                <input name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="Street Address" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
              </div>
              <div className="md:col-span-2 relative">
                <input name="addressDescription" value={formData.addressDescription} onChange={handleInputChange} type="text" placeholder="Description of your address (Optional)" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" />
              </div>
              <div className="relative">
                <input name="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="City" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
              </div>
              <div className="relative">
                <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} type="text" placeholder="ZIP / Postal Code" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-red-900 focus:ring-4 focus:ring-red-900/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
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

            {paymentMethod === 'Bkash' && (
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100 mb-2">
                  <p className="text-sm text-pink-900 font-medium text-center">
                    Please send the full amount (৳{total.toFixed(2)}) to our bKash Merchant Number: <br/>
                    <span className="font-black text-lg tracking-wider">017XX-XXXXXX</span>
                  </p>
                </div>
                <div className="relative">
                  <input name="bkashNumber" value={formData.bkashNumber} onChange={handleInputChange} type="text" form="checkout-form" placeholder="Your bKash Number" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-pink-600 focus:ring-4 focus:ring-pink-600/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
                </div>
                <div className="relative">
                  <input name="trxId" value={formData.trxId} onChange={handleInputChange} type="text" form="checkout-form" placeholder="Transaction ID (TrxID)" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-pink-600 focus:ring-4 focus:ring-pink-600/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
                </div>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex flex-col items-center text-center mb-2">
                  <Banknote className="text-green-600 mb-3 w-10 h-10" />
                  <h3 className="font-bold text-green-900 text-lg mb-2">Pre-Delivery Charge Required</h3>
                  <p className="text-sm text-green-800 font-medium">
                    Please send the delivery charge (৳{shipping.toFixed(2)}) via bKash to our Merchant Number: <br/>
                    <span className="font-black text-lg tracking-wider">017XX-XXXXXX</span><br/>
                    <span className="text-xs">You will pay the remaining ৳{subtotal.toFixed(2)} in cash upon delivery.</span>
                  </p>
                </div>
                <div className="relative">
                  <input name="bkashNumber" value={formData.bkashNumber} onChange={handleInputChange} type="text" form="checkout-form" placeholder="Your bKash Number" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-600/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
                </div>
                <div className="relative">
                  <input name="trxId" value={formData.trxId} onChange={handleInputChange} type="text" form="checkout-form" placeholder="Transaction ID (TrxID)" className="w-full px-4 py-4 bg-zinc-50 border border-transparent focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-600/10 rounded-2xl text-gray-900 placeholder-gray-400 transition-all outline-none" required />
                </div>
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
            {items.length === 0 ? (
              <div className="text-center py-6 text-gray-500">Your cart is empty.</div>
            ) : items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-zinc-50 rounded-2xl relative">
                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1 relative">
                  <Image src={getImageUrl(item.image)} alt={item.title || "Product image"} fill className="object-contain mix-blend-multiply p-1" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 leading-tight">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{item.variant}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-md bg-zinc-200 hover:bg-zinc-300 text-gray-700 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-sm text-gray-900 w-4 text-center">{item.quantity}</span>
                    <button 
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-md bg-zinc-200 hover:bg-zinc-300 text-gray-700 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button 
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="font-bold text-gray-900 text-right min-w-[80px]">
                    ৳{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Receipt Math */}
          <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
            <div className="flex justify-between items-center text-gray-600 font-medium">
              <span>Subtotal</span>
              <span>৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600 font-medium pb-4 border-b border-zinc-100">
              <span>Shipping Fee</span>
              <span>৳{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 mb-6">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-3xl font-black text-red-900">৳{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button 
            type="submit" 
            form="checkout-form"
            disabled={isSubmitting || items.length === 0}
            className="w-full bg-red-900 hover:bg-red-950 disabled:bg-gray-400 text-white text-lg font-black rounded-2xl py-5 shadow-xl shadow-red-900/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
          >
            <ShieldCheck size={22} />
            {isSubmitting ? "PROCESSING..." : "PLACE ORDER"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4 font-medium flex items-center justify-center gap-1">
            Payments are secure and encrypted.
          </p>
        </div>

      </div>
    </div>
  );
}