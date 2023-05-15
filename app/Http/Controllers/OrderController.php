<?php

namespace App\Http\Controllers;

use App\Models\DiningTables;
use App\Models\Food;
use App\Models\Order;
use App\Models\OrderDetails;
use Illuminate\Http\Request;
use App\Models\Response;
use Ramsey\Uuid\Uuid;
use Validator;
use Illuminate\Support\Facades\DB;
use Throwable;

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
            return $response->build();
        } catch (Throwable $e) {
            $response->setStatus(false);
            $response->setMessage("Something Went Wrong in the Server");
            $response->setHttpCode(500);
            $response->setData([
                "Details" => $e->getMessage()
            ]);
            return $response->build();
        }
    }

    public function getListFood(Request $request)
    {
        $response = new Response();
        if ($request->has("list") && $request->get("list") == "food") {
            try {
                $foods = Food::where("status_stock", "=", "Tersedia")->get();
                $response->setStatus(true);
                $response->setMessage("success");
                $response->setData($foods);
                $response->setHttpCode(200);
                return $response->build();
            } catch (Throwable $th) {
                $response->setStatus(false);
                $response->setMessage("Something Went Wrong in the Server");
                $response->setHttpCode(500);
                $response->setData([
                    "Details" => $th->getMessage()
                ]);
                return $response->build();
            }
        }
        return null;
    }

    public function getDiningTables()
    {
        $response = new Response();
        try {
            $tables = DiningTables::orderBy('number')->where('status', '=', 'AVALIABLE')->get();
            $response->setStatus(true);
            $response->setMessage("success");
            $response->setData($tables);
            $response->setHttpCode(200);
            return $response->build();
        } catch (Throwable $th) {
            $response->setStatus(false);
            $response->setMessage("Something Went Wrong in the Server");
            $response->setHttpCode(500);
            $response->setData([
                "Details" => $th->getMessage()
            ]);
            return $response->build();
        }
    }

    public function save(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'order_table_number' => 'required|exists:dining_tables,id',
            'order_food' => 'required'
        ]);
        $response = new Response();
        if ($validation->fails()) {
            $response->setStatus(false);
            $response->setMessage("Unprocessable Entity");
            $response->setHttpCode(422);
            $response->setData([
                'errors' => $validation->errors()
            ]);
            return $response->build();
        }
        // Validate order_food
        $order_food = json_decode($request->order_food, true);
        $id =  Uuid::uuid4()->getHex();
        DB::beginTransaction();

        try {
            $valid_foods = 0;
            $total_price = 0;
            $foods = Food::orderBy('created_at')->get();
            $dinning_table = DiningTables::findOrFail($request->order_table_number);
            $order = new Order;
            $order->id = $id;
            $order->order_number = date('YmdHis');
            $order->total_price = $total_price;
            $order->table_id = $request->order_table_number;
            $order->save();

            foreach ($foods as $f) {
                foreach ($order_food as $of) {
                    if ($f->id == $of['food']) {
                        $valid_foods += 1;
                        $total_price += intval($of['quantity_ordered']) * intval($f->price);
                        $order_details = new OrderDetails;
                        $order_details->order_id = $id;
                        $order_details->food_id = $of['food'];
                        $order_details->quantity_ordered = $of['quantity_ordered'];
                        $order_details->save();
                        break;
                    }
                }
                if ($valid_foods == count($order_food)) {
                    break;
                }
            }
            if ($valid_foods != count($order_food)) {
                $response->setStatus(false);
                $response->setMessage("Invalid request data : Food not valid!");
                $response->setHttpCode(400);
                $response->setData([]);
                return $response->build();
            }
            $order->total_price = $total_price;
            $dinning_table->status = 'UNAVALIABLE';
            $dinning_table->save();
            $order->save();
            DB::commit();
            $response->setStatus(true);
            $response->setMessage("New order has been created");
            $response->setHttpCode(201);
            $response->setData(null);
            return $response->build();
        } catch (Throwable $th) {
            DB::rollBack();
            $response->setStatus(false);
            $response->setMessage("Something Went Wrong in the Server");
            $response->setHttpCode(500);
            $response->setData([
                "Details" => $th->getMessage()
            ]);
            return $response->build();
        }
    }
}
