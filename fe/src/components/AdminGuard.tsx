'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface AdminGuardProps {
    children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/');
            } else if (!isAdmin) {
                router.push('/unauthorized');
            }
        }
    }, [user, loading, isAdmin, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return null; 
    }

    return <>{children}</>;
}