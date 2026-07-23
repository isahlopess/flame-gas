import { ReactNode, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import UserDropdown from '@/Components/UserDropdown';
import { LayoutDashboard, ListTodo, History, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HubLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function HubLayout({ children, title = 'Hub do Entregador' }: HubLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const currentRoute = window.location.pathname;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navSections = [
        {
            title: 'Principal',
            items: [
                { name: 'Visão Geral', href: route('hub.dashboard'), icon: LayoutDashboard, active: currentRoute === '/hub' },
            ]
        },
        {
            title: 'Operacional',
            items: [
                { name: 'Fila de Pedidos', href: route('hub.queue'), icon: ListTodo, active: currentRoute === '/hub/queue' },
                { name: 'Histórico', href: route('hub.history'), icon: History, active: currentRoute === '/hub/history' },
            ]
        },
        {
            title: 'Administrativo',
            items: [
                { name: 'Perfil', href: route('hub.profile.edit'), icon: User, active: currentRoute.startsWith('/hub/profile') },
            ]
        }
    ];

    return (
        <div className="h-screen bg-[#060a14] text-slate-100 font-sans selection:bg-flame-500 selection:text-white flex overflow-hidden">
            <Head title={`${title} - FlameGás`} />
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-[#060a14]/80 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-[#0a0f1c] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full'}
                lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:w-20 lg:hover:w-72 group`}
            >
                <div className="h-20 flex items-center px-6 border-b border-white/5 overflow-hidden whitespace-nowrap shrink-0 justify-between lg:justify-start">
                    <div className="flex items-center">
                        <img src="/images/fire.png" alt="FlameGás" className="w-8 h-8 object-contain shrink-0" />
                        <span className={`font-heading uppercase text-2xl text-white ml-3 transition-opacity duration-300 delay-75 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'}`}>
                            <span className="font-medium tracking-tight">FLAME</span>
                            <span className="font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-flame-500 to-amber-400">GÁS</span>
                        </span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>
                <nav className="flex-1 py-8 overflow-y-auto overflow-x-hidden px-4 space-y-8 custom-scrollbar">
                    {navSections.map((section, idx) => (
                        <div key={idx} className="flex flex-col gap-2 relative">
                            <div className="flex items-center gap-3 px-3 mb-1">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap transition-all duration-300 ${sidebarOpen ? 'opacity-100 max-w-[100px]' : 'opacity-0 max-w-0 overflow-hidden lg:group-hover:max-w-[100px] lg:group-hover:opacity-100'}`}>
                                    {section.title}
                                </span>
                                <div className="h-px bg-white/10 flex-1"></div>
                            </div>
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center rounded-2xl transition-all font-medium relative overflow-hidden group/item ${
                                            item.active
                                                ? 'bg-flame-500/10 text-flame-500'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                        style={{ height: '52px' }}
                                    >
                                        <div className="w-12 h-12 shrink-0 flex items-center justify-center relative z-10">
                                            <Icon className={`w-5 h-5 ${item.active ? 'text-flame-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'group-hover/item:scale-110 transition-transform'}`} />
                                        </div>
                                        <span className={`transition-opacity duration-300 whitespace-nowrap absolute left-12 tracking-wide z-10 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'}`}>
                                            {item.name}
                                        </span>
                                        {item.active && (
                                            <>
                                                <div className="absolute left-0 top-1 bottom-1 w-1 bg-flame-500 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.5)] z-10"></div>
                                                <div className="absolute inset-0 bg-gradient-to-r from-flame-500/10 to-transparent z-0"></div>
                                            </>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>
                <div className="border-t border-white/5 p-4 overflow-hidden shrink-0">
                    <div className={`flex items-center gap-3 mb-6 px-2 whitespace-nowrap transition-opacity duration-300 delay-75 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'}`}>
                        <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {auth.user.name.charAt(0)}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0a0f1c] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{auth.user.name}</p>
                            <p className="text-xs text-emerald-400 font-medium truncate">Conectado na Frota</p>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center rounded-2xl transition-all font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full relative group/item"
                        style={{ height: '52px' }}
                    >
                        <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                            <LogOut className="w-5 h-5 group-hover/item:translate-x-1 transition-transform" />
                        </div>
                        <span className={`transition-opacity duration-300 whitespace-nowrap absolute left-14 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'}`}>
                            Sair do Hub
                        </span>
                    </Link>
                </div>
            </aside>
            <main className="flex-1 flex flex-col min-w-0 relative">
                <div className="absolute top-0 left-1/4 w-full h-[500px] bg-flame-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
                <header className="bg-[#0a0f1c]/80 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 h-20 flex items-center justify-between sticky top-0 z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <div className="flex items-center gap-2 lg:hidden">
                            <img src="/images/fire.png" alt="FlameGás" className="w-7 h-7 object-contain" />
                            <span className="font-heading uppercase text-xl text-white">
                                <span className="font-medium tracking-tight">FLAME</span>
                                <span className="font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-flame-500 to-amber-400">GÁS</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <UserDropdown user={auth.user} isScrolled={true} />
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
                        >
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
                                    {title}
                                    {title === 'Fila de Pedidos' && (
                                        <span className="flex h-3 w-3 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-flame-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-flame-500"></span>
                                        </span>
                                    )}
                                </h1>
                                <p className="text-slate-400 mt-2">
                                    Bem-vindo de volta, piloto. Acompanhe suas métricas em tempo real.
                                </p>
                            </div>
                        </motion.div>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
