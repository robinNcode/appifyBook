<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'name' => $this->name,
            'email' => $this->when(
                $request->user() && $request->user()->id === $this->id,
                $this->email
            ),
            'avatar_url' => $this->avatar ? asset('storage/'.$this->avatar) : null,
        ];
    }
}
