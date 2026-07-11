<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class InvalidCredentialsException extends Exception
{
    protected $message = 'Invalid credentials';

    public function render(): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
        ], 401);
    }
}
