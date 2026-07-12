import type { User } from '../types';

/**
 * Round user avatar. Falls back to the user's initials on a solid background
 * when no avatar image is available.
 */
export default function Avatar({ user }: { user?: User }) {
    const initials = (user?.name ?? '?')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('');

    if (user?.avatar_url) {
        return <img src={user.avatar_url} alt={user.name} className="bs-avatar" />;
    }

    return <span className="bs-avatar-fallback">{initials || '?'}</span>;
}
