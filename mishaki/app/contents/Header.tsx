import Image from "next/image";
import Link from "next/link";
import logoImage from "./logo.jpg";

interface HeaderProps {
  centerText: string;
  className?: string;
  showOptions?: boolean;
}

export function Header({
  centerText,
  className = "",
  showOptions = true,
}: HeaderProps) {
  return (
    <header
      className={`w-full
      bg-linear-to-r from-red-950 via-red-800 to-red-600
      backdrop-blur-md border border-white/10 shadow-lg
      px-6 py-4 flex items-center justify-between
      sticky top-0 z-50 relative ${className}`}
    >
      {/* Glossy Shine */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />

      {/* Floral Sketch Design Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 flex items-center justify-center">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1000 200"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -100 100 Q 50 10 150 100 T 400 100 T 650 100 T 900 100 T 1150 100"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            strokeOpacity="0.5"
          />
          <path
            d="M 50 80 C 60 40, 90 40, 100 80 C 90 120, 60 120, 50 80 Z"
            stroke="white"
            strokeWidth="1"
            fill="transparent"
          />
          <path
            d="M 150 120 C 160 160, 190 160, 200 120 C 190 80, 160 80, 150 120 Z"
            stroke="white"
            strokeWidth="1"
            fill="transparent"
          />
          <path
            d="M 300 70 C 310 20, 350 20, 360 70 C 350 120, 310 120, 300 70 Z"
            stroke="white"
            strokeWidth="1"
            fill="transparent"
          />
          <path
            d="M 450 130 C 470 180, 510 180, 530 130 C 510 80, 470 80, 450 130 Z"
            stroke="white"
            strokeWidth="1"
            fill="transparent"
          />
          <path
            d="M 700 60 C 720 10, 760 10, 780 60 C 760 110, 720 110, 700 60 Z"
            stroke="white"
            strokeWidth="1"
            fill="transparent"
          />
          <path
            d="M 850 140 C 860 180, 890 180, 900 140 C 890 100, 860 100, 850 140 Z"
            stroke="white"
            strokeWidth="1"
            fill="transparent"
          />
        </svg>
      </div>

      {/* LEFT SIDE */}
      <div className="flex items-center w-1/3 relative z-10">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 overflow-hidden rounded-full border border-white/20 shadow-sm">
            <Image
              src={logoImage}
              alt="Mishaki Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </Link>
      </div>

      {/* CENTER */}
      <div className="absolute left-1/2 -translate-x-1/2 w-1/3 text-center z-10">
        <h2 className="text-white/90 font-bold text-lg md:text-xl tracking-wider uppercase drop-shadow-md">
          {centerText}
        </h2>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-1/3 justify-end relative z-50">
        {showOptions && (
          <nav className="flex items-center gap-x-5">
            <div className="relative group">
              <button className="text-white hover:text-red-200 transition-colors focus:outline-none ml-2 bg-black/20 p-2 rounded cursor-pointer">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* FIXED DROPDOWN */}
              <div
                className="absolute right-0 top-full mt-2
                invisible opacity-0 translate-y-2
                group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-300 ease-out z-[999]"
              >
                <div className="w-40 bg-white rounded-xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden">
                  <Link
                    href="/login"
                    className="px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-red-50 hover:text-red-900 transition-colors border-b border-zinc-100"
                  >
                    Log In
                  </Link>

                  <Link
                    href="/signup"
                    className="px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-red-50 hover:text-red-900 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}