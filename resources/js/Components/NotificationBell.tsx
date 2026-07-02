import { Bell, Truck, Star } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell({ isScrolled, notifications = [] }: { isScrolled: boolean, notifications?: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unratedCompletedOrders = notifications.filter(n => n.status === 'completed' && !n.rating);
    const pendingOrEnRouteOrders = notifications.filter(n => ['pending', 'en_route', 'accepted'].includes(n.status));
    const hasNotifications = notifications.length > 0;

    const currentSig = notifications.map(n => n.id + '-' + n.status).join(',');
    
    const [hasSeen, setHasSeen] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedSig = localStorage.getItem('flamegas-notifications-sig');
            return savedSig === currentSig;
        }
        return false;
    });
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedSig = localStorage.getItem('flamegas-notifications-sig');
            if (savedSig !== currentSig) {
                setHasSeen(false);
            } else {
                setHasSeen(true);
            }
        }
    }, [currentSig]);

    const handleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setHasSeen(true);
            if (typeof window !== 'undefined') {
                localStorage.setItem('flamegas-notifications-sig', currentSig);
            }
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleOpen}
                className={`relative p-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                    isScrolled
                        ? 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/5'
                        : 'bg-white/10 text-white hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-white/10 backdrop-blur-md'
                }`}
            >
                <Bell className="w-5 h-5" />

                {(hasNotifications && !hasSeen) && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-flame-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 bg-[#0a0f1c]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-white/10 bg-white/5">
                            <h3 className="font-bold text-white">Notificações</h3>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {!hasNotifications ? (
                                <div className="p-6 text-center text-slate-400 text-sm">
                                    Você não tem notificações no momento.
                                </div>
                            ) : (
                                <div className="flex flex-col divide-y divide-white/5">
                                    {pendingOrEnRouteOrders.map(order => (
                                        <div key={order.id} className="p-4 hover:bg-white/5 transition-colors flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                                <Truck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-200">
                                                    Seu pedido <span className="font-bold text-blue-400">#{order.id}</span> está {order.status === 'en_route' ? 'a caminho!' : 'sendo preparado.'}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {new Date(order.created_at).toLocaleString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {unratedCompletedOrders.map(order => (
                                        <div key={order.id} className="p-4 hover:bg-white/5 transition-colors flex gap-4 items-start cursor-pointer" onClick={() => {
                                            window.dispatchEvent(new CustomEvent('open-rating-modal', { detail: order }));
                                            setIsOpen(false);
                                        }}>
                                            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                                                <Star className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-200">
                                                    Pedido <span className="font-bold">#{order.id}</span> entregue!
                                                    <span className="block mt-1 text-flame-400 font-medium">Avalie sua experiência agora.</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
