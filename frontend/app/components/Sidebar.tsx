// app/components/Sidebar.tsx
"use client";

import { UserButton } from "@clerk/nextjs";

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
              <UserButton 
                    afterSignOutUrl="/sign-in" 
                    appearance={{ 
                        elements: { 
                            userButtonAvatarBox: {
                                width: "3rem",
                                height: "3rem",
                                borderRadius: "0.5rem", // rounded-lg
                                ring: "2px",
                                ringColor: "#4F46E5", // indigo-600
                            },
                        },
                        variables: {
                            colorBackground: "#1E1E1E", // Dark background for popover
                            colorText: "#ffffff", // 💡 Main Text Color (e.g., Name, Menu Items)
                            colorPrimary: "#4F46E5", // Indigo-600 as primary action color
                            colorTextSecondary: "#E0E0E0", // Secondary Text Color (e.g., Email, Small text)
                        },
                    }}
                    userProfileProps={{
                        appearance: {
                            variables: {
                                colorBackground: "#121212", // Even darker background for profile modal
                                colorText: "#ffffff",
                                colorPrimary: "#4F46E5",
                                colorTextSecondary: "#E0E0E0",
                            },
                        },
                    }}
                />
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
         
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href)); 

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)} 
             
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-[#A0A0A0] hover:bg-gray-200 dark:hover:bg-white/10"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <p className="text-sm font-medium leading-normal">
                  {item.name}
                </p>
              </Link>
            );
          })}
        </nav>

       
      </div>
    </aside>
  );
}
