import { z } from 'zod';

export const UserLoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const CreateStaffSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  role: z.enum(['admin', 'staff']).default('staff'),
  phone: z.string().optional(),
});

export type UserLoginInput = z.infer<typeof UserLoginSchema>;
export type CreateStaffInput = z.infer<typeof CreateStaffSchema>;
