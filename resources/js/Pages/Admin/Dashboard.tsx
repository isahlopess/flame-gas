import AdminLayout from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from '@inertiajs/react';
import { TrendingUp, ShoppingCart, Users, Truck, ArrowUpRight, ArrowDownRight, PackageCheck, Clock, XCircle, MapPin, Star, Timer, Filter } from 'lucide-react';

export default function Dashboard({ stats, recentOrders, statusData, topDrivers, revenueData, currentPeriod = 'today', notifications = [] }: { stats: any, recentOrders: any[], statusData: any[], topDrivers: any[], revenueData: any[], currentPeriod?: string, notifications?: any[] }) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const getTimeElapsed = (start: string, end: string, status: string) => {
        const startDate = new Date(start);
        const endDate = status === 'completed' ? new Date(end) : new Date();
        const diffMs = endDate.getTime() - startDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 60) return `${diffMins} min`;
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        return `${hours}h ${mins}m`;
    };

    const kpis = [
        { 
            label: 'Faturamento Total', 
            value: formatCurrency(stats?.revenue || 0), 
            trend: '+12.5%', 
            isPositive: true,
            icon: TrendingUp, 
            color: 'from-emerald-500 to-teal-400', 
            shadow: 'shadow-emerald-500/20' 
        },
        { 
            label: 'Pedidos Realizados', 
            value: stats?.ordersCount || 0, 
            trend: '+5.2%', 
            isPositive: true,
            icon: ShoppingCart, 
            color: 'from-flame-500 to-amber-400', 
            shadow: 'shadow-flame-500/20' 
        },
        { 
            label: 'Clientes Ativos', 
            value: stats?.customersCount || 0, 
            trend: '+2.1%', 
            isPositive: true,
            icon: Users, 
            color: 'from-blue-500 to-cyan-400', 
            shadow: 'shadow-blue-500/20' 
        },
        { 
            label: 'Entregas Hoje', 
            value: stats?.deliveriesToday || 0, 
            trend: '-1.4%', 
            isPositive: false,
            icon: Truck, 
            color: 'from-purple-500 to-pink-400', 
            shadow: 'shadow-purple-500/20' 
        },
    ];

    const getTooltipText = () => {
        if (currentPeriod === 'today') return "Comparado com ontem";
        if (currentPeriod === 'week') return "Comparado com a semana anterior";
        return "Comparado com o mês anterior";
    };

    return (
        <AdminLayout 
            title="Visão Geral" 
            notifications={notifications}
            headerActions={
                <div className="flex items-center gap-2 bg-[#0a0f1c] border border-white/10 rounded-xl p-1 shadow-lg overflow-x-auto">
                    <Link 
                        href={route('admin.dashboard', { period: 'today' })} 
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${currentPeriod === 'today' ? 'bg-flame-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Hoje
                    </Link>
                    <Link 
                        href={route('admin.dashboard', { period: 'week' })} 
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${currentPeriod === 'week' ? 'bg-flame-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Últimos 7 dias
                    </Link>
                    <Link 
                        href={route('admin.dashboard', { period: 'month' })} 
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${currentPeriod === 'month' ? 'bg-flame-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Últimos 30 dias
                    </Link>
                </div>
            }
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpis.map((kpi, i) => {
                    const Icon = kpi.icon;
                    return (
                        <motion.div
                            key={kpi.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                            className="relative group rounded-3xl p-6 bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl pointer-events-none`}></div>
                            
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${kpi.color} shadow-lg ${kpi.shadow}`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div 
                                    className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border cursor-help ${
                                        kpi.isPositive 
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}
                                    title={getTooltipText()}
                                >
                                    {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {kpi.trend}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-slate-400 mb-1">{kpi.label}</h3>
                                <div className="text-3xl font-extrabold text-white tracking-tight">{kpi.value}</div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-6"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Evolução do Faturamento</h2>
                            <p className="text-sm text-slate-400 mt-1">Acompanhamento diário da receita.</p>
                        </div>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#ffffff" opacity={0.05} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} tickFormatter={(value) => `R$ ${value}`} />
                                <Tooltip
                                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }}
                                    contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', backdropFilter: 'blur(10px)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 3 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-6 flex flex-col"
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white tracking-tight">Status Atual</h2>
                        <p className="text-sm text-slate-400 mt-1">
                            Distribuição dos pedidos {currentPeriod === 'today' ? 'do dia' : currentPeriod === 'week' ? 'da semana' : 'do mês'}.
                        </p>
                    </div>
                    <div className="flex-1 relative min-h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData.map(item => ({ ...item, value: Number(item.value) }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0a0f1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: any) => [Math.round(Number(value)), 'Pedidos']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-white">
                                {Math.round(statusData.reduce((acc, curr) => acc + Number(curr.value), 0))}
                            </span>
                            <span className="text-xs font-bold text-slate-500 tracking-wider">TOTAL</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {statusData.map(status => (
                            <div key={status.name} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                                <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: status.color, boxShadow: `0 0 10px ${status.color}` }}></div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-medium">{status.name}</span>
                                    <span className="text-base font-bold text-white">{status.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden"
                >
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Pedidos Recentes</h2>
                            <p className="text-sm text-slate-400 mt-1">Últimas movimentações no sistema.</p>
                        </div>
                        <a href={route('admin.orders')} className="text-sm font-bold text-flame-400 hover:text-flame-300 transition-colors px-4 py-2 bg-flame-500/10 rounded-full hover:bg-flame-500/20">
                            Ver Todos
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider font-bold">
                                    <th className="p-4 pl-6">ID</th>
                                    <th className="p-4">Cliente</th>
                                    <th className="p-4">Tempo</th>
                                    <th className="p-4">Valor</th>
                                    <th className="p-4">Entregador</th>
                                    <th className="p-4 pr-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-white/5">
                                {recentOrders && recentOrders.length > 0 ? recentOrders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 pl-6 font-bold text-white">#{order.id}</td>
                                        <td className="p-4">
                                            <div className="font-medium text-slate-200">{order.user?.name || order.address}</div>
                                            {order.user?.phone && <div className="text-xs text-slate-500 mt-0.5">{order.user.phone}</div>}
                                        </td>
                                        <td className="p-4">
                                            <div className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 bg-white/5 border border-white/10 rounded-md text-slate-300">
                                                <Timer className="w-3 h-3 text-slate-400" />
                                                {getTimeElapsed(order.created_at, order.updated_at, order.status)}
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-flame-400">{formatCurrency(order.total)}</td>
                                        <td className="p-4 text-slate-300">
                                            {order.driver ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold border border-white/10">
                                                        {order.driver.name.charAt(0)}
                                                    </div>
                                                    {order.driver.name}
                                                </div>
                                            ) : (
                                                <span className="text-slate-500 italic">Pendente</span>
                                            )}
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${
                                                order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                order.status === 'en_route' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-white/5 text-slate-300 border-white/10'
                                            }`}>
                                                {order.status === 'completed' ? <PackageCheck className="w-3.5 h-3.5" /> :
                                                 order.status === 'en_route' ? <Truck className="w-3.5 h-3.5" /> :
                                                 order.status === 'cancelled' ? <XCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                 
                                                {order.status === 'completed' ? 'Concluído' :
                                                 order.status === 'en_route' ? 'Em Rota' :
                                                 order.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum pedido recente.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden flex flex-col"
                >
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-xl font-bold text-white tracking-tight">Top Entregadores</h2>
                        <p className="text-sm text-slate-400 mt-1">Destaques do mês atual.</p>
                    </div>
                    <div className="p-2 flex-1">
                        {topDrivers && topDrivers.length > 0 ? topDrivers.map((driver, i) => (
                            <div key={i} className="p-4 mx-2 my-2 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center font-bold text-lg text-white shadow-lg">
                                            {driver.name.charAt(0)}
                                        </div>
                                        {i === 0 && <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full border-2 border-[#0a0f1c] flex items-center justify-center text-[#0a0f1c]"><Star className="w-3 h-3 fill-current" /></div>}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm group-hover:text-flame-400 transition-colors">{driver.name}</p>
                                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> 
                                            <span className="font-medium text-slate-300">{driver.rating}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-extrabold text-white text-lg">{driver.deliveries}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Entregas</p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 h-full flex flex-col items-center justify-center text-slate-500 text-center">
                                <Truck className="w-8 h-8 mb-3 opacity-20" />
                                <p>Nenhum entregador encontrado.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AdminLayout>
    );
}
