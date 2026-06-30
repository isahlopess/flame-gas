import { ReactNode } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import UserDropdown from '@/Components/UserDropdown';

interface HubLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function HubLayout({ children, title = 'Hub do Entregador' }: HubLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const currentRoute = window.location.pathname;

    const navItems = [
        { name: 'Dashboard', href: route('hub.dashboard'), icon: 'fa-solid fa-chart-pie', active: currentRoute === '/hub' },
        { name: 'Fila de Pedidos', href: route('hub.queue'), icon: 'fa-solid fa-list-check', active: currentRoute === '/hub/queue' },
        { name: 'Histórico', href: route('hub.history'), icon: 'fa-solid fa-clock-rotate-left', active: currentRoute === '/hub/history' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans selection:bg-flame-500 selection:text-white flex">
            <Head title={`${title} - FlameGás`} />
            <aside className="hidden lg:flex flex-col w-72 h-screen bg-white dark:bg-navy-950 border-r border-slate-200 dark:border-white/10 sticky top-0">
                <div className="p-6 flex items-center gap-3">
                    <img src="/images/fire.png" alt="FlameGás" className="w-8 h-8 object-contain" />
                    <span className="font-heading uppercase text-2xl text-slate-900 dark:text-white">
                        <span className="font-medium tracking-tight">FLAME</span>
                        <span className="font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-flame-500 to-amber-400">GÁS</span>
                    </span>
                </div>
                <div className="px-4 py-2">
                    <div className="bg-slate-100 dark:bg-navy-900 p-4 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-flame-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-md">
                                {auth.user.name.charAt(0)}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-navy-900 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{auth.user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Online e Disponível</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                                item.active
                                    ? 'bg-flame-500 text-white shadow-[0_4px_14px_0_rgba(249,115,22,0.39)]'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <i className={`${item.icon} w-5 text-center`}></i>
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-200 dark:border-white/10">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                        <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i>
                        Sair do Sistema
                    </Link>
                </div>
            </aside>
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="lg:hidden bg-white dark:bg-navy-950 border-b border-slate-200 dark:border-white/10 px-4 py-4 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <img src="/images/fire.png" alt="FlameGás" className="w-6 h-6 object-contain" />
                        <span className="font-heading uppercase text-xl text-slate-900 dark:text-white">
                            <span className="font-medium tracking-tight">FLAME</span>
                            <span className="font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-flame-500 to-amber-400">GÁS</span>
                        </span>
                    </div>
                    <UserDropdown user={auth.user} isScrolled={true} />
                </header>
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
                            {title}
                        </h1>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
