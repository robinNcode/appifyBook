import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { clearToken, getToken, setToken } from "../api/client";
import * as authApi from "../api/services";
import type { AuthResponse, User, LoginCredentials, RegisterPayload } from "../types";

interface AuthContextValue{
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<User>;
    register: (credentials: RegisterPayload) => Promise<User>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // On boot, check if user is already logged in
    useEffect(() => {
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }

        authApi.fetchMe()
        .then(({ data }) => { setUser(data.data); })
        .catch(() => { clearToken(); })
        .finally(() => { setLoading(false); });
    }, []);

    const handleAuthSuccess = ({user, token}: AuthResponse) => {
        setToken(token);
        setUser(user);
    }

    const login = async (credentials: LoginCredentials) => {
        const response = await authApi.login(credentials);
        handleAuthSuccess(response.data);
        return response.data.user;
    }

    const register = async (credentials: RegisterPayload) => {
        const response = await authApi.register(credentials);
        handleAuthSuccess(response.data);
        return response.data.user;
    }

    const logout = async () : Promise<void> => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            clearToken();
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

