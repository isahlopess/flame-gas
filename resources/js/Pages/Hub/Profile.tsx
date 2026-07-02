import HubLayout from '@/Layouts/HubLayout';
import { PageProps } from '@/types';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { User, Shield, AlertTriangle } from 'lucide-react';

export default function Profile({ mustVerifyEmail, status }: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Dados Pessoais', icon: User, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { id: 'security', label: 'Segurança', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { id: 'danger', label: 'Zona de Perigo', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
    ];

    return (
        <HubLayout title="Meu Perfil">
            <div className="max-w-6xl relative z-10 flex flex-col md:flex-row gap-6 lg:gap-10 items-start">
                <div className="w-full md:w-64 shrink-0 space-y-2">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? 'bg-[#0a0f1c]/80 border border-white/10 shadow-lg' : 'bg-transparent border border-transparent hover:bg-white/5 text-slate-400 hover:text-white'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? tab.bg : 'bg-white/5'} ${isActive ? tab.color : 'text-slate-400'}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={`font-bold text-left ${isActive ? 'text-white' : ''}`}>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="flex-1 w-full bg-[#0a0f1c]/60 backdrop-blur-xl rounded-3xl border border-white/5 p-6 sm:p-8 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-xl"
                                />
                            </motion.div>
                        )}
                        {activeTab === 'security' && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <UpdatePasswordForm className="max-w-xl" />
                            </motion.div>
                        )}
                        {activeTab === 'danger' && (
                            <motion.div
                                key="danger"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <DeleteUserForm className="max-w-xl" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </HubLayout>
    );
}
