import { useState } from 'react';
import { deletePost, togglePostLike } from '../api/services';
import Avatar from './Avatar';
import type { Post as PostType } from '../types';

interface PostProps {
    post: PostType;
    onChange: (post: PostType) => void;
    onDeleted: (id: number) => void;
}

export default function Post({ post, onChange, onDeleted }: PostProps) {
    const [liking, setLiking] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleLike = async () => {
        if (liking) return;
        setLiking(true);

        // Optimistic update, reconciled with the server's authoritative count.
        const optimistic: PostType = {
            ...post,
            liked_by_me: !post.liked_by_me,
            likes_count: post.likes_count + (post.liked_by_me ? -1 : 1),
        };
        onChange(optimistic);

        try {
            const { data } = await togglePostLike(post.id);
            onChange({ ...post, liked_by_me: data.liked, likes_count: data.likes_count });
        } catch {
            onChange(post); // Roll back on failure.
        } finally {
            setLiking(false);
        }
    };

    const handleDelete = async () => {
        if (deleting) return;
        if (!window.confirm('Delete this post?')) return;
        setDeleting(true);
        try {
            await deletePost(post.id);
            onDeleted(post.id);
        } catch {
            setDeleting(false);
        }
    };

    return (
        <article className="bs-card bs-post">
            <header className="bs-post-header">
                <div className="bs-post-avatar">
                    <Avatar user={post.author} />
                </div>
                <div className="bs-post-meta">
                    <span className="bs-post-author">{post.author?.name ?? 'Unknown'}</span>
                    <span className="bs-post-sub">
                        {post.created_at_human}
                        {post.visibility === 'private' && ' · 🔒 Private'}
                    </span>
                </div>
                {post.is_owner && (
                    <button
                        type="button"
                        className="bs-post-delete"
                        onClick={handleDelete}
                        disabled={deleting}
                        aria-label="Delete post"
                    >
                        🗑
                    </button>
                )}
            </header>

            {post.content && <p className="bs-post-content">{post.content}</p>}

            {post.image_url && (
                <img src={post.image_url} alt="" className="bs-post-image" />
            )}

            <footer className="bs-post-footer">
                <button
                    type="button"
                    className={`bs-post-action${post.liked_by_me ? ' bs-active' : ''}`}
                    onClick={handleLike}
                    disabled={liking}
                >
                    {post.liked_by_me ? '♥' : '♡'} {post.likes_count}
                    <span className="bs-post-action-label"> Like{post.likes_count === 1 ? '' : 's'}</span>
                </button>
                <span className="bs-post-action bs-muted">
                    💬 {post.comments_count}
                    <span className="bs-post-action-label"> Comment{post.comments_count === 1 ? '' : 's'}</span>
                </span>
            </footer>
        </article>
    );
}
