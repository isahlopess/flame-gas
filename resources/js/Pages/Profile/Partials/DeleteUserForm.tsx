import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-2xl font-bold text-red-500 mb-2">
                    Excluir Conta
                </h2>
                <p className="text-sm text-gray-400">
                    Atenção! Uma vez que sua conta for excluída, todos os seus recursos e dados serão permanentemente apagados. Antes de excluir, faça o download de qualquer dado ou informação que deseja manter.
                </p>
            </header>
            <div className="mt-8 pt-6 border-t border-gray-800">
                <DangerButton onClick={confirmUserDeletion} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 px-8 py-3 rounded-xl transition-all">
                    Quero excluir minha conta
                </DangerButton>
            </div>
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 bg-gray-900 border border-gray-700">
                    <h2 className="text-lg font-medium text-gray-100">
                        Você tem certeza que deseja excluir sua conta?
                    </h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Após a exclusão, não será possível recuperar seus dados. Por favor, digite sua senha para confirmar que você deseja excluir permanentemente sua conta.
                    </p>
                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Senha"
                            className="sr-only"
                        />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-full bg-gray-950 border-gray-700 text-gray-100 focus:border-red-500 focus:ring-red-500"
                            isFocused
                            placeholder="Sua senha atual"
                        />
                        <InputError message={errors.password} className="mt-2 text-red-400" />
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal} className="bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border-gray-700">
                            Cancelar
                        </SecondaryButton>
                        <DangerButton className="bg-red-600 hover:bg-red-700 ms-3" disabled={processing}>
                            Excluir Conta Permanentemente
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
