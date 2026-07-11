<?php

namespace App\Repositories\Eloquent;

use App\Models\Post;
use App\Models\User;
use App\Repositories\Contracts\PostRepositoryInterface;

class PostRepository implements PostRepositoryInterface
{
    /**
     * Cursor-paginated feed, newest first. Uses the (visibility, id) index so
     * performance stays constant regardless of table size. `likes` is
     * constrained to the viewer so the collection doubles as like-state.
     */
    public function feedFor(User $user)
    {
        return Post::query()
            ->visibleTo($user)
            ->with([
                'user',
                'likes' => fn ($q) => $q->where('user_id', $user->id),
            ])
            ->latest('id')
            ->cursorPaginate(10);
    }

    public function create(array $data): Post
    {
        return Post::create($data);
    }

    public function loadForView(Post $post, int $userId): Post
    {
        return $post->load([
            'user',
            'likes' => fn ($q) => $q->where('user_id', $userId),
        ]);
    }

    public function delete(Post $post): void
    {
        $post->delete();
    }
}
