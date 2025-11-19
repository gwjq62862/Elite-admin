// app/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const menuItems = [
  { name: "Dashboard", icon: "dashboard", href: "/" },
  { name: "Posts", icon: "article", href: "/posts" },
  { name: "Analytics", icon: "analytics", href: "/analytics" },
  { name: "Settings", icon: "settings", href: "/settings" },

];

export default function Sidebar({ isMenuOpen, setIsMenuOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
            flex flex-col w-64 border-r border-white/10 p-4 h-screen transition-transform duration-300 ease-in-out
            bg-background-light dark:bg-[#1E1E1E]
            
            // Mobile: Fixed position, ဘယ်ဘက်ကို ရွေ့ထားပါ
            fixed top-0 left-0 z-50 md:sticky md:top-0 md:flex
            
            // State ပေါ်မူတည်ပြီး ရွှေ့/မရွှေ့ ထိန်းချုပ်ပါ
            ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} 
            
            // Desktop မှာဆို အမြဲတမ်း ပေါ်နေစေ
            md:translate-x-0
        `}
    >
      <div className="flex flex-col h-full">
        {/* Header & Avatar */}
        <div className="flex items-center gap-3 mb-8 pt-2">
          <div className="flex flex-col">
            <h1 className="text-gray-900 dark:text-[#E0E0E0] text-xl font-black">
              ELITE ADMIN
            </h1>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-900 dark:text-white md:hidden ml-auto"
          >
            <span className="material-symbols-outlined !text-3xl">close</span>
          </button>
        </div>

        {/* Navigation */}
    <nav className="flex flex-col gap-2">
                {menuItems.map((item) => {
                    // *** 💥 Hydration Failed ဖြစ်နိုင်တဲ့ နေရာ ***
                    // pathname သည် Server-side မှာ null ဖြစ်ပြီး Client-side မှာမှ /posts/create ဖြစ်လာတာကြောင့်
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)); // Pathname စစ်ဆေးနည်းကို ပြင်ဆင်နိုင်သည်
                    
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)} // Mobile မှာ နှိပ်ပြီးရင် Menu ပြန်ပိတ်ပါ
                            // ❗❗❗ 
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-700 dark:text-[#A0A0A0] hover:bg-gray-200 dark:hover:bg-white/10"
                            }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <p className="text-sm font-medium leading-normal">{item.name}</p>
                        </Link>
                    );
                })}
            </nav>

        {/* Create Post Button */}
      </div>
    </aside>
  );
}
