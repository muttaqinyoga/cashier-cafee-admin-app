<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Food;
use App\Models\DiningTables;
use App\Models\Order;
use App\Models\OrderDetails;
use Illuminate\Database\Seeder;
use Ramsey\Uuid\Uuid;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::create([
            'username' => 'admin',
            'password' => bcrypt('admin123')
        ]);
        // Categori Seed
        $category = new Category;
        $idCategory = Uuid::uuid4()->getHex();
        $category->id = $idCategory;
        $category->name = 'Aneka Nasi';
        $category->slug = \Str::slug('Aneka Nasi', '-');
        $category->image = 'categories-placeholder.png';
        $category->save();
        $category2 = new Category;
        $idCategory2 = Uuid::uuid4()->getHex();
        $category2->id = $idCategory2;
        $category2->name = 'Aneka Mie';
        $category2->slug = \Str::slug('Aneka Mie', '-');
        $category2->image = 'categories-placeholder.png';
        $category2->save();
        // 
        // Food Seed
        $food = new Food;
        $food->id = Uuid::uuid4()->getHex();
        $food->name = 'Nasi Goreng Biasa';
        $food->price = 12000.00;
        $food->image = 'foods-placeholder.jpg';
        $food->description = 'Nasi goreng dengan telur dan potongan sayur';
        $food->status_stock = 'Tersedia';
        $food->save();
        $food->categories()->attach($idCategory);
        $food2 = new Food;
        $food2->id = Uuid::uuid4()->getHex();
        $food2->name = 'Nasi Goreng Spesial';
        $food2->price = 23000.00;
        $food2->image = 'foods-placeholder.jpg';
        $food2->description = 'Nasi goreng dengan potongan satu potong ayam, telur, dan potogan sayur';
        $food2->status_stock = 'Tersedia';
        $food2->save();
        $food2->categories()->attach($idCategory);
        $food3 = new Food;
        $food3->id = Uuid::uuid4()->getHex();
        $food3->name = 'Kwetiau Goreng';
        $food3->price = 13000.00;
        $food3->image = 'foods-placeholder.jpg';
        $food3->description = 'Kwetiau goreng dengan potongan telur dan sayur';
        $food3->status_stock = 'Tersedia';
        $food3->save();
        $food3->categories()->attach($idCategory2);


        // Dining Table Seed
        $tables1 = new DiningTables;
        $tables1->id = Uuid::uuid4()->getHex();
        $tables1->number = 1;
        $tables1->save();
        // Order Food
        // $order1 = new Order;
        // $order1->id = Uuid::uuid4()->getHex();
        // $order1->order_number = date('YmdHis');
        // $order1->total_price = 23000.00;
        // $order1->status = "Selesai";
        // $order1->table_id = $tables1->id;
        // $order1->save();
        // // Order Details 
        // $orderDetail = new OrderDetails;
        // $orderDetail->id = Uuid::uuid4()->getHex();
        // $orderDetail->quantity_ordered = 1;
        // $orderDetail->order_id = $order1->id;
        // $orderDetail->food_id = $food2->id;
        // $orderDetail->save();

        // Another Dining Table Seed
        for ($i = 2; $i <= 20; $i++) {
            DiningTables::create([
                'number' => $i
            ]);
        }
    }
}
