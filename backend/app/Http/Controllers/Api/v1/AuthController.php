<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginValidator;
use App\Http\Requests\RegistrationValidator;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    // Registration ...
    public function register(RegistrationValidator $request)
    {
        $data = $this->authService->register($request->validated());

        return response()->json([
            'code' => 201,
            'status' => 'success',
            'message' => 'User registered successfully',
            'data' => $data,
        ], 201);
    }

    // Login ...
    public function login(LoginValidator $request)
    {
        $data = $this->authService->login($request->validated());

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'message' => 'User logged in successfully',
            'data' => $data,
        ]);
    }

    // Logout ...
    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'message' => 'User logged out successfully',
        ]);
    }
}
