<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::post('auth/login', [AuthController::class, 'login'])->middleware('guest');
Route::get('auth/login', function () {
    return view('login');
})->middleware('guest');
Route::redirect('/', '/admin');
Route::post('auth/logout', [AuthController::class, 'logout']);
Route::group(['middleware' => 'auth'], function () {
    Route::get('/admin', [HomeController::class, 'index']);
    Route::get('/admin/{path?}', function () {
        return view('app');
    })->where('path', '[\/\w\.-]*');
    Route::get('/api/admin/categories/get', [CategoryController::class, 'getListCategory']);
    Route::post('/api/admin/categories/save', [CategoryController::class, 'save']);
    Route::post('/api/admin/categories/update', [CategoryController::class, 'update']);
    Route::delete('/api/admin/categories/delete', [CategoryController::class, 'delete']);
    Route::get('/api/admin/foods/get', [FoodController::class, 'getListFood']);
    Route::post('/api/admin/foods/save', [FoodController::class, 'save']);
    Route::get('/api/admin/foods/{id}/get', [FoodController::class, 'getFoodById']);
    Route::post('/api/admin/foods/update', [FoodController::class, 'update']);
    Route::delete('/api/admin/foods/delete', [FoodController::class, 'delete']);
    // Route::get('/admin/orders', [OrderController::class, 'index']);
    // Route::get('/admin/orders/get', [OrderController::class, 'getListOrder']);
});
// Route::get('{path}', HomeController::class)->where('path', '(.*)');
