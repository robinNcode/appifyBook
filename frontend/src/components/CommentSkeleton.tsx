/** Placeholder mimicking a comment row while a post's comments load. */
export default function CommentSkeleton() {
    return (
        <div className="bs-comment-skeleton" aria-hidden="true">
            <span className="bs-sk bs-sk-avatar bs-sk-avatar-sm" />
            <div className="bs-sk-bubble">
                <span className="bs-sk bs-sk-line bs-sk-w-30" />
                <span className="bs-sk bs-sk-line bs-sk-w-80" />
            </div>
        </div>
    );
}
