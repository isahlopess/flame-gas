import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/Contexts/CartContext';

export default function CartButton({ isScrolled }: { isScrolled: boolean }) {
    const { totalItems, setCartOpen } = useCart();

    return (
        <button
            onClick={() => setCartOpen(true)}
            className={`relative p-2 rounded-full transition-colors flex items-center justify-center ${
                isScrolled
                    ? 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'
                    : 'text-white hover:bg-white/10'
            }`}
        >
            <i className="fa-solid fa-cart-shopping text-lg"></i>
            
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1 -right-1 bg-flame-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-navy-950"
                    >
                        {totalItems > 99 ? '99+' : totalItems}
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}
