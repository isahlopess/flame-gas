import HubLayout from '@/Layouts/HubLayout';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const stats = [
        { label: 'Entregas Hoje', value: '12', icon: 'fa-solid fa-box-open', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Ganhos Hoje', value: 'R$ 84,00', icon: 'fa-solid fa-money-bill-wave', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Avaliação', value: '4.9', icon: 'fa-solid fa-star', color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Em Rota', value: '1', icon: 'fa-solid fa-truck-fast', color: 'text-flame-500', bg: 'bg-flame-500/10' },
    ];

    return (
        <HubLayout title="Visão Geral">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-between"
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <i className={`${stat.icon} text-xl`}></i>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Desempenho da Semana</h2>
                            <button className="text-slate-400 hover:text-flame-500 transition-colors">
                                <i className="fa-solid fa-ellipsis"></i>
                            </button>
                        </div>
                        <div className="p-6 h-72 flex items-end justify-between gap-2">
                            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
                                <div key={i} className="w-full relative group h-full flex items-end">
                                    <div
                                        className="w-full bg-slate-100 dark:bg-white/5 rounded-t-lg group-hover:bg-flame-500/20 transition-colors relative"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-flame-500 rounded-t-lg"></div>
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded font-bold transition-opacity whitespace-nowrap">
                                            {height} entregas
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 pb-6 flex justify-between text-xs font-medium text-slate-400 uppercase">
                            <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Na Fila Agora</h2>
                            <span className="bg-flame-500/10 text-flame-500 text-xs font-bold px-2 py-1 rounded">2 Pendentes</span>
                        </div>
                        <div className="p-0">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-4 border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-navy-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">
                                                C{i}
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">Cliente {i}</span>
                                        </div>
                                        <span className="text-xs font-medium text-slate-500">Há {i * 5} min</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                                        <i className="fa-solid fa-location-dot text-slate-400"></i>
                                        <span className="truncate">Rua Exemplo, {100 * i} - Bairro</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-flame-500 hover:bg-flame-600 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                                            Aceitar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </HubLayout>
    );
}
