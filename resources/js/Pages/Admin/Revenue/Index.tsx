import AdminLayout from '@/Layouts/AdminLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function Revenue({ revenueDetails, totalRevenue, paymentMethods, revenueChartData }: { revenueDetails: any[], totalRevenue: number, paymentMethods: any[], revenueChartData: any[] }) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <AdminLayout title="Faturamento e Financeiro">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-[#0a0f1c] rounded-3xl p-1 shadow-xl border border-white/5 relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="flex flex-col sm:flex-row relative z-10">
                            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                                        <i className="fa-solid fa-sack-dollar text-emerald-400 text-xl"></i>
                                    </div>
                                    <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Receita Bruta (Ano)</p>
                                </div>
                                <div className="flex justify-between items-end gap-4">
                                    <div>
                                        <p className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-sm">{formatCurrency(totalRevenue || 0)}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/20 shadow-sm">+15.3%</span>
                                            <span className="text-xs font-medium text-slate-500">vs ano anterior</span>
                                        </div>
                                    </div>
                                    <div className="h-16 w-28 sm:w-32 opacity-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={revenueChartData}>
                                                <Tooltip
                                                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', padding: '6px 10px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                                                    itemStyle={{ color: '#10b981', fontWeight: 'bold', margin: 0 }}
                                                    formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Receita']}
                                                    labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '2px', fontWeight: '600', textTransform: 'uppercase' }}
                                                />
                                                <XAxis dataKey="name" hide />
                                                <Area type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} fillOpacity={0.2} fill="#10b981" isAnimationActive={false} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden sm:flex flex-col justify-center items-center px-2">
                                <div className="w-px h-full max-h-[140px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                            </div>
                            <div className="sm:hidden w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2"></div>
                            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                                        <i className="fa-solid fa-chart-line text-blue-400 text-xl"></i>
                                    </div>
                                    <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Lucro Líq. Estimado</p>
                                </div>
                                <div className="flex justify-between items-end gap-4">
                                    <div>
                                        <p className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-sm">{formatCurrency((totalRevenue || 0) * 0.375)}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Margem:</span>
                                            <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">37.5%</span>
                                        </div>
                                    </div>
                                    <div className="h-16 w-28 sm:w-32 opacity-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={revenueChartData}>
                                                <Tooltip
                                                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', padding: '6px 10px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                                                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold', margin: 0 }}
                                                    formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Lucro']}
                                                    labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '2px', fontWeight: '600', textTransform: 'uppercase' }}
                                                />
                                                <XAxis dataKey="name" hide />
                                                <Area type="monotone" dataKey={(d) => d.receita * 0.375} stroke="#3b82f6" strokeWidth={2} fillOpacity={0.2} fill="#3b82f6" isAnimationActive={false} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mx-4 mb-4 sm:mx-6 sm:mb-6 mt-auto p-5 rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/5 flex gap-4 items-start relative z-10 hover:bg-white/10 transition-colors group">
                            <div className="shrink-0 mt-0.5 w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-lightbulb text-amber-400 text-lg drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"></i>
                            </div>
                            <div>
                                <p className="text-[15px] text-slate-300 leading-relaxed font-medium">
                                    <strong className="text-white tracking-wide">Insight Inteligente:</strong> A sua margem de lucro está excelente! O faturamento atual de <span className="text-emerald-400 font-bold">{formatCurrency(totalRevenue || 0)}</span> sugere um negócio altamente saudável. Recomendamos destinar 10% do excedente em marketing local para maximizar a conversão de novos clientes no próximo trimestre.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#0a0f1c] rounded-3xl shadow-xl border border-white/5 p-6 sm:p-8 flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-white">Receitas vs Despesas</h2>
                                <p className="text-sm text-slate-400 mt-1">Comparativo de fluxo de caixa</p>
                            </div>
                            <select className="bg-white/5 border border-white/10 text-slate-300 font-medium text-sm rounded-xl px-4 py-2 outline-none hover:bg-white/10 cursor-pointer transition-colors focus:border-flame-500">
                                <option className="bg-[#0a0f1c]">2026</option>
                                <option className="bg-[#0a0f1c]">2025</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorDesp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.05} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} tickFormatter={(value) => `R$ ${(value/1000)}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Area type="monotone" name="Receita" dataKey="receita" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRec)" />
                                    <Area type="monotone" name="Despesa" dataKey="despesa" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorDesp)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="bg-[#0a0f1c] rounded-3xl p-5 shadow-xl border border-white/5 flex flex-col relative overflow-hidden">
                        <div className="relative z-10 mb-4">
                            <h3 className="text-white font-bold text-lg mb-0.5">Exportar Dados</h3>
                            <p className="text-xs text-slate-400">Gere relatórios instantâneos</p>
                        </div>
                        <div className="flex gap-3 relative z-10">
                            <a
                                href="/admin/revenue/export-pdf"
                                target="_blank"
                                className="flex-1 cursor-pointer group py-3 px-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-all overflow-hidden border border-white/5 hover:border-white/20 shadow-md flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-file-pdf text-red-500 text-lg group-hover:-translate-y-0.5 transition-transform"></i> PDF
                            </a>
                            <a
                                href="/admin/revenue/export-csv"
                                target="_blank"
                                className="flex-1 cursor-pointer group py-3 px-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-all overflow-hidden border border-white/5 hover:border-white/20 shadow-md flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-file-excel text-emerald-500 text-lg group-hover:-translate-y-0.5 transition-transform"></i> Excel
                            </a>
                        </div>
                    </div>
                    <div className="bg-[#0a0f1c] rounded-3xl shadow-xl border border-white/5 p-6 sm:p-8 flex flex-col relative overflow-hidden flex-1">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="mb-6 relative z-10">
                            <h2 className="text-xl font-bold text-white">Carteira Digital</h2>
                            <p className="text-sm text-slate-400 mt-1">Meios de pagamento</p>
                        </div>
                        {paymentMethods && paymentMethods.length > 0 ? (
                            <div className="flex-1 flex flex-col">
                                {(() => {
                                    const method = paymentMethods[0];
                                    const isPix = method.name.includes('Pix');
                                    const isMoney = method.name.includes('Dinheiro');
                                    const isCredit = method.name.includes('Crédito') || method.name.includes('Débito');

                                    if (isPix) {
                                        return (
                                            <div className="w-full rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-700 to-slate-900 p-6 relative overflow-hidden border border-emerald-500/30 shadow-2xl mb-6 group cursor-pointer hover:border-emerald-400 transition-all hover:scale-[1.02] transform duration-300">
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                                                <div className="flex justify-between items-start mb-8 relative z-10">
                                                    <i className="fa-brands fa-pix text-white text-4xl drop-shadow-md"></i>
                                                    <i className="fa-solid fa-qrcode text-emerald-300 text-3xl opacity-50"></i>
                                                </div>
                                                <div className="relative z-10">
                                                    <p className="text-emerald-200 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Principal (Pix)</p>
                                                    <div className="flex justify-between items-end">
                                                        <p className="text-xl sm:text-2xl font-black text-white tracking-widest">{method.name}</p>
                                                        <p className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{method.value}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else if (isMoney) {
                                        return (
                                            <div className="w-full rounded-2xl bg-gradient-to-br from-amber-600 via-emerald-800 to-green-900 p-6 relative overflow-hidden border border-amber-500/30 shadow-2xl mb-6 group cursor-pointer hover:border-amber-400 transition-all hover:scale-[1.02] transform duration-300">
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                                                <div className="flex justify-between items-start mb-8 relative z-10">
                                                    <i className="fa-solid fa-money-bill-wave text-white text-4xl drop-shadow-md"></i>
                                                    <i className="fa-solid fa-coins text-amber-300 text-3xl opacity-50"></i>
                                                </div>
                                                <div className="relative z-10">
                                                    <p className="text-amber-200 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Principal (Espécie)</p>
                                                    <div className="flex justify-between items-end">
                                                        <p className="text-xl sm:text-2xl font-black text-white tracking-widest">{method.name}</p>
                                                        <p className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{method.value}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className={`w-full rounded-2xl bg-gradient-to-br ${isCredit ? 'from-blue-700 via-indigo-900' : 'from-slate-700 via-slate-800'} to-black p-6 relative overflow-hidden border border-white/10 shadow-2xl mb-6 group cursor-pointer hover:border-white/30 transition-all hover:scale-[1.02] transform duration-300`}>
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 -mb-10 blur-xl"></div>
                                                <div className="flex justify-between items-start mb-8 relative z-10">
                                                    <i className="fa-solid fa-microchip text-amber-200/80 text-4xl drop-shadow-md"></i>
                                                    <div className="flex gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-red-500/80 mix-blend-screen"></div>
                                                        <div className="w-8 h-8 rounded-full bg-amber-500/80 mix-blend-screen -ml-4"></div>
                                                    </div>
                                                </div>
                                                <div className="relative z-10">
                                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Principal (Cartão)</p>
                                                    <div className="flex justify-between items-end">
                                                        <p className="text-xl sm:text-2xl font-black text-white tracking-widest">{method.name}</p>
                                                        <p className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{method.value}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })()}
                                <div className="flex-1 space-y-3 relative z-10">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">Outros Métodos</p>
                                    {paymentMethods.slice(1).map((method) => {
                                        const isPix = method.name.includes('Pix');
                                        const isCredit = method.name.includes('Crédito') || method.name.includes('Débito');
                                        const isMoney = method.name.includes('Dinheiro');

                                        return (
                                            <div key={method.name} className={`flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border ${method.value === 0 ? 'border-white/5 opacity-60' : 'border-white/10 hover:bg-white/10 hover:scale-[1.02]'} transition-all cursor-pointer transform duration-300`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                                                        isPix ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                                                        isCredit ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                                                        isMoney ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                                                        'bg-slate-500/20 text-slate-400 border border-slate-500/20'
                                                    }`}>
                                                        <i className={`text-xl ${
                                                            isPix ? 'fa-brands fa-pix' :
                                                            isCredit ? 'fa-solid fa-credit-card' :
                                                            isMoney ? 'fa-solid fa-money-bill-wave' : 'fa-solid fa-credit-card'
                                                        }`}></i>
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-white text-base block">{method.name}</span>
                                                        <span className="text-xs text-slate-400 font-medium">{method.value === 0 ? 'Sem dados' : 'Uso secundário'}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`font-black text-lg block ${method.value === 0 ? 'text-slate-500' : 'text-white'}`}>{method.value}%</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="text-slate-500 text-sm flex-1 flex items-center justify-center">Nenhum dado disponível.</div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
