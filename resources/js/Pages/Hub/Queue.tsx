import HubLayout from '@/Layouts/HubLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Box, Clock, Navigation, Check, X, ChevronDown, PackageCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Queue({ queue: initialQueue, activeOrders = [] }: { queue: any[], activeOrders?: any[] }) {
    const [queueList, setQueueList] = useState(initialQueue || []);
    const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    useEffect(() => {
        setQueueList(initialQueue || []);
    }, [initialQueue]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const getUrgency = (createdAt: string) => {
        const diffInMs = new Date().getTime() - new Date(createdAt).getTime();
        const minutes = Math.floor(Math.max(0, diffInMs) / 60000);
        if (minutes > 45) return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'Crítico', pulse: true, mins: minutes };
        if (minutes > 20) return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'Atenção', pulse: false, mins: minutes };
        return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'Normal', pulse: false, mins: minutes };
    };

    const handleAccept = (id: number) => {
        router.post(`/api/orders/${id}/accept`, {}, {
            preserveScroll: true,
        });
    };

    const handleComplete = (id: number) => {
        router.post(`/api/orders/${id}/complete`, {}, {
            preserveScroll: true,
        });
    };

    const handleDecline = (id: number) => {
        setQueueList(prev => prev.filter(q => q.id !== id));
        setOrderToDelete(null);
    };

    return (
        <HubLayout title="Fila de Pedidos">
            {activeOrders && activeOrders.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4 px-1">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <PackageCheck className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Entregas em Andamento</h2>
                            <p className="text-sm text-slate-400">Pedidos que você aceitou e estão em rota</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {activeOrders.map(order => (
                            <div key={order.id} className="bg-[#0a0f1c]/60 backdrop-blur-xl rounded-3xl p-5 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)] flex flex-col relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center font-bold text-white text-lg shadow-inner">
                                            {(order.user?.name || 'Cliente Avulso').charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white tracking-tight">{order.user?.name || 'Cliente Avulso'}</h3>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mt-1">
                                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Em Rota
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xl font-black text-emerald-400">
                                        {formatCurrency(order.total)}
                                    </span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-6 relative z-10">
                                    <div className="flex gap-3">
                                        <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-white leading-tight">
                                                {order.address}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">{order.neighborhood}</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-px bg-white/5 my-3"></div>
                                    <div className="flex flex-col gap-2">
                                        {order.items?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <span className="text-slate-300">{item.quantity}x {item.product?.name || 'Produto'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleComplete(order.id)}
                                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-[0_4px_20px_-4px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 relative z-10"
                                >
                                    <Check className="w-5 h-5" /> Finalizar Entrega
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0f1c]/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-flame-500/10 border border-flame-500/20 flex items-center justify-center">
                        <span className="text-2xl font-black text-flame-400">{queueList.length}</span>
                    </div>
                    <div>
                        <p className="text-white font-bold">Pedidos Pendentes</p>
                        <p className="text-sm text-slate-400">Prontos para aceite na sua região</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center gap-2">
                        <Navigation className="w-4 h-4" /> Mais Próximos
                    </button>
                </div>
            </div>
            {queueList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[#0a0f1c]/40 rounded-3xl border border-white/5 backdrop-blur-xl">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Box className="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Fila Vazia</h3>
                    <p className="text-slate-400 text-center max-w-sm">
                        Nenhum pedido pendente no momento. Fique de olho, novas entregas aparecerão aqui!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {queueList.map((order, i) => {
                            const urgency = getUrgency(order.created_at);
                            return (
                                <motion.div
                                    key={order.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-[#0a0f1c]/60 backdrop-blur-xl rounded-3xl p-1 border border-white/5 flex flex-col relative overflow-hidden group hover:border-white/10 transition-all"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-flame-500/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                                    <div className="bg-[#0a0f1c] rounded-[22px] p-5 h-full flex flex-col relative z-10 border border-white/5">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center font-bold text-white text-lg shadow-inner">
                                                        {(order.user?.name || 'Cliente Avulso').charAt(0)}
                                                    </div>
                                                    {urgency.pulse && (
                                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white tracking-tight">{order.user?.name || 'Cliente Avulso'}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full w-fit ${urgency.bg} ${urgency.color} ${urgency.border} border`}>
                                                            <Clock className="w-3 h-3" />
                                                            {urgency.text}
                                                        </div>
                                                        <span className="text-xs font-medium text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                                                            {urgency.mins > 60 ? `há ${Math.floor(urgency.mins / 60)}h ${urgency.mins % 60}m` : `há ${urgency.mins}m`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xl font-black text-flame-500">
                                                {formatCurrency(order.total)}
                                            </span>
                                        </div>
                                        <div className="space-y-4 mb-6 flex-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <div className="flex gap-3">
                                                <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-white leading-tight">
                                                        {order.address}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{order.neighborhood}</p>
                                                </div>
                                            </div>
                                            <div className="w-full h-px bg-white/5"></div>
                                            <div className="flex flex-col gap-3">
                                                <div
                                                    className="flex gap-3 cursor-pointer group/items"
                                                    onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                                >
                                                    <Box className="w-5 h-5 text-slate-400 shrink-0 group-hover/items:text-flame-400 transition-colors" />
                                                    <div className="flex-1 flex justify-between items-center">
                                                        <p className="text-sm text-slate-300 group-hover/items:text-white transition-colors">
                                                            <strong className="text-white">{order.items?.length || 0}</strong> itens no pedido
                                                        </p>
                                                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`} />
                                                    </div>
                                                </div>
                                                <AnimatePresence>
                                                    {expandedOrderId === order.id && order.items && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pt-2 border-t border-white/5 space-y-2 mt-2">
                                                                {order.items.map((item: any, idx: number) => (
                                                                    <div key={idx} className="flex justify-between items-center text-sm">
                                                                        <span className="text-slate-400">{item.quantity}x {item.product?.name || 'Produto'}</span>
                                                                        <span className="text-white font-medium">{formatCurrency(Number(item.unit_price) * item.quantity)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-auto">
                                            <button
                                                onClick={() => handleAccept(order.id)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-flame-500 to-flame-600 hover:from-flame-400 hover:to-flame-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_-4px_rgba(249,115,22,0.5)] group-hover:shadow-[0_4px_25px_-2px_rgba(249,115,22,0.7)]"
                                            >
                                                <Check className="w-5 h-5" /> Aceitar Entrega
                                            </button>
                                            <button
                                                onClick={() => setOrderToDelete(order.id)}
                                                className="w-14 shrink-0 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-slate-400 rounded-xl transition-all"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
            <AnimatePresence>
                {orderToDelete !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f1c]/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#121827] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
                            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-500">
                                <X className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Excluir Pedido da Fila?</h3>
                            <p className="text-sm text-slate-400 mb-6">Esta ação removerá o pedido da sua lista de oportunidades. O pedido continuará disponível para outros entregadores.</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setOrderToDelete(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleDecline(orderToDelete)}
                                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                                >
                                    Excluir
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </HubLayout>
    );
}
