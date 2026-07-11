<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\AuthController;

// Guest urls
Route::get('/', function () {
    return response()->json([
        'message' => 'Welcome to the API',
    ]);
})->name('home');

// Route::get('login', function () {
//     return response()->json([
//         'code' => 401,
//         'status' => 'error',
//         'message' => 'Please login to continue',
//     ]);
// })->name('login');

// Route::get('register', function () {
//     return response()->json([
//         'code' => 401,
//         'status' => 'error',
//         'message' => 'Please register to continue',
//     ]);
// })->name('register');

Route::prefix('v1')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');

    Route::middleware('auth:api')->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    });
});
