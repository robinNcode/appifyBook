<?php

namespace App\Repositories\Contracts;

use App\Models\Like;
use Illuminate\Database\Eloquent\Model;

interface LikeRepositoryInterface
{
    /**
     * Find the current user's like on a likeable model, if any.
     */
    public function findUserLike(Model $likeable, int $userId): ?Like;

    /**
     * Create the current user's like on a likeable model.
     */
    public function createLike(Model $likeable, int $userId): Like;

    /**
     * Remove an existing like.
     */
    public function deleteLike(Like $like): void;

    /**
     * Paginated list of likes (with their user) for a likeable model.
     */
    public function likersOf(Model $likeable);
}
