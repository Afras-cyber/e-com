import { useQuery } from '@tanstack/react-query';
import { ProductFilters, ProductsResponse } from '@/types/product';

async function fetchProducts(filters: ProductFilters): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.subcategory) params.append('subcategory', filters.subcategory);
  if (filters.search) params.append('search', filters.search);
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.isOnSale) params.append('isOnSale', 'true');
  if (filters.isFeatured) params.append('isFeatured', 'true');
  if (filters.page) params.append('page', filters.page.toString());
  
  if (filters.brand?.length) params.append('brand', filters.brand.join(','));
  if (filters.sizes?.length) params.append('sizes', filters.sizes.join(','));
  if (filters.colors?.length) params.append('colors', filters.colors.join(','));
  
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

  const response = await fetch(`/api/products?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    placeholderData: (previousData) => previousData, // keepPreviousData
  });
}
