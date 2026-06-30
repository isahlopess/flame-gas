import { ReactNode, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import UserDropdown from '@/Components/UserDropdown';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title = 'Painel do Gestor' }: AdminLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const currentRoute = window.location.pathname;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Visão Geral', href: route('admin.dashboard'), icon: 'fa-solid fa-chart-line', active: currentRoute === '/admin' },
        { name: 'Pedidos', href: route('admin.orders'), icon: 'fa-solid fa-cart-shopping', active: currentRoute.startsWith('/admin/orders') },
        { name: 'Clientes', href: route('admin.clients'), icon: 'fa-solid fa-users', active: currentRoute.startsWith('/admin/clients') },
        { name: 'Entregadores', href: route('admin.drivers'), icon: 'fa-solid fa-motorcycle', active: currentRoute.startsWith('/admin/drivers') },
        { name: 'Estoque', href: route('admin.inventory'), icon: 'fa-solid fa-boxes-stacked', active: currentRoute.startsWith('/admin/inventory') },
        { name: 'Faturamento', href: route('admin.revenue'), icon: 'fa-solid fa-money-bill-trend-up', active: currentRoute.startsWith('/admin/revenue') },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-flame-500 selection:text-white flex overflow-hidden">
            <Head title={`${title} - FlameGás Admin`} />
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>
            <motion.aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-white/5 flex flex-col transition-transform lg:translate-x-0 lg:static lg:h-screen`}
                initial={false}
                animate={{ x: sidebarOpen ? 0 : (window.innerWidth < 1024 ? -300 : 0) }}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-2">
                        <img src="/images/fire.png" alt="FlameGás" className="w-8 h-8 object-contain" />
                        <span className="font-heading uppercase text-xl text-slate-900 dark:text-white">
                            <span className="font-medium tracking-tight">FLAME</span>
                            <span className="font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-flame-500 to-amber-400">GÁS</span>
                            <span className="ml-2 text-xs font-bold bg-slate-100 dark:bg-navy-800 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider hidden xl:inline-block">Admin</span>
                        </span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                                item.active
                                    ? 'bg-flame-50 dark:bg-flame-500/10 text-flame-600 dark:text-flame-400 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.active ? 'bg-flame-500 text-white shadow-md shadow-flame-500/20' : ''}`}>
                                <i className={`${item.icon} text-[15px]`}></i>
                            </div>
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-200 dark:border-white/5">
                    <div className="bg-slate-50 dark:bg-navy-950 p-4 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-navy-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold">
                            {auth.user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{auth.user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Gestor Geral</p>
                        </div>
                    </div>
                </div>
            </motion.aside>
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="h-16 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-white/5 px-4 lg:px-8 flex items-center justify-between z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-700 transition-colors"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <div className="hidden sm:flex relative w-64 md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar pedidos, clientes, etc..."
                                className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-flame-500 focus:border-flame-500 sm:text-sm transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-4">
                        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                            <i className="fa-regular fa-bell text-lg"></i>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-flame-500 rounded-full border-2 border-white dark:border-navy-900"></span>
                        </button>
                        <div className="w-px h-6 bg-slate-200 dark:bg-white/10"></div>
                        <UserDropdown user={auth.user} isScrolled={true} />
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-navy-950">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    {title}
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gerencie seu negócio de forma centralizada.</p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
