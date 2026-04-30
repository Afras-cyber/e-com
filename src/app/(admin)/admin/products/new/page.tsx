import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Product</h1>
        <p className="text-muted-foreground">Add a new item to your store inventory</p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <ProductForm />
      </div>
    </div>
  );
}
