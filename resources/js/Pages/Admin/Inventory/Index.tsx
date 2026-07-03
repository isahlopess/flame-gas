import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, router } from '@inertiajs/react';
import { X, Upload, ArrowUp, ArrowDown, Trash2, Edit2, Plus, Image as ImageIcon, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Inventory({ products }: { products: any[] }) {
    const [localProducts, setLocalProducts] = useState([...products]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);

    useEffect(() => {
        setLocalProducts([...products]);
    }, [products]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (productToDelete !== null) {
            router.delete(route('admin.products.destroy', productToDelete), {
                onSuccess: () => {
                    setLocalProducts(prev => prev.filter(p => p.id !== productToDelete));
                    setProductToDelete(null);
                },
                preserveScroll: true
            });
        }
    };

    const moveProduct = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === localProducts.length - 1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const newProducts = [...localProducts];
        const temp = newProducts[index];
        newProducts[index] = newProducts[newIndex];
        newProducts[newIndex] = temp;

        setLocalProducts(newProducts);

        router.post(route('admin.products.reorder'), {
            orderedIds: newProducts.map(p => p.id)
        }, { preserveScroll: true });
    };

    const lowStockThreshold = 10;
    const lowStockItems = localProducts.filter(p => (p.stock || 0) < lowStockThreshold);
    const goodStockItemsCount = localProducts.length - lowStockItems.length;
    const healthPercentage = localProducts.length === 0 ? 100 : Math.round((goodStockItemsCount / localProducts.length) * 100);

    const gaugeData = [
        { name: 'Saudável', value: healthPercentage, color: '#10b981' },
        { name: 'Crítico', value: 100 - healthPercentage, color: '#1e293b' }
    ];

    return (
        <AdminLayout title="Controle de Estoque">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-center">
                <div className="flex flex-col gap-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a0f1c] p-6 rounded-2xl border border-white/5 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Produtos Cadastrados</p>
                            <p className="text-3xl font-bold text-white mt-1">{localProducts.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <i className="fa-solid fa-boxes-stacked text-blue-500 text-xl"></i>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-[#0a0f1c] p-6 rounded-2xl border border-white/5 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Total em Estoque</p>
                            <p className="text-3xl font-bold text-emerald-500 mt-1">{localProducts.reduce((acc, curr) => acc + (curr.stock || 0), 0)}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <i className="fa-solid fa-cubes text-emerald-500 text-xl"></i>
                        </div>
                    </motion.div>
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="col-span-1 flex flex-col items-center justify-center relative h-full min-h-[200px]">
                    <div className="h-48 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={gaugeData}
                                    cx="50%"
                                    cy="100%"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={100}
                                    outerRadius={130}
                                    paddingAngle={0}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {gaugeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-2">
                            <span className="text-5xl font-black text-white">{healthPercentage}%</span>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{healthPercentage >= 80 ? 'Excelente' : (healthPercentage >= 50 ? 'Atenção' : 'Crítico')}</span>
                        </div>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0a0f1c] p-6 rounded-2xl border border-white/5 shadow-sm col-span-1 h-full flex flex-col max-h-[250px]">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                Atenção
                            </h3>
                            <p className="text-slate-400 text-sm">Abaixo de {lowStockThreshold} un</p>
                        </div>
                        <div className="bg-white/5 px-3 py-1 rounded-lg text-xs font-bold text-white">
                            {lowStockItems.length} Itens
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {lowStockItems.length > 0 ? (
                            lowStockItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                                <ImageIcon className="w-4 h-4 text-slate-500" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white font-bold text-sm">{item.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-amber-500 font-black text-lg">{item.stock} <span className="text-xs font-normal text-amber-500/70">un</span></p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 py-6">
                                <CheckCircle2 className="w-8 h-8 mb-2 text-emerald-500/50" />
                                <p className="text-sm font-medium text-emerald-400">Tudo sob controle!</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
            <div className="bg-[#0a0f1c] rounded-2xl shadow-sm border border-white/5 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <button onClick={handleCreate} className="px-4 py-2 bg-flame-500 hover:bg-flame-600 text-white rounded-lg text-sm font-bold shadow-md shadow-flame-500/20 transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Novo Produto
                    </button>
                    <div className="text-sm font-medium text-slate-400 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
                        <ArrowUp className="w-4 h-4 text-flame-500" />
                        Use as setas para alterar a ordem de exibição
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/5">
                        <thead className="bg-white/5">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-16">Ordem</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Foto</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Produto</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Categoria</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Estoque</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Preço</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {localProducts && localProducts.length > 0 ? localProducts.map((item, index) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col items-center gap-1 opacity-100 transition-opacity">
                                            <button
                                                onClick={() => moveProduct(index, 'up')}
                                                disabled={index === 0}
                                                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                                            >
                                                <ArrowUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => moveProduct(index, 'down')}
                                                disabled={index === localProducts.length - 1}
                                                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                                            >
                                                <ArrowDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-white/5 border border-white/10" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                                                <ImageIcon className="w-5 h-5" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-white">{item.name}</div>
                                        <div className="text-xs text-slate-400 line-clamp-1 max-w-[200px]">{item.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            (item.stock || 0) < lowStockThreshold
                                            ? 'bg-amber-500/10 text-amber-500'
                                            : 'bg-emerald-500/10 text-emerald-400'
                                        }`}>
                                            {item.stock || 0} un
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-400">{formatCurrency(item.price)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-flame-500 transition-colors rounded-lg hover:bg-white/5">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setProductToDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-white/5 ml-2">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={7} className="p-8 text-center text-slate-500 font-medium">Nenhum produto cadastrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <AnimatePresence>
                {isModalOpen && (
                    <ProductModal
                        product={editingProduct}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
                {productToDelete !== null && (
                    <DeleteModal
                        onClose={() => setProductToDelete(null)}
                        onConfirm={confirmDelete}
                    />
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}

function DeleteModal({ onClose, onConfirm }: { onClose: () => void, onConfirm: () => void }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-sm bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 text-center"
            >
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Excluir Produto?</h3>
                <p className="text-slate-400 text-sm mb-6">Esta ação não pode ser desfeita. O produto e sua imagem serão permanentemente removidos.</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-colors"
                    >
                        Sim, excluir
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

function ProductModal({ product, onClose }: { product: any, onClose: () => void }) {
    const { data, setData, post, processing, errors } = useForm({
        name: product?.name || '',
        price: product?.price || '',
        category: product?.category || 'Gás',
        stock: product?.stock || 99,
        description: product?.description || '',
        image: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(product?.image || null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (product) {
            post(route('admin.products.update', product.id), {
                onSuccess: () => {
                    onClose();
                    router.reload();
                },
                preserveScroll: true
            });
        } else {
            post(route('admin.products.store'), {
                onSuccess: () => {
                    onClose();
                    router.reload();
                },
                preserveScroll: true
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <h2 className="text-xl font-bold text-white">
                        {product ? 'Editar Produto' : 'Novo Produto'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-32 h-32 rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center overflow-hidden group">
                            {preview ? (
                                <>
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Upload className="w-6 h-6 text-white" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-slate-400">
                                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                    <span className="text-xs font-bold">Adicionar Foto</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        {errors.image && <span className="text-red-400 text-xs font-bold">{errors.image}</span>}
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-1">Nome do Produto *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-flame-500 focus:border-transparent outline-none"
                                placeholder="Ex: Botijão 13kg"
                                required
                            />
                            {errors.name && <span className="text-red-400 text-xs font-bold">{errors.name}</span>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-1">Preço (R$) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={e => setData('price', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-flame-500 focus:border-transparent outline-none"
                                    placeholder="0.00"
                                    required
                                />
                                {errors.price && <span className="text-red-400 text-xs font-bold">{errors.price}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-1">Estoque</label>
                                <input
                                    type="number"
                                    value={data.stock}
                                    onChange={e => setData('stock', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-flame-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-1">Categoria</label>
                            <select
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-flame-500"
                            >
                                <option value="Gás">Gás</option>
                                <option value="Água">Água</option>
                                <option value="Acessórios">Acessórios</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-1">Descrição</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-flame-500 focus:border-transparent outline-none resize-none h-24"
                                placeholder="Breve descrição do produto..."
                            ></textarea>
                        </div>
                    </div>
                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 bg-flame-500 hover:bg-flame-600 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-lg shadow-flame-500/20 transition-all flex items-center gap-2"
                        >
                            {processing ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                product ? 'Salvar Alterações' : 'Criar Produto'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
