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
      bg-gradient-to-r from-red-950 via-red-800 to-red-600
      backdrop-blur-md border border-white/10 shadow-lg
      px-6 py-4 flex items-center justify-between
      sticky top-0 z-50 relative ${className}`}
    >
      {/* Glossy Shine */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />

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
                    href="/admin"
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