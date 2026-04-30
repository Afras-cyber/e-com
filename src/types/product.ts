export interface IColor {
  name: string;
  hex: string;
  imageIndex?: number;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: 'shoes' | 'bags' | 'accessories';
  subcategory: string;
  brand: string;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  images: string[];
  sizes: string[];
  colors: IColor[];
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string[];
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  isOnSale?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'best-rated';
  page?: number;
  limit?: number;
  search?: string;
}

export interface ProductsResponse {
  products: IProduct[];
  total: number;
  page: number;
  totalPages: number;
}
