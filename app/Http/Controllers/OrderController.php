<?php

namespace App\Http\Controllers;

use App\Models\Food;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Models\Response;

class OrderController extends Controller
{

    public function getListOrder()
    {
        $response = new Response();
        try {
            $orders = Order::with(["table", "foods"])->get();
            $response->setStatus(true);
            $response->setMessage("success");
            $response->setData($orders);
            $response->setHttpCode(200);
        } catch (Throwable $e) {
            $response->setStatus(false);
            $response->setMessage("Something Went Wrong in the Server");
            $response->setHttpCode(500);
            $response->setData([
                "Details" => $e->getMessage()
            ]);
        }
        return $response->build();
    }
}
