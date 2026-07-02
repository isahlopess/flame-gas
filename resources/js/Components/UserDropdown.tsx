import { Link, useForm } from '@inertiajs/react';
import { User } from '@/types';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserDropdownProps {
    user: User;
    isScrolled: boolean;
}

export default function UserDropdown({ user, isScrolled }: UserDropdownProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { post } = useForm();

    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        post(route('logout'));
    };

    let menuItems: { icon: string, label: string, href: string }[] = [];

    if (user.role === 'customer') {
        menuItems = [
            { icon: 'fa-regular fa-user', label: 'Meu Perfil', href: route('profile.edit') },
            { icon: 'fa-regular fa-rectangle-list', label: 'Meus Pedidos', href: route('profile.edit') },
            { icon: 'fa-solid fa-gear', label: 'Configurações', href: route('profile.edit') },
        ];
    } else if (user.role === 'employee') {
        menuItems = [
            { icon: 'fa-solid fa-motorcycle', label: 'Hub do Entregador', href: route('hub.dashboard') },
            { icon: 'fa-regular fa-user', label: 'Meu Perfil', href: route('profile.edit') },
        ];
    } else if (user.role === 'manager') {
        menuItems = [
            { icon: 'fa-solid fa-chart-line', label: 'Painel Admin', href: route('admin.dashboard') },
            { icon: 'fa-solid fa-gear', label: 'Configurações', href: route('profile.edit') },
        ];
    }

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full transition-all duration-300 cursor-pointer group ${
                    isScrolled
                        ? 'hover:bg-slate-100 dark:hover:bg-white/5'
                        : 'hover:bg-white/10'
                }`}
            >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-flame-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-shadow">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        initials
                    )}
                </div>
                <span className={`hidden sm:block font-semibold text-sm transition-colors ${
                    isScrolled ? 'text-slate-700 dark:text-slate-200' : 'text-white/90'
                }`}>
                    {user.name.split(' ')[0]}
                </span>
                <i className={`fa-solid fa-chevron-down text-[10px] transition-all duration-300 ${
                    open ? 'rotate-180' : ''
                } ${isScrolled ? 'text-slate-400' : 'text-white/60'}`}></i>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-navy-900 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] border border-slate-200/80 dark:border-white/10 overflow-hidden z-[999]"
                    >
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-flame-500 to-amber-500 flex items-center justify-center text-white font-bold text-base shadow-md flex-shrink-0">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        initials
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{user.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="py-2 px-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors group/item"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover/item:bg-flame-500/10 group-hover/item:text-flame-500 transition-colors">
                                        <i className={item.icon}></i>
                                    </div>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <div className="px-2 py-2 border-t border-slate-100 dark:border-white/5">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full group/logout cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center group-hover/logout:bg-red-100 dark:group-hover/logout:bg-red-500/20 transition-colors">
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                </div>
                                Sair da conta
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
