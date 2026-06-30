import { Head } from '@inertiajs/react';

export default function HubDashboard() {
    return (
        <>
            <Head title="Hub do Entregador - FlameGás" />
            <div className="min-h-screen bg-navy-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-flame-500/20 flex items-center justify-center mx-auto mb-6">
                        <i className="fa-solid fa-motorcycle text-flame-500 text-3xl"></i>
                    </div>
                    <h1 className="text-4xl font-heading font-extrabold text-white mb-4">Hub do Entregador</h1>
                    <p className="text-slate-400 text-lg">Em construção — Em breve você verá seus pedidos aqui.</p>
                </div>
            </div>
        </>
    );
}
