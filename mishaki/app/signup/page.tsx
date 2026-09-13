"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "../contents/Header";
import { User, Mail, Phone, Lock, MapPin, ArrowRight, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",     // Separated Email state
    phone: "",     // Separated Phone state
    password: "",
    confirmPassword: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear the error message as soon as the user starts typing again
    if (error) setError(""); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- FRONTEND MATCHING LOGIC ---
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return; // Stop submission
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return; // Stop submission
    }

    // If everything passes, proceed with signup
    console.log("Signing up:", formData);
    alert("Account created successfully!");
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8 flex flex-col items-center">
      
      <Header centerText="Join Mishaki" className="mb-8 w-full max-w-6xl rounded-3xl" />

      {/* Main Container */}
      <div className="w-full max-w-md mt-4 animate-slide-up">
        
        {/* GRADIENT BOX: Red to Silver */}
        <div className="relative p-8 md:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(153,27,27,0.3)] bg-gradient-to-br from-red-900 via-red-800 to-zinc-400 overflow-hidden">
          
          {/* Decorative Background Glows */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-2 tracking-wide">
              Create Account
            </h2>
            <p className="text-red-100/80 mb-6 font-medium text-sm">
              Sign up to track your orders, get exclusive trendy specials, and save your favorites.
            </p>

            {/* ERROR ALERT BOX */}
            {error && (
              <div className="mb-6 flex items-center gap-3 bg-red-950/80 border border-red-400/50 text-white px-4 py-3 rounded-xl text-sm font-medium animate-slide-down backdrop-blur-md shadow-lg">
                <AlertCircle size={20} className="text-red-400 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Name Input */}
              <div className="relative group">
                <User className="absolute top-4 left-4 text-white/50 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="text" 
                  name="name"
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 focus:bg-white/20 focus:border-white focus:ring-4 focus:ring-white/10 rounded-2xl text-white placeholder-white/50 transition-all outline-none backdrop-blur-sm font-medium" 
                  required 
                />
              </div>

              {/* Email Input */}
              <div className="relative group">
                <Mail className="absolute top-4 left-4 text-white/50 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 focus:bg-white/20 focus:border-white focus:ring-4 focus:ring-white/10 rounded-2xl text-white placeholder-white/50 transition-all outline-none backdrop-blur-sm font-medium" 
                  required 
                />
              </div>

              {/* Phone Input (Mandatory) */}
              <div className="relative group">
                <Phone className="absolute top-4 left-4 text-white/50 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Phone Number" 
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 focus:bg-white/20 focus:border-white focus:ring-4 focus:ring-white/10 rounded-2xl text-white placeholder-white/50 transition-all outline-none backdrop-blur-sm font-medium" 
                  required 
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <Lock className="absolute top-4 left-4 text-white/50 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 bg-white/10 border ${error.includes('Password') ? 'border-red-400 bg-red-900/30' : 'border-white/20'} focus:bg-white/20 focus:border-white focus:ring-4 focus:ring-white/10 rounded-2xl text-white placeholder-white/50 transition-all outline-none backdrop-blur-sm font-medium`}
                  required 
                />
              </div>

              {/* Confirm Password Input */}
              <div className="relative group">
                <Lock className="absolute top-4 left-4 text-white/50 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Confirm Password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 bg-white/10 border ${error.includes('match') ? 'border-red-400 bg-red-900/30' : 'border-white/20'} focus:bg-white/20 focus:border-white focus:ring-4 focus:ring-white/10 rounded-2xl text-white placeholder-white/50 transition-all outline-none backdrop-blur-sm font-medium`}
                  required 
                />
              </div>

              {/* Primary Address Input */}
              <div className="relative group mb-2">
                <MapPin className="absolute top-4 left-4 text-white/50 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="text" 
                  name="address"
                  placeholder="Primary Address (e.g. 123 Main St)" 
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 focus:bg-white/20 focus:border-white focus:ring-4 focus:ring-white/10 rounded-2xl text-white placeholder-white/50 transition-all outline-none backdrop-blur-sm font-medium" 
                  required 
                />
              </div>

              {/* FLOATING SUBMIT BUTTON */}
              <button 
                type="submit" 
                className="w-full mt-2 bg-white text-red-950 text-lg font-black rounded-2xl py-4 shadow-lg hover:shadow-[0_10px_25px_rgba(255,255,255,0.4)] hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300 flex justify-center items-center gap-2"
              >
                Sign Up
                <ArrowRight size={20} className="text-red-700" />
              </button>
            </form>

          </div>
        </div>

        {/* Redirect to Login */}
        <p className="text-center text-zinc-500 mt-8 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-red-800 font-bold hover:underline hover:text-red-900 transition-colors">
            Log in here
          </Link>
        </p>

      </div>
    </div>
  );
}