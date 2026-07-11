<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentValidator;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;
use App\Services\CommentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct(protected CommentService $commentService) {}

    /**
     * List top-level comments of a post with their replies.
     */
    public function index(Request $request, Post $post)
    {
        $comments = $this->commentService->listForPost($post, $request->user());

        return CommentResource::collection($comments);
    }

    /**
     * Create a comment (or a reply when parent_id is present).
     */
    public function store(StoreCommentValidator $request, Post $post): JsonResponse
    {
        $comment = $this->commentService->create(
            $post,
            $request->validated(),
            $request->user(),
        );

        return (new CommentResource($comment))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Delete a comment (author only).
     */
    public function destroy(Request $request, Comment $comment): JsonResponse
    {
        $this->commentService->delete($comment, $request->user());

        return response()->json(['message' => 'Comment deleted.']);
    }
}
