<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'name' => 'Botijão Residencial',
            'sku' => 'P13-RESIDENCIAL',
            'description' => 'Gás de cozinha padrão 13kg. Segurança e durabilidade para a sua família.',
            'price' => 115.00,
            'cost_price' => 80.00,
            'image' => '/images/residential_gas.png',
            'stock' => 150,
            'category' => 'Gás',
        ]);

        Product::create([
            'name' => 'Cilindro Comercial',
            'sku' => 'P45-COMERCIAL',
            'description' => 'Alta pressão para seu negócio (45kg). Rendimento profissional.',
            'price' => 410.00,
            'cost_price' => 320.00,
            'image' => '/images/commercial_gas.png',
            'stock' => 20,
            'category' => 'Gás',
        ]);

        Product::create([
            'name' => 'Água Mineral 20L',
            'sku' => 'AGUA-20L',
            'description' => 'Galão retornável de 20 litros. Água leve e pura da fonte.',
            'price' => 15.00,
            'cost_price' => 8.00,
            'image' => '/images/water_gallon.png',
            'stock' => 80,
            'category' => 'Água',
        ]);

        Product::create([
            'name' => 'Kit Segurança',
            'sku' => 'KIT-SEGURANCA',
            'description' => 'Registro e mangueira normatizados pelo Inmetro. 5 anos de validade.',
            'price' => 45.00,
            'cost_price' => 25.00,
            'image' => '/images/tech_tools.png',
            'stock' => 50,
            'category' => 'Acessórios',
        ]);
    }
}
