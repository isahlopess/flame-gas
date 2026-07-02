import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import UserDropdown from '@/Components/UserDropdown';
import CartButton from '@/Components/Cart/CartButton';
import CartDrawer from '@/Components/Cart/CartDrawer';
import CheckoutModal from '@/Components/Cart/CheckoutModal';
import NotificationBell from '@/Components/NotificationBell';
import RatingModal from '@/Components/RatingModal';

export default function Authenticated({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, notifications } = usePage<any>().props;
    const user = auth.user;
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 font-sans text-slate-100 selection:bg-flame-500 selection:text-white">
            <CartDrawer />
            <CheckoutModal />
            <RatingModal />
            <div className="fixed top-0 w-full z-50 px-4 sm:px-6 pt-4 sm:pt-6 transition-all duration-500">
                <header
                    className={`w-[95%] max-w-[1400px] mx-auto rounded-2xl sm:rounded-full transition-all duration-500 ${
                        isScrolled
                            ? 'py-3 px-4 sm:px-6 bg-navy-950/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/10'
                            : 'py-4 px-4 sm:px-6 bg-transparent border border-transparent'
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                            <img src="/images/fire.png" alt="FlameGás" className="w-8 h-8 object-contain drop-shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                            <span className={`font-heading uppercase transition-colors duration-300 hidden sm:block text-3xl ${isScrolled ? 'text-white' : 'text-white drop-shadow-sm'}`}>
                                <span className="font-medium tracking-tight">FLAME</span><span className="font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-flame-500 to-amber-400">GÁS</span>
                            </span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-1 font-medium text-sm">
                            <Link
                                href="/"
                                className={`relative group px-4 py-2 rounded-full transition-colors ${
                                    isScrolled
                                        ? 'text-slate-300 hover:text-white hover:bg-white/5'
                                        : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                Página Inicial
                                <span className="absolute inset-x-4 bottom-1.5 h-0.5 bg-flame-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full opacity-0 group-hover:opacity-100"></span>
                            </Link>
                            <div className={`w-px h-6 mx-2 ${isScrolled ? 'bg-navy-800' : 'bg-white/20'}`}></div>

                            {user && <UserDropdown user={user} isScrolled={isScrolled} />}

                            <div className={`w-px h-6 mx-2 ${isScrolled ? 'bg-navy-800' : 'bg-white/20'}`}></div>
                            <NotificationBell isScrolled={isScrolled} notifications={notifications} />
                            <CartButton isScrolled={isScrolled} />
                        </nav>
                        <button
                            className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                isScrolled
                                    ? 'bg-navy-900 text-white'
                                    : 'bg-white/10 text-white backdrop-blur-md'
                            }`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </header>
                {mobileMenuOpen && (
                    <div className="absolute top-full left-4 right-4 mt-2 p-4 rounded-2xl bg-navy-900 border border-white/10 shadow-2xl md:hidden">
                        <div className="flex flex-col gap-4">
                            <Link href="/" className="text-white hover:text-flame-500 transition-colors">Página Inicial</Link>
                            <Link href={route('profile.edit')} className="text-white hover:text-flame-500 transition-colors">Meu Perfil</Link>
                            <Link href={route('logout')} method="post" as="button" className="text-left text-red-400 hover:text-red-300 transition-colors">Sair</Link>
                        </div>
                    </div>
                )}
            </div>
            <main className="pt-24 pb-12 relative z-0">
                {children}
            </main>
        </div>
    );
}
