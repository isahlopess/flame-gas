<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Relatório de Faturamento</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            font-size: 12px;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #ea580c;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #ea580c;
            margin: 0 0 5px 0;
            font-size: 24px;
        }
        .header p {
            margin: 0;
            color: #666;
        }
        .summary {
            width: 100%;
            margin-bottom: 30px;
            border-collapse: collapse;
        }
        .summary td {
            width: 50%;
            padding: 15px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            text-align: center;
        }
        .summary h3 {
            margin: 0 0 5px 0;
            color: #475569;
            font-size: 14px;
            text-transform: uppercase;
        }
        .summary .value {
            font-size: 20px;
            font-weight: bold;
            color: #0f172a;
        }
        .summary .value.green {
            color: #10b981;
        }
        .summary .value.blue {
            color: #3b82f6;
        }
        table.data {
            width: 100%;
            border-collapse: collapse;
        }
        table.data th {
            background-color: #f1f5f9;
            color: #334155;
            font-weight: bold;
            text-align: left;
            padding: 10px;
            border-bottom: 2px solid #cbd5e1;
        }
        table.data td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
            color: #475569;
        }
        table.data tr:nth-child(even) td {
            background-color: #f8fafc;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>FlameGás</h1>
        <p>Relatório Consolidado de Faturamento</p>
        <p>Gerado em {{ $date }}</p>
    </div>
    <table class="summary">
        <tr>
            <td>
                <h3>Receita Bruta Total</h3>
                <div class="value green">R$ {{ number_format($totalRevenue, 2, ',', '.') }}</div>
            </td>
            <td>
                <h3>Lucro Líquido Estimado</h3>
                <div class="value blue">R$ {{ number_format($totalProfit, 2, ',', '.') }}</div>
            </td>
        </tr>
    </table>
    <table class="data">
        <thead>
            <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Itens</th>
                <th>Pagamento</th>
                <th style="text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse($orders as $order)
                <tr>
                    <td>#{{ $order->id }}</td>
                    <td>{{ $order->created_at->format('d/m/Y H:i') }}</td>
                    <td>{{ $order->user ? $order->user->name : 'N/D' }}</td>
                    <td>
                        {{ $order->items->map(function($item) { return $item->quantity . 'x ' . ($item->product->name ?? 'N/D'); })->join(', ') }}
                    </td>
                    <td>{{ ucfirst($order->payment_method) }}</td>
                    <td style="text-align: right; font-weight: bold;">R$ {{ number_format($order->total, 2, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align: center;">Nenhuma venda registrada.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
    <div class="footer">
        Este documento é gerado automaticamente pelo sistema interno da FlameGás e possui caráter informativo.
    </div>
</body>
</html>
