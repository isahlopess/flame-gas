import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Plus, Search, MoreVertical, Edit2, Trash2,
    X, Check, Copy, UserCheck, ShieldCheck, Mail, Phone, Car
} from 'lucide-react';
import { Dialog } from '@headlessui/react';

interface Driver {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    deliveries?: number;
    created_at: string;
    avatar?: string;
    status?: string;
}

interface InviteCode {
    id: number;
    code: string;
    used_at: string | null;
    created_at: string;
    user?: { id: number, name: string };
}

export default function Drivers({ drivers, inviteCodes = [] }: { drivers: Driver[], inviteCodes: InviteCode[] }) {
    const [search, setSearch] = useState('');

    const [isInviteModalOpen, setInviteModalOpen] = useState(false);
    const [isEditSlideOpen, setEditSlideOpen] = useState(false);
    const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const { data: editData, setData: setEditData, put: updateDriver, processing: updating, reset: resetEdit } = useForm({
        name: '',
        phone: '',
        email: ''
    });

    const filteredDrivers = drivers.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.phone && d.phone.includes(search))
    );

    const handleGenerateInvite = () => {
        router.post(route('admin.drivers.invite'), {}, {
            preserveScroll: true,
            onSuccess: () => setInviteModalOpen(true)
        });
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const openEdit = (driver: Driver) => {
        setDriverToEdit(driver);
        setEditData({
            name: driver.name,
            phone: driver.phone || '',
            email: driver.email,
        });
        setEditSlideOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!driverToEdit) return;
        updateDriver(route('admin.drivers.update', driverToEdit.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditSlideOpen(false);
                setDriverToEdit(null);
            }
        });
    };

    const confirmDelete = (driver: Driver) => {
        setDriverToDelete(driver);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!driverToDelete) return;
        router.delete(route('admin.drivers.destroy', driverToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModalOpen(false);
                setDriverToDelete(null);
            }
        });
    };

    return (
        <AdminLayout
            title="Gestão de Entregadores"
            headerActions={
                <button
                    onClick={handleGenerateInvite}
                    className="flex items-center gap-2 px-5 py-2.5 bg-flame-500 hover:bg-flame-600 active:bg-flame-700 text-white rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] transition-all cursor-pointer"
                >
                    <Plus className="w-5 h-5" /> Novo Entregador
                </button>
            }
        >
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1 w-full bg-white dark:bg-navy-900 rounded-3xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-navy-950/50">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar entregador por nome ou telefone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-flame-500 focus:border-flame-500 text-sm transition-all"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-white/5">
                            <thead className="bg-slate-50 dark:bg-navy-950/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Entregador</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Contato</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Entregas</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-navy-900 divide-y divide-slate-100 dark:divide-white/5">
                                {filteredDrivers.length > 0 ? filteredDrivers.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-flame-500 to-amber-500 flex items-center justify-center font-black text-white text-sm shadow-md">
                                                    {item.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</div>
                                                    <div className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                                                        <Car className="w-3 h-3" /> Veículo Padrão
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-slate-400" /> {item.phone || 'Sem telefone'}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-slate-400" /> {item.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-sm font-black text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10">
                                                {item.deliveries || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 px-3 py-1 text-xs font-black rounded-full">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Ativo
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2 transition-opacity">
                                                <button
                                                    onClick={() => openEdit(item)}
                                                    className="p-2 text-slate-400 hover:text-flame-500 hover:bg-flame-500/10 rounded-xl transition-all cursor-pointer"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(item)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                                <UserCheck className="w-12 h-12 mb-4 opacity-50" />
                                                <p className="text-base font-medium">Nenhum entregador encontrado.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="w-full lg:w-80 shrink-0 space-y-4">
                    <div className="bg-slate-800 dark:bg-navy-900 border border-slate-700 dark:border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden">
                        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-flame-500" /> Mural de Convites
                        </h3>
                        <div className="space-y-3">
                            {inviteCodes.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-4">Nenhum código gerado ainda.</p>
                            ) : (
                                inviteCodes.map(invite => (
                                    <div key={invite.id} className={`flex flex-col gap-2 p-3 rounded-2xl border transition-all ${
                                        invite.used_at
                                            ? 'bg-slate-700/30 border-slate-600/30'
                                            : 'bg-amber-500/10 border-amber-500/20'
                                    }`}>
                                        <div className="flex items-center justify-between">
                                            <span className={`font-mono font-bold tracking-wider ${
                                                invite.used_at ? 'text-slate-400 line-through' : 'text-amber-400'
                                            }`}>
                                                {invite.code}
                                            </span>
                                            {!invite.used_at && (
                                                <button
                                                    onClick={() => handleCopyCode(invite.code)}
                                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 cursor-pointer"
                                                    title="Copiar código"
                                                >
                                                    {copiedCode === invite.code ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-medium">
                                            {invite.used_at ? (
                                                <span className="text-emerald-400 flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> Usado por {invite.user?.name?.split(' ')[0]}
                                                </span>
                                            ) : (
                                                <span className="text-amber-500/80 flex items-center gap-1 animate-pulse">
                                                    Pendente
                                                </span>
                                            )}
                                            <span className="text-slate-500">
                                                {new Date(invite.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isInviteModalOpen && (
                    <Dialog open={isInviteModalOpen} onClose={() => setInviteModalOpen(false)} className="relative z-50">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Dialog.Panel as={motion.div} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-sm bg-white dark:bg-navy-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-white/10 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-flame-500 to-amber-500"></div>
                                <button onClick={() => setInviteModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
                                <div className="w-16 h-16 bg-flame-500/10 text-flame-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <Dialog.Title className="text-xl font-black text-slate-800 dark:text-white mb-2">Código Gerado!</Dialog.Title>
                                <Dialog.Description className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                    Envie este código único para o entregador realizar o cadastro no aplicativo. Ele é válido para um único uso.
                                </Dialog.Description>
                                {inviteCodes.length > 0 && (
                                    <div className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-2xl p-4 mb-6">
                                        <div className="text-3xl font-mono font-black text-slate-800 dark:text-white tracking-widest">
                                            {inviteCodes[0].code}
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => handleCopyCode(inviteCodes[0]?.code)}
                                        className="w-full py-3 bg-flame-500 hover:bg-flame-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                                    >
                                        {copiedCode === inviteCodes[0]?.code ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        {copiedCode === inviteCodes[0]?.code ? 'Copiado!' : 'Copiar Código'}
                                    </button>
                                    <button
                                        onClick={() => window.open(`https://wa.me/?text=Baixe o App FlameGás e use este código para se cadastrar como Entregador: ${inviteCodes[0]?.code}`, '_blank')}
                                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                                    >
                                        <Phone className="w-5 h-5" /> Enviar por WhatsApp
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isEditSlideOpen && (
                    <Dialog open={isEditSlideOpen} onClose={() => setEditSlideOpen(false)} className="relative z-50">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Dialog.Panel as={motion.div} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 } as any} className="w-screen max-w-md bg-white dark:bg-navy-900 shadow-2xl border-l border-slate-200 dark:border-white/10 flex flex-col h-full">
                                <div className="px-6 py-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-navy-950/50">
                                    <Dialog.Title className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                                        <Edit2 className="w-5 h-5 text-flame-500" />
                                        Editar Entregador
                                    </Dialog.Title>
                                    <button onClick={() => setEditSlideOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6">
                                    <form id="edit-form" onSubmit={handleUpdate} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nome Completo</label>
                                            <input
                                                type="text"
                                                value={editData.name}
                                                onChange={e => setEditData('name', e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-flame-500 focus:border-flame-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Telefone</label>
                                            <input
                                                type="text"
                                                value={editData.phone}
                                                onChange={e => setEditData('phone', e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-flame-500 focus:border-flame-500"
                                                placeholder="(00) 00000-0000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">E-mail</label>
                                            <input
                                                type="email"
                                                value={editData.email}
                                                onChange={e => setEditData('email', e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-flame-500 focus:border-flame-500 opacity-70"
                                                readOnly
                                            />
                                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> E-mail é a chave de login e não pode ser alterado.</p>
                                        </div>
                                    </form>
                                </div>
                                <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-navy-950/50 flex gap-3">
                                    <button onClick={() => setEditSlideOpen(false)} className="flex-1 py-3 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 transition-colors cursor-pointer">
                                        Cancelar
                                    </button>
                                    <button form="edit-form" type="submit" disabled={updating} className="flex-1 py-3 bg-flame-500 hover:bg-flame-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md cursor-pointer">
                                        {updating ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span> : 'Salvar'}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="relative z-50">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Dialog.Panel as={motion.div} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-sm bg-white dark:bg-navy-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-white/10 text-center">
                                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="w-8 h-8" />
                                </div>
                                <Dialog.Title className="text-xl font-black text-slate-800 dark:text-white mb-2">Excluir Entregador</Dialog.Title>
                                <Dialog.Description className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                    Tem certeza que deseja remover <b>{driverToDelete?.name}</b>? Esta ação não poderá ser desfeita.
                                </Dialog.Description>
                                <div className="flex gap-3">
                                    <button onClick={() => setDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors cursor-pointer">
                                        Cancelar
                                    </button>
                                    <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors shadow-md cursor-pointer">
                                        Sim, excluir
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
