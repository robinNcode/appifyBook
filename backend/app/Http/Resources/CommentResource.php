<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'post_id' => $this->post_id,
            'parent_id' => $this->parent_id,
            'content' => $this->content,
            'likes_count' => (int) $this->likes_count,
            'replies_count' => (int) $this->replies_count,
            'liked_by_me' => $this->relationLoaded('likes') && $this->likes->isNotEmpty(),
            'is_owner' => $request->user() && $request->user()->id === $this->user_id,
            'author' => new UserResource($this->whenLoaded('user')),
            'replies' => CommentResource::collection($this->whenLoaded('replies')),
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_human' => $this->created_at?->diffForHumans(),
        ];
    }
}
