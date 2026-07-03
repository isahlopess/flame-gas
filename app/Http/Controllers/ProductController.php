<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:100',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        if (empty($validated['sku'])) {
            $validated['sku'] = 'PRD-' . strtoupper(uniqid());
        }

        $product = new Product($validated);
        $product->active = true;

        $maxOrder = Product::max('display_order') ?? 0;
        $product->display_order = $maxOrder + 1;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->image = '/storage/' . $path;
        }

        $product->save();

        return redirect()->back()->with('success', 'Produto criado com sucesso.');
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:100',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        if (empty($validated['sku'])) {
            $validated['sku'] = 'PRD-' . strtoupper(uniqid());
        }

        unset($validated['image']);
        $product->fill($validated);

        if ($request->hasFile('image')) {
            if ($product->image && str_starts_with($product->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $product->image);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $path = $request->file('image')->store('products', 'public');
            $product->image = '/storage/' . $path;
        }

        $product->save();

        return redirect()->back()->with('success', 'Produto atualizado com sucesso.');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image && str_starts_with($product->image, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $product->image);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $product->delete();

        return redirect()->back()->with('success', 'Produto removido com sucesso.');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'orderedIds' => 'required|array',
            'orderedIds.*' => 'integer|exists:products,id',
        ]);

        foreach ($validated['orderedIds'] as $index => $id) {
            Product::where('id', $id)->update(['display_order' => $index]);
        }

        return redirect()->back()->with('success', 'Ordem atualizada com sucesso.');
    }
}
