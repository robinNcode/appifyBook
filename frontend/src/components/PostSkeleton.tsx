/** Placeholder mimicking a Post card's layout while the feed loads. */
export default function PostSkeleton() {
    return (
        <article className="bs-card bs-post bs-skeleton" aria-hidden="true">
            <header className="bs-post-header">
                <span className="bs-sk bs-sk-avatar" />
                <div className="bs-post-meta bs-sk-meta">
                    <span className="bs-sk bs-sk-line bs-sk-w-40" />
                    <span className="bs-sk bs-sk-line bs-sk-w-25" />
                </div>
            </header>

            <div className="bs-sk-body">
                <span className="bs-sk bs-sk-line bs-sk-w-90" />
                <span className="bs-sk bs-sk-line bs-sk-w-75" />
                <span className="bs-sk bs-sk-line bs-sk-w-60" />
            </div>

            <span className="bs-sk bs-sk-image" />

            <footer className="bs-post-footer">
                <span className="bs-sk bs-sk-pill" />
                <span className="bs-sk bs-sk-pill" />
            </footer>
        </article>
    );
}
