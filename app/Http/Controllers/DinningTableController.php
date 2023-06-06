<?php

namespace App\Http\Controllers;

use App\Models\DiningTables;
use App\Models\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;
use Validator;
use Throwable;

class DinningTableController extends Controller
{
    public function getAllTables()
    {
        $response = new Response();
        try {
            $dinningTables = DiningTables::orderBy('number')->get();
            $response->setStatus(true);
            $response->setHttpCode(200);
            $response->setMessage('success');
            $response->setData($dinningTables);

            return $response->build();
        } catch (Throwable $th) {
            $response->setStatus(false);
            $response->setHttpCode(500);
            $response->setMessage('Something went wrong in the Server');
            $response->setData([
                'Details' => $th->getMessage()
            ]);
            return $response->build();
        }
    }

    public function save(Request $request)
    {
        $response = new Response();
        $validation = Validator::make($request->all(), [
            'dinning_table_number' => 'required|numeric|min:1|unique:dining_tables,number'
        ]);
        if ($validation->fails()) {
            $response->setStatus(false);
            $response->setMessage("Unprocessable Entity");
            $response->setHttpCode(422);
            $response->setData([
                'errors' => $validation->errors()
            ]);
            return $response->build();
        }

        try {
            $dinningTable = new DiningTables;
            $dinningTable->id = Uuid::uuid4()->getHex();
            $dinningTable->number = $request->dinning_table_number;
            $dinningTable->save();

            $response->setStatus(true);
            $response->setHttpCode(201);
            $response->setMessage("New Dinning Table has been added");
            $response->setData(null);

            return $response->build();
        } catch (Throwable $th) {
            $response->setStatus(false);
            $response->setHttpCode(500);
            $response->setMessage('Something went wrong in the Server');
            $response->setData([
                'Details' => $th->getMessage()
            ]);
            return $response->build();
        }
    }

    public function update(Request $request)
    {
        $response = new Response();
        try {
            $dinningTable = DiningTables::with(['order'])->where('id', '=', $request->dinning_table_edit_id)->firstOrFail();
            $activeTable = false;
            foreach ($dinningTable->order as $o) {
                if ($o->status == 'Proses') {
                    $activeTable = true;
                }
            }
            if ($activeTable) {
                $response->setStatus(false);
                $response->setHttpCode(400);
                $response->setMessage('Selected dinning table has an active order');
                $response->setData(null);
                return $response->build();
            }
            $dinningTable->number = $request->dinning_table_edit_number;
            $dinningTable->status = $request->edit_food_status;
            $dinningTable->update();
            $response->setStatus(true);
            $response->setHttpCode(200);
            $response->setMessage("Dinning Table has been updated");
            $response->setData(null);

            return $response->build();
        } catch (ModelNotFoundException $m) {
            $response->setStatus(false);
            $response->setHttpCode(404);
            $response->setMessage('Could not find dinning table');
            $response->setData([
                'Details' => $m->getMessage()
            ]);
            return $response->build();
        } catch (Throwable $th) {
            $response->setStatus(false);
            $response->setHttpCode(500);
            $response->setMessage('Something went wrong in the Server');
            $response->setData([
                'Details' => $th->getMessage()
            ]);
            return $response->build();
        }
    }

    public function delete(Request $request)
    {
        $response = new Response();
        try {
            $dinningTable = DiningTables::with(['order'])->where('id', '=', $request->delete_id)->firstOrFail();
            $activeTable = false;
            foreach ($dinningTable->order as $o) {
                if ($o->status == 'Proses') {
                    $activeTable = true;
                }
            }
            if ($activeTable) {
                $response->setStatus(false);
                $response->setHttpCode(400);
                $response->setMessage('Selected dinning table has an active order');
                $response->setData(null);
                return $response->build();
            }
            $dinningTable->delete();
            $response->setStatus(true);
            $response->setHttpCode(200);
            $response->setMessage("Dinning Table has been deleted");
            $response->setData(null);

            return $response->build();
        } catch (Throwable $th) {
            $response->setStatus(false);
            $response->setHttpCode(500);
            $response->setMessage('Something went wrong in the Server : ' . $th->getMessage());
            $response->setData([
                'Details' => $th->getMessage()
            ]);
            return $response->build();
        }
    }
}
