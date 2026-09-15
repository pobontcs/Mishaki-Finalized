"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../contents/Header";
import Image from "next/image";
import LogoImage from "../../contents/logo.jpg";

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_or_phone: identifier, password: password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Invalid credentials");
      }

      const data = await res.json();
      
      // Ensure the user is an admin
      if (data.user && data.user.role !== "admin") {
        throw new Error("Access denied. Admin only.");
      }

      // Save token and redirect
      if (typeof window !== "undefined") {
        localStorage.setItem("mishaki_admin_token", data.access_token);
      }
      
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const LoginForm = (
    <div
      className="flex flex-col w-full max-w-md mx-auto mt-8 md:mt-10
      bg-gradient-to-br from-red-950 via-red-800 to-red-600
      rounded-bl-3xl rounded-tr-3xl rounded-tl-xl rounded-br-xl
      shadow-2xl border border-white/20 backdrop-blur-xl
      relative overflow-hidden transition-all duration-500
      hover:max-w-lg hover:scale-[1.02]"
    >
      {/* Glossy Shine */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />

      <form onSubmit={handleLogin} className="relative z-10 flex flex-col gap-5 mt-10 justify-center items-center px-6">
        <Image
          src={LogoImage}
          alt="Mishaki Logo"
          width={80}
          height={80}
          className="rounded-4xl shadow-lg border border-white/20"
        />
        
        <h2 className="text-white text-xl font-bold mb-2">Admin Portal</h2>

        {error && <div className="text-red-200 bg-red-900/50 p-2 rounded text-sm w-full text-center">{error}</div>}

        <input
          className="bg-white/95 text-black h-12 w-full max-w-xs p-3 rounded-b-xl
          outline-none shadow-md border border-transparent
          focus:border-red-300 focus:scale-[1.02] transition-all duration-300"
          placeholder="Admin Email or Phone"
          type="text"
          required
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          className="bg-white/95 text-black h-12 w-full max-w-xs p-3 rounded-t-xl
          outline-none shadow-md border border-transparent
          focus:border-red-300 focus:scale-[1.02] transition-all duration-300"
          placeholder="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="mb-10 bg-white text-red-900 font-semibold
          w-24 h-10 rounded-2xl shadow-md
          hover:bg-red-100 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? "..." : "Login"}
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Header centerText="Admin Login" />

      {/* Main Section */}
      <div className="flex flex-col md:flex-row flex-1 px-6 md:px-12 py-8 gap-10 items-center justify-center">
        {/* RIGHT LOGIN CARD */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          {LoginForm}
        </div>
      </div>
    </div>
  );
}
