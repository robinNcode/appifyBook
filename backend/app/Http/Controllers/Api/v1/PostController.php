<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostValidator;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct(protected PostService $postService) {}

    /**
     * Paginated feed, newest first.
     */
    public function index(Request $request)
    {
        $posts = $this->postService->getFeed($request->user());

        return PostResource::collection($posts);
    }

    /**
     * Create a post with optional image.
     */
    public function store(StorePostValidator $request): JsonResponse
    {
        $post = $this->postService->createPost(
            $request->safe()->only(['content', 'visibility']),
            $request->user(),
            $request->file('image'),
        );

        return (new PostResource($post))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Show a single post.
     */
    public function show(Request $request, Post $post): PostResource
    {
        $post = $this->postService->viewPost($post, $request->user());

        return new PostResource($post);
    }

    /**
     * Delete a post (author only).
     */
    public function destroy(Request $request, Post $post): JsonResponse
    {
        $this->postService->deletePost($post, $request->user());

        return response()->json(['message' => 'Post deleted.']);
    }
}
