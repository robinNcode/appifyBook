# AppifyBook — Social Feed

A full-stack social feed application built to the provided **Login / Register / Feed** designs.

## Features 
- Login and Registration with frontend and Backend validation.
- Social Feed with posts, comments, likes, and replies.
- Image upload for posts and comments.
- User authentication using Laravel Passport (JWT access tokens).
- Clean and modern UI with Bootstrap 5 and Task CSS.

## Architecture/Technology Stack 
- Backend: 
    - Laravel 12 + Laravel Passport (OAuth2 / JWT access tokens) + MySQL
    - CursorPagination for infinite scroll.
    - Service, Repository Pattern for clean business logic.
    - SOLID Principles for clean code.

- Frontend: 
    - React 19 + Vite + Axios + React Router


## Installation

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan passport:install
php artisan migrate
php artisan db:seed
php artisan serve --port 6063
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Core Schema ER Diagram

Covers the four major tables: `users`, `posts`, `comments`, `likes`.

> Note: `likes` is a **polymorphic** table (`likeable_type` + `likeable_id`), so it can reference either `posts` or `comments`. Mermaid has no native polymorphic-association notation, so both relationships are drawn explicitly with a comment noting the actual FK mechanism.

```mermaid
erDiagram
    USERS ||--o{ POSTS : "creates"
    USERS ||--o{ COMMENTS : "writes"
    USERS ||--o{ LIKES : "gives"
    POSTS ||--o{ COMMENTS : "has"
    COMMENTS ||--o{ COMMENTS : "replies to (parent_id)"
    POSTS ||--o{ LIKES : "liked via (likeable_type='Post')"
    COMMENTS ||--o{ LIKES : "liked via (likeable_type='Comment')"

    USERS {
        bigint id PK
        varchar first_name
        varchar last_name
        varchar email UK
        timestamp email_verified_at
        varchar password
        varchar avatar
        varchar remember_token
        timestamp created_at
        timestamp updated_at
    }

    POSTS {
        bigint id PK
        bigint user_id FK
        text content
        varchar image_path
        enum visibility "public|private"
        bigint likes_count
        bigint comments_count
        timestamp created_at
        timestamp updated_at
    }

    COMMENTS {
        bigint id PK
        bigint post_id FK
        bigint user_id FK
        bigint parent_id FK "self-ref, nullable"
        text content
        varchar image_path
        bigint likes_count
        bigint replies_count
        timestamp created_at
        timestamp updated_at
    }

    LIKES {
        bigint id PK
        bigint user_id FK
        varchar likeable_type "App\Models\Post | App\Models\Comment"
        bigint likeable_id "polymorphic target id"
        timestamp created_at
        timestamp updated_at
    }
```

## Key constraints reflected above

- `posts.user_id` → `users.id`, `ON DELETE CASCADE`
- `comments.post_id` → `posts.id`, `ON DELETE CASCADE`
- `comments.user_id` → `users.id`, `ON DELETE CASCADE`
- `comments.parent_id` → `comments.id` (self-referencing, nullable, `ON DELETE CASCADE`) — enables threaded replies
- `likes.user_id` → `users.id`, `ON DELETE CASCADE`
- `likes` has a composite unique key on `(user_id, likeable_id, likeable_type)` — prevents duplicate likes on the same target by the same user
- `likes_count` / `comments_count` / `replies_count` are denormalized counters on `posts`/`comments`, not derived via SQL joins — kept in sync at the application layer

## Project Structure (Major Only)

```
appify-book/
├── backend/                    # Laravel 12 + Passport
│   ├── app/
│   │   ├── Http/Controllers/  # API controllers
│   │   ├── Models/            # Eloquent models
│   │   ├── Repositories/      # Repository pattern
│   │   ├── Services/          # Business logic services
│   │   └── Providers/         # AuthServiceProvider, etc.
│   ├── database/
│   │   ├── migrations/        # DB migrations
│   │   ├── seeders/           # DB seeders
│   │   └── factories/         # Model factories
│   ├── routes/                # API routes (api.php)
│   ├── config/                # App configuration
│   ├── public/                # Public assets
│   └── artisan                # Laravel CLI entry point
│
├── frontend/                   # React 19 + Vite
│   ├── src/
│   │   ├── api/               # Axios API clients
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page-level components
│   │   ├── contexts/          # React Context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── assets/            # Static assets (images, etc.)
│   │   └── App.jsx            # Root component
│   ├── public/                # Static assets
│   └── vite.config.js         # Vite config
│
└── README.md                  # This file
```