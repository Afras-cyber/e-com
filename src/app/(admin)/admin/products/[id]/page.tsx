import { notFound } from 'next/navigation';
import connectDB from '@/lib/db/mongoose';
import Product from '@/lib/db/models/Product';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  await connectDB();
  const product = await Product.findById(id).lean();

  if (!product) {
    notFound();
  }

  // Serialize MongoDB object
  const serializedProduct = JSON.parse(JSON.stringify(product));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">
          Update your product details and inventory.
        </p>
      </div>
      <ProductForm initialData={serializedProduct} />
    </div>
  );
}
