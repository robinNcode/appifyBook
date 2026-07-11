<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\CommentController;
use App\Http\Controllers\Api\v1\LikeController;
use App\Http\Controllers\Api\v1\PostController;

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

        // Posts
        Route::apiResource('posts', PostController::class)
            ->only(['index', 'store', 'show', 'destroy']);

        // Comments
        Route::get('posts/{post}/comments', [CommentController::class, 'index'])->name('comments.index');
        Route::post('posts/{post}/comments', [CommentController::class, 'store'])->name('comments.store');
        Route::delete('comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

        // Likes
        Route::post('posts/{post}/like', [LikeController::class, 'togglePost'])->name('posts.like');
        Route::post('comments/{comment}/like', [LikeController::class, 'toggleComment'])->name('comments.like');
        Route::get('posts/{post}/likers', [LikeController::class, 'postLikers'])->name('posts.likers');
        Route::get('comments/{comment}/likers', [LikeController::class, 'commentLikers'])->name('comments.likers');
    });
});
