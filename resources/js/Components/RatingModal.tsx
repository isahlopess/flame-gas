import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function RatingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const handleOpen = (e: any) => {
            setOrder(e.detail);
            setRating(0);
            setHover(0);
            setFeedback('');
            setIsOpen(true);
        };
        window.addEventListener('open-rating-modal', handleOpen);
        return () => window.removeEventListener('open-rating-modal', handleOpen);
    }, []);

    const submitRating = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        try {
            await axios.post(`/api/orders/${order.id}/rate`, {
                rating,
                feedback
            });
            router.reload();
            setIsOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Avalie sua entrega</h2>
                            <p className="text-slate-400 text-sm">
                                Pedido <span className="text-flame-400 font-bold">#{order?.id}</span>. Como foi a sua experiência com o entregador?
                            </p>
                        </div>
                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-10 h-10 transition-colors duration-200 ${
                                            star <= (hover || rating)
                                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                                                : 'text-slate-600'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Deixe um comentário (opcional)
                            </label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-flame-500 focus:ring-flame-500 p-4 resize-none transition-all"
                                placeholder="O entregador foi rápido? O gás chegou direitinho?"
                            />
                        </div>
                        <button
                            onClick={submitRating}
                            disabled={rating === 0 || submitting}
                            className="w-full py-4 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-flame-600 to-flame-500 hover:from-flame-500 hover:to-flame-400 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                        >
                            {submitting ? 'Enviando...' : 'Enviar Avaliação'}
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
