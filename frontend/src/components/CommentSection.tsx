import { useCallback, useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { fetchComments } from '../api/services';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import CommentSkeleton from './CommentSkeleton';
import type { Comment } from '../types';

interface CommentSectionProps {
    postId: number;
    /** Report the change in the post's total comment count (replies included). */
    onCountChange: (delta: number) => void;
}

export default function CommentSection({ postId, onCountChange }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Guards against overlapping loads.
    const inFlight = useRef(false);

    const loadComments = useCallback(async (nextPage: number) => {
        if (inFlight.current) return;
        inFlight.current = true;
        if (nextPage > 1) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const { data } = await fetchComments(postId, nextPage);
            setComments((prev) => (nextPage > 1 ? [...prev, ...data.data] : data.data));
            setPage(data.meta.current_page);
            setLastPage(data.meta.last_page);
        } catch (err) {
            if (!isAxiosError(err) || err.response?.status !== 401) {
                setError('Could not load comments. Please try again.');
            }
        } finally {
            inFlight.current = false;
            setLoading(false);
            setLoadingMore(false);
        }
    }, [postId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadComments(1);
    }, [loadComments]);

    const handleCreated = (comment: Comment) => {
        setComments((prev) => [...prev, comment]);
        onCountChange(1);
    };

    const handleDeleted = (comment: Comment) =>
        setComments((prev) => prev.filter((c) => c.id !== comment.id));

    const hasMore = page < lastPage;

    return (
        <div className="bs-comment-section">
            <CommentForm postId={postId} onCreated={handleCreated} />

            {error && (
                <div className="bs-alert">
                    {error}{' '}
                    <button type="button" className="bs-inline-btn" onClick={() => loadComments(page)}>
                        Retry
                    </button>
                </div>
            )}

            {loading ? (
                <div className="bs-comment-list">
                    {Array.from({ length: 2 }, (_, i) => (
                        <CommentSkeleton key={i} />
                    ))}
                </div>
            ) : comments.length === 0 && !error ? (
                <p className="bs-comment-empty">No comments yet. Be the first to comment!</p>
            ) : (
                <div className="bs-comment-list">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            postId={postId}
                            onDeleted={handleDeleted}
                            onCountChange={onCountChange}
                        />
                    ))}
                </div>
            )}

            {!loading && hasMore && (
                <button
                    type="button"
                    className="bs-inline-btn bs-comment-more"
                    onClick={() => loadComments(page + 1)}
                    disabled={loadingMore}
                >
                    {loadingMore ? 'Loading…' : 'View more comments'}
                </button>
            )}
        </div>
    );
}
