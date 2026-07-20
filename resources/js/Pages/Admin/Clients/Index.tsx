import React, { useState, useMemo, Fragment } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import {
    Users, UserPlus, Star, Search, Filter,
    User, Phone, MapPin, Edit2, Trash2, Eye,
    X, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

declare function route(name: string, params?: any): string;

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    total_amount: number;
    status: string;
    created_at: string;
    items?: OrderItem[];
}

interface Client {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    neighborhood: string | null;
    city: string | null;
    orders_count: number;
    total_spent: number;
    created_at: string;
    orders: Order[];
}

interface Props {
    clients: Client[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateString));
};

const getClientStatus = (client: Client) => {
    if (client.orders_count > 10 || client.total_spent > 500) return 'VIP';
    if (client.orders_count > 0) return 'Active';
    return 'Inactive';
};

const SlideOver = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
    <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
            <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-navy-900 shadow-xl border-l border-slate-200 dark:border-navy-800">
                                    <div className="px-4 py-6 sm:px-6 bg-slate-50 dark:bg-navy-800 border-b border-slate-200 dark:border-navy-700 flex items-center justify-between">
                                        <Dialog.Title className="text-lg font-semibold leading-6 text-slate-900 dark:text-white">
                                            {title}
                                        </Dialog.Title>
                                        <button
                                            type="button"
                                            className="rounded-full p-2 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 focus:outline-none transition-colors cursor-pointer"
                                            onClick={onClose}
                                        >
                                            <span className="sr-only">Fechar painel</span>
                                            <X className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </div>
                                    <div className="relative flex-1 p-6">
                                        {children}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </div>
        </Dialog>
    </Transition.Root>
);

export default function ClientsIndex({ clients = [] }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        neighborhood: '',
        city: '',
    });

    const openAdd = () => {
        reset();
        clearErrors();
        setIsAddOpen(true);
    };

    const openEdit = (client: Client) => {
        setSelectedClient(client);
        setData({
            name: client.name || '',
            phone: client.phone || '',
            email: client.email || '',
            address: client.address || '',
            neighborhood: client.neighborhood || '',
            city: client.city || '',
        });
        clearErrors();
        setIsEditOpen(true);
    };

    const openView = (client: Client) => {
        setSelectedClient(client);
        setIsViewOpen(true);
    };

    const openDelete = (client: Client) => {
        setSelectedClient(client);
        setIsDeleteOpen(true);
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.clients.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient) return;
        put(route('admin.clients.update', selectedClient.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                reset();
            },
        });
    };

    const confirmDelete = () => {
        if (!selectedClient) return;
        destroy(route('admin.clients.destroy', selectedClient.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedClient(null);
            },
        });
    };

    const totalClients = clients.length;
    const newThisMonth = clients.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth()).length;
    const vipClients = clients.filter(c => getClientStatus(c) === 'VIP').length;

    const kpiCards = [
        { title: 'Total de Clientes', value: totalClients, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { title: 'Novos este Mês', value: newThisMonth, icon: UserPlus, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
        { title: 'Clientes VIP', value: vipClients, icon: Star, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    ];

    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            const matchesSearch =
                (client.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (client.phone?.includes(searchTerm));
            if (!matchesSearch) return false;

            const status = getClientStatus(client);
            if (statusFilter !== 'All' && status !== statusFilter) return false;

            return true;
        });
    }, [clients, searchTerm, statusFilter]);

    const ClientForm = ({ mode }: { mode: 'add' | 'edit' }) => (
        <form onSubmit={mode === 'add' ? submitAdd : submitEdit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo *</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="w-full rounded-lg border-slate-300 dark:border-navy-700 dark:bg-navy-950 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 transition-colors"
                    required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefone</label>
                    <input
                        type="text"
                        value={data.phone}
                        onChange={e => setData('phone', e.target.value)}
                        className="w-full rounded-lg border-slate-300 dark:border-navy-700 dark:bg-navy-950 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 transition-colors"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className="w-full rounded-lg border-slate-300 dark:border-navy-700 dark:bg-navy-950 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 transition-colors"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Endereço</label>
                <input
                    type="text"
                    value={data.address}
                    onChange={e => setData('address', e.target.value)}
                    className="w-full rounded-lg border-slate-300 dark:border-navy-700 dark:bg-navy-950 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 transition-colors"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bairro</label>
                    <input
                        type="text"
                        value={data.neighborhood}
                        onChange={e => setData('neighborhood', e.target.value)}
                        className="w-full rounded-lg border-slate-300 dark:border-navy-700 dark:bg-navy-950 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 transition-colors"
                    />
                    {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cidade</label>
                    <input
                        type="text"
                        value={data.city}
                        onChange={e => setData('city', e.target.value)}
                        className="w-full rounded-lg border-slate-300 dark:border-navy-700 dark:bg-navy-950 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 transition-colors"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
            </div>
            <div className="pt-6 flex justify-end gap-3 border-t border-slate-200 dark:border-navy-700 mt-6">
                <button
                    type="button"
                    onClick={() => { mode === 'add' ? setIsAddOpen(false) : setIsEditOpen(false); reset(); clearErrors(); }}
                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg transition-colors cursor-pointer"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-70 flex items-center cursor-pointer"
                >
                    {processing ? 'Salvando...' : 'Salvar Cliente'}
                </button>
            </div>
        </form>
    );
    return (
        <AdminLayout
            title="Gestão de Clientes"
            headerActions={
                <button
                    onClick={openAdd}
                    className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-navy-900 transition-all cursor-pointer"
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Novo Cliente
                </button>
            }
        >
            <Head title="Clientes - Mini-CRM" />
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm overflow-hidden"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-white/5">
                        {kpiCards.map((kpi, idx) => (
                            <div key={kpi.title} className="p-6 sm:p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors relative overflow-hidden">
                                <div className="z-10 relative">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.title}</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{kpi.value}</p>
                                </div>

                                <div className={`p-4 rounded-2xl ${kpi.bg} shadow-sm z-10 relative`}>
                                    <kpi.icon className={`w-7 h-7 ${kpi.color}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
                <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-navy-900/50">
                        <div className="relative max-w-md w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por nome ou telefone..."
                                className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-navy-600 rounded-xl leading-5 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Filter className="w-5 h-5 text-slate-400 hidden sm:block" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="block w-full sm:w-48 py-2 pl-3 pr-10 text-base border-slate-200 dark:border-navy-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm bg-white dark:bg-navy-900 text-slate-900 dark:text-white transition-all shadow-sm"
                            >
                                <option value="All">Todos os Status</option>
                                <option value="VIP">VIP</option>
                                <option value="Active">Ativos</option>
                                <option value="Inactive">Inativos</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-white/5 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-navy-900/50">
                                    <th className="p-4">Cliente</th>
                                    <th className="p-4">Contato</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Pedidos</th>
                                    <th className="p-4 text-right">LTV (Total)</th>
                                    <th className="p-4 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredClients.length > 0 ? (
                                        filteredClients.map((client) => {
                                            const status = getClientStatus(client);
                                            return (
                                                <motion.tr
                                                    key={client.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                                                    onClick={() => openView(client)}
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold shrink-0">
                                                                {client.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{client.name}</p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{client.address ? `${client.address}, ${client.neighborhood || ''}` : 'Sem endereço'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-sm">
                                                            <p className="text-slate-900 dark:text-slate-200 font-medium">{client.phone || '-'}</p>
                                                            <p className="text-slate-500 dark:text-slate-400 text-xs">{client.email || '-'}</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        {status === 'VIP' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"><Star className="w-3 h-3 mr-1"/> VIP</span>}
                                                        {status === 'Active' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"><CheckCircle className="w-3 h-3 mr-1"/> Ativo</span>}
                                                        {status === 'Inactive' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"><Clock className="w-3 h-3 mr-1"/> Inativo</span>}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <span className="font-medium text-slate-900 dark:text-white">{client.orders_count}</span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(client.total_spent)}</span>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                            <button onClick={() => openView(client)} className="p-2 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer" title="Ver Detalhes"><Eye className="w-4 h-4"/></button>
                                                            <button onClick={() => openEdit(client)} className="p-2 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors cursor-pointer" title="Editar"><Edit2 className="w-4 h-4"/></button>
                                                            <button onClick={() => openDelete(client)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer" title="Excluir"><Trash2 className="w-4 h-4"/></button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center">
                                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-400 mb-4">
                                                    <Users className="w-8 h-8" />
                                                </div>
                                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Nenhum cliente encontrado</h3>
                                                <p className="mt-1 text-slate-500 dark:text-slate-400">Ajuste os filtros de busca ou cadastre um novo cliente.</p>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <SlideOver isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Novo Cliente">
                <ClientForm mode="add" />
            </SlideOver>
            <SlideOver isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Editar Cliente">
                <ClientForm mode="edit" />
            </SlideOver>
            <SlideOver isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Detalhes do Cliente">
                {selectedClient && (
                    <div className="space-y-8 pb-8">
                        <div className="flex items-center space-x-4">
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-amber-500/20">
                                {selectedClient.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedClient.name}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                                    <Star className="w-4 h-4 text-amber-500 mr-1" />
                                    Cliente {getClientStatus(selectedClient)} desde {new Date(selectedClient.created_at).getFullYear()}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-navy-800 p-5 rounded-2xl border border-slate-100 dark:border-navy-700">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Investido (LTV)</p>
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(selectedClient.total_spent)}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-navy-800 p-5 rounded-2xl border border-slate-100 dark:border-navy-700">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de Pedidos</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{selectedClient.orders_count}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Informações de Contato</h3>
                            <div className="bg-slate-50 dark:bg-navy-800 rounded-2xl border border-slate-100 dark:border-navy-700 p-5 space-y-4">
                                <div className="flex items-center text-slate-700 dark:text-slate-300">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-navy-900 flex items-center justify-center mr-3 shadow-sm">
                                        <Phone className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                    </div>
                                    <span className="font-medium">{selectedClient.phone || 'Não informado'}</span>
                                </div>
                                <div className="flex items-center text-slate-700 dark:text-slate-300">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-navy-900 flex items-center justify-center mr-3 shadow-sm">
                                        <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                    </div>
                                    <span>{selectedClient.email || 'Não informado'}</span>
                                </div>
                                <div className="flex items-start text-slate-700 dark:text-slate-300">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-navy-900 flex items-center justify-center mr-3 shadow-sm shrink-0">
                                        <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                    </div>
                                    <span className="mt-1 leading-relaxed">
                                        {selectedClient.address ? `${selectedClient.address}, ${selectedClient.neighborhood || ''}, ${selectedClient.city || ''}` : 'Endereço não cadastrado'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Últimos Pedidos</h3>
                                <span className="text-xs text-slate-500 dark:text-slate-400">Mostrando até 5 recentes</span>
                            </div>
                            {selectedClient.orders && selectedClient.orders.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedClient.orders.slice(0, 5).map((order) => (
                                        <div key={order.id} className="relative pl-6 border-l-2 border-slate-200 dark:border-navy-700 pb-4 last:pb-0">
                                            <div className="absolute w-3.5 h-3.5 bg-amber-500 rounded-full -left-[9px] top-1.5 ring-4 ring-white dark:ring-navy-900"></div>
                                            <div className="bg-slate-50 dark:bg-navy-800 rounded-xl p-4 border border-slate-100 dark:border-navy-700 shadow-sm transition-all hover:shadow-md">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="font-semibold text-slate-900 dark:text-white">Pedido #{order.id}</span>
                                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-navy-900 px-2 py-1 rounded-md">{formatDate(order.created_at)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm mb-3">
                                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">{formatCurrency(order.total_amount)}</span>
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400">
                                                        {order.status}
                                                    </span>
                                                </div>
                                                {order.items && order.items.length > 0 && (
                                                    <div className="border-t border-slate-200 dark:border-navy-700 pt-3 mt-3">
                                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Itens do pedido:</p>
                                                        <ul className="space-y-1">
                                                            {order.items.map(item => (
                                                                <li key={item.id} className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                                                                    <span>{item.quantity}x {item.product_name}</span>
                                                                    <span>{formatCurrency(item.price)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-slate-50 dark:bg-navy-800 rounded-xl p-6 text-center border border-dashed border-slate-300 dark:border-navy-700">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum pedido registrado para este cliente.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </SlideOver>
            <Transition.Root show={isDeleteOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={setIsDeleteOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-navy-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-sm border border-slate-100 dark:border-white/5">
                                    <div className="p-8 text-center">
                                        <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 mb-5">
                                            <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" aria-hidden="true" />
                                        </div>
                                        <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-slate-900 dark:text-white mb-3">
                                            Excluir Cliente
                                        </Dialog.Title>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                                            Tem certeza de que deseja excluir <strong className="text-slate-700 dark:text-slate-200">{selectedClient?.name}</strong>?
                                            Esta ação não pode ser desfeita.
                                        </p>
                                    </div>
                                    <div className="p-6 pt-0 flex gap-3">
                                        <button
                                            type="button"
                                            className="flex-1 justify-center rounded-xl bg-white dark:bg-navy-800 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors cursor-pointer border border-slate-200 dark:border-white/5"
                                            onClick={() => setIsDeleteOpen(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 justify-center rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-600 transition-colors cursor-pointer"
                                            onClick={confirmDelete}
                                        >
                                            Sim, excluir
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </AdminLayout>
    );
}
