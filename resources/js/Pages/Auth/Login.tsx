import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Bem-vindo de volta"
            subtitle="Entre com sua conta para solicitar ou gerenciar entregas."
        >
            <Head title="Login - FlameGás" />
            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                    {status}
                </div>
            )}
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="E-mail" className="font-semibold text-slate-700 dark:text-slate-300" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full bg-slate-50 dark:bg-navy-900 border-slate-200 dark:border-white/10 rounded-xl focus:ring-flame-500 focus:border-flame-500 transition-all shadow-sm"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="seu@email.com"
                        icon={<i className="fa-regular fa-envelope"></i>}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Senha" className="font-semibold text-slate-700 dark:text-slate-300" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-flame-500 hover:text-flame-600 font-semibold transition-colors"
                            >
                                Esqueceu a senha?
                            </Link>
                        )}
                    </div>
                    <TextInput
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full bg-slate-50 dark:bg-navy-900 border-slate-200 dark:border-white/10 rounded-xl focus:ring-flame-500 focus:border-flame-500 transition-all shadow-sm"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
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
                </div>
                <div className="block">
                    <label className="flex items-center group cursor-pointer w-fit">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                            className="rounded border-slate-300 text-flame-500 shadow-sm focus:ring-flame-500 dark:border-white/20 dark:bg-navy-900 transition-all cursor-pointer"
                        />
                        <span className="ms-3 text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            Lembrar de mim
                        </span>
                    </label>
                </div>
                <div className="pt-2">
                    <PrimaryButton
                        className="w-full justify-center py-3.5 bg-flame-500 hover:bg-flame-600 active:bg-flame-700 rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] transition-all font-bold tracking-wide"
                        disabled={processing}
                    >
                        {processing ? 'Entrando...' : 'Entrar na plataforma'}
                    </PrimaryButton>
                </div>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
                    Não tem uma conta ainda?{' '}
                    <Link href={route('register')} className="text-flame-500 hover:text-flame-600 font-semibold transition-colors">
                        Criar conta
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
