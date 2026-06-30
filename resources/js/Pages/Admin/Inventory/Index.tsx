import AdminLayout from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';

export default function Inventory() {
    const products = [
        { id: 'PROD-001', name: 'Botijão de Gás P13 (13kg)', sku: 'P13-GAS', stock: 145, minStock: 50, cost: 'R$ 80,00', price: 'R$ 115,00', category: 'Gás Residencial', status: 'Em Estoque' },
        { id: 'PROD-002', name: 'Cilindro de Gás P45 (45kg)', sku: 'P45-GAS', stock: 12, minStock: 20, cost: 'R$ 320,00', price: 'R$ 410,00', category: 'Gás Comercial', status: 'Estoque Baixo' },
        { id: 'PROD-003', name: 'Galão de Água Mineral (20L)', sku: 'AGUA-20L', stock: 80, minStock: 30, cost: 'R$ 8,00', price: 'R$ 15,00', category: 'Água', status: 'Em Estoque' },
        { id: 'PROD-004', name: 'Kit Registro + Mangueira Inmetro', sku: 'KIT-SEG', stock: 5, minStock: 15, cost: 'R$ 25,00', price: 'R$ 45,00', category: 'Acessórios', status: 'Crítico' },
    ];

    return (
        <AdminLayout title="Controle de Estoque">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm flex flex-col items-start justify-center">
                    <p className="text-slate-500 text-sm font-medium">Itens no Estoque</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">242</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm flex flex-col items-start justify-center">
                    <p className="text-slate-500 text-sm font-medium">Itens em Baixa</p>
                    <p className="text-3xl font-bold text-amber-500 mt-1">1</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm flex flex-col items-start justify-center">
                    <p className="text-slate-500 text-sm font-medium">Valor em Estoque</p>
                    <p className="text-3xl font-bold text-emerald-500 mt-1">R$ 16.205,00</p>
                </motion.div>
            </div>
            <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <button className="px-4 py-2 bg-flame-500 hover:bg-flame-600 text-white rounded-lg text-sm font-bold shadow-md shadow-flame-500/20 transition-all">
                        <i className="fa-solid fa-plus mr-2"></i> Novo Produto
                    </button>
                    <div className="flex gap-2">
                        <select className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm rounded-lg px-3 py-2 outline-none">
                            <option>Todas Categorias</option>
                            <option>Gás</option>
                            <option>Água</option>
                            <option>Acessórios</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-white/5">
                        <thead className="bg-slate-50 dark:bg-navy-950/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Produto / SKU</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Estoque</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Preço Custo</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Preço Venda</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-navy-900 divide-y divide-slate-100 dark:divide-white/5">
                            {products.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</div>
                                        <div className="text-xs text-slate-500">{item.sku}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{item.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{item.stock} un</div>
                                        <div className="text-xs text-slate-500">Mín: {item.minStock}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{item.cost}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">{item.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                                            item.status === 'Em Estoque' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                            item.status === 'Estoque Baixo' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-slate-400 hover:text-flame-500 mx-2"><i className="fa-solid fa-pen"></i></button>
                                        <button className="text-slate-400 hover:text-blue-500"><i className="fa-solid fa-boxes-packing"></i></button>
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
