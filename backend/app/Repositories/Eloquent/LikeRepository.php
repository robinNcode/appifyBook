<?php

namespace App\Repositories\Eloquent;

use App\Models\Like;
use App\Repositories\Contracts\LikeRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class LikeRepository implements LikeRepositoryInterface
{
    public function findUserLike(Model $likeable, int $userId): ?Like
    {
        return $likeable->likes()->where('user_id', $userId)->first();
    }

    public function createLike(Model $likeable, int $userId): Like
    {
        return $likeable->likes()->create(['user_id' => $userId]);
    }

    public function deleteLike(Like $like): void
    {
        $like->delete();
    }

    public function likersOf(Model $likeable)
    {
        return $likeable->likes()
            ->with('user')
            ->latest('id')
            ->paginate(20);
    }
}
