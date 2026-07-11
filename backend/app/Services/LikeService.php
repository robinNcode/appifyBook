<?php

namespace App\Services;

use App\Repositories\Contracts\LikeRepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class LikeService
{
    public function __construct(
        protected LikeRepositoryInterface $likeRepository,
    ) {}

    /**
     * Toggle the given user's like on any likeable model, keeping the
     * denormalized likes_count column consistent inside a transaction.
     *
     * @return array{liked: bool, likes_count: int}
     */
    public function toggle(Model $likeable, int $userId): array
    {
        $liked = DB::transaction(function () use ($likeable, $userId) {
            $existing = $this->likeRepository->findUserLike($likeable, $userId);

            if ($existing) {
                $this->likeRepository->deleteLike($existing);
                $likeable->decrement('likes_count');

                return false;
            }

            $this->likeRepository->createLike($likeable, $userId);
            $likeable->increment('likes_count');

            return true;
        });

        return [
            'liked' => $liked,
            'likes_count' => (int) $likeable->fresh()->likes_count,
        ];
    }

    /**
     * Paginated list of likes (with their user) for a likeable model.
     */
    public function listLikers(Model $likeable)
    {
        return $this->likeRepository->likersOf($likeable);
    }
}
