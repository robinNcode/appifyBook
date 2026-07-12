<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Passport\Passport;
use Tests\TestCase;

class CommentImageTest extends TestCase
{
    use RefreshDatabase;

    private function makePost(User $user): Post
    {
        return Post::create([
            'user_id' => $user->id,
            'content' => 'A post',
            'visibility' => 'public',
        ]);
    }

    public function test_a_comment_can_be_created_with_an_image(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $post = $this->makePost($user);
        Passport::actingAs($user);

        $response = $this->postJson("/api/v1/posts/{$post->id}/comments", [
            'content' => 'nice photo',
            'image' => UploadedFile::fake()->image('shot.png'),
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.content', 'nice photo')
            ->assertJsonPath('data.image_url', fn ($url) => is_string($url) && str_contains($url, '/storage/comments/'));

        $this->assertDatabaseCount('comments', 1);
        // The stored file lives under the public disk's comments/ directory.
        $this->assertNotEmpty(Storage::disk('public')->files('comments'));
    }

    public function test_a_comment_can_be_image_only(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $post = $this->makePost($user);
        Passport::actingAs($user);

        $response = $this->postJson("/api/v1/posts/{$post->id}/comments", [
            'image' => UploadedFile::fake()->image('shot.png'),
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.content', null)
            ->assertJsonPath('data.image_url', fn ($url) => is_string($url) && $url !== '');
    }

    public function test_a_comment_requires_text_or_image(): void
    {
        $user = User::factory()->create();
        $post = $this->makePost($user);
        Passport::actingAs($user);

        $this->postJson("/api/v1/posts/{$post->id}/comments", [])
            ->assertStatus(422)
            ->assertJsonPath('errors.content.0', 'A comment must have text or an image.');
    }

    public function test_a_non_image_upload_is_rejected(): void
    {
        $user = User::factory()->create();
        $post = $this->makePost($user);
        Passport::actingAs($user);

        $this->postJson("/api/v1/posts/{$post->id}/comments", [
            'content' => 'hi',
            'image' => UploadedFile::fake()->create('notes.pdf', 100, 'application/pdf'),
        ])->assertStatus(422)->assertJsonPath('errors.image.0', 'The uploaded file must be an image.');
    }

    public function test_a_reply_can_be_created_under_a_comment(): void
    {
        $user = User::factory()->create();
        $post = $this->makePost($user);
        Passport::actingAs($user);

        $parent = $this->postJson("/api/v1/posts/{$post->id}/comments", [
            'content' => 'top level',
        ])->json('data');

        $this->postJson("/api/v1/posts/{$post->id}/comments", [
            'content' => 'a reply',
            'parent_id' => $parent['id'],
        ])->assertCreated()->assertJsonPath('data.parent_id', $parent['id']);

        // The post counts every comment and reply; the parent tracks its replies.
        $this->assertDatabaseHas('posts', ['id' => $post->id, 'comments_count' => 2]);
        $this->assertDatabaseHas('comments', ['id' => $parent['id'], 'replies_count' => 1]);
    }

    public function test_comments_are_listed_paginated_with_replies(): void
    {
        $user = User::factory()->create();
        $post = $this->makePost($user);
        Passport::actingAs($user);

        $parent = $this->postJson("/api/v1/posts/{$post->id}/comments", [
            'content' => 'top level',
        ])->json('data');

        $this->postJson("/api/v1/posts/{$post->id}/comments", [
            'content' => 'a reply',
            'parent_id' => $parent['id'],
        ]);

        // The frontend Paginated<T> type relies on this exact envelope.
        $this->getJson("/api/v1/posts/{$post->id}/comments")
            ->assertOk()
            ->assertJsonStructure([
                'data' => [['id', 'content', 'image_url', 'likes_count', 'replies_count', 'liked_by_me', 'is_owner', 'author', 'replies']],
                'links' => ['first', 'last', 'prev', 'next'],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ])
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.replies.0.content', 'a reply')
            ->assertJsonPath('meta.total', 1);
    }

    public function test_a_comment_can_be_deleted_by_its_author_and_adjusts_counts(): void
    {
        $user = User::factory()->create();
        $post = $this->makePost($user);
        Passport::actingAs($user);

        $parent = $this->postJson("/api/v1/posts/{$post->id}/comments", [
            'content' => 'top level',
        ])->json('data');
        $this->postJson("/api/v1/posts/{$post->id}/comments", [
            'content' => 'a reply',
            'parent_id' => $parent['id'],
        ]);

        // Deleting the top-level comment cascades to its reply (comments_count 2 -> 0).
        $this->deleteJson("/api/v1/comments/{$parent['id']}")->assertOk();

        $this->assertDatabaseCount('comments', 0);
        $this->assertDatabaseHas('posts', ['id' => $post->id, 'comments_count' => 0]);
    }
}
