import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useMemo, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Package, MapPin, Truck, Clock, CreditCard, User as UserIcon, LayoutGrid, List, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { router } from '@inertiajs/react';

export default function Orders({ orders, drivers }: { orders: any[], drivers: any[] }) {
    const [localOrders, setLocalOrders] = useState<any[]>(orders);
    const [statusFilter, setStatusFilter] = useState('');
    const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [assignDriverModal, setAssignDriverModal] = useState<number | null>(null);

    useEffect(() => {
        setLocalOrders(orders);
    }, [orders]);

    useEffect(() => {
        const interval = setInterval(() => {
            (router as any).reload({ only: ['orders'], preserveScroll: true, preserveState: true });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'en_route': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20 dark:text-slate-300 dark:bg-white/5 dark:border-white/10';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Concluído';
            case 'en_route': return 'Em Rota';
            case 'cancelled': return 'Cancelado';
            default: return 'Pendente';
        }
    };

    const filteredOrders = useMemo(() => {
        if (!statusFilter) return localOrders;
        return localOrders.filter(o => o.status === statusFilter);
    }, [localOrders, statusFilter]);

    const updateOrderStatus = (orderId: number, status: string, driverId?: number) => {
        setLocalOrders(prev => prev.map(o =>
            o.id === orderId
                ? { ...o, status, ...(driverId ? { driver: drivers.find(d => d.id === driverId), driver_id: driverId } : {}) }
                : o
        ));

        router.post(route('admin.orders.update_status', orderId), {
            status,
            ...(driverId && { driver_id: driverId })
        }, {
            preserveScroll: true,
            preserveState: true
        });
    };

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId) return;

        const orderId = draggableId.replace('order-', '');
        let newStatus = destination.droppableId;

        updateOrderStatus(Number(orderId), newStatus);
    };

    const renderKanbanColumn = (status: string, title: string, items: any[], icon: any, colorClass: string) => (
        <div className="flex-1 min-w-[300px] flex flex-col bg-slate-50 dark:bg-navy-950/50 rounded-3xl p-4 border border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${colorClass}`}>
                        {icon}
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white">{title}</h3>
                </div>
                <span className="bg-white dark:bg-navy-900 text-xs font-black px-2.5 py-1 rounded-full text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-white/5">
                    {items.length}
                </span>
            </div>
            <Droppable droppableId={status}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 flex flex-col gap-3 min-h-[200px] rounded-2xl transition-colors ${snapshot.isDraggingOver ? 'bg-slate-100 dark:bg-white/5' : ''}`}
                    >
                        {items.map((order, index) => (
                            <Draggable key={order.id} draggableId={`order-${order.id}`} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`bg-white dark:bg-navy-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 group transition-shadow ${snapshot.isDragging ? 'shadow-xl shadow-flame-500/10 border-flame-500/30' : 'hover:shadow-md hover:border-slate-300 dark:hover:border-white/10'}`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className="text-xs font-black text-slate-400">#{order.id}</span>
                                                <h4 className="font-bold text-slate-800 dark:text-white mt-0.5">{order.user?.name || order.address}</h4>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-black text-flame-500">{formatCurrency(order.total)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                                            <div className="flex items-center gap-2">
                                                {order.driver ? (
                                                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                                                        <Truck className="w-3 h-3 text-flame-500" />
                                                        {order.driver.name.split(' ')[0]}
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setAssignDriverModal(order.id)}
                                                        className="text-xs font-bold text-flame-500 hover:text-white bg-flame-500/10 hover:bg-flame-500 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        Atribuir
                                                    </button>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );

    return (
        <AdminLayout title="Gestão de Pedidos">
            <div className="bg-white dark:bg-navy-900 rounded-3xl shadow-sm border border-slate-200 dark:border-white/5 flex flex-col min-h-[600px]">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex bg-slate-100 dark:bg-navy-950 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 overflow-x-auto max-w-full no-scrollbar">
                        <button
                            onClick={() => setStatusFilter('')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${statusFilter === '' ? 'bg-white dark:bg-navy-900 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            Todos <span className="ml-2 text-xs bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded-full">{localOrders.length}</span>
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${statusFilter === 'pending' ? 'bg-white dark:bg-navy-900 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            Pendentes <span className="ml-2 text-xs bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded-full">{localOrders.filter(o => o.status === 'pending').length}</span>
                        </button>
                        <button
                            onClick={() => setStatusFilter('en_route')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${statusFilter === 'en_route' ? 'bg-white dark:bg-navy-900 text-amber-500 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            Em Rota <span className="ml-2 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-500 px-2 py-0.5 rounded-full">{localOrders.filter(o => o.status === 'en_route').length}</span>
                        </button>
                        <button
                            onClick={() => setStatusFilter('completed')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${statusFilter === 'completed' ? 'bg-white dark:bg-navy-900 text-emerald-500 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            Concluídos <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 px-2 py-0.5 rounded-full">{localOrders.filter(o => o.status === 'completed').length}</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-navy-950 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${viewMode === 'table' ? 'bg-white dark:bg-navy-900 text-flame-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${viewMode === 'kanban' ? 'bg-white dark:bg-navy-900 text-flame-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 p-0 sm:p-6 bg-slate-50/50 dark:bg-transparent overflow-x-auto">
                    {viewMode === 'table' ? (
                        <div className="bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-white/5">
                                <thead className="bg-slate-50 dark:bg-navy-950/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">ID</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Cliente</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Data</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Total</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Entregador</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-navy-900 divide-y divide-slate-100 dark:divide-white/5">
                                    {filteredOrders.length > 0 ? filteredOrders.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900 dark:text-white">#{item.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700 dark:text-slate-200">{item.user?.name || item.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500 dark:text-slate-400">{new Date(item.created_at).toLocaleString('pt-BR')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-flame-500">{formatCurrency(item.total)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-600 dark:text-slate-300">
                                                {item.driver ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold border border-white/10">
                                                            {item.driver.name.charAt(0)}
                                                        </div>
                                                        {item.driver.name}
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setAssignDriverModal(item.id)} className="text-flame-500 hover:text-flame-600 font-bold underline decoration-flame-500/30 underline-offset-4 cursor-pointer">Atribuir</button>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1.5 inline-flex text-xs font-black rounded-full border ${getStatusColor(item.status)}`}>
                                                    {getStatusLabel(item.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    {item.status === 'pending' && (
                                                        <button onClick={() => updateOrderStatus(item.id, 'en_route')} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-colors cursor-pointer" title="Marcar Em Rota">
                                                            <Truck className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {item.status === 'en_route' && (
                                                        <button onClick={() => updateOrderStatus(item.id, 'completed')} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-colors cursor-pointer" title="Concluir">
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {item.status !== 'cancelled' && item.status !== 'completed' && (
                                                        <button onClick={() => { if(confirm('Cancelar pedido?')) updateOrderStatus(item.id, 'cancelled'); }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer" title="Cancelar">
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setSelectedOrder(item)}
                                                        className="text-flame-500 hover:text-flame-400 bg-flame-500/10 hover:bg-flame-500/20 px-4 py-2 rounded-xl transition-colors font-bold cursor-pointer"
                                                    >
                                                        Detalhes
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-16 text-center text-slate-500 dark:text-slate-400 font-medium">
                                                Nenhum pedido encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex gap-6 overflow-x-auto pb-4 h-full">
                            <DragDropContext onDragEnd={onDragEnd}>
                                {renderKanbanColumn(
                                    'pending',
                                    'Pendentes',
                                    localOrders.filter(o => o.status === 'pending'),
                                    <Clock className="w-5 h-5 text-slate-500" />,
                                    'bg-slate-200 dark:bg-white/10'
                                )}
                                {renderKanbanColumn(
                                    'en_route',
                                    'Em Rota',
                                    localOrders.filter(o => o.status === 'en_route'),
                                    <Truck className="w-5 h-5 text-amber-500" />,
                                    'bg-amber-500/20'
                                )}
                                {renderKanbanColumn(
                                    'completed',
                                    'Concluídos',
                                    localOrders.filter(o => o.status === 'completed'),
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />,
                                    'bg-emerald-500/20'
                                )}
                            </DragDropContext>
                        </div>
                    )}
                </div>
            </div>
            <Transition appear show={!!selectedOrder} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={() => setSelectedOrder(null)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-white/10 text-left align-middle shadow-2xl transition-all">
                                    {selectedOrder && (
                                        <>
                                            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                                                <div>
                                                    <Dialog.Title as="h3" className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                                        Pedido #{selectedOrder.id}
                                                    </Dialog.Title>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                                        Realizado em {new Date(selectedOrder.created_at).toLocaleString('pt-BR')}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedOrder(null)}
                                                    className="w-10 h-10 rounded-xl cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="p-6 space-y-8">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
                                                            <UserIcon className="w-4 h-4" /> Cliente
                                                        </div>
                                                        <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedOrder.user?.name || 'Cliente Avulso'}</p>
                                                        {selectedOrder.user?.phone && (
                                                            <p className="text-sm text-slate-500 mt-1 font-medium">{selectedOrder.user.phone}</p>
                                                        )}
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
                                                            <Truck className="w-4 h-4" /> Entrega
                                                        </div>
                                                        <span className={`px-2.5 py-1 inline-flex text-xs font-black rounded-lg border ${getStatusColor(selectedOrder.status)}`}>
                                                            {getStatusLabel(selectedOrder.status)}
                                                        </span>
                                                        <p className="text-sm text-slate-500 mt-2 font-medium">
                                                            <span className="text-slate-400">Entregador:</span> {selectedOrder.driver?.name || 'Pendente'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
                                                        <MapPin className="w-4 h-4" /> Endereço de Entrega
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 font-medium">
                                                        {selectedOrder.address || 'Não informado'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
                                                        <Package className="w-4 h-4" /> Produtos
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden">
                                                        <table className="min-w-full divide-y divide-slate-100 dark:divide-white/5">
                                                            <thead className="bg-slate-100/50 dark:bg-black/20">
                                                                <tr>
                                                                    <th scope="col" className="px-4 py-3 text-left text-xs font-black text-slate-400 uppercase">Item</th>
                                                                    <th scope="col" className="px-4 py-3 text-center text-xs font-black text-slate-400 uppercase">Qtd</th>
                                                                    <th scope="col" className="px-4 py-3 text-right text-xs font-black text-slate-400 uppercase">Preço</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                                                {selectedOrder.items?.map((item: any) => (
                                                                    <tr key={item.id}>
                                                                        <td className="px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                                                                            {item.product?.name || 'Produto Removido'}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-sm font-medium text-slate-500 text-center">
                                                                            x{item.quantity}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 text-right">
                                                                            {formatCurrency(item.unit_price * item.quantity)}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                            <tfoot className="bg-slate-100/50 dark:bg-black/20 border-t border-slate-200 dark:border-white/10">
                                                                <tr>
                                                                    <td colSpan={2} className="px-4 py-4 text-sm font-black text-slate-900 dark:text-white text-right">
                                                                        Total do Pedido:
                                                                    </td>
                                                                    <td className="px-4 py-4 text-lg font-black text-flame-500 text-right">
                                                                        {formatCurrency(selectedOrder.total)}
                                                                    </td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Transition appear show={assignDriverModal !== null} as={Fragment}>
                <Dialog as="div" className="relative z-[105]" onClose={() => setAssignDriverModal(null)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-3xl bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-white/10 text-left align-middle shadow-2xl transition-all p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <Dialog.Title as="h3" className="text-lg font-black text-slate-900 dark:text-white">
                                            Atribuir Entregador
                                        </Dialog.Title>
                                        <button onClick={() => setAssignDriverModal(null)} className="cursor-pointer text-slate-400 hover:text-slate-500"><X className="w-5 h-5"/></button>
                                    </div>
                                    <div className="space-y-3">
                                        {drivers.map(driver => (
                                            <button
                                                key={driver.id}
                                                onClick={() => {
                                                    updateOrderStatus(assignDriverModal!, 'en_route', driver.id);
                                                    setAssignDriverModal(null);
                                                }}
                                                className="w-full cursor-pointer flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-flame-500 hover:bg-flame-500/5 transition-all text-left group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 group-hover:bg-flame-500 group-hover:text-white transition-colors">
                                                        {driver.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-flame-500 transition-colors">{driver.name}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </AdminLayout>
    );
}
