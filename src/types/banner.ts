export type BannerType = 'hero' | 'promo' | 'sale' | 'seasonal';

export interface IBanner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  buttonText?: string;
  type: BannerType;
  position: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  backgroundColor?: string;
  textColor?: string;
  createdAt: string;
  updatedAt: string;
}
