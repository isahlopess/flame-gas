import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/Contexts/CartContext';
import PrimaryButton from '@/Components/PrimaryButton';

export default function CartDrawer() {
    const { isCartOpen, setCartOpen, items, updateQuantity, removeItem, totalPrice, setCheckoutOpen } = useCart();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleCheckout = () => {
        setCartOpen(false);
        setCheckoutOpen(true);
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartOpen(false)}
                        className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-navy-900 shadow-2xl z-[101] flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10">
                            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-3">
                                <i className="fa-solid fa-cart-shopping text-flame-500"></i>
                                Seu Pedido
                            </h2>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                        <i className="fa-solid fa-basket-shopping text-4xl text-slate-300 dark:text-slate-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">Seu carrinho está vazio</p>
                                        <p className="text-sm text-slate-500">Adicione alguns botijões ou galões para continuar.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <AnimatePresence>
                                        {items.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/50 border border-slate-100 dark:border-white/5"
                                            >
                                                <div className="w-20 h-20 bg-white dark:bg-navy-950 rounded-xl p-2 shadow-sm flex items-center justify-center">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                                    ) : (
                                                        <i className="fa-solid fa-image text-slate-300 text-2xl"></i>
                                                    )}
                                                </div>

                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                                                                {item.name}
                                                            </h3>
                                                            {item.category && (
                                                                <span className="text-xs text-flame-500 font-medium">{item.category}</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                        >
                                                            <i className="fa-regular fa-trash-can"></i>
                                                        </button>
                                                    </div>

                                                    <div className="mt-auto flex items-center justify-between">
                                                        <p className="font-bold text-slate-900 dark:text-white">
                                                            {formatCurrency(item.price)}
                                                        </p>
                                                        <div className="flex items-center gap-3 bg-white dark:bg-navy-950 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="w-6 h-6 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 transition-colors"
                                                            >
                                                                <i className="fa-solid fa-minus text-[10px]"></i>
                                                            </button>
                                                            <span className="text-sm font-semibold text-slate-900 dark:text-white w-4 text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-6 h-6 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 transition-colors"
                                                            >
                                                                <i className="fa-solid fa-plus text-[10px]"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                        {items.length > 0 && (
                            <div className="p-6 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-navy-800">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Total</span>
                                    <span className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
                                        {formatCurrency(totalPrice)}
                                    </span>
                                </div>
                                <PrimaryButton
                                    onClick={handleCheckout}
                                    className="w-full justify-center py-4 text-base bg-flame-500 hover:bg-flame-600 rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)]"
                                >
                                    Finalizar Pedido
                                    <i className="fa-solid fa-arrow-right ml-2"></i>
                                </PrimaryButton>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
