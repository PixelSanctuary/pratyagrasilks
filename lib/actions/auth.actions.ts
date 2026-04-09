'use server';

import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/lib/constants/roles';

const VALID_ROLES: readonly UserRole[] = ['ADMIN', 'CASHIER', 'CUSTOMER', 'VENDOR'] as const;

export async function getUserRole(): Promise<UserRole | null> {
    try {
        const supabase = createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (error || !data) return null;

        const role = data.role as string;
        return (VALID_ROLES as readonly string[]).includes(role)
            ? (role as UserRole)
            : null;
    } catch {
        return null;
    }
}
