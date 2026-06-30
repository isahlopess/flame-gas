import AdminLayout from '@/Layouts/AdminLayout';

export default function Clients() {
    const clients = [
        { id: 'C001', name: 'Maria Silva', email: 'maria@example.com', phone: '(11) 98888-7777', orders: 12, totalSpent: 'R$ 1.380,00', status: 'Ativo', lastOrder: 'Hoje' },
        { id: 'C002', name: 'João Souza', email: 'joao@example.com', phone: '(11) 97777-6666', orders: 5, totalSpent: 'R$ 575,00', status: 'Ativo', lastOrder: 'Há 5 dias' },
        { id: 'C003', name: 'Padaria Central', email: 'contato@padariacentral.com', phone: '(11) 3333-4444', orders: 48, totalSpent: 'R$ 15.600,00', status: 'VIP', lastOrder: 'Ontem' },
        { id: 'C004', name: 'Carlos Mendes', email: 'carlos@example.com', phone: '(11) 96666-5555', orders: 1, totalSpent: 'R$ 115,00', status: 'Inativo', lastOrder: 'Há 3 meses' },
    ];

    return (
        <AdminLayout title="Gestão de Clientes">
            <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <button className="px-4 py-2 bg-flame-500 hover:bg-flame-600 text-white rounded-lg text-sm font-bold shadow-md shadow-flame-500/20 transition-all">
                        <i className="fa-solid fa-plus mr-2"></i> Novo Cliente
                    </button>
                    <div className="flex gap-2">
                        <select className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm rounded-lg px-3 py-2 outline-none">
                            <option>Todos os Status</option>
                            <option>Ativos</option>
                            <option>VIPs</option>
                            <option>Inativos</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-white/5">
                        <thead className="bg-slate-50 dark:bg-navy-950/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contato</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pedidos</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Gasto Total</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Último Pedido</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-navy-900 divide-y divide-slate-100 dark:divide-white/5">
                            {clients.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">
                                                {item.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</div>
                                                <div className="text-xs text-slate-500">{item.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-900 dark:text-white">{item.phone}</div>
                                        <div className="text-xs text-slate-500">{item.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{item.orders}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">{item.totalSpent}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.lastOrder}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                                            item.status === 'VIP' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                                            item.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                            'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-slate-400 hover:text-flame-500 mx-2"><i className="fa-solid fa-pen"></i></button>
                                        <button className="text-slate-400 hover:text-red-500"><i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
