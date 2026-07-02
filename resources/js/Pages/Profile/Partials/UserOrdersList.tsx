import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, CheckCircle2, Clock, MapPin, Package, XCircle, User, Star } from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface OrderItem {
    id: number;
    product: {
        name: string;
        image: string;
    };
    quantity: number;
    unit_price: number;
}

interface Order {
    id: number;
    status: string;
    total: number;
    payment_method: string;
    created_at: string;
    rating?: number;
    items: OrderItem[];
    driver?: {
        name: string;
    };
    user?: {
        name: string;
        phone: string;
        address: string;
        neighborhood: string;
    };
}

export default function UserOrdersList({ orders }: { orders: Order[] }) {
    const getProductImage = (product: any) => {
        if (!product) return '/images/residential.png';
        const name = product.name?.toLowerCase() || '';
        if (name.includes('comercial') || name.includes('p45')) return '/images/commercial.png';
        if (name.includes('água') || name.includes('agua') || name.includes('galão')) return '/images/water_gallon.png';
        if (name.includes('kit') || name.includes('segurança')) return '/images/tech.png';
        return '/images/residential.png';
    };

    const user = usePage().props.auth.user as any;
    const isEmployee = user.role === 'employee';

    if (!orders || orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-100 mb-2">
                    {isEmployee ? 'Nenhuma entrega ainda' : 'Nenhum pedido ainda'}
                </h3>
                <p className="text-gray-400 mb-8 max-w-md">
                    {isEmployee 
                        ? 'Você ainda não realizou nenhuma entrega pela FlameGás. Fique de olho no Hub!' 
                        : 'Você ainda não fez nenhum pedido de botijão com a FlameGás. Que tal experimentar a entrega mais rápida da região?'}
                </p>
                {!isEmployee && (
                    <a
                        href="/"
                        className="bg-flame-500 hover:bg-flame-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-flame-500/20"
                    >
                        Fazer meu primeiro pedido
                    </a>
                )}
            </div>
        );
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Pendente', icon: <Clock className="w-4 h-4" /> };
            case 'accepted': return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Aceito / Separando', icon: <Package className="w-4 h-4" /> };
            case 'en_route': return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'A Caminho', icon: <Truck className="w-4 h-4" /> };
            case 'completed': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Entregue', icon: <CheckCircle2 className="w-4 h-4" /> };
            case 'cancelled': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Cancelado', icon: <XCircle className="w-4 h-4" /> };
            default: return { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: status, icon: <ShoppingBag className="w-4 h-4" /> };
        }
    };

    return (
        <section>
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-2 flex items-center gap-2">
                        <ShoppingBag className="w-6 h-6 text-flame-500" />
                        {isEmployee ? 'Histórico de Entregas' : 'Histórico de Pedidos'}
                    </h2>
                    <p className="text-sm text-gray-400">
                        {isEmployee 
                            ? 'Acompanhe as entregas que você já realizou.' 
                            : 'Acompanhe seus pedidos em tempo real ou reveja suas compras anteriores.'}
                    </p>
                </div>
            </header>
            <div className="space-y-6">
                {orders.map((order, index) => {
                    const statusInfo = getStatusInfo(order.status);
                    return (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 hover:bg-gray-900/60 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-gray-800 pb-4">
                                <div>
                                    <span className="text-gray-400 text-sm font-mono">#{order.id}</span>
                                    <h3 className="text-lg font-bold text-white mt-1">
                                        Pedido em {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                    </h3>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color} font-medium text-sm self-start md:self-auto`}>
                                    {statusInfo.icon}
                                    {statusInfo.label}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                <div className="lg:col-start-1 lg:row-start-1">
                                    <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Itens do Pedido</h4>
                                    <div className="space-y-3">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 bg-gray-950/50 p-3 rounded-xl border border-gray-800/50">
                                                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                                                    <img src={getProductImage(item.product)} alt={item.product?.name || 'Produto'} className="w-full h-full object-contain drop-shadow-md" />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-gray-200 text-sm">{item.product.name}</h5>
                                                    <p className="text-gray-500 text-sm">{item.quantity}x de R$ {Number(item.unit_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                                </div>
                                                <div className="font-bold text-gray-300 text-sm">
                                                    R$ {(item.quantity * item.unit_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {!isEmployee && order.status === 'completed' && (
                                    <div className="lg:col-start-1 lg:row-start-2 h-full flex flex-col">
                                        <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Avaliação do Pedido</h4>
                                        <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-800/50 flex flex-col items-center justify-center min-h-[104px] flex-1">
                                            {order.rating ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex gap-1 text-flame-400">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star key={i} className={`w-5 h-5 ${i < Math.round(order.rating!) ? 'fill-current' : 'text-gray-700'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-400 font-medium">Você avaliou com {order.rating} estrelas</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-xs text-gray-400 text-center">Como foi sua experiência?</span>
                                                    <button 
                                                        onClick={() => (window as any).dispatchEvent(new CustomEvent('open-rating', { detail: { orderId: order.id } }))}
                                                        className="px-4 py-1.5 bg-flame-500 hover:bg-flame-600 text-white rounded-full text-xs font-bold transition-colors"
                                                    >
                                                        Avaliar Pedido
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="lg:col-start-2 lg:row-start-1">
                                    <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Resumo Financeiro</h4>
                                    <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-800/50 min-h-[104px] flex flex-col justify-center">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-400">Pagamento</span>
                                            <span className="text-sm text-gray-200 font-medium capitalize">{order.payment_method || 'PIX'}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-800/50">
                                            <span className="text-gray-300 font-bold">Total</span>
                                            <span className="text-flame-500 font-bold text-lg">R$ {Number(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {isEmployee && (
                                    <div className="lg:col-start-2 lg:row-start-2 h-full flex flex-col">
                                        <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Cliente</h4>
                                        <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-800/50 flex items-start gap-3 min-h-[104px] flex-1">
                                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                                                <User className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-white font-medium">{order.user?.name}</span>
                                                    <span className="text-gray-400 text-sm">{order.user?.phone}</span>
                                                </div>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    <MapPin className="w-3 h-3 inline mr-1" />
                                                    {order.user?.address} - {order.user?.neighborhood}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) || (
                                    order.driver && (
                                        <div className="lg:col-start-2 lg:row-start-2 h-full flex flex-col">
                                            <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Entrega</h4>
                                            <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-800/50 flex items-center gap-3 min-h-[104px] flex-1">
                                                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                                                    <Truck className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Motorista Responsável</p>
                                                    <p className="text-gray-200 font-medium">{order.driver.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
