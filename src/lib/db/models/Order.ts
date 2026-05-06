import mongoose, { Schema, Document, Model } from 'mongoose';

export type OrderStatus =
  | 'inquiry'
  | 'contacted'
  | 'negotiating'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface IOrderDocument extends Document {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  items: {
    productId: mongoose.Types.ObjectId;
    productName: string;
    productSlug: string;
    selectedSize: string;
    selectedColor: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  negotiatedTotal?: number;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    updatedBy: mongoose.Types.ObjectId;
    note?: string;
    timestamp: Date;
  }[];
  whatsappSent: boolean;
  emailSent: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ORDER_STATUSES: OrderStatus[] = [
  'inquiry', 'contacted', 'negotiating', 'confirmed',
  'processing', 'shipped', 'delivered', 'cancelled',
];

const StatusHistorySchema = new Schema(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
    },
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      productName: { type: String, required: true },
      productSlug: { type: String, required: true },
      selectedSize: { type: String, required: true },
      selectedColor: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
      image: { type: String, required: true },
    }],
    totalAmount: { type: Number, required: true },
    negotiatedTotal: { type: Number },
    status: { type: String, enum: ORDER_STATUSES, default: 'inquiry' },
    statusHistory: [StatusHistorySchema],
    whatsappSent: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

// Indexes
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'customer.phone': 1 });

// Auto-generate order number
OrderSchema.pre('validate', async function () {
  if (this.isNew && !this.orderNumber) {
    try {
      const OrderModel = this.constructor as mongoose.Model<IOrderDocument>;
      const count = await OrderModel.countDocuments();
      this.orderNumber = `STK-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
    } catch (err: any) {
      throw err;
    }
  }
});

// Force refresh model in development to avoid schema caching issues
if (process.env.NODE_ENV === 'development') {
  delete (mongoose as any).models.Order;
}

const Order: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);

export default Order;
