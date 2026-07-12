import type { AxiosResponse } from 'axios'
import api from './client'
import type {
  ApiEnvelope,
  AuthResponse,
  Comment,
  CursorPaginated,
  LikeToggleResponse,
  LoginCredentials,
  Paginated,
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

export const toggleCommentLike = (
  commentId: number
): Promise<AxiosResponse<LikeToggleResponse>> => api.post(`/comments/${commentId}/like`)

// --- Comments & replies ---
// Top-level comments (with their replies) are length-aware paginated, 15 per page.
export const fetchComments = (
  postId: number,
  page = 1
): Promise<AxiosResponse<Paginated<Comment>>> =>
  api.get(`/posts/${postId}/comments`, { params: { page } })

// Comments carry an optional image, so they go up as multipart/form-data.
export const createComment = (
  postId: number,
  formData: FormData
): Promise<AxiosResponse<Resource<Comment>>> =>
  api.post(`/posts/${postId}/comments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deleteComment = (id: number): Promise<AxiosResponse<{ message: string }>> =>
  api.delete(`/comments/${id}`)
