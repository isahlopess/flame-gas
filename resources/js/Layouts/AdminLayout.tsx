import { ReactNode, useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import UserDropdown from '@/Components/UserDropdown';
import { LayoutDashboard, ShoppingCart, Users, Truck, Package, TrendingUp, LogOut, Search, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
    notifications?: any[];
    headerActions?: ReactNode;
}

const emptyArray: any[] = [];

export default function AdminLayout({ children, title = 'Painel do Gestor', notifications = emptyArray, headerActions }: AdminLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const currentRoute = window.location.pathname;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [localNotifications, setLocalNotifications] = useState(notifications);

    useEffect(() => {
        const lastRead = Number(localStorage.getItem('notifications_read_at') || 0);
        setLocalNotifications(notifications.map(n => ({
            ...n,
            is_read: (n.timestamp || 0) <= lastRead
        })));
    }, [notifications]);

    const markAllAsRead = () => {
        const now = Date.now();
        localStorage.setItem('notifications_read_at', now.toString());
        setLocalNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const navItems = [
        { name: 'Visão Geral', href: route('admin.dashboard'), icon: LayoutDashboard, active: currentRoute === '/admin' },
        { name: 'Pedidos', href: route('admin.orders'), icon: ShoppingCart, active: currentRoute.startsWith('/admin/orders') },
        { name: 'Clientes', href: route('admin.clients'), icon: Users, active: currentRoute.startsWith('/admin/clients') },
        { name: 'Entregadores', href: route('admin.drivers'), icon: Truck, active: currentRoute.startsWith('/admin/drivers') },
        { name: 'Estoque', href: route('admin.inventory'), icon: Package, active: currentRoute.startsWith('/admin/inventory') },
        { name: 'Faturamento', href: route('admin.revenue'), icon: TrendingUp, active: currentRoute.startsWith('/admin/revenue') },
    ];

    return (
        <div className="h-screen bg-[#060a14] text-slate-100 font-sans selection:bg-flame-500 selection:text-white flex overflow-hidden">
            <Head title={`${title} - FlameGás Admin`} />
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
                <nav className="flex-1 py-8 space-y-3 overflow-x-hidden px-4">
                    {navItems.map((item) => {
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
                                <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                                    <Icon className={`w-5 h-5 ${item.active ? 'text-flame-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'group-hover/item:scale-110 transition-transform'}`} />
                                </div>
                                <span className={`transition-opacity duration-300 whitespace-nowrap absolute left-14 tracking-wide ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'}`}>
                                    {item.name}
                                </span>
                                {item.active && (
                                    <div className="absolute left-0 top-1 bottom-1 w-1 bg-flame-500 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                                )}
                            </Link>
                        );
                    })}
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
                            <p className="text-xs text-flame-400 font-medium truncate">Gestor Geral</p>
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
                            Sair do Painel
                        </span>
                    </Link>
                </div>
            </aside>
            <main className="flex-1 flex flex-col min-w-0 relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-flame-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
                <header className="bg-[#0a0f1c]/80 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 h-20 flex items-center justify-between sticky top-0 z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                {localNotifications.filter(n => !n.is_read).length > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-flame-500 rounded-full border-2 border-[#0a0f1c]"></span>
                                )}
                            </button>
                            <AnimatePresence>
                                {notificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-80 bg-[#0a0f1c] border border-white/10 rounded-2xl shadow-xl shadow-black/50 z-50 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                                            <h3 className="font-bold text-white text-sm">Notificações</h3>
                                            {localNotifications.filter(n => !n.is_read).length > 0 && (
                                                <span className="text-xs bg-flame-500/20 text-flame-400 px-2 py-0.5 rounded-full font-bold">
                                                    {localNotifications.filter(n => !n.is_read).length} Novas
                                                </span>
                                            )}
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {localNotifications.length === 0 ? (
                                                <div className="p-4 text-center text-slate-500 text-sm">
                                                    Nenhuma notificação encontrada.
                                                </div>
                                            ) : (
                                                localNotifications.map(notification => (
                                                    <div key={notification.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${notification.is_read ? 'opacity-60' : ''}`}>
                                                        <p className="text-sm text-slate-300 font-medium">{notification.message}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className="p-3 border-t border-white/10 bg-white/5 text-center">
                                            <button onClick={markAllAsRead} className="text-xs font-bold text-flame-400 hover:text-flame-300 w-full cursor-pointer py-1">Marcar todas como lidas</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
                        <UserDropdown user={auth.user} isScrolled={true} />
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                                    {title}
                                </h1>
                                <p className="text-slate-400 mt-2">Gestão inteligente e acompanhamento em tempo real.</p>
                            </div>
                            {headerActions && (
                                <div className="shrink-0">
                                    {headerActions}
                                </div>
                            )}
                        </motion.div>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
