<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ManagerSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@flamegas.com'],
            [
                'name' => 'Gestor FlameGás',
                'password' => Hash::make('password'),
                'role' => 'manager',
                'phone' => '(67) 99999-9999',
            ]
        );
    }
}
