<?php 

namespace App\Services;

use App\Repositories\Eloquent\PostRepository;

class PostService
{
    protected PostRepository $postRepository;

    public function __construct(PostRepository $postRepository)
    {
        $this->postRepository = $postRepository;
    }

    public function getAllPosts()
    {
        return $this->postRepository->getAllPosts();
    }

    public function getPostById(int $id)
    {
        return $this->postRepository->getPostById($id);
    }

    public function createPost(array $data)
    {
        return $this->postRepository->createPost($data);
    }

    public function updatePost(int $id, array $data)
    {
        return $this->postRepository->updatePost($id, $data);
    }

    public function deletePost(int $id)
    {
        return $this->postRepository->deletePost($id);
    }
}
