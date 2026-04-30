export type UserRole = 'admin' | 'staff';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  phone?: string;
  avatar?: string;
  addedBy?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}
