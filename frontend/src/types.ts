export type Visibility = "public" | "private";

export interface User {
    id: number;
    first_name?: string;
    last_name?: string;
    name: string;
    email?: string | null;
    avatar_url?: string | null;
}

export interface Comment {
  id: number
  post_id: number
  parent_id: number | null
  content: string | null
  image_url: string | null
  likes_count: number
  replies_count: number
  liked_by_me: boolean
  is_owner: boolean
  author?: User
  replies?: Comment[]
  created_at?: string
  created_at_human?: string
}

export interface Post {
  id: number
  content: string | null
  image_url: string | null
  visibility: Visibility
  likes_count: number
  comments_count: number
  liked_by_me: boolean
  is_owner: boolean
  author?: User
  comments?: Comment[]
  created_at?: string
  created_at_human?: string
}

/** Response from toggling a like: `{ liked, likes_count }`. */
export interface LikeToggleResponse {
  liked: boolean
  likes_count: number
}

// Request Payloads ...
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterPayload {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
}

/**
 * Fields for creating a comment or reply. A comment needs `content`, an
 * `image`, or both. `parent_id` is set only when replying to a comment.
 * Sent as multipart/form-data so an image file can ride along.
 */
export interface CreateCommentPayload {
    content?: string;
    image?: File | null;
    parent_id?: number | null;
}


// Response Envelope

/**
 * Standard API envelope used by the backend controllers:
 * `{ code, status, message, data: T }`.
 */
export interface ApiEnvelope<T> {
    code: number;
    status: string;
    message: string;
    data: T;
}

/** Payload nested under `data` on the login/register responses. */
export interface AuthResponse {
    user: User;
    access_token: string;
    token_type: string;
}


/** A single Laravel resource: `{ data: {...} }`. */
export interface Resource<T> {
  data: T
}

/** A Laravel resource collection: `{ data: [...] }`. */
export interface Collection<T> {
  data: T[]
}

/** A cursor-paginated collection: adds `meta.next_cursor`. */
export interface CursorPaginated<T> {
  data: T[]
  meta?: {
    next_cursor: string | null
  }
}

/**
 * A length-aware paginated collection — the shape Laravel's
 * `ResourceCollection` emits for `->paginate()`. Comments use this.
 */
export interface Paginated<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    path: string
    per_page: number
    to: number | null
    total: number
  }
}

/** Laravel 422 validation errors: field name -> messages. */
export type ValidationErrors = Record<string, string[]>