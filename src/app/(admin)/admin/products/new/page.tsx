import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <ProductForm />
      </div>
    </div>
  );
}
