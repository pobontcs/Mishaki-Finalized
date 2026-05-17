import Image from "next/image";
import Link from "next/link";
import ProductImage from "../contents/prod.jpg";
// Assuming you have a feature image for your bags/accessories in the contents folder
// import heroImage from "../contents/hero-bag.jpg"; 

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      
      {/* Hero Section Container 
        - max-w-6xl mx-auto: Centers the content so it doesn't stretch too wide on huge monitors
        - flex-col md:flex-row: Stacks vertically on mobile, sits side-by-side on desktop
        - gap-12: Adds nice breathing room between the image and the text
      */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto px-6 py-16 md:py-24 gap-12">

        {/* LEFT SIDE: The Feature Image (Your first empty div) */}
        <div className="w-full md:w-1/2 flex justify-center animate-slide-up">
          {/* A placeholder box if you don't have an image ready yet. 
              Once you have an image, replace this div with the Next.js <Image> component */}
          <div className="w-full max-w-md aspect-square bg-zinc-200 rounded-2xl shadow-xl border border-zinc-300 flex items-center justify-center overflow-hidden relative">
         
             
            
             <Image 
               src={ProductImage} 
               alt="Latest Mishaki Collection" 
               fill 
               className="object-cover hover:scale-105 transition-transform duration-700"
             /> 
        
          </div>
        </div>

        {/* RIGHT SIDE: The Text & Call to Action (Your second div) */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left animate-slide-down delay-100">
          
          <h3 className="text-red-800 font-bold tracking-widest uppercase mb-3 text-sm md:text-base">
            Trendy Specials
          </h3>
          
          <h2 className="text-5xl md:text-6xl font-extrabold text-zinc-900 mb-6 leading-tight">
            JUST FOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-500">YOU!!</span>
          </h2>
          
          <p className="text-lg text-zinc-600 mb-10 max-w-lg">
            Discover our latest collection of carefully sourced premium Clothings and Outfits designed to elevate your everyday style.
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/shop" 
              className="bg-red-900 hover:bg-red-800 text-white font-semibold py-4 px-8 rounded-full shadow-lg shadow-red-900/30 transition-all hover:-translate-y-1 text-center"
            >
              Shop Collection
            </Link>
            <Link 
              href="/about" 
              className="bg-white hover:bg-zinc-100 text-zinc-800 border-2 border-zinc-200 font-semibold py-4 px-8 rounded-full transition-all text-center"
            >
              Our Story
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}