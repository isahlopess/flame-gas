import HubLayout from '@/Layouts/HubLayout';
import { motion } from 'framer-motion';
import { Search, Calendar, Download, CheckCircle2, XCircle, MapPin, Box, ChevronLeft, ChevronRight } from 'lucide-react';

export default function History({ history }: { history: any[] }) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <HubLayout title="Histórico de Entregas">
            <div className="bg-[#0a0f1c]/40 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden flex flex-col relative z-10">
                <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative flex-1 max-w-md w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por ID ou cliente..."
                            className="block w-full pl-12 pr-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:ring-flame-500 focus:border-flame-500 sm:text-sm transition-all focus:bg-white/10"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
                            <Calendar className="w-4 h-4" /> Data
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
                            <Download className="w-4 h-4" /> Exportar
                        </button>
                    </div>
                </div>
                <div className="p-6 sm:p-8 relative">
                    <div className="absolute left-8 sm:left-12 top-8 bottom-8 w-px bg-white/5"></div>
                    <div className="space-y-8">
                        {history.map((item, index) => {
                            const isCompleted = item.status === 'completed';
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative flex items-start gap-6 sm:gap-8 group"
                                >
                                    <div className="relative z-10 shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center -ml-1.5 sm:-ml-2.5 bg-[#0a0f1c] border-4 border-[#0a0f1c]">
                                        <div className={`w-full h-full rounded-full flex items-center justify-center ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {isCompleted ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-white/5 border border-white/5 group-hover:border-white/10 rounded-2xl p-5 sm:p-6 transition-colors">
                                        <div className="flex flex-col xl:flex-row justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">#{item.id}</span>
                                                    <span className="hidden sm:block text-slate-600">•</span>
                                                    <span className="text-sm text-slate-400 font-medium">
                                                        {new Date(item.created_at).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center font-bold text-white text-lg shadow-inner shrink-0">
                                                        {(item.user?.name || item.address).charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white text-lg">{item.user?.name || item.address}</h3>
                                                        <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            {item.address}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-4 border-t xl:border-t-0 xl:border-l border-white/5 pt-4 xl:pt-0 xl:pl-6 shrink-0">
                                                <div className="text-left xl:text-right">
                                                    <p className="text-xs text-slate-400 mb-1 flex items-center xl:justify-end gap-1.5">
                                                        <Box className="w-3.5 h-3.5" /> {item.items?.length || 0} itens entregues
                                                    </p>
                                                    <p className="text-2xl font-black text-white">{formatCurrency(item.total)}</p>
                                                </div>
                                                <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                    {isCompleted ? 'Concluído' : 'Cancelado'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <p className="text-sm text-slate-400 hidden sm:block">
                        Mostrando <span className="font-bold text-white">1</span> a <span className="font-bold text-white">7</span> de <span className="font-bold text-white">24</span> entregas
                    </p>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex gap-1">
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-flame-500 text-white font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                                1
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-transparent text-slate-400 hover:bg-white/5 transition-colors font-medium">
                                2
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-transparent text-slate-400 hover:bg-white/5 transition-colors font-medium">
                                3
                            </button>
                        </div>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </HubLayout>
    );
}
