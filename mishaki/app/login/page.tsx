import { Header } from "../contents/Header";
import Image from "next/image";
import LogoImage from "../contents/logo.jpg";

export default function Login() {
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

      <form className="relative z-10 flex flex-col gap-5 mt-10 justify-center items-center px-6">
        <Image
          src={LogoImage}
          alt="Mishaki Logo"
          width={80}
          height={80}
          className="rounded-4xl shadow-lg border border-white/20"
        />

        <input
          className="bg-white/95 text-blue-950 h-12 w-full max-w-xs p-3 rounded-b-xl
          outline-none shadow-md border border-transparent
          focus:border-red-300 focus:scale-[1.02] transition-all duration-300"
          placeholder="Email/Phone"
          type="email"
          required
        />

        <input
          className="bg-white/95 text-blue-950 h-12 w-full max-w-xs p-3 rounded-t-xl
          outline-none shadow-md border border-transparent
          focus:border-red-300 focus:scale-[1.02] transition-all duration-300"
          placeholder="Password"
          type="password"
          required
        />

        <button
          className="mb-10 bg-white text-red-900 font-semibold
          w-24 h-10 rounded-2xl shadow-md
          hover:bg-red-100 hover:scale-105 transition-all duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Header centerText="Login" />

      {/* Main Section */}
      <div className="flex flex-col md:flex-row flex-1 px-6 md:px-12 py-8 gap-10 items-center">
        
        {/* LEFT TITLE SECTION */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left animate-slide-up">
          
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold
            text-black leading-tight tracking-tight"
          >
            Flex with
          </h1>

          <h2
            className="text-5xl sm:text-6xl md:text-7xl font-black
            bg-gradient-to-r from-red-900 via-red-700 to-red-500
            bg-clip-text text-transparent leading-tight"
          >
            Your Trends
          </h2>

          <p className="mt-4 text-gray-600 text-base md:text-lg max-w-md font-medium">
            Sign in to continue your fashion journey with premium elegance.
          </p>
        </div>

        {/* RIGHT LOGIN CARD */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          {LoginForm}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full bg-black flex flex-col items-center justify-center py-12 gap-6 mt-auto">
        <div className="flex items-center gap-x-6">
          <a
            href="https://www.facebook.com/mishaki99/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors duration-300"
            aria-label="Facebook"
          >
            <svg
              className="w-7 h-7"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>

        <p className="text-white/50 text-sm font-medium tracking-wide">
          © {new Date().getFullYear()} Mishaki. All rights reserved.
        </p>
      </footer>
    </div>
  );
}