<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Food;
use App\Models\Response;
use Validator;
use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;
use Throwable;

class FoodController extends Controller
{
    const DEFAULT_IMAGE_FOOD = "foods-placeholder.jpg";

    public function getListFood()
    {
        $response = new Response();
        try {
            $foodList = Food::with(['categories'])->orderBy("foods.name")->get();
            $response->setStatus(true);
            $response->setMessage("success");
            $response->setData($foodList);
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
    public function save(Request $request)
    {

        $validation = Validator::make($request->all(), [
            'food_name' => 'required|string|min:3|max:50|unique:foods,name',
            'food_image' => 'image|mimes:jpeg,png,jpg|max:100',
            'food_price' => 'required|numeric|min:0',
            'food_description' => 'max:100',
            'food_categories' => 'required'
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
        // validate categories
        $reqCategories = explode(",", $request->food_categories);
        $validCategories = null;
        try {
            $validCategories = DB::table('categories')->select('id', 'name')->whereIn('id', $reqCategories)->get();
            if ($validCategories->count() != count($reqCategories)) {
                $response->setStatus(false);
                $response->setMessage("Unprocessable Entity");
                $response->setHttpCode(422);
                $response->setData([
                    'errors' => ['food_categories' => ['The food categories does not exists']]
                ]);
                return $response->build();
            }
        } catch (Throwable $e) {
            $response->setStatus(false);
            $response->setMessage("Could not run categories validation");
            $response->setHttpCode(400);
            $response->setData(null);
            return $response->build();
        }
        // Save
        DB::beginTransaction();

        try {
            $newFood = new Food;
            $newFood->id = Uuid::uuid4()->getHex();
            $newFood->name = $request->food_name;
            $newFood->price = $request->food_price;
            $newFood->description = $request->food_description;
            if ($request->file('food_image')) {
                $imageName = time() . $newFood->name . '.' . $request->file('food_image')->getClientOriginalExtension();
                $request->file('food_image')->move(public_path('/images/foods'), $imageName);
                $newFood->image = $imageName;
            } else {
                $newFood->image = self::DEFAULT_IMAGE_FOOD;
            }
            $newFood->status_stock = "Tidak Tersedia";
            $newFood->save();
            $newFood->categories()->attach($reqCategories);
            DB::commit();
            $response->setStatus(true);
            $response->setMessage("New Food has been added");
            $response->setHttpCode(201);
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

    public function getFoodById($id)
    {
        $response = new Response();
        try {
            $food = Food::with(['categories'])->where('id', '=', $id)->firstOrFail();
            $response->setStatus(true);
            $response->setMessage("success");
            $response->setData($food);
            $response->setHttpCode(200);
            return $response->build();
        } catch (Throwable $e) {
            $response->setStatus(false);
            $response->setMessage("Something Went Wrong in the Server");
            $response->setHttpCode(500);
            $response->setData(null);
            return $response->build();
        }
    }

    public function delete(Request $request)
    {
        DB::beginTransaction();
        $response = new Response();
        try {
            $food = Food::findOrFail($request->delete_id);
            $food->categories()->detach();
            $food->delete();
            DB::commit();
            $response->setStatus(true);
            $response->setMessage("$food->name has been removed from Food List");
            $response->setData(null);
            $response->setHttpCode(200);
            return $response->build();
        } catch (ModelNotFoundException $e) {
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

    public function update(Request $request)
    {

        $food = null;
        $response = new Response();
        try {
            $validation = Validator::make($request->all(), [
                'edit_food_name' => 'required|string|min:3|max:50|unique:foods,name,' . $request->edit_food_id,
                'edit_food_image' => 'image|mimes:jpeg,png,jpg|max:100',
                'edit_food_price' => 'required|numeric|min:0',
                'edit_food_description' => 'max:100',
                'edit_food_categories' => 'required',
                'edit_food_status' => 'required|in:Tersedia,Tidak Tersedia'
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
            $food = Food::find($request->edit_food_id);
        } catch (Throwable $e) {
            $response->setStatus(false);
            $response->setMessage("Could not update requested data");
            $response->setHttpCode(400);
            $response->setData(null);
            return $response->build();
        }

        // validate categories
        $reqCategories = explode(",", $request->edit_food_categories);
        $validCategories = null;
        try {
            $validCategories = DB::table('categories')->select('id', 'name')->whereIn('id', $reqCategories)->get();
            if ($validCategories->count() != count($reqCategories)) {
                $response->setStatus(false);
                $response->setMessage("Unprocessable Entity");
                $response->setHttpCode(422);
                $response->setData([
                    'errors' => ['edit_food_categories' => ['The food categories does not exists']]
                ]);
                return $response->build();
            }
        } catch (QueryException $e) {
            $response->setStatus(false);
            $response->setMessage("Could not run categories validation");
            $response->setHttpCode(400);
            $response->setData(null);
            return $response->build();
        }
        // Update
        DB::beginTransaction();

        try {
            $food->name = $request->edit_food_name;
            $food->price = $request->edit_food_price;
            $food->description = $request->edit_food_description;
            if ($request->file('edit_food_image')) {
                if ($food->image != self::DEFAULT_IMAGE_FOOD) {
                    unlink(public_path('/images/foods/' . $category->image));
                }
                $imageName = time() . $food->name . '.' . $request->file('edit_food_image')->getClientOriginalExtension();
                $request->file('edit_food_image')->move(public_path('/images/foods'), $imageName);
                $food->image = $imageName;
            }
            $food->status_stock = $request->edit_food_status;
            $food->update();
            $food->categories()->sync($reqCategories);
            DB::commit();
            $response->setStatus(true);
            $response->setMessage("The Food has been updated");
            $response->setHttpCode(200);
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
