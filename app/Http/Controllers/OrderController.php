<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // public function index()
    // {
    //     $foods = Food::orderBy('name')->get();
    //     $tables = [];
    //     return view('orders.index', compact('foods', 'tables'));
    // }

    // public function getListOrder()
    // {
    //     try {
    //         $data = [
    //             [
    //                 'id' => '12334'
    //             ]
    //         ];
    //         return response()->json(['status' => 'success', 'data' => $data], 200);
    //     } catch (Exception $e) {
    //         return response()->json(['status' => 'failed', 'message' => 'Failed to load data from server'], 500);
    //     }
    // }
}
