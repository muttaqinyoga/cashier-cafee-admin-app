<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;
use Throwable;
use App\Models\Response;
use Validator;
use Str;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CategoryController extends Controller
{
    const DEFAULT_IMAGE_CATEGORY = 'categories-placeholder.png';

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
            $response->setData(null);
        }
        return $response->build();
    }

    public function save(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'category_name' => 'required|string|min:3|max:50|unique:categories,name',
            'category_image' => 'image|mimes:jpeg,png,jpg|max:100'
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
            $newCategory = new Category;
            $newCategory->id = Uuid::uuid4()->getHex();
            $newCategory->name = $request->category_name;
            $newCategory->slug = Str::slug($request->category_name, '-');
            if ($request->file('category_image')) {
                $imageName = time() . $newCategory->slug . '.' . $request->file('category_image')->getClientOriginalExtension();
                $request->file('category_image')->move(public_path('/images/categories'), $imageName);
                $newCategory->image = $imageName;
            } else {
                $newCategory->image = self::DEFAULT_IMAGE_CATEGORY;
            }
            $newCategory->save();
            $response->setStatus(true);
            $response->setMessage("New Category added");
            $response->setHttpCode(201);
            $response->setData(null);
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
            $category->slug = Str::slug($request->category_edit_name, '-');
            if ($request->file('category_edit_image')) {
                if ($category->image != self::DEFAULT_IMAGE_CATEGORY) {
                    unlink(public_path('/images/categories/' . $category->image));
                }
                $imageName = time() . $category->slug . '.' . $request->file('category_edit_image')->getClientOriginalExtension();
                $request->file('category_edit_image')->move(public_path('/images/categories'), $imageName);
                $category->image = $imageName;
            }
            $category->update();
            $response->setStatus(true);
            $response->setMessage("Category has been updated");
            $response->setHttpCode(200);
            $response->setData(null);
            return $response->build();
        } catch (ModelNotFoundException $e) {
            $response->setStatus(false);
            $response->setMessage("Requested data not found");
            $response->setHttpCode(400);
            $response->setData(null);
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

    public function delete(Request $request)
    {
        $response = new Response();
        try {
            $category = Category::findOrFail($request->delete_id);
            if ($category->image != self::DEFAULT_IMAGE_CATEGORY) {
                unlink(public_path('/images/categories/' . $category->image));
            }
            $category->delete();
            $response->setStatus(true);
            $response->setMessage("$category->name has been removed from Category List");
            $response->setHttpCode(200);
            $response->setData(null);
            return $response->build();
        } catch (ModelNotFoundException $e) {
            $response->setStatus(false);
            $response->setMessage("Could not delete requested data");
            $response->setHttpCode(400);
            $response->setData(null);
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
}
