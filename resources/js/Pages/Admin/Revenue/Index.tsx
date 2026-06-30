import AdminLayout from '@/Layouts/AdminLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function Revenue() {
    const revenueData = [
        { name: 'Jan', receita: 38000, despesa: 24000 },
        { name: 'Fev', receita: 42000, despesa: 26000 },
        { name: 'Mar', receita: 39000, despesa: 25000 },
        { name: 'Abr', receita: 45000, despesa: 28000 },
        { name: 'Mai', receita: 48000, despesa: 29000 },
        { name: 'Jun', receita: 42500, despesa: 27000 },
    ];

    const paymentMethods = [
        { name: 'Pix', value: 45 },
        { name: 'Cartão de Crédito', value: 35 },
        { name: 'Dinheiro', value: 15 },
        { name: 'Cartão de Débito', value: 5 },
    ];

    return (
        <AdminLayout title="Faturamento e Financeiro">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/5">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Receita Bruta (Ano)</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mb-4">R$ 254.500,00</p>
                    <div className="w-full bg-slate-100 dark:bg-navy-800 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Meta: R$ 350.000,00</p>
                </div>
                <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/5">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Lucro Líquido Estimado</p>
                    <p className="text-2xl font-bold text-emerald-500 mb-4">R$ 95.500,00</p>
                    <div className="w-full bg-slate-100 dark:bg-navy-800 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '37%' }}></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Margem de 37.5%</p>
                </div>
                <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/5 flex flex-col justify-center">
                    <button className="w-full py-3 bg-slate-50 dark:bg-navy-800 hover:bg-slate-100 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors mb-3">
                        <i className="fa-solid fa-file-pdf mr-2 text-red-500"></i> Relatório PDF
                    </button>
                    <button className="w-full py-3 bg-slate-50 dark:bg-navy-800 hover:bg-slate-100 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors">
                        <i className="fa-solid fa-file-excel mr-2 text-emerald-500"></i> Exportar Excel
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Receitas vs Despesas</h2>
                        <select className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm rounded-lg px-3 py-1.5 outline-none">
                            <option>2026</option>
                            <option>2025</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorDesp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `R$ ${(value/1000)}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Legend />
                                <Area type="monotone" name="Receita" dataKey="receita" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRec)" />
                                <Area type="monotone" name="Despesa" dataKey="despesa" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDesp)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Meios de Pagamento</h2>
                    <div className="flex-1 space-y-5 mt-4">
                        {paymentMethods.map(method => (
                            <div key={method.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{method.name}</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{method.value}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-navy-800 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${
                                            method.name === 'Pix' ? 'bg-emerald-500' :
                                            method.name.includes('Crédito') ? 'bg-blue-500' :
                                            method.name.includes('Dinheiro') ? 'bg-amber-500' : 'bg-slate-400'
                                        }`}
                                        style={{ width: `${method.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
