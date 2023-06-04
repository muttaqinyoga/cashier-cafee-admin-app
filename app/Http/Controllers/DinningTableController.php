<?php

namespace App\Http\Controllers;

use App\Models\DiningTables;
use App\Models\Response;
use Illuminate\Http\Request;
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
}
