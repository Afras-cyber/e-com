import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().min(10).max(200),
  category: z.enum(['shoes', 'bags', 'accessories']),
  subcategory: z.string().min(1, 'Subcategory is required'),
  brand: z.string().min(1, 'Brand is required'),
  price: z.number().positive('Price must be positive'),
  discountPrice: z.number().positive().optional(),
  discountPercent: z.number().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  colors: z.array(
    z.object({
      name: z.string(),
      hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
      imageIndex: z.number().optional(),
    })
  ).min(1),
  stock: z.number().int().min(0),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().max(160).optional(),
});

export type ProductInput = z.input<typeof ProductSchema>;
