export interface ITestimonial {
  _id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  review: string;
  productId?: string;
  productName?: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}
