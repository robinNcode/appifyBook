<?php

namespace App\Services;

use App\Models\Post;
use App\Models\User;
use App\Repositories\Contracts\PostRepositoryInterface;
use Illuminate\Http\UploadedFile;

class PostService
{
    protected PostRepositoryInterface $postRepository;

    public function __construct(PostRepositoryInterface $postRepository)
    {
        $this->postRepository = $postRepository;
    }

    /**
     * Paginated feed visible to the given user.
     */
    public function getFeed(User $user)
    {
        return $this->postRepository->feedFor($user);
    }

    /**
     * Create a post for the author, storing the optional image.
     */
    public function createPost(array $data, User $author, ?UploadedFile $image = null): Post
    {
        $data['user_id'] = $author->id;

        if ($image) {
            $data['image_path'] = $image->store('posts', 'public');
        }

        $post = $this->postRepository->create($data);
        $post->load('user');
        // Fresh post: viewer has no like yet.
        $post->setRelation('likes', collect());

        return $post;
    }

    /**
     * Load a single post for viewing, enforcing visibility.
     */
    public function viewPost(Post $post, User $user): Post
    {
        $this->authorizeView($post, $user);

        return $this->postRepository->loadForView($post, $user->id);
    }

    /**
     * Delete a post (author only).
     */
    public function deletePost(Post $post, User $user): void
    {
        abort_unless($post->user_id === $user->id, 403, 'You cannot delete this post.');

        $this->postRepository->delete($post);
    }

    /**
     * Guard: a private post is only viewable by its author.
     */
    public function authorizeView(Post $post, ?User $user): void
    {
        abort_unless($post->isViewableBy($user), 403, 'This post is private.');
    }
}
