import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
    id: string;
    email: string;
    name: string;
    role: 'customer' | 'admin';
};

interface AuthState {
    user: User | null;
    token: string | null;
    status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            status: 'unauthenticated',
            error: null,
            login: async (email, password) => {
                set({ status: 'loading', error: null });
                try {
                    const res = await fetch('/api/auth/login', {
                        method: 'POST',
                        body: JSON.stringify({ email, password })
                    });
                    const data = await res.json();
                    if (data.error) {
                        set({ status: 'unauthenticated', error: data.error });
                        return;
                    }
                    set({ user: data.user, token: data.token, status: 'authenticated' });
                } catch (err) {
                    set({ status: 'unauthenticated', error: 'Connection failed' });
                }
            },
            register: async (name, email, password) => {
                set({ status: 'loading', error: null });
                try {
                    const res = await fetch('/api/auth/register', {
                        method: 'POST',
                        body: JSON.stringify({ name, email, password })
                    });
                    const data = await res.json();
                    if (data.error) {
                        set({ status: 'unauthenticated', error: data.error });
                        return;
                    }
                    set({ user: data.user, token: data.token, status: 'authenticated' });
                } catch (err) {
                    set({ status: 'unauthenticated', error: 'Registration failed' });
                }
            },
            logout: () => {
                set({ user: null, token: null, status: 'unauthenticated', error: null });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
