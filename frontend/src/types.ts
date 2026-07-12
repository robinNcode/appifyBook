export type Visibility = "public" | "private";

export interface User {
    id: number;
    first_name?: string;
    last_name?: string;
    name: string;
    email: string | null;
    avatar?: string | null;
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


// Response Envelope
export interface AuthResponse {
    token: string;
    token_type: string;
    user: User;
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

/** Laravel 422 validation errors: field name -> messages. */
export type ValidationErrors = Record<string, string[]>