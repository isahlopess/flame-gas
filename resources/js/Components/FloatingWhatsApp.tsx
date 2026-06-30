import { motion } from 'framer-motion';

export default function FloatingWhatsApp() {
    return (
        <motion.a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 group flex items-center gap-3"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1, duration: 0.5, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="bg-white text-slate-800 px-4 py-2 rounded-xl shadow-lg border border-slate-200 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300 hidden sm:block">
                Precisa de ajuda?
            </div>

            <div className="relative">
                <div className="absolute inset-0 bg-[#25D366] rounded-full opacity-75"></div>
                <div className="relative bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-colors hover:bg-[#20bd5a]">
                    <i className="fa-brands fa-whatsapp text-3xl"></i>
                </div>
            </div>
        </motion.a>
    );
}
