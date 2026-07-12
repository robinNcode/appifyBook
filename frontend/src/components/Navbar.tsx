import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    return (
        <header className="bs-navbar">
            <div className="bs-navbar-inner">
                <div className="bs-navbar-brand">
                    <img
                        src="/assets/images/appifybook-logo.svg"
                        alt="AppifyBook"
                        className="bs-navbar-logo"
                    />
                </div>

                {user && (
                    <div className="bs-navbar-user">
                        <div className="bs-navbar-avatar">
                            <Avatar user={user} />
                        </div>
                        <span className="bs-navbar-name">{user.name}</span>
                        <button type="button" className="bs-navbar-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
