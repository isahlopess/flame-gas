import HubLayout from '@/Layouts/HubLayout';

export default function History() {
    const historyItems = [
        { id: '#4092', customer: 'Lanchonete Sabor', date: 'Hoje, 14:30', items: '2x P13', total: 'R$ 230,00', status: 'Concluído', color: 'text-emerald-500 bg-emerald-500/10' },
        { id: '#4091', customer: 'Carlos Mendes', date: 'Hoje, 11:15', items: '1x P13, 1x Água 20L', total: 'R$ 130,00', status: 'Concluído', color: 'text-emerald-500 bg-emerald-500/10' },
        { id: '#4090', customer: 'Fernanda Lima', date: 'Hoje, 09:45', items: '1x P13', total: 'R$ 115,00', status: 'Concluído', color: 'text-emerald-500 bg-emerald-500/10' },
        { id: '#4089', customer: 'Restaurante Central', date: 'Ontem, 19:20', items: '3x P45', total: 'R$ 1.230,00', status: 'Cancelado', color: 'text-red-500 bg-red-500/10' },
        { id: '#4088', customer: 'Ana Clara', date: 'Ontem, 16:10', items: '1x P13', total: 'R$ 115,00', status: 'Concluído', color: 'text-emerald-500 bg-emerald-500/10' },
        { id: '#4087', customer: 'Roberto Silva', date: 'Ontem, 14:05', items: '2x Água 20L', total: 'R$ 30,00', status: 'Concluído', color: 'text-emerald-500 bg-emerald-500/10' },
        { id: '#4086', customer: 'Condomínio Vista Bela', date: 'Ontem, 10:30', items: '5x P13', total: 'R$ 575,00', status: 'Concluído', color: 'text-emerald-500 bg-emerald-500/10' },
    ];

    return (
        <HubLayout title="Histórico de Entregas">
            <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por ID ou cliente..."
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-white/10 rounded-lg bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-flame-500 focus:border-flame-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                            <i className="fa-regular fa-calendar mr-2"></i> Data
                        </button>
                        <button className="px-4 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                            <i className="fa-solid fa-download mr-2"></i> Exportar
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-white/5">
                        <thead className="bg-slate-50 dark:bg-navy-950/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    ID do Pedido
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Data
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Itens
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-navy-900 divide-y divide-slate-100 dark:divide-white/5">
                            {historyItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">
                                        {item.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">
                                                {item.customer.charAt(0)}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{item.customer}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        {item.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        {item.items}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">
                                        {item.total}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${item.color}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white dark:bg-navy-900 px-4 py-3 border-t border-slate-100 dark:border-white/5 sm:px-6 flex items-center justify-between">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                Mostrando <span className="font-medium">1</span> a <span className="font-medium">7</span> de <span className="font-medium">24</span> resultados
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5">
                                    <span className="sr-only">Anterior</span>
                                    <i className="fa-solid fa-chevron-left"></i>
                                </a>
                                <a href="#" aria-current="page" className="z-10 bg-flame-50 dark:bg-flame-500/10 border-flame-500 text-flame-600 dark:text-flame-400 relative inline-flex items-center px-4 py-2 border text-sm font-bold">
                                    1
                                </a>
                                <a href="#" className="bg-white dark:bg-navy-900 border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                    2
                                </a>
                                <a href="#" className="bg-white dark:bg-navy-900 border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                    3
                                </a>
                                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5">
                                    <span className="sr-only">Próximo</span>
                                    <i className="fa-solid fa-chevron-right"></i>
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </HubLayout>
    );
}
