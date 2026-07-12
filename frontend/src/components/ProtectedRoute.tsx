import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import PageSkeleton from "./PageSkeleton";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <PageSkeleton />
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}