<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\PostService;
use App\Http\Requests\StorePostValidator;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\JsonResponse;

class PostController extends Controller
{
    protected PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    /**
     * Paginated feed, newest first.
     *
     * Uses cursor pagination + the (visibility, id) index so performance stays
     * constant regardless of how many millions of posts exist.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $posts = Post::query()
            ->visibleTo($user)
            ->with([
                'user',
                // Constrain to the viewer so the collection doubles as like-state.
                'likes' => fn ($q) => $q->where('user_id', $user->id),
            ])
            ->latest('id')
            ->cursorPaginate(10);

        return PostResource::collection($posts);
    }

    /**
     * Create a post with optional image.
     */
    public function store(StorePostValidator $request): JsonResponse
    {
        $data = $request->safe()->only(['content', 'visibility']);
        $data['user_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('posts', 'public');
        }

        $post = Post::create($data);
        $post->load('user');
        $post->setRelation('likes', collect());

        return (new PostResource($post))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Show a single post.
     */
    public function show(Request $request, Post $post): PostResource
    {
        $this->authorizeView($request, $post);

        $user = $request->user();
        $post->load([
            'user',
            'likes' => fn ($q) => $q->where('user_id', $user->id),
        ]);

        return new PostResource($post);
    }

    /**
     * Delete a post (author only).
     */
    public function destroy(Request $request, Post $post): JsonResponse
    {
        abort_unless($post->user_id === $request->user()->id, 403, 'You cannot delete this post.');

        $post->delete();

        return response()->json(['message' => 'Post deleted.']);
    }

    /**
     * Guard: a private post is only viewable by its author.
     */
    private function authorizeView(Request $request, Post $post): void
    {
        if ($post->visibility === 'private' && $post->user_id !== $request->user()->id) {
            abort(403, 'This post is private.');
        }
    }
}
