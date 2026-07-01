import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { motion } from 'framer-motion';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const passwordRules = {
        length: data.password.length >= 8,
        uppercase: /[A-Z]/.test(data.password),
        lowercase: /[a-z]/.test(data.password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(data.password),
    };

    const isPasswordValid = data.password.length > 0 ? Object.values(passwordRules).every(Boolean) : true;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (data.password && !isPasswordValid) return;

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
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

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing || (data.password.length > 0 && !isPasswordValid)}>
                        Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
