'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useAdmin() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAdmin() {
            if (authLoading) return;

            if (!user) {
                router.push('/auth/login');
                return;
            }

            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('customers')
                    .select('is_admin')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error checking admin status:', error);
                    setIsAdmin(false);
                } else {
                    setIsAdmin(data?.is_admin || false);

                    // Redirect non-admins
                    if (!data?.is_admin) {
                        router.push('/');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        }

        checkAdmin();
    }, [user, authLoading, router]);

    return { isAdmin, loading, user };
}
