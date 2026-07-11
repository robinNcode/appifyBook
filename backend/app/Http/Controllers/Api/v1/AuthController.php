<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegistrationValidator;
use Laravolt\Avatar\Facade as Avatar;
use Illuminate\Support\Facades\File;

class AuthController extends Controller
{
    // Registration ...
    public function register(RegistrationValidator $request)
    {
        try {
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }

        // Store avatar in storage
        $avatar = Avatar::create($request->first_name . ' ' . $request->last_name)->getImageObject();
        $directory = storage_path('app/public/avatars');
        if (! File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }
        $avatar->save($directory . '/avatar_' . $user->id . '.png');

        $token = $user->createToken('auth_token')->accessToken;
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}
