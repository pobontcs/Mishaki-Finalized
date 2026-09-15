"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

import { getLandingSettings, LandingSettingData, getImageUrl } from "../lib/api";

export default function Landing() {
  const [settings, setSettings] = useState<LandingSettingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { scrollYProgress } = useScroll();
  
  // Parallax transforms for the 3D flower
  const flowerY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const flowerRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const flowerScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.8]);

  useEffect(() => {
    let isMounted = true;
    getLandingSettings()
      .then((data) => {
        if (isMounted) setSettings(data);
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError("Failed to load landing settings.");
        }
      });
    return () => { isMounted = false; };
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-red-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Parse New Arrivals Images
  let newArrivals: string[] = [];
  try {
    newArrivals = JSON.parse(settings.new_arrivals_images);
  } catch (e) {
    newArrivals = [];
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent text-zinc-900 font-sans selection:bg-red-900/30">
      <div className="relative z-10 w-full">

        {/* ==========================================
            ROW 1: HERO SECTION
        ========================================== */}
        <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20 md:py-32 min-h-[90vh] gap-12">
          
          {/* Text Left */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-1/2 flex flex-col items-start text-left"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
              {settings.hero_title.split(' ').map((word, i) => (
                <span key={i} className={i % 2 !== 0 ? "text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-400" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h1>
            <p className="text-lg md:text-xl mb-10 max-w-lg leading-relaxed text-zinc-600">
              {settings.hero_subtitle}
            </p>
            <Link href="/shop">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto text-white font-bold py-4 px-10 rounded-full shadow-[0_10px_40px_rgba(153,27,27,0.3)] transition-all"
                style={{ backgroundColor: settings.primary_color }}
              >
                Shop Now
              </motion.button>
            </Link>
          </motion.div>

          {/* Image Right */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full md:w-1/2 flex justify-center perspective-[1000px]"
          >
            {settings.hero_image_url && (
              <motion.div 
                whileHover={{ rotateY: 15, rotateX: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-100"
              >
                <Image src={getImageUrl(settings.hero_image_url)} alt="Hero" fill className="object-cover" priority unoptimized={true} />
              </motion.div>
            )}
          </motion.div>
        </section>


        {/* ==========================================
            ROW 2: NEW ARRIVALS
        ========================================== */}
        {newArrivals.length > 0 && (
          <section className="py-24 bg-zinc-50/50 border-y border-zinc-100 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-black text-zinc-900 tracking-tight"
              >
                New Arrivals
              </motion.h2>
              <div className="w-24 h-1 bg-red-900 mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 pb-12 max-w-7xl mx-auto custom-scrollbar">
              {newArrivals.map((url, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: idx * 0.1 }}
                  className="snap-center shrink-0 w-72 md:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-zinc-200 relative group"
                >
                  <Image src={getImageUrl(url)} alt={`New Arrival ${idx}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized={true} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <span className="text-white font-bold text-lg">View Details</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}


        {/* ==========================================
            ROW 3: 3D ANIMATION (CHERISH FLOWER)
        ========================================== */}
        <section className="relative py-40 overflow-hidden flex items-center justify-center">
          <motion.div 
            style={{ y: flowerY, rotate: flowerRotate, scale: flowerScale }}
            className="relative w-full max-w-2xl aspect-square drop-shadow-2xl"
          >
            <Image 
              src="/3d_cherish_flower.jpg" 
              alt="Feminine Cherish and Compliment" 
              fill 
              className="object-contain mix-blend-multiply"
              unoptimized={true}
            />
          </motion.div>
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-900/40 to-pink-500/40 tracking-widest text-center"
            >
              CHERISH
            </motion.h2>
          </div>
        </section>


        {/* ==========================================
            ROW 4: ABOUT MISHAKI (NOTE FRAME)
        ========================================== */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* About Image */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 flex justify-center"
            >
              {settings.about_image_url && (
                <div className="relative w-full max-w-md aspect-square rounded-full overflow-hidden shadow-[0_20px_50px_rgba(153,27,27,0.15)] border-8 border-white">
                  <Image src={getImageUrl(settings.about_image_url)} alt="About Mishaki" fill className="object-cover" unoptimized={true} />
                </div>
              )}
            </motion.div>

            {/* Header & Note Frame */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 flex flex-col"
            >
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6">{settings.about_title}</h2>
              <p className="text-lg text-zinc-600 mb-10 leading-relaxed">
                {settings.about_description}
              </p>
              
              {/* Note Shape Frame */}
              <div className="relative bg-amber-50/80 backdrop-blur-sm p-8 md:p-12 rounded-br-3xl shadow-lg border border-amber-200/60 transform rotate-1">
                {/* Folded Corner Effect */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-white border-l-[40px] border-l-transparent shadow-[-2px_2px_4px_rgba(0,0,0,0.05)]"></div>
                <p className="font-serif italic text-amber-900/90 text-xl md:text-2xl leading-relaxed">
                  "{settings.about_note}"
                </p>
              </div>

            </motion.div>
          </div>
        </section>

      </div>

      {/* ==========================================
          FOOTER: LINKS
      ========================================== */}
      <footer className="w-full bg-zinc-950 text-zinc-400 py-16 mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-2xl font-bold tracking-widest uppercase mb-4">MISHAKI</h3>
            <p className="max-w-sm mb-6">Redefining elegance with every thread. Join us on our journey to beautiful fashion.</p>
            <div className="flex items-center gap-6">
              <a href="https://facebook.com/mishaki99" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                <span>Facebook</span>
              </a>
              <a href="https://www.instagram.com/mishaki_official_/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.46 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Collections</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-800 text-sm text-zinc-600 text-center flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Mishaki. All rights reserved.</p>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4d4d8; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7f1d1d; 
        }
      `}} />
    </div>
  );
}