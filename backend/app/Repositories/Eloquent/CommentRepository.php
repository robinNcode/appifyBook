<?php

namespace App\Repositories\Eloquent;

use App\Models\Comment;
use App\Models\Post;
use App\Repositories\Contracts\CommentRepositoryInterface;

class CommentRepository implements CommentRepositoryInterface
{
    public function topLevelForPost(Post $post, int $userId)
    {
        $likeState = fn ($q) => $q->where('user_id', $userId);

        return $post->comments()
            ->with([
                'user',
                'likes' => $likeState,
                'replies' => fn ($q) => $q->with([
                    'user',
                    'likes' => $likeState,
                ])->oldest('id'),
            ])
            ->oldest('id')
            ->paginate(15);
    }

    public function createForPost(Post $post, array $data, int $userId): Comment
    {
        $comment = $post->comments()->make([
            'content' => $data['content'] ?? null,
            'image_path' => $data['image_path'] ?? null,
            'parent_id' => $data['parent_id'] ?? null,
        ]);
        $comment->user_id = $userId;
        // Bypass the whereNull('parent_id') scope on the relation for replies.
        $comment->post_id = $post->id;
        $comment->save();

        return $comment;
    }

    public function loadForView(Comment $comment, int $userId): Comment
    {
        return $comment->load([
            'user',
            'likes' => fn ($q) => $q->where('user_id', $userId),
        ]);
    }

    public function incrementPostCommentsCount(int $postId, int $amount = 1): void
    {
        Post::where('id', $postId)->increment('comments_count', $amount);
    }

    public function decrementPostCommentsCount(int $postId, int $amount = 1): void
    {
        Post::where('id', $postId)->decrement('comments_count', $amount);
    }

    public function incrementRepliesCount(int $commentId): void
    {
        Comment::where('id', $commentId)->increment('replies_count');
    }

    public function decrementRepliesCount(int $commentId): void
    {
        Comment::where('id', $commentId)->decrement('replies_count');
    }

    public function delete(Comment $comment): void
    {
        $comment->delete();
    }
}
