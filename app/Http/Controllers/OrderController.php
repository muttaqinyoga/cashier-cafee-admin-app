<?php

namespace App\Http\Controllers;

use App\Models\DiningTables;
use App\Models\Food;
use App\Models\Order;
use App\Models\OrderDetails;
use Illuminate\Http\Request;
use App\Models\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Ramsey\Uuid\Uuid;
use Illuminate\Support\Facades\Crypt;
use Validator;
use Illuminate\Support\Facades\DB;
use Throwable;

class OrderController extends Controller
{


    function encryptOrder($orders)
    {
        foreach ($orders as $order) {
            if ($order['status'] == 'Proses') {
                $order['payment_code'] = Crypt::encryptString($order['id']);
            } else {
                $order['payment_code'] = null;
            }
        }

        return $orders;
    }
    public function getListOrder()
    {
        $response = new Response();
        try {
            $orders = Order::with(["table", "foods"])->get();
            $response->setStatus(true);
            $response->setMessage("success");
            $order_map = $this->encryptOrder($orders);
            $response->setData($order_map);
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
        $validation = null;
        if($request->has('order_table_number')){
            $validation = Validator::make($request->all(), [
                'order_table_number' => 'required|exists:dining_tables,id',
                'order_customer_name' => 'required',
                'order_food' => 'required'
            ]);
            
        } else {
            $validation = Validator::make($request->all(), [
                'order_customer_name' => 'required',
                'order_food' => 'required'
            ]);
        }
        
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
        if (count($order_food) < 1) {
            $response->setStatus(false);
            $response->setMessage("Unprocessable Entity");
            $response->setHttpCode(422);
            $response->setData([
                'errors' => ['order_food' => ['The menu field is required']]
            ]);
            return $response->build();
        }
        $id =  Uuid::uuid4()->getHex();
        DB::beginTransaction();

        try {
            $valid_foods = 0;
            $total_price = 0;
            $foods = Food::orderBy('created_at')->get();
            $dinning_table = null;
            $order = new Order;
            $order->id = $id;
            $order->order_number = date('YmdHis');
            $order->customer_name = $request->order_customer_name;
            $order->total_price = $total_price;
            if($request->has('order_table_number')){
                $dinning_table = DiningTables::findOrFail($request->order_table_number);
                $dinning_table->status = 'UNAVALIABLE';
                $dinning_table->save();
                $order->table_id = $request->order_table_number;
            }
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
                DB::rollBack();
                $response->setStatus(false);
                $response->setMessage("Invalid request data : Food not valid!");
                $response->setHttpCode(400);
                $response->setData(null);
                return $response->build();
            }
            $order->total_price = $total_price;
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

    public function getOrderById($id)
    {
        $response = new Response();
        try {
            $order = Order::with(['table', 'foods'])->where('id', '=', $id)->firstOrFail();
            $response->setStatus(true);
            $response->setMessage("success");
            $response->setData($order);
            $response->setHttpCode(200);
            return $response->build();
        } catch (ModelNotFoundException $m) {
            $response->setStatus(false);
            $response->setMessage('Requested data could not be found');
            $response->setData([
                'Details' => $m->getMessage()
            ]);
            $response->setHttpCode(404);
            return $response->build();
        } catch (Throwable $th) {
            $response->setStatus(false);
            $response->setMessage('Something Went Wrong in the Server');
            $response->setData([
                'Details' => $th->getMessage()
            ]);
            $response->setHttpCode(500);
            return $response->build();
        }
    }

    public function update(Request $request)
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
        $order = null;
        try {
            $order = Order::with(['foods'])->where('id', '=', $request->order_id)->firstOrFail();
        } catch (ModelNotFoundException $m) {
            $response->setStatus(false);
            $response->setMessage('Requested data could not be found');
            $response->setData([
                'Details' => $m->getMessage()
            ]);
            $response->setHttpCode(404);
            return $response->build();
        } catch (Throwable $th) {
            $response->setStatus(false);
            $response->setMessage('Something Went Wrong in the Server');
            $response->setData([
                'Details' => $th->getMessage()
            ]);
            $response->setHttpCode(500);
            return $response->build();
        }


        $order_food = json_decode($request->order_food, true);
        if (count($order_food) < 1) {
            $response->setStatus(false);
            $response->setMessage("Unprocessable Entity");
            $response->setHttpCode(422);
            $response->setData([
                'errors' => ['order_food' => ['The menu field is required']]
            ]);
            return $response->build();
        }
        DB::beginTransaction();
        try {
            $valid_foods = 0;
            $total_price = 0;
            $foods = Food::orderBy('created_at')->get();
            $curr_dinning_table = DiningTables::findOrFail($order->table_id);
            $curr_dinning_table->status = 'AVALIABLE';
            $curr_dinning_table->update();
            $order->foods()->detach();
            foreach ($foods as $f) {
                foreach ($order_food as $of) {
                    if ($f->id == $of['food']) {
                        $valid_foods += 1;
                        $total_price += intval($of['quantity_ordered']) * intval($f->price);
                        $order_details = new OrderDetails;
                        $order_details->order_id = $order->id;
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
                DB::rollBack();
                $response->setStatus(false);
                $response->setMessage("Invalid request data : Food not valid!");
                $response->setHttpCode(400);
                $response->setData([]);
                return $response->build();
            }
            $order->total_price = $total_price;
            $order->table_id = $request->order_table_number;
            $dinning_table = DiningTables::findOrFail($request->order_table_number);
            $dinning_table->status = 'UNAVALIABLE';
            $dinning_table->update();
            $order->update();
            DB::commit();
            $response->setStatus(true);
            $response->setMessage("Order has been updated");
            $response->setHttpCode(200);
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

    public function delete(Request $request)
    {
        $response = new Response();
        DB::beginTransaction();
        try {
            $order = Order::findOrFail($request->delete_id);
            $order->foods()->detach();
            $dinning_table = DiningTables::findOrFail($order->table_id);
            $dinning_table->status = 'AVALIABLE';
            $dinning_table->update();
            $order->delete();
            DB::commit();
            $response->setStatus(true);
            $response->setMessage("$order->order_number has been canceled");
            $response->setData(null);
            $response->setHttpCode(200);
            return $response->build();
        } catch (ModelNotFoundException $m) {
            DB::rollBack();
            $response->setStatus(false);
            $response->setMessage("Could not delete requested data");
            $response->setHttpCode(400);
            $response->setData(null);
            return $response->build();
        } catch (Throwable $e) {
            DB::rollBack();
            $response->setStatus(false);
            $response->setMessage("Something Went Wrong in the Server");
            $response->setHttpCode(500);
            $response->setData([
                "Details" => $e->getMessage()
            ]);
            return $response->build();
        }
    }

    public function finish(Request $request)
    {
        $response = new Response();
        $paymentCode = Crypt::decryptString($request->payment_code);
        DB::beginTransaction();
        try {
            $order = Order::findOrFail($paymentCode);
            $table = DiningTables::findOrFail($order->table_id);
            $order->status = 'Selesai';
            $table->status = 'AVALIABLE';
            $order->update();
            $table->update();
            DB::commit();
            $response->setStatus(true);
            $response->setMessage("$order->order_number has been finished");
            $response->setData(null);
            $response->setHttpCode(200);
            return $response->build();
        } catch (ModelNotFoundException $m) {
            DB::rollBack();
            $response->setStatus(false);
            $response->setMessage("Could not process request");
            $response->setHttpCode(400);
            $response->setData(null);
            return $response->build();
        } catch (Throwable $e) {
            DB::rollBack();
            $response->setStatus(false);
            $response->setMessage("Something Went Wrong in the Server");
            $response->setHttpCode(500);
            $response->setData([
                "Details" => $e->getMessage()
            ]);
            return $response->build();
        }
    }
}
