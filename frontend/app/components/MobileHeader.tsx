// app/components/MobileHeader.tsx
import Link from 'next/link';

interface MobileHeaderProps {
    onMenuToggle: () => void;
}

export default function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
    return (
     
        <header className="fixed top-0 left-0 z-30 w-full bg-background-light dark:bg-background-dark p-4 shadow-lg md:hidden border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
                {/* Logo/Title */}
                <Link href="/" className="text-xl font-black text-primary">
                    ELITE ADMIN
                </Link>
                
              
                <button onClick={onMenuToggle} className="text-gray-900 dark:text-white">
                    <span className="material-symbols-outlined !text-3xl">menu</span>
                </button>
            </div>
        </header>
    );
}