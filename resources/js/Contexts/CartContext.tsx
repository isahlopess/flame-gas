import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    category?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isCartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void;
    isCheckoutOpen: boolean;
    setCheckoutOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    const [isCartOpen, setCartOpen] = useState(false);
    const [isCheckoutOpen, setCheckoutOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('flamegas-cart');
            if (savedCart) {
                try {
                    setItems(JSON.parse(savedCart));
                } catch (e) {
                    console.error('Failed to parse cart data from localStorage:', e);
                }
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted && typeof window !== 'undefined') {
            localStorage.setItem('flamegas-cart', JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === newItem.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
                        : item
                );
            }
            return [...prevItems, { ...newItem, quantity: newItem.quantity || 1 } as CartItem];
        });
    };

    const removeItem = (id: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }
        setItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = useMemo(() => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);

    const totalPrice = useMemo(() => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [items]);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                isCartOpen,
                setCartOpen,
                isCheckoutOpen,
                setCheckoutOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
