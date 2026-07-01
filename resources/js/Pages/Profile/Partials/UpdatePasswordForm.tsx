import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

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

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

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
                <h2 className="text-2xl font-bold text-gray-100 mb-2">
                    Alterar Senha
                </h2>
                <p className="text-sm text-gray-400">
                    Sua conta está segura com a FlameGás. Crie uma senha longa e aleatória para se manter protegido.
                </p>
            </header>
            <form onSubmit={updatePassword} className="mt-8 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Senha Atual"
                        className="text-gray-300"
                    />
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full bg-gray-900/50 border-gray-700 text-gray-100 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                        autoComplete="current-password"
                    />
                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="password" value="Nova Senha" className="text-gray-300" />
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full bg-gray-900/50 border-gray-700 text-gray-100 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>
                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Nova Senha"
                        className="text-gray-300"
                    />
                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="mt-1 block w-full bg-gray-900/50 border-gray-700 text-gray-100 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                        autoComplete="new-password"
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-800">
                    <PrimaryButton disabled={processing} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-3 rounded-xl shadow-lg shadow-orange-500/20 border-none transition-all">
                        Salvar Nova Senha
                    </PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-2"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-medium text-green-400 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Senha alterada!
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
