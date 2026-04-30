'use client';

import { useProducts } from '@/hooks/useProducts';
import { formatPrice } from '@/lib/format-price';
import { 
  Edit, 
  Trash2, 
  Plus, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProductTable() {
  const { data, isLoading, isError, refetch } = useProducts({ page: 1 });

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted successfully');
        refetch();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });
      if (res.ok) refetch();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading products...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error loading products</div>;

  return (
    <div className="rounded-md border bg-card">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Image</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stock</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data?.products.map((product) => (
              <tr key={product._id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle">
                  <div className="h-12 w-12 rounded-md border bg-muted/50 overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[10px]">No img</div>
                    )}
                  </div>
                </td>
                <td className="p-4 align-middle font-medium">
                  <div className="flex flex-col">
                    <span>{product.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{product.brand}</span>
                  </div>
                </td>
                <td className="p-4 align-middle capitalize">{product.category}</td>
                <td className="p-4 align-middle">
                  {product.isOnSale ? (
                    <div className="flex flex-col">
                      <span className="text-primary font-bold">{formatPrice(product.discountPrice!)}</span>
                      <span className="text-xs line-through text-muted-foreground">{formatPrice(product.price)}</span>
                    </div>
                  ) : (
                    formatPrice(product.price)
                  )}
                </td>
                <td className="p-4 align-middle">
                  <span className={product.stock < 10 ? "text-orange-600 font-medium" : ""}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4 align-middle">
                  <button onClick={() => toggleStatus(product._id, product.isAvailable)}>
                    {product.isAvailable ? (
                      <div className="flex items-center text-green-600 gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-muted-foreground gap-1">
                        <XCircle className="h-4 w-4" />
                        <span>Hidden</span>
                      </div>
                    )}
                  </button>
                </td>
                <td className="p-4 align-middle text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/shop/${product.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" title="View in Store">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/products/${product._id}`}>
                      <Button variant="ghost" size="icon" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteProduct(product._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
