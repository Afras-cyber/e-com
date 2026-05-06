import { z } from 'zod';

export const CreateOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(7, 'Valid phone number required'),
    email: z.string().email().optional().or(z.literal('')),
  }),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    productSlug: z.string(),
    selectedSize: z.string().min(1, 'Size is required'),
    selectedColor: z.string().min(1, 'Color is required'),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
    image: z.string(),
  })),
  totalAmount: z.number().positive(),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum([
    'inquiry', 'contacted', 'negotiating', 'confirmed',
    'processing', 'shipped', 'delivered', 'cancelled',
  ]),
  note: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
