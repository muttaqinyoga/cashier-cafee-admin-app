<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DinningTableController;
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
    Route::get('/api/admin/dinningtables/get', [DinningTableController::class, 'getAllTables']);
    Route::post('/api/admin/dinningtables/save', [DinningTableController::class, 'save']);
    Route::post('/api/admin/dinningtables/update', [DinningTableController::class, 'update']);
    Route::delete('/api/admin/dinningtables/delete', [DinningTableController::class, 'delete']);
    Route::get('/api/admin/orders/get', [OrderController::class, 'getListOrder']);
    Route::get('/api/admin/orders', [OrderController::class, 'getListFood']);
    Route::get('/api/admin/tables/get', [OrderController::class, 'getDiningTables']);
    Route::post('/api/admin/orders/save', [OrderController::class, 'save']);
    Route::get('/api/admin/orders/{id}/get', [OrderController::class, 'getOrderById']);
    Route::post('/api/admin/orders/update', [OrderController::class, 'update']);
    Route::delete('/api/admin/orders/delete', [OrderController::class, 'delete']);
    Route::post('/api/admin/orders/finish', [OrderController::class, 'finish']);

    Route::get('/api/admin/order/paymentmonthly', [OrderController::class, 'getMonthlyPayment']);
    Route::get('/api/admin/order/paymentdaily', [OrderController::class, 'getDailyPayment']);

    Route::post('/api/admin/password/update', [HomeController::class, 'updatePassword']);
});

Route::get('/customer/order/{table}', [OrderController::class, 'customer']);
Route::get('/api/menus/get', [OrderController::class, 'getListFood']);
Route::post('/api/order/{table}', [OrderController::class, 'createOrderFromCustomer']);
// Route::get('{path}', HomeController::class)->where('path', '(.*)');
