<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Services\LikeService;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function __construct(
        protected LikeService $likeService,
        protected PostService $postService,
    ) {}

    public function togglePost(Request $request, Post $post): JsonResponse
    {
        $this->postService->authorizeView($post, $request->user());

        return response()->json(
            $this->likeService->toggle($post, $request->user()->id)
        );
    }

    public function toggleComment(Request $request, Comment $comment): JsonResponse
    {
        $this->postService->authorizeView($comment->post, $request->user());

        return response()->json(
            $this->likeService->toggle($comment, $request->user()->id)
        );
    }

    public function postLikers(Request $request, Post $post)
    {
        $this->postService->authorizeView($post, $request->user());

        return $this->likers($post);
    }

    public function commentLikers(Request $request, Comment $comment)
    {
        $this->postService->authorizeView($comment->post, $request->user());

        return $this->likers($comment);
    }

    /**
     * Paginated list of users who liked the given likeable model.
     */
    private function likers($likeable)
    {
        $likers = $this->likeService->listLikers($likeable);

        return UserResource::collection(
            $likers->through(fn (Like $like) => $like->user)
        );
    }
}
