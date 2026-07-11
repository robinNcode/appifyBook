<?php

namespace App\Providers;

use App\Repositories\Contracts\AuthRepositoryInterfaces;
use App\Repositories\Contracts\CommentRepositoryInterface;
use App\Repositories\Contracts\LikeRepositoryInterface;
use App\Repositories\Contracts\PostRepositoryInterface;
use App\Repositories\Eloquent\AuthRepository;
use App\Repositories\Eloquent\CommentRepository;
use App\Repositories\Eloquent\LikeRepository;
use App\Repositories\Eloquent\PostRepository;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AuthRepositoryInterfaces::class, AuthRepository::class);
        $this->app->bind(PostRepositoryInterface::class, PostRepository::class);
        $this->app->bind(CommentRepositoryInterface::class, CommentRepository::class);
        $this->app->bind(LikeRepositoryInterface::class, LikeRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Passport::loadKeysFrom(__DIR__ . '/../../storage');
    }
}
