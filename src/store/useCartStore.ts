'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IProduct } from '@/types/product';

export interface CartItem {
  product: IProduct;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  addItem: (product: IProduct, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, selectedSize, selectedColor) => {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.product._id === product._id &&
              i.selectedSize === selectedSize &&
              i.selectedColor === selectedColor
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product._id === product._id &&
                i.selectedSize === selectedSize &&
                i.selectedColor === selectedColor
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { product, selectedSize, selectedColor, quantity: 1 }],
          };
        });
      },
      
      updateQuantity: (productId, size, color, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.product._id === productId &&
            i.selectedSize === size &&
            i.selectedColor === color
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        }));
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(i.product._id === productId &&
                i.selectedSize === size &&
                i.selectedColor === color)
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () =>
        get().items.reduce(
          (sum, item) =>
            sum + (item.product.discountPrice ?? item.product.price) * item.quantity,
          0
        ),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'stepkicks-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
