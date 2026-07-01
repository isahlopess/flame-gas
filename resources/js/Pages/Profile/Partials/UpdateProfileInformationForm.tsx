import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    interface FormState {
        name: string;
        email: string;
        phone: string;
        address: string;
        neighborhood: string;
        complement: string;
        vehicle_type: string;
        vehicle_plate: string;
    }

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm<FormState>({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            neighborhood: user.neighborhood || '',
            complement: user.complement || '',
            vehicle_type: user.vehicle_type || '',
            vehicle_plate: user.vehicle_plate || '',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-2xl font-bold text-gray-100 mb-2">
                    Dados Pessoais e Entrega
                </h2>
                <p className="text-sm text-gray-400">
                    Mantenha seus dados atualizados para entregas mais rápidas.
                </p>
            </header>
            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="name" value="Nome Completo" className="text-gray-300" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full bg-gray-900/50 border-gray-700 text-gray-100 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>
                    <div>
                        <InputLabel htmlFor="email" value="E-mail" className="text-gray-300" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full bg-gray-900/50 border-gray-700 text-gray-100 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>
                    <div>
                        <InputLabel htmlFor="phone" value="WhatsApp / Celular" className="text-gray-300" />
                        <TextInput
                            id="phone"
                            className="mt-1 block w-full bg-gray-900/50 border-gray-700 text-gray-100 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="(00) 00000-0000"
                            autoComplete="tel"
                        />
                        <InputError className="mt-2" message={errors.phone} />
                    </div>
                    {user.role === 'customer' ? (
                        <>
                            <div className="md:col-span-2">
                                <InputLabel htmlFor="address" value="Endereço (Rua e Número)" className="text-gray-300" />
                                <TextInput
                                    id="address"
                                    className="mt-1 block w-full bg-gray-900/50 border-gray-700 text-gray-100 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Ex: Av. Principal, 123"
                                />
                                <InputError className="mt-2" message={errors.address} />
                            </div>
                            <div>
                                <InputLabel htmlFor="neighborhood" value="Bairro" className="text-gray-300" />
                                <TextInput
                                    id="neighborhood"
                                    className="mt-1 block w-full bg-gray-900/50 border-gray-700 text-gray-100 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                                    value={data.neighborhood}
                                    onChange={(e) => setData('neighborhood', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.neighborhood} />
                            </div>
                            <div>
                                <InputLabel htmlFor="complement" value="Complemento (Opcional)" className="text-gray-300" />
                                <TextInput
                                    id="complement"
                                    className="mt-1 block w-full bg-gray-900/50 border-gray-700 text-gray-100 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                                    value={data.complement}
                                    onChange={(e) => setData('complement', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.complement} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <InputLabel htmlFor="vehicle_type" value="Tipo de Veículo" className="text-gray-300" />
                                <select
                                    id="vehicle_type"
                                    className="mt-1 block w-full bg-gray-900/50 border-gray-700 text-gray-100 focus:border-orange-500 focus:ring-orange-500 rounded-xl py-3 px-4"
                                    value={data.vehicle_type}
                                    onChange={(e) => setData('vehicle_type', e.target.value)}
                                >
                                    <option value="">Selecione o tipo</option>
                                    <option value="Moto">Moto</option>
                                    <option value="Carro">Carro de Passeio</option>
                                    <option value="Caminhonete">Caminhonete (Fiorino, Strada, Saveiro)</option>
                                    <option value="Caminhao">Caminhão Padrão</option>
                                </select>
                                <InputError className="mt-2" message={errors.vehicle_type} />
                            </div>
                            <div>
                                <InputLabel htmlFor="vehicle_plate" value="Placa do Veículo" className="text-gray-300" />
                                <TextInput
                                    id="vehicle_plate"
                                    className="mt-1 block w-full bg-gray-900/50 border-gray-700 text-gray-100 focus:border-orange-500 focus:ring-orange-500 rounded-xl uppercase"
                                    value={data.vehicle_plate}
                                    onChange={(e) => setData('vehicle_plate', e.target.value.toUpperCase())}
                                    placeholder="Ex: ABC-1234"
                                    pattern="[A-Za-z]{3}-?[0-9][A-Za-z0-9][0-9]{2}"
                                    title="A placa deve ser no formato ABC-1234 ou padrão Mercosul ABC1D23"
                                />
                                <InputError className="mt-2" message={errors.vehicle_plate} />
                            </div>
                        </>
                    )}
                </div>
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                        <p className="text-sm text-orange-400">
                            Seu e-mail ainda não foi verificado.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 font-bold underline hover:text-orange-300 focus:outline-none"
                            >
                                Clique aqui para reenviar o e-mail.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-400">
                                Um novo link foi enviado para seu e-mail!
                            </div>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-800">
                    <PrimaryButton disabled={processing} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all border-none">
                        Salvar Informações
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
                            Atualizado com sucesso!
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
