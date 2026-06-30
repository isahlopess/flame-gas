import HubLayout from '@/Layouts/HubLayout';
import { motion } from 'framer-motion';

export default function Queue() {
    const queueItems = [
        { id: 1, customer: 'Maria Silva', address: 'Rua das Flores, 123', neighborhood: 'Centro', items: '1x P13', total: 'R$ 115,00', time: '5 min', distance: '1.2 km' },
        { id: 2, customer: 'João Souza', address: 'Av Principal, 456', neighborhood: 'Jardim', items: '2x P13', total: 'R$ 230,00', time: '12 min', distance: '3.5 km' },
        { id: 3, customer: 'Padaria Pão Quente', address: 'Rua do Comércio, 78', neighborhood: 'Centro', items: '1x P45', total: 'R$ 410,00', time: '15 min', distance: '2.1 km' },
    ];

    return (
        <HubLayout title="Fila de Pedidos">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-slate-600 dark:text-slate-400">
                    Você tem <strong className="text-flame-500">{queueItems.length} pedidos</strong> pendentes na sua região.
                </p>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <i className="fa-solid fa-filter mr-2"></i> Filtros
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <i className="fa-solid fa-arrow-up-short-wide mr-2"></i> Mais Próximos
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {queueItems.map((order, i) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-flame-500/10 to-amber-500/10 rounded-bl-full -z-10"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                                    {order.customer.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{order.customer}</h3>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <i className="fa-regular fa-clock"></i> Há {order.time}
                                    </p>
                                </div>
                            </div>
                            <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-xs font-bold px-2 py-1 rounded">
                                PENDENTE
                            </span>
                        </div>
                        <div className="space-y-3 mb-6 flex-1">
                            <div className="flex items-start gap-3">
                                <div className="w-6 flex justify-center mt-1 text-slate-400">
                                    <i className="fa-solid fa-location-dot"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight">
                                        {order.address}
                                    </p>
                                    <p className="text-xs text-slate-500">{order.neighborhood}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 flex justify-center mt-1 text-slate-400">
                                    <i className="fa-solid fa-box"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight">
                                        {order.items}
                                    </p>
                                    <p className="text-xs font-bold text-flame-500">{order.total}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 flex justify-center mt-1 text-slate-400">
                                    <i className="fa-solid fa-route"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight">
                                        {order.distance} de você
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-auto">
                            <button className="flex-1 bg-flame-500 hover:bg-flame-600 text-white font-bold py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)]">
                                Aceitar
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-navy-800 text-slate-500 hover:text-red-500 rounded-xl transition-colors shrink-0">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </HubLayout>
    );
}
