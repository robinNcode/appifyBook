import PostSkeleton from './PostSkeleton';

/** Full-page placeholder shown while a protected route resolves auth. */
export default function PageSkeleton() {
    return (
        <div className="bs-feed-page" aria-hidden="true">
            <header className="bs-navbar">
                <div className="bs-navbar-inner">
                    <span className="bs-sk bs-sk-line bs-sk-w-25" />
                    <div className="bs-navbar-user">
                        <span className="bs-sk bs-sk-avatar bs-sk-avatar-sm" />
                        <span className="bs-sk bs-sk-line bs-sk-w-40" />
                    </div>
                </div>
            </header>

            <main className="bs-feed">
                <div className="bs-feed-skeletons">
                    {Array.from({ length: 3 }, (_, i) => (
                        <PostSkeleton key={i} />
                    ))}
                </div>
            </main>
        </div>
    );
}
