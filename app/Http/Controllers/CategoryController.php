<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;
use Throwable;
use App\Models\Response;
use Validator;

class CategoryController extends Controller
{
    const DEFAULT_IMAGE_CATEGORY = 'category-foods.png';

    public function index()
    {
        return view('categories/index');
    }
    public function getListCategory()
    {
        $response = new Response();
        try {
            $categories = Category::orderBy('name')->get();
            $response->setStatus(true);
            $response->setMessage("success");
            $response->setData($categories);
            $response->setHttpCode(200);
        } catch (Throwable $e) {
            $response->setStatus(false);
            $response->setMessage("Something Went Wrong in the Server");
            $response->setHttpCode(500);
            $response->setData([]);
        }
        return $response->build();
    }



    public function save(Request $request)
    {
        $validation = \Validator::make($request->all(), [
            'category_name' => 'required|string|min:3|max:50|unique:categories,name',
            'category_image' => 'image|mimes:jpeg,png,jpg|max:100'
        ]);
        if ($validation->fails()) {
            return response()->json(['status' => 'failed', 'errors' => $validation->errors()], 400);
        }
        try {
            $newCategory = new Category;
            $newCategory->id = Uuid::uuid4()->getHex();
            $newCategory->name = $request->category_name;
            $newCategory->slug = \Str::slug($request->category_name, '-');
            if ($request->file('category_image')) {
                $imageName = time() . $newCategory->slug . '.' . $request->file('category_image')->getClientOriginalExtension();
                $request->file('category_image')->move(public_path('/images/categories'), $imageName);
                $newCategory->image = $imageName;
            } else {
                $newCategory->image = self::DEFAULT_IMAGE_CATEGORY;
            }
            $newCategory->save();
            return response()->json(['status' => 'created', 'message' => 'New category added'], 201);
        } catch (Throwable $e) {
            return response()->json(['status' => 'failed', 'message' => 'Could not save input request'], 500);
        }
    }

    public function update(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'category_edit_name' => 'required|string|min:3|max:50|unique:categories,name,' . $request->category_edit_id . ',id',
            'category_edit_image' => 'image|mimes:jpeg,png,jpg|max:100'
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
        try {

            $category = Category::findOrFail($request->category_edit_id);
            $category->name = $request->category_edit_name;
            $category->slug = \Str::slug($request->category_edit_name, '-');
            if ($request->file('category_edit_image')) {
                if ($category->image != self::DEFAULT_IMAGE_CATEGORY) {
                    unlink(public_path('/images/categories/' . $category->image));
                }
                $imageName = time() . $category->slug . '.' . $request->file('category_edit_image')->getClientOriginalExtension();
                $request->file('category_edit_image')->move(public_path('/images/categories'), $imageName);
                $category->image = $imageName;
            }
            $category->update();
            return response()->json(['status' => 'success', 'message' => 'Category has beens updated'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['status' => 'failed', 'message' => 'Could not update requested data'], 400);
        } catch (Throwable $e) {
            return response()->json(['status' => 'failed', 'message' => 'Something Went Wrong in the Server'], 500);
        }
    }

    public function delete(Request $request)
    {
        try {
            $category = Category::findOrFail($request->delete_id);
            $category->delete();
            return response()->json(['status' => 'success', 'message' => "$category->name has been deleted"]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['status' => 'failed', 'message' => 'Could not delete requested data'], 400);
        } catch (QueryException $e) {
            return response()->json(['status' => 'failed', 'message' => 'Could not delete because this category had references to other data'], 500);
        }
    }
}
