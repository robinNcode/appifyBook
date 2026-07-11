<?php

namespace App\Providers;

use App\Repositories\Contracts\AuthRepositoryInterfaces;
use App\Repositories\Eloquent\AuthRepository;
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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Passport::loadKeysFrom(__DIR__ . '/../../storage');
    }
}
