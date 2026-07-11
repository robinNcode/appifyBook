<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'image_url' => $this->image_path
                ? asset('storage/'.$this->image_path)
                : null,
            'visibility' => $this->visibility,
            'likes_count' => (int) $this->likes_count,
            'comments_count' => (int) $this->comments_count,
            // `likes` is eager-loaded constrained to the current user only,
            // so its presence signals the viewer's like state.
            'liked_by_me' => $this->relationLoaded('likes') && $this->likes->isNotEmpty(),
            'is_owner' => $request->user() && $request->user()->id === $this->user_id,
            'author' => new UserResource($this->whenLoaded('user')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_human' => $this->created_at?->diffForHumans(),
        ];
    }
}
