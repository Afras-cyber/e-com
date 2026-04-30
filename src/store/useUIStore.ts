'use client';

import { create } from 'zustand';

interface UIStore {
  isMobileMenuOpen: boolean;
  isFilterDrawerOpen: boolean;
  activeModal: string | null;

  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleFilterDrawer: () => void;
  closeFilterDrawer: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isFilterDrawerOpen: false,
  activeModal: null,

  toggleMobileMenu: () =>
    set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  toggleFilterDrawer: () =>
    set((s) => ({ isFilterDrawerOpen: !s.isFilterDrawerOpen })),
  closeFilterDrawer: () => set({ isFilterDrawerOpen: false }),

  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}));
