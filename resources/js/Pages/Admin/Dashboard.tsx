import AdminLayout from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
    { name: '01 Jun', value: 1200 },
    { name: '05 Jun', value: 2100 },
    { name: '10 Jun', value: 1800 },
    { name: '15 Jun', value: 3400 },
    { name: '20 Jun', value: 2800 },
    { name: '25 Jun', value: 4200 },
    { name: '30 Jun', value: 3800 },
];

const statusData = [
    { name: 'Concluídos', value: 400, color: '#10b981' },
    { name: 'Em Rota', value: 85, color: '#f97316' },
    { name: 'Pendentes', value: 45, color: '#eab308' },
    { name: 'Cancelados', value: 20, color: '#ef4444' },
];

export default function Dashboard() {
    const kpis = [
        { label: 'Faturamento Mensal', value: 'R$ 42.500,00', trend: '+12%', icon: 'fa-solid fa-money-bill-trend-up', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Pedidos Realizados', value: '1.248', trend: '+5%', icon: 'fa-solid fa-cart-shopping', color: 'text-flame-500', bg: 'bg-flame-500/10' },
        { label: 'Clientes Ativos', value: '342', trend: '+18%', icon: 'fa-solid fa-users', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Entregas Hoje', value: '84', trend: '-2%', icon: 'fa-solid fa-truck-fast', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    return (
        <AdminLayout title="Visão Geral">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {kpis.map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/5"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                                <i className={`${kpi.icon} text-xl`}></i>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                kpi.trend.startsWith('+')
                                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                    : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                            }`}>
                                {kpi.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{kpi.label}</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Faturamento (Mês Atual)</h2>
                        <select className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm rounded-lg px-3 py-1.5 outline-none">
                            <option>Junho 2026</option>
                            <option>Maio 2026</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `R$ ${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#10b981' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Status dos Pedidos</h2>
                    <div className="flex-1 min-h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">550</span>
                            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Total</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {statusData.map(status => (
                            <div key={status.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 font-medium">{status.name}</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{status.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pedidos Recentes</h2>
                        <a href={route('admin.orders')} className="text-sm font-bold text-flame-500 hover:text-flame-600">Ver Todos</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-navy-950/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                                    <th className="p-4 pl-6">Pedido</th>
                                    <th className="p-4">Cliente</th>
                                    <th className="p-4">Valor</th>
                                    <th className="p-4">Entregador</th>
                                    <th className="p-4 pr-6">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100 dark:divide-white/5">
                                {[1, 2, 3, 4].map(i => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4 pl-6 font-bold text-slate-900 dark:text-white">#509{i}</td>
                                        <td className="p-4 font-medium text-slate-600 dark:text-slate-300">Cliente Exemplo {i}</td>
                                        <td className="p-4 font-bold text-slate-900 dark:text-white">R$ 115,00</td>
                                        <td className="p-4 text-slate-500">João Silva</td>
                                        <td className="p-4 pr-6">
                                            <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded-full">
                                                Concluído
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-white/5">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Top Entregadores (Mês)</h2>
                    </div>
                    <div className="p-0">
                        {[
                            { name: 'Marcos Almeida', deliveries: 342, rating: 4.9 },
                            { name: 'Ricardo Santos', deliveries: 289, rating: 4.8 },
                            { name: 'Felipe Costa', deliveries: 215, rating: 4.9 },
                        ].map((driver, i) => (
                            <div key={i} className="p-4 border-b border-slate-100 dark:border-white/5 last:border-0 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-navy-800 dark:to-navy-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                                        {driver.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{driver.name}</p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <i className="fa-solid fa-star text-amber-500"></i> {driver.rating}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{driver.deliveries}</p>
                                    <p className="text-xs text-slate-500 uppercase">Entregas</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
