import { useState } from 'react';
import { deleteComment, toggleCommentLike } from '../api/services';
import Avatar from './Avatar';
import CommentForm from './CommentForm';
import type { Comment } from '../types';

interface CommentItemProps {
    comment: Comment;
    postId: number;
    /** Replies render one level deep; a reply cannot itself be replied to. */
    isReply?: boolean;
    /** Remove this comment from its parent list. */
    onDeleted: (comment: Comment) => void;
    /** Report a change in the total comment count (replies included). */
    onCountChange: (delta: number) => void;
}

export default function CommentItem({
    comment,
    postId,
    isReply = false,
    onDeleted,
    onCountChange,
}: CommentItemProps) {
    const [liked, setLiked] = useState(comment.liked_by_me);
    const [likesCount, setLikesCount] = useState(comment.likes_count);
    const [liking, setLiking] = useState(false);

    const [replies, setReplies] = useState<Comment[]>(comment.replies ?? []);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleLike = async () => {
        if (liking) return;
        setLiking(true);

        // Optimistic toggle, reconciled with the server's authoritative count.
        const prevLiked = liked;
        const prevCount = likesCount;
        setLiked(!prevLiked);
        setLikesCount(prevCount + (prevLiked ? -1 : 1));

        try {
            const { data } = await toggleCommentLike(comment.id);
            setLiked(data.liked);
            setLikesCount(data.likes_count);
        } catch {
            setLiked(prevLiked);
            setLikesCount(prevCount);
        } finally {
            setLiking(false);
        }
    };

    const handleDelete = async () => {
        if (deleting) return;
        if (!window.confirm('Delete this comment?')) return;
        setDeleting(true);
        try {
            await deleteComment(comment.id);
            // Deleting a comment also removes its replies on the backend.
            onCountChange(-(1 + replies.length));
            onDeleted(comment);
        } catch {
            setDeleting(false);
        }
    };

    const handleReplyCreated = (reply: Comment) => {
        setReplies((prev) => [...prev, reply]);
        setShowReplyForm(false);
        onCountChange(1);
    };

    const handleReplyDeleted = (reply: Comment) => {
        setReplies((prev) => prev.filter((r) => r.id !== reply.id));
    };

    return (
        <div className={`bs-comment${isReply ? ' bs-comment-reply' : ''}`}>
            <div className="bs-comment-avatar">
                <Avatar user={comment.author} />
            </div>

            <div className="bs-comment-main">
                <div className="bs-comment-bubble">
                    <span className="bs-comment-author">{comment.author?.name ?? 'Unknown'}</span>
                    {comment.content && <p className="bs-comment-text">{comment.content}</p>}
                    {comment.image_url && (
                        <img src={comment.image_url} alt="" className="bs-comment-image" />
                    )}
                </div>

                <div className="bs-comment-actions">
                    <button
                        type="button"
                        className={`bs-inline-btn${liked ? ' bs-active' : ''}`}
                        onClick={handleLike}
                        disabled={liking}
                    >
                        {liked ? 'Liked' : 'Like'}
                        {likesCount > 0 && ` · ${likesCount}`}
                    </button>

                    {!isReply && (
                        <button
                            type="button"
                            className="bs-inline-btn"
                            onClick={() => setShowReplyForm((v) => !v)}
                        >
                            Reply
                            {comment.replies_count > 0 && ` · ${replies.length}`}
                        </button>
                    )}

                    <span className="bs-comment-time">{comment.created_at_human}</span>

                    {comment.is_owner && (
                        <button
                            type="button"
                            className="bs-inline-btn bs-comment-delete"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            Delete
                        </button>
                    )}
                </div>

                {!isReply && replies.length > 0 && (
                    <div className="bs-reply-thread">
                        {replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                postId={postId}
                                isReply
                                onDeleted={handleReplyDeleted}
                                onCountChange={onCountChange}
                            />
                        ))}
                    </div>
                )}

                {showReplyForm && (
                    <div className="bs-reply-form">
                        <CommentForm
                            postId={postId}
                            parentId={comment.id}
                            onCreated={handleReplyCreated}
                            placeholder={`Reply to ${comment.author?.name ?? 'this comment'}…`}
                            autoFocus
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
