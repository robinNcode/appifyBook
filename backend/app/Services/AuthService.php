<?php

namespace App\Services;

use App\Exceptions\InvalidCredentialsException;
use App\Models\User;
use App\Repositories\Contracts\AuthRepositoryInterfaces;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Laravolt\Avatar\Facade as Avatar;

class AuthService
{
    protected AuthRepositoryInterfaces $authRepository;

    public function __construct(AuthRepositoryInterfaces $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    public function register(array $data): array
    {
        $user = $this->authRepository->createUser([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        $avatarUrl = $this->createAvatar($user);
        $token = $user->createToken('auth_token')->accessToken;

        return [
            'user' => $user,
            'avatar' => $avatarUrl,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ];
    }

    public function login(array $data): array
    {
        $user = $this->authRepository->findByEmail($data['email']);

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw new InvalidCredentialsException();
        }

        $token = $user->createToken('auth_token')->accessToken;

        return [
            'user' => $user,
            'avatar' => asset('storage/avatars/avatar_' . $user->id . '.png'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ];
    }

    public function logout(User $user): void
    {
        $user->token()->revoke();
    }

    /**
     * Generate and persist the user's default avatar, returning its public URL.
     */
    protected function createAvatar(User $user): string
    {
        $avatar = Avatar::create($user->first_name . ' ' . $user->last_name)->getImageObject();

        $directory = storage_path('app/public/avatars');
        if (! File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }
        $avatar->save($directory . '/avatar_' . $user->id . '.png');

        return asset('storage/avatars/avatar_' . $user->id . '.png');
    }
}
