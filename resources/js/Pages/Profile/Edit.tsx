import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UserOrdersList from './Partials/UserOrdersList';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { CartProvider } from '@/Contexts/CartContext';

function EditContent({
    mustVerifyEmail,
    status,
    orders,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; orders?: any[] }>) {
    const user = usePage().props.auth.user;
    const [activeTab, setActiveTab] = useState('orders');

    const tabs = [
        { id: 'orders', label: user.role === 'employee' ? 'Minhas Entregas' : 'Meus Pedidos', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
        { id: 'profile', label: 'Meus Dados', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { id: 'security', label: 'Segurança', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
        { id: 'danger', label: 'Zona de Risco', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Meu Perfil - FlameGás" />
            <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden py-12">
                <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                {user.role === 'employee' ? 'Central do Motorista' : 'Central do Cliente'}
                            </h1>
                            <p className="mt-2 text-gray-400">
                                Olá, {user.name}! Gerencie seus dados e preferências de entrega.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-1/4">
                            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                                            activeTab === tab.id
                                                ? tab.id === 'danger'
                                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                    : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                                        </svg>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-3/4">
                            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden min-h-[500px]">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'orders' && (
                                        <motion.div
                                            key="orders"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-8"
                                        >
                                            <UserOrdersList orders={orders || []} />
                                        </motion.div>
                                    )}
                                    {activeTab === 'profile' && (
                                        <motion.div
                                            key="profile"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-8"
                                        >
                                            <UpdateProfileInformationForm
                                                mustVerifyEmail={mustVerifyEmail}
                                                status={status}
                                            />
                                        </motion.div>
                                    )}
                                    {activeTab === 'security' && (
                                        <motion.div
                                            key="security"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-8"
                                        >
                                            <UpdatePasswordForm />
                                        </motion.div>
                                    )}
                                    {activeTab === 'danger' && (
                                        <motion.div
                                            key="danger"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-8"
                                        >
                                            <DeleteUserForm />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default function Edit(props: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <CartProvider>
            <EditContent {...props} />
        </CartProvider>
    );
}
