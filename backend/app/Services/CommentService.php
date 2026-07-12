<?php

namespace App\Services;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use App\Repositories\Contracts\CommentRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class CommentService
{
    public function __construct(
        protected CommentRepositoryInterface $commentRepository,
        protected PostService $postService,
    ) {}

    /**
     * Paginated top-level comments (with replies) of a post the user may view.
     */
    public function listForPost(Post $post, User $user)
    {
        $this->postService->authorizeView($post, $user);

        return $this->commentRepository->topLevelForPost($post, $user->id);
    }

    /**
     * Create a comment (or reply) and keep denormalized counters in sync.
     */
    public function create(Post $post, array $data, User $user, ?UploadedFile $image = null): Comment
    {
        $this->postService->authorizeView($post, $user);

        if ($image) {
            $data['image_path'] = $image->store('comments', 'public');
        }

        $comment = DB::transaction(function () use ($post, $data, $user) {
            $comment = $this->commentRepository->createForPost($post, $data, $user->id);

            $this->commentRepository->incrementPostCommentsCount($post->id);
            if ($comment->parent_id) {
                $this->commentRepository->incrementRepliesCount($comment->parent_id);
            }

            return $comment;
        });

        return $this->commentRepository->loadForView($comment, $user->id);
    }

    /**
     * Delete a comment (author only), adjusting counters for it and any replies.
     */
    public function delete(Comment $comment, User $user): void
    {
        abort_unless($comment->user_id === $user->id, 403, 'You cannot delete this comment.');

        DB::transaction(function () use ($comment) {
            // A top-level comment also removes its replies (cascade); adjust counters.
            $removed = 1 + ($comment->parent_id ? 0 : $comment->replies_count);

            $this->commentRepository->decrementPostCommentsCount($comment->post_id, $removed);

            if ($comment->parent_id) {
                $this->commentRepository->decrementRepliesCount($comment->parent_id);
            }

            $this->commentRepository->delete($comment);
        });
    }
}
