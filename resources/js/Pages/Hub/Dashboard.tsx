import HubLayout from '@/Layouts/HubLayout';
import { motion } from 'framer-motion';
import { Package, Banknote, Star, Truck, MapPin, ArrowRight, History, Activity } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis } from 'recharts';

export default function Dashboard({ orders, queue, weeklyData, recentHistory, kpis, currentPeriod }: { orders: any[], queue: any[], weeklyData: any[], recentHistory: any[], kpis: any, currentPeriod: string }) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const sparklineCount = weeklyData.map(d => ({ name: d.day, v: d.count }));
    const sparklineRevenue = weeklyData.map(d => ({ name: d.day, v: d.revenue }));
    const sparklineRating = weeklyData.map(d => ({ name: d.day, v: d.rating }));

    const maxDaily = Math.max(...weeklyData.map(d => d.count), 10);

    const stats = [
        { label: currentPeriod === 'today' ? 'Entregas Hoje' : 'Entregas no Período', value: kpis?.count || 0, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', stroke: '#60a5fa', sparkline: sparklineCount, isCurrency: false, domain: [0, 'dataMax'] },
        { label: currentPeriod === 'today' ? 'Ganhos Hoje' : 'Ganhos no Período', value: formatCurrency(kpis?.revenue || 0), icon: Banknote, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', stroke: '#34d399', sparkline: sparklineRevenue, isCurrency: true, domain: [0, 'dataMax'] },
        { label: 'Avaliação Média', value: '5.0', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', stroke: '#fbbf24', sparkline: sparklineRating, isCurrency: false, domain: [0, 10] },
        { label: 'Em Rota Agora', value: kpis?.en_route || 0, icon: Truck, color: 'text-flame-400', bg: 'bg-flame-500/10', border: 'border-flame-500/20', stroke: '#f97316', sparkline: sparklineCount, isCurrency: false, domain: [0, 'dataMax'] },
    ];

    const CustomTooltip = ({ active, payload, label, isCurrency }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0a0f1c] border border-white/10 p-2 rounded-lg shadow-xl text-xs z-50">
                    <p className="text-slate-400 mb-1 font-bold">{label}</p>
                    <p className="text-white font-black">
                        {isCurrency ? formatCurrency(payload[0].value) : payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };
    const handlePeriodChange = (period: string) => {
        router.get(route('hub.dashboard'), { period }, { preserveState: true, preserveScroll: true });
    };
    const currentHour = new Date().getHours();
    let currentBlockIndex = weeklyData.length - 1;
    if (currentPeriod === 'today') {
        currentBlockIndex = Math.floor((currentHour - 7) / 2);
        if (currentBlockIndex < 0) currentBlockIndex = -1;
        if (currentBlockIndex > 6) currentBlockIndex = -1;
    }
    return (
        <HubLayout title="Visão Geral">
            <div className="flex justify-end mb-8 sm:-mt-16 relative z-20">
                <div className="flex bg-[#0a0f1c]/80 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg">
                    {['today', 'week', 'month'].map(p => (
                        <button
                            key={p}
                            onClick={() => handlePeriodChange(p)}
                            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${currentPeriod === p ? 'bg-gradient-to-r from-flame-600 to-flame-500 text-white shadow-[0_2px_10px_rgba(249,115,22,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {p === 'today' ? 'Hoje' : p === 'week' ? '7 Dias' : '30 Dias'}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#0a0f1c]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5 relative overflow-visible group hover:border-white/10 transition-colors flex flex-col justify-between h-40"
                        >
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:bg-white/10 transition-all z-0 pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-2 relative z-10">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.border} border`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div className="w-20 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stat.sparkline}>
                                            <XAxis dataKey="name" hide />
                                            <YAxis hide domain={stat.domain as any} />
                                            <Tooltip content={<CustomTooltip isCurrency={stat.isCurrency} />} cursor={false} />
                                            <defs>
                                                <linearGradient id={`color-${i}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={stat.stroke} stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor={stat.stroke} stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <Area type="monotone" dataKey="v" stroke={stat.stroke} fillOpacity={1} fill={`url(#color-${i})`} strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="relative z-10 pointer-events-none">
                                <p className="text-3xl font-bold text-white tracking-tight mb-1">{stat.value}</p>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-[#0a0f1c]/60 backdrop-blur-xl rounded-3xl border border-white/5 p-8 flex flex-col h-[400px]"
                    >
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-slate-400" />
                                Fluxo de Entregas (Termômetro)
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">
                                {currentPeriod === 'month'
                                    ? 'Média de entregas por dia da semana (últimos 30 dias)'
                                    : 'Desempenho real do período selecionado'}
                            </p>
                        </div>
                        <div className="flex-1 flex flex-col justify-center pt-6">
                            <div className="flex justify-between px-2 mb-3">
                                {weeklyData.map((data, i) => {
                                    const isCurrent = i === currentBlockIndex;
                                    return (
                                        <div key={i} className={`flex-1 text-center text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-flame-400' : 'text-slate-400'}`}>
                                            {data.day}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="w-full h-16 sm:h-20 bg-[#0a0f1c] rounded-full flex border border-white/5 p-1 relative shadow-inner">
                                {weeklyData.map((data, i) => {
                                    const percentage = Math.max((data.count / maxDaily) * 100, 10);
                                    const isCurrent = i === currentBlockIndex;
                                    return (
                                        <div key={i} className="flex-1 h-full relative group cursor-pointer overflow-hidden rounded-full mx-0.5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-white/5">
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                                                {data.count} entregas
                                            </div>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${percentage}%` }}
                                                transition={{ duration: 1, delay: 0.1 + (i * 0.1), type: 'spring' }}
                                                className={`absolute bottom-0 w-full ${isCurrent ? 'bg-gradient-to-t from-flame-600 to-flame-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-gradient-to-t from-blue-600/80 to-cyan-400/80 group-hover:from-blue-500 group-hover:to-cyan-300'}`}
                                            >
                                                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-white/30 rounded-full blur-[1px]"></div>
                                            </motion.div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className={`font-black text-sm sm:text-base drop-shadow-lg z-10 ${isCurrent ? 'text-white' : 'text-slate-200'}`}>
                                                    {data.count}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-[#0a0f1c]/60 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[400px]"
                    >
                        <div className="px-6 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-flame-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></span>
                                Na Fila Agora
                            </h2>
                            <span className="bg-flame-500/10 border border-flame-500/20 text-flame-400 text-xs font-bold px-3 py-1 rounded-full">
                                {queue?.length || 0}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {queue && queue.length > 0 ? queue.slice(0, 4).map((order) => (
                                <Link
                                    href={route('hub.queue')}
                                    key={order.id}
                                    className="block p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-flame-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex justify-between items-start mb-3 pl-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-sm shadow-inner shrink-0 border border-white/10">
                                                {(order.user?.name || 'Cliente Avulso').charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="font-bold text-white text-sm block truncate">{order.user?.name || 'Cliente Avulso'}</span>
                                                <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full mt-1 inline-block">Pendente</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 pl-2">
                                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                        <span className="truncate">{order.address}, {order.neighborhood}</span>
                                    </div>
                                </Link>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 opacity-50">
                                    <Package className="w-10 h-10" />
                                    <p className="text-sm">Nenhum pedido na fila.</p>
                                </div>
                            )}
                            {queue && queue.length > 4 && (
                                <div className="text-center pt-2">
                                    <Link href={route('hub.queue')} className="text-xs font-bold text-flame-400 hover:text-flame-300">
                                        Ver todos ({queue.length})
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-[#0a0f1c]/60 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden"
            >
                <div className="px-6 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <History className="w-5 h-5 text-slate-400" />
                        Histórico do Período ({recentHistory?.length || 0})
                    </h2>
                    <Link href={route('hub.history')} className="text-xs font-bold text-flame-400 hover:text-flame-300 flex items-center gap-1">
                        Ver histórico completo <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Cliente</th>
                                <th className="px-6 py-4 font-medium">Endereço</th>
                                <th className="px-6 py-4 font-medium">Data/Hora</th>
                                <th className="px-6 py-4 font-medium text-right">Valor Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentHistory && recentHistory.length > 0 ? recentHistory.map((order) => (
                                <tr key={order.id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs shrink-0 border border-white/5 group-hover:border-white/20 transition-colors">
                                                {(order.user?.name || order.address).charAt(0)}
                                            </div>
                                            <span className="font-semibold text-slate-200">{order.user?.name || 'Cliente Avulso'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-300">{order.address}</div>
                                        <div className="text-xs text-slate-500">{order.neighborhood}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-300">{new Date(order.created_at).toLocaleDateString('pt-BR')}</div>
                                        <div className="text-xs text-slate-500">{new Date(order.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-sm">
                                            {formatCurrency(order.total)}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        Nenhuma entrega finalizada neste período.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </HubLayout>
    );
}
