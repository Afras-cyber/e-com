export type OrderStatus =
  | 'inquiry'
  | 'contacted'
  | 'negotiating'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface IStatusHistory {
  status: OrderStatus;
  updatedBy: string;
  note?: string;
  timestamp: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  product: {
    productId: string;
    productName: string;
    productSlug: string;
    selectedSize: string;
    selectedColor: string;
    price: number;
    negotiatedPrice?: number;
    image: string;
  };
  status: OrderStatus;
  statusHistory: IStatusHistory[];
  whatsappSent: boolean;
  emailSent: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
