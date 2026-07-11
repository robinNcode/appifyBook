<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\AuthRepositoryInterfaces;

class AuthRepository implements AuthRepositoryInterfaces
{
    public function createUser(array $data): User
    {
        // Password is hashed by the User model's 'hashed' cast.
        return User::create($data);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function setAvatar(User $user, string $path): User
    {
        $user->avatar = $path;
        $user->save();

        return $user;
    }
}
