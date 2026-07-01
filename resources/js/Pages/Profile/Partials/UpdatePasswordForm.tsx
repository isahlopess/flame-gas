import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { motion } from 'framer-motion';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
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

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        if (data.password && !isPasswordValid) return;

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Update Password
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Current Password"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                    {data.password.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 space-y-1.5 overflow-hidden"
                        >
                            <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${passwordRules.length ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                <i className={`fa-solid ${passwordRules.length ? 'fa-check' : 'fa-circle-dot'} text-[10px]`}></i>
                                Mínimo 8 caracteres
                            </div>
                            <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${passwordRules.uppercase ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                <i className={`fa-solid ${passwordRules.uppercase ? 'fa-check' : 'fa-circle-dot'} text-[10px]`}></i>
                                Letra maiúscula
                            </div>
                            <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${passwordRules.lowercase ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                <i className={`fa-solid ${passwordRules.lowercase ? 'fa-check' : 'fa-circle-dot'} text-[10px]`}></i>
                                Letra minúscula
                            </div>
                            <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${passwordRules.special ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                <i className={`fa-solid ${passwordRules.special ? 'fa-check' : 'fa-circle-dot'} text-[10px]`}></i>
                                Caractere especial (!@#$...)
                            </div>
                        </motion.div>
                    )}
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing || (data.password.length > 0 && !isPasswordValid)}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
