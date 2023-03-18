<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Food;
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
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
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
        $category->image = 'category-foods.png';
        $category->save();
        $category2 = new Category;
        $idCategory2 = Uuid::uuid4()->getHex();
        $category2->id = $idCategory2;
        $category2->name = 'Aneka Mie';
        $category2->slug = \Str::slug('Aneka Mie', '-');
        $category2->image = 'category-foods.png';
        $category2->save();
        // 
        // Food Seed
        $food = new Food;
        $food->id = Uuid::uuid4()->getHex();
        $food->name = 'Nasi Goreng Biasa';
        $food->price = 12000.00;
        $food->image = 'food-placeholder.jpeg';
        $food->description = 'Nasi goreng dengan telur dan potongan sayur';
        $food->status_stock = 'Tersedia';
        $food->save();
        $food->categories()->attach($idCategory);
        $food2 = new Food;
        $food2->id = Uuid::uuid4()->getHex();
        $food2->name = 'Nasi Goreng Spesial';
        $food2->price = 23000.00;
        $food2->image = 'food-placeholder.jpeg';
        $food2->description = 'Nasi goreng dengan potongan satu potong ayam, telur, dan potogan sayur';
        $food2->status_stock = 'Tersedia';
        $food2->save();
        $food2->categories()->attach($idCategory);
        $food3 = new Food;
        $food3->id = Uuid::uuid4()->getHex();
        $food3->name = 'Kwetiau Goreng';
        $food3->price = 13000.00;
        $food3->image = 'food-placeholder.jpeg';
        $food3->description = 'Kwetiau goreng dengan potongan telur dan sayur';
        $food3->status_stock = 'Tersedia';
        $food3->save();
        $food3->categories()->attach($idCategory2);


        // 
    }
}
