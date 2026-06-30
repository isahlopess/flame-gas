import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/Contexts/CartContext';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { PageProps } from '@/types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function CheckoutModal() {
    const { isCheckoutOpen, setCheckoutOpen, items, totalPrice, clearCart } = useCart();
    const { auth } = usePage<PageProps>().props;

    const { data, setData, errors, reset, clearErrors } = useForm({
        name: auth.user?.name || '',
        phone: auth.user?.phone || '',
        address: auth.user?.address || '',
        neighborhood: auth.user?.neighborhood || '',
        complement: auth.user?.complement || '',
        payment_method: 'pix',
        notes: '',
    });

    useEffect(() => {
        if (auth.user) {
            setData({
                name: auth.user.name || '',
                phone: auth.user.phone || '',
                address: auth.user.address || '',
                neighborhood: auth.user.neighborhood || '',
                complement: auth.user.complement || '',
                payment_method: 'pix',
                notes: '',
            });
        }
    }, [auth.user]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const submitOrder: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.name || !data.phone || !data.address || !data.neighborhood) {
            alert('Preencha os dados obrigatórios para entrega.');
            return;
        }

        const phoneTarget = '5567999999999';

        let message = `*Novo Pedido — FlameGás*\n\n`;
        message += `*Cliente:* ${data.name}\n`;
        message += `*Telefone:* ${data.phone}\n`;
        message += `*Endereço:* ${data.address}, Bairro: ${data.neighborhood}\n`;
        if (data.complement) {
            message += `*Complemento:* ${data.complement}\n`;
        }

        message += `\n*Itens do Pedido:*\n`;
        items.forEach(item => {
            message += `- ${item.quantity}x ${item.name} (${formatCurrency(item.price * item.quantity)})\n`;
        });

        message += `\n*Total:* ${formatCurrency(totalPrice)}\n`;

        const paymentLabel = data.payment_method === 'pix' ? 'Pix' : (data.payment_method === 'card' ? 'Cartão' : 'Dinheiro');
        message += `*Pagamento:* ${paymentLabel}\n`;

        if (data.notes) {
            message += `\n*Observações:* ${data.notes}\n`;
        }

        message += `\nPedido via Site 🌐`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneTarget}?text=${encodedMessage}`;

        clearCart();
        setCheckoutOpen(false);
        window.open(whatsappUrl, '_blank');
    };

    if (!isCheckoutOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
                    onClick={() => setCheckoutOpen(false)}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white dark:bg-navy-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-white/10">
                        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-3">
                            <i className="fa-brands fa-whatsapp text-green-500"></i>
                            Finalizar no WhatsApp
                        </h2>
                        <button
                            onClick={() => setCheckoutOpen(false)}
                            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        <form id="checkoutForm" onSubmit={submitOrder} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <InputLabel value="Seu Nome" className="text-slate-700 dark:text-slate-300 font-medium" />
                                    <TextInput
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        icon={<i className="fa-regular fa-user"></i>}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Seu Telefone (WhatsApp)" className="text-slate-700 dark:text-slate-300 font-medium" />
                                    <TextInput
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required
                                        placeholder="(00) 00000-0000"
                                        icon={<i className="fa-brands fa-whatsapp"></i>}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-navy-800/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5 space-y-4">
                                <h3 className="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <i className="fa-solid fa-location-dot"></i>
                                    Endereço de Entrega
                                </h3>
                                <div>
                                    <InputLabel value="Rua / Avenida" className="text-slate-700 dark:text-slate-300 font-medium" />
                                    <TextInput
                                        type="text"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        required
                                        placeholder="Ex: Rua das Flores, 123"
                                        className="mt-1"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel value="Bairro" className="text-slate-700 dark:text-slate-300 font-medium" />
                                        <TextInput
                                            type="text"
                                            value={data.neighborhood}
                                            onChange={(e) => setData('neighborhood', e.target.value)}
                                            required
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel value="Complemento (Opcional)" className="text-slate-700 dark:text-slate-300 font-medium" />
                                        <TextInput
                                            type="text"
                                            value={data.complement}
                                            onChange={(e) => setData('complement', e.target.value)}
                                            placeholder="Apt, Bloco, etc"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <InputLabel value="Forma de Pagamento" className="text-slate-700 dark:text-slate-300 font-medium" />
                                    <select
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition-all focus:border-flame-500 focus:ring-2 focus:ring-flame-500/20 dark:border-navy-800 dark:bg-navy-950/50 dark:text-slate-100"
                                    >
                                        <option value="pix">Pix (Ganhe 5% de Desconto)</option>
                                        <option value="card">Cartão de Crédito/Débito</option>
                                        <option value="money">Dinheiro</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel value="Observações (Opcional)" className="text-slate-700 dark:text-slate-300 font-medium" />
                                    <TextInput
                                        type="text"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Ex: Troco para R$100, portão verde..."
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="p-6 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-navy-900 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total do Pedido</p>
                            <p className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                                {formatCurrency(totalPrice)}
                            </p>
                        </div>
                        <PrimaryButton
                            form="checkoutForm"
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] py-3 px-8 text-sm md:text-base gap-2 rounded-xl"
                        >
                            <i className="fa-brands fa-whatsapp text-lg"></i>
                            Enviar Pedido
                        </PrimaryButton>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
