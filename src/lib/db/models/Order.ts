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
  product: {
    productId: mongoose.Types.ObjectId;
    productName: string;
    productSlug: string;
    selectedSize: string;
    selectedColor: string;
    price: number;
    negotiatedPrice?: number;
    image: string;
  };
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
    product: {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      productName: { type: String, required: true },
      productSlug: { type: String, required: true },
      selectedSize: { type: String, required: true },
      selectedColor: { type: String, required: true },
      price: { type: Number, required: true },
      negotiatedPrice: { type: Number },
      image: { type: String, required: true },
    },
    status: { type: String, enum: ORDER_STATUSES, default: 'inquiry' },
    statusHistory: [StatusHistorySchema],
    whatsappSent: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'customer.phone': 1 });

// Auto-generate order number
OrderSchema.pre('save', async function () {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `SK-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
  }
});

const Order: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);

export default Order;
