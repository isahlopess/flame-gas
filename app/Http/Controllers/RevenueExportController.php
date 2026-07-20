<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
class RevenueExportController extends Controller
{
    public function exportPdf(Request $request)
    {
        $orders = Order::with(['user', 'items.product'])->where('status', 'completed')->orderBy('created_at', 'desc')->get();

        $totalRevenue = $orders->sum('total');
        $totalProfit = $totalRevenue * 0.375;

        $data = [
            'orders' => $orders,
            'totalRevenue' => $totalRevenue,
            'totalProfit' => $totalProfit,
            'date' => Carbon::now()->format('d/m/Y H:i')
        ];

        $pdf = Pdf::loadView('reports.revenue', $data);
        return $pdf->download('relatorio_faturamento_' . Carbon::now()->format('d_m_Y') . '.pdf');
    }

    public function exportCsv(Request $request)
    {
        $orders = Order::with(['user', 'items.product'])->where('status', 'completed')->orderBy('created_at', 'desc')->get();

        $filename = "relatorio_faturamento_" . Carbon::now()->format('d_m_Y') . ".xls";
        $handle = fopen('php://output', 'w');

        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment; filename="' . $filename . '"');

        $xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
        $xml .= '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ';
        $xml .= 'xmlns:o="urn:schemas-microsoft-com:office:office" ';
        $xml .= 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
        $xml .= 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" ';
        $xml .= 'xmlns:html="http://www.w3.org/TR/REC-html40">';

        $xml .= '<Styles>';
        $xml .= '<Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Bottom"/><Borders/><Font/><Interior/><NumberFormat/><Protection/></Style>';
        $xml .= '<Style ss:ID="sHeader"><Font ss:Bold="1"/><Interior ss:Color="#DDDDDD" ss:Pattern="Solid"/></Style>';
        $xml .= '<Style ss:ID="sCurrency"><NumberFormat ss:Format="&quot;R$&quot;\ #,##0.00"/></Style>';
        $xml .= '</Styles>';

        $xml .= '<Worksheet ss:Name="Faturamento"><Table>';

        $xml .= '<Column ss:Width="60"/>';
        $xml .= '<Column ss:Width="110"/>';
        $xml .= '<Column ss:Width="200"/>';
        $xml .= '<Column ss:Width="250"/>';
        $xml .= '<Column ss:Width="130"/>';
        $xml .= '<Column ss:Width="100"/>';

        $xml .= '<Row ss:StyleID="sHeader">';
        $xml .= '<Cell><Data ss:Type="String">ID</Data></Cell>';
        $xml .= '<Cell><Data ss:Type="String">Data</Data></Cell>';
        $xml .= '<Cell><Data ss:Type="String">Cliente</Data></Cell>';
        $xml .= '<Cell><Data ss:Type="String">Itens</Data></Cell>';
        $xml .= '<Cell><Data ss:Type="String">Metodo de Pagamento</Data></Cell>';
        $xml .= '<Cell><Data ss:Type="String">Total (R$)</Data></Cell>';
        $xml .= '</Row>';

        foreach ($orders as $order) {
            $itemsStr = $order->items->map(function($item) {
                return $item->quantity . 'x ' . ($item->product->name ?? 'N/D');
            })->join(', ');

            $xml .= '<Row>';
            $xml .= '<Cell><Data ss:Type="String">#' . $order->id . '</Data></Cell>';
            $xml .= '<Cell><Data ss:Type="String">' . $order->created_at->format('d/m/Y H:i') . '</Data></Cell>';
            $xml .= '<Cell><Data ss:Type="String">' . htmlspecialchars($order->user ? $order->user->name : 'N/A') . '</Data></Cell>';
            $xml .= '<Cell><Data ss:Type="String">' . htmlspecialchars($itemsStr) . '</Data></Cell>';
            $xml .= '<Cell><Data ss:Type="String">' . ucfirst($order->payment_method) . '</Data></Cell>';
            $xml .= '<Cell ss:StyleID="sCurrency"><Data ss:Type="Number">' . $order->total . '</Data></Cell>';
            $xml .= '</Row>';
        }

        $xml .= '</Table></Worksheet></Workbook>';

        fwrite($handle, $xml);
        fclose($handle);
        exit;
    }
}
