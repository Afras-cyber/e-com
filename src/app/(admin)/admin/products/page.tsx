import ProductTable from '@/components/admin/ProductTable';
import { Button } from '@/components/ui/button';
import { AddCircleLinear } from "solar-icon-set";;
import Link from 'next/link';

export default function AdminProductsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your store inventory</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <AddCircleLinear className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <ProductTable />
    </div>
  );
}
