import OrderManager from '@/components/admin/OrderManager';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  return (
    <div className="w-full">
      <OrderManager id={resolvedParams.id} />
    </div>
  );
}
