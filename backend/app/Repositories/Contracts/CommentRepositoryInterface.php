<?php

namespace App\Repositories\Contracts;

use App\Models\Comment;
use App\Models\Post;

interface CommentRepositoryInterface
{
    /**
     * Paginated top-level comments of a post with their replies, authors and
     * the viewer's like-state eager loaded (oldest first).
     */
    public function topLevelForPost(Post $post, int $userId);

    /**
     * Create a comment (or reply when parent_id is present) on a post.
     */
    public function createForPost(Post $post, array $data, int $userId): Comment;

    /**
     * Eager load a comment for display (author + viewer's like-state).
     */
    public function loadForView(Comment $comment, int $userId): Comment;

    public function incrementPostCommentsCount(int $postId, int $amount = 1): void;

    public function decrementPostCommentsCount(int $postId, int $amount = 1): void;

    public function incrementRepliesCount(int $commentId): void;

    public function decrementRepliesCount(int $commentId): void;

    public function delete(Comment $comment): void;
}
