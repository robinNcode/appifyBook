<?php

namespace App\Repositories\Contracts;

interface PostRepositoryInterfaces
{
    public function getAllPosts();
    public function getPostById(int $id);
    public function createPost(array $data);
    public function updatePost(int $id, array $data);
    public function deletePost(int $id);
}