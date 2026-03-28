/* eslint-disable */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: string;
    slug: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (product) =>
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === product.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                            isCartOpen: true
                        };
                    }
                    return { items: [...state.items, { ...product, quantity: 1 }], isCartOpen: true };
                }),
            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                })),
            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                })),
            clearCart: () => set({ items: [] }),
            isCartOpen: false,
            setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
        }),
        {
            name: 'cart-storage',
        }
    )
);
