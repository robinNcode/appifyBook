import type { AxiosResponse } from 'axios'
import api from './client'
import type {
  ApiEnvelope,
  AuthResponse,
  //Collection,
  //Comment,
 // CreateCommentPayload,
  CursorPaginated,
  LikeToggleResponse,
  LoginCredentials,
  Post,
  RegisterPayload,
  Resource,
  User,
} from '../types'

// --- Auth ---
export const register = (
  payload: RegisterPayload
): Promise<AxiosResponse<ApiEnvelope<AuthResponse>>> => api.post('/register', payload)
export const login = (
  payload: LoginCredentials
): Promise<AxiosResponse<ApiEnvelope<AuthResponse>>> => api.post('/login', payload)
export const logout = (): Promise<AxiosResponse<{ message: string }>> => api.post('/logout')
export const fetchMe = (): Promise<AxiosResponse<Resource<User>>> => api.get('/me')

// --- Posts / feed ---
export const fetchPosts = (
  cursor?: string | null
): Promise<AxiosResponse<CursorPaginated<Post>>> =>
  api.get('/posts', { params: cursor ? { cursor } : {} })

export const createPost = (formData: FormData): Promise<AxiosResponse<Resource<Post>>> =>
  api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deletePost = (id: number): Promise<AxiosResponse<{ message: string }>> =>
  api.delete(`/posts/${id}`)

// --- Likes ---
export const togglePostLike = (postId: number): Promise<AxiosResponse<LikeToggleResponse>> =>
  api.post(`/posts/${postId}/like`)

// --- Comments & replies ---
// export const fetchComments = (
//   postId: number,
//   page = 1
// ): Promise<AxiosResponse<Collection<Comment>>> =>
//   api.get(`/posts/${postId}/comments`, { params: { page } })

// export const createComment = (
//   postId: number,
//   payload: CreateCommentPayload
// ): Promise<AxiosResponse<Resource<Comment>>> => api.post(`/posts/${postId}/comments`, payload)

// export const deleteComment = (id: number): Promise<AxiosResponse<void>> =>
//   api.delete(`/comments/${id}`)

// // --- Likes ---
// export const togglePostLike = (postId: number): Promise<AxiosResponse<LikeToggleResponse>> =>
//   api.post(`/posts/${postId}/like`)
// export const toggleCommentLike = (
//   commentId: number
// ): Promise<AxiosResponse<LikeToggleResponse>> => api.post(`/comments/${commentId}/like`)
// export const fetchPostLikers = (postId: number): Promise<AxiosResponse<Collection<User>>> =>
//   api.get(`/posts/${postId}/likers`)
// export const fetchCommentLikers = (
//   commentId: number
// ): Promise<AxiosResponse<Collection<User>>> => api.get(`/comments/${commentId}/likers`)
