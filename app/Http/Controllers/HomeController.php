<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use App\Models\Response;
use App\Models\User;

class HomeController extends Controller
{
    // public function __invoke()
    // {
    //     return view('test-spa');
    // }
    public function index()
    {
        return view('app');
    }

    public function updatePassword(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'oldPassword' => 'required',
            'newPassword' => 'required|string|min:3'
        ]);

        $response = new Response();
        if ($validation->fails()) {
            $response->setStatus(false);
            $response->setMessage("Validation error! Please check your request field");
            $response->setHttpCode(422);
            $response->setData($request->all());
            return $response->build();
        }
        $credentials = [
            'username' => Auth::user()->username,
            'password' => $request->oldPassword
        ];

        if (Auth::attempt($credentials)) {
            $user = User::findOrfail(Auth::user()->id);
            $user->password = bcrypt($request->newPassword);
            $user->update();
            $response->setStatus(true);
            $response->setMessage("Password succesfully changed!");
            $response->setHttpCode(200);
            $response->setData(null);
            return $response->build();
        }

        $response->setStatus(false);
        $response->setMessage("Current Password is incorrect!");
        $response->setHttpCode(422);
        $response->setData(null);
        return $response->build();
    }
}
