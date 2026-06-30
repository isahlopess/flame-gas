import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'customer',
        invite_code: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordRules = {
        length: data.password.length >= 8,
        uppercase: /[A-Z]/.test(data.password),
        lowercase: /[a-z]/.test(data.password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(data.password),
    };

    const isPasswordValid = Object.values(passwordRules).every(Boolean);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!isPasswordValid) return;

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title="Crie sua conta"
            subtitle="Junte-se à revolução do gás de cozinha. Rápido, seguro e sem complicações."
        >
            <Head title="Criar Conta - FlameGás" />
            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-3">
                    <InputLabel value="Como você quer usar o FlameGás?" className="font-semibold text-slate-700 dark:text-slate-300" />
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() => setData('role', 'customer')}
                            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 relative overflow-hidden ${
                                data.role === 'customer'
                                    ? 'border-flame-500 bg-flame-500/5 shadow-[0_4px_20px_rgba(249,115,22,0.15)]'
                                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-navy-900/50 hover:border-flame-300'
                            }`}
                        >
                            <div className="flex flex-col items-center text-center gap-2 relative z-10">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${
                                    data.role === 'customer' ? 'bg-flame-500 text-white' : 'bg-white dark:bg-navy-800 text-slate-500'
                                }`}>
                                    <i className="fa-solid fa-house"></i>
                                </div>
                                <span className={`font-bold ${data.role === 'customer' ? 'text-flame-600 dark:text-flame-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                    Para minha casa
                                </span>
                            </div>
                            {data.role === 'customer' && (
                                <motion.div layoutId="role-indicator" className="absolute inset-0 bg-gradient-to-br from-flame-500/10 to-amber-500/5 pointer-events-none" />
                            )}
                        </div>
                        <div
                            onClick={() => setData('role', 'employee')}
                            className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 relative overflow-hidden ${
                                data.role === 'employee'
                                    ? 'border-flame-500 bg-flame-500/5 shadow-[0_4px_20px_rgba(249,115,22,0.15)]'
                                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-navy-900/50 hover:border-flame-300'
                            }`}
                        >
                            <div className="flex flex-col items-center text-center gap-2 relative z-10">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${
                                    data.role === 'employee' ? 'bg-flame-500 text-white' : 'bg-white dark:bg-navy-800 text-slate-500'
                                }`}>
                                    <i className="fa-solid fa-motorcycle"></i>
                                </div>
                                <span className={`font-bold ${data.role === 'employee' ? 'text-flame-600 dark:text-flame-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                    Sou entregador
                                </span>
                            </div>
                            {data.role === 'employee' && (
                                <motion.div layoutId="role-indicator" className="absolute inset-0 bg-gradient-to-br from-flame-500/10 to-amber-500/5 pointer-events-none" />
                            )}
                        </div>
                    </div>
                </div>
                <AnimatePresence>
                    {data.role === 'employee' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-xl">
                                <InputLabel htmlFor="invite_code" value="Código de Parceria (Opcional)" className="font-semibold text-amber-700 dark:text-amber-400" />
                                <TextInput
                                    id="invite_code"
                                    name="invite_code"
                                    value={data.invite_code}
                                    className="mt-2 block w-full bg-white dark:bg-navy-900 border-amber-200 dark:border-amber-500/30 rounded-xl focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                                    onChange={(e) => setData('invite_code', e.target.value)}
                                    placeholder="Ex: FLAME-123"
                                    icon={<i className="fa-solid fa-handshake"></i>}
                                />
                                <p className="text-xs text-amber-600 dark:text-amber-500/80 mt-2">
                                    Se você foi indicado por uma distribuidora, insira o código acima.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div>
                    <InputLabel htmlFor="name" value="Nome completo" className="font-semibold text-slate-700 dark:text-slate-300" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-2 block w-full bg-slate-50 dark:bg-navy-900 border-slate-200 dark:border-white/10 rounded-xl focus:ring-flame-500 focus:border-flame-500 transition-all shadow-sm"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder="João da Silva"
                        icon={<i className="fa-regular fa-user"></i>}
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="email" value="E-mail" className="font-semibold text-slate-700 dark:text-slate-300" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full bg-slate-50 dark:bg-navy-900 border-slate-200 dark:border-white/10 rounded-xl focus:ring-flame-500 focus:border-flame-500 transition-all shadow-sm"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        placeholder="seu@email.com"
                        icon={<i className="fa-regular fa-envelope"></i>}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="password" value="Senha" className="font-semibold text-slate-700 dark:text-slate-300" />
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="mt-2 block w-full bg-slate-50 dark:bg-navy-900 border-slate-200 dark:border-white/10 rounded-xl focus:ring-flame-500 focus:border-flame-500 transition-all shadow-sm"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            placeholder="••••••••"
                            icon={<i className="fa-solid fa-lock"></i>}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none p-2 rounded-full hover:bg-slate-100 dark:hover:bg-navy-800"
                                    tabIndex={-1}
                                >
                                    <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            }
                        />
                        <InputError message={errors.password} className="mt-2" />
                        {data.password.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-3 space-y-1.5 overflow-hidden"
                            >
                                <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${passwordRules.length ? 'text-green-500' : 'text-slate-500'}`}>
                                    <i className={`fa-solid ${passwordRules.length ? 'fa-check' : 'fa-circle-dot'} text-[10px]`}></i>
                                    Mínimo 8 caracteres
                                </div>
                                <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${passwordRules.uppercase ? 'text-green-500' : 'text-slate-500'}`}>
                                    <i className={`fa-solid ${passwordRules.uppercase ? 'fa-check' : 'fa-circle-dot'} text-[10px]`}></i>
                                    Letra maiúscula
                                </div>
                                <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${passwordRules.lowercase ? 'text-green-500' : 'text-slate-500'}`}>
                                    <i className={`fa-solid ${passwordRules.lowercase ? 'fa-check' : 'fa-circle-dot'} text-[10px]`}></i>
                                    Letra minúscula
                                </div>
                                <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${passwordRules.special ? 'text-green-500' : 'text-slate-500'}`}>
                                    <i className={`fa-solid ${passwordRules.special ? 'fa-check' : 'fa-circle-dot'} text-[10px]`}></i>
                                    Caractere especial (!@#$...)
                                </div>
                            </motion.div>
                        )}
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirmar Senha"
                            className="font-semibold text-slate-700 dark:text-slate-300"
                        />
                        <TextInput
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-2 block w-full bg-slate-50 dark:bg-navy-900 border-slate-200 dark:border-white/10 rounded-xl focus:ring-flame-500 focus:border-flame-500 transition-all shadow-sm"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                            placeholder="••••••••"
                            icon={<i className="fa-solid fa-lock"></i>}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none p-2 rounded-full hover:bg-slate-100 dark:hover:bg-navy-800"
                                    tabIndex={-1}
                                >
                                    <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            }
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                </div>
                <div className="pt-4">
                    <PrimaryButton
                        className="w-full justify-center py-3.5 bg-flame-500 hover:bg-flame-600 active:bg-flame-700 rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] transition-all font-bold tracking-wide text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={processing || !isPasswordValid}
                    >
                        {processing ? 'Criando conta...' : 'Criar minha conta'}
                    </PrimaryButton>
                </div>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                    Já possui uma conta?{' '}
                    <Link href={route('login')} className="text-flame-500 hover:text-flame-600 font-semibold transition-colors">
                        Faça login
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
