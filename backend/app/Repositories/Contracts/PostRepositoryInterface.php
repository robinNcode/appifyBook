<?php

namespace App\Repositories\Contracts;

use App\Models\Post;
use App\Models\User;

interface PostRepositoryInterface
{
    /**
     * Paginated feed of posts visible to the given user, newest first, with
     * the author and the viewer's like-state eager loaded.
     */
    public function feedFor(User $user);

    /**
     * Persist a new post from the given attributes.
     */
    public function create(array $data): Post;

    /**
     * Eager load a single post for display (author + viewer's like-state).
     */
    public function loadForView(Post $post, int $userId): Post;

    /**
     * Delete a post (cascades to comments/likes via FK constraints).
     */
    public function delete(Post $post): void;
}
