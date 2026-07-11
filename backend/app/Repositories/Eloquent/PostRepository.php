<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\PostRepositoryInterfaces;
use App\Models\Post;

class PostRepository implements PostRepositoryInterfaces
{
    public function getAllPosts()
    {
        return Post::all();
    }

    public function getPostById(int $id)
    {
        return Post::find($id);
    }

    public function createPost(array $data)
    {
        return Post::create($data);
    }

    public function updatePost(int $id, array $data)
    {
        $post = Post::find($id);
        $post->update($data);
        return $post;
    }

    public function deletePost(int $id)
    {
        $post = Post::find($id);
        $post->delete();
        return $post;
    }
}