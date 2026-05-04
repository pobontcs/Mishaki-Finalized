import { Header } from "./contents/Header"; 
// ADD THIS LINE! (Adjust the path if your client folder is somewhere else)
import Landing from "./client/Landing"; 

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      
      <Header 
        centerText="Welcome to Mishaki" 
        className="rounded-lg mt-5 w-[95%] max-w-6xl mx-auto animate-slide-down"
      />

      {/* Now Next.js knows what this is! */}
      <Landing />

      <footer className="w-full bg-black flex flex-col items-center justify-center py-12 gap-6 mt-auto">
        
        {/* Social Media Icons */}
        <div className="flex items-center gap-x-6">
          <a 
            href="https://www.facebook.com/mishaki99/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors duration-300"
            aria-label="Facebook"
          >
            {/* This SVG is the official Facebook Logo */}
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          
          {/* You can easily copy/paste that <a> tag block above to add Instagram, Twitter, etc. later! */}
        </div>

        {/* Copyright Text (Automatically uses the current year) */}
        <p className="text-white/50 text-sm font-medium tracking-wide">
          © {new Date().getFullYear()} Mishaki. All rights reserved.
        </p>

      </footer>

    </div>
  );
}