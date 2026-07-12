import { useCallback, useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { fetchPosts } from '../api/services';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import PostSkeleton from '../components/PostSkeleton';
import type { Post as PostType } from '../types';

export default function Feed() {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Guards against overlapping loads (initial render + observer firing together).
    const inFlight = useRef(false);

    const loadPosts = useCallback(async (nextCursor: string | null) => {
        if (inFlight.current) return;
        inFlight.current = true;
        if (nextCursor) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const { data } = await fetchPosts(nextCursor);
            setPosts((prev) => (nextCursor ? [...prev, ...data.data] : data.data));
            const next = data.meta?.next_cursor ?? null;
            setCursor(next);
            setHasMore(Boolean(next));
        } catch (err) {
            if (!isAxiosError(err) || err.response?.status !== 401) {
                setError('Could not load the feed. Please try again.');
            }
        } finally {
            inFlight.current = false;
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        // Initial feed fetch on mount. loadPosts flips its own loading flags,
        // which the set-state-in-effect rule flags — expected for data fetching.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadPosts(null);
    }, [loadPosts]);

    const handleCreated = (post: PostType) => setPosts((prev) => [post, ...prev]);

    const handleChanged = (updated: PostType) =>
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

    const handleDeleted = (id: number) =>
        setPosts((prev) => prev.filter((p) => p.id !== id));

    return (
        <div className="bs-feed-page">
            <Navbar />

            <main className="bs-feed">
                <CreatePost onCreated={handleCreated} />

                {error && (
                    <div className="bs-alert">
                        {error}{' '}
                        <button type="button" className="bs-inline-btn" onClick={() => loadPosts(cursor)}>
                            Retry
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="bs-feed-skeletons">
                        {Array.from({ length: 3 }, (_, i) => (
                            <PostSkeleton key={i} />
                        ))}
                    </div>
                ) : posts.length === 0 && !error ? (
                    <div className="bs-empty">No posts yet. Be the first to share something!</div>
                ) : (
                    posts.map((post) => (
                        <Post
                            key={post.id}
                            post={post}
                            onChange={handleChanged}
                            onDeleted={handleDeleted}
                        />
                    ))
                )}

                {!loading && hasMore && posts.length > 0 && (
                    <div className="bs-feed-more">
                        <button
                            type="button"
                            className="bs-btn-secondary"
                            onClick={() => loadPosts(cursor)}
                            disabled={loadingMore}
                        >
                            {loadingMore ? <span className="bs-spinner bs-spinner-dark" /> : 'Load more'}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
