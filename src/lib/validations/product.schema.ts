import { z } from "zod";

export const ProductSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().optional(),
    description: z.string().optional(),
    shortDescription: z.string().min(10).max(200),
    categoryId: z.string().min(1, "Category is required"),
    brandId: z.string().min(1, "Brand is required"),
    category: z.string(),
    brand: z.string(),
    subcategory: z.string().optional().default(""),
    price: z.number().positive("Price must be positive"),
    isDiscount: z.boolean().default(false),
    discountPrice: z
      .number()
      .positive("Discount price must be positive")
      .optional(),
    discountPercent: z.number().optional(),
    images: z.array(z.string().url()).min(1, "At least one image is required"),
    sizes: z.array(z.string()).min(1, "At least one size is required"),
    colors: z
      .array(
        z.object({
          name: z.string(),
          hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
          imageIndex: z.number().optional(),
        }),
      )
      .min(1),
    stock: z.number().int().min(0),
    isAvailable: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    isOnSale: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().max(160).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isDiscount) {
      // discountPrice is required when discount is enabled
      if (data.discountPrice === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount price is required when discount is enabled",
          path: ["discountPrice"],
        });
        return;
      }
      // discountPrice must be less than price
      if (data.discountPrice >= data.price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount price must be less than the regular price",
          path: ["discountPrice"],
        });
      }
    }
  });

export type ProductInput = z.input<typeof ProductSchema>;
