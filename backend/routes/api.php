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
        // Auth
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Posts / feed
        Route::get('/posts', [PostController::class, 'index']);
        Route::post('/posts', [PostController::class, 'store']);
        Route::get('/posts/{post}', [PostController::class, 'show']);
        Route::delete('/posts/{post}', [PostController::class, 'destroy']);

        // Comments & replies
        Route::get('/posts/{post}/comments', [CommentController::class, 'index']);
        Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
        Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

        // Likes (posts, comments & replies) + who liked
        Route::post('/posts/{post}/like', [LikeController::class, 'togglePost']);
        Route::get('/posts/{post}/likers', [LikeController::class, 'postLikers']);
        Route::post('/comments/{comment}/like', [LikeController::class, 'toggleComment']);
        Route::get('/comments/{comment}/likers', [LikeController::class, 'commentLikers']);
    });
});
