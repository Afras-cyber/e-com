import OrderTable from '@/components/admin/OrderTable';

export default function AdminOrdersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Track and manage customer inquiries and sales</p>
      </div>

      <OrderTable />
    </div>
  );
}
