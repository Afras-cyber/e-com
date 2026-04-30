'use client';

import { useQuery } from '@tanstack/react-query';
import { Edit, Trash2, CheckCircle, XCircle, ExternalLink, MoveUp, MoveDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BannerTable({ onEdit }: { onEdit: (banner: any) => void }) {
  const { data: banners, isLoading, refetch } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      const res = await fetch('/api/admin/banners');
      return res.json();
    }
  });

  const deleteBanner = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    refetch();
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/admin/banners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !currentStatus }),
    });
    refetch();
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading banners...</div>;

  return (
    <div className="rounded-md border bg-card">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12 text-center">#</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-40">Preview</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title & Subtitle</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Link</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {banners?.map((banner: any, i: number) => (
              <tr key={banner._id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle text-center font-bold text-muted-foreground">{banner.position}</td>
                <td className="p-4 align-middle">
                  <div className="h-20 w-40 rounded-md border bg-muted/50 overflow-hidden">
                    <img src={banner.imageUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex flex-col">
                    <span className="font-bold">{banner.title}</span>
                    <span className="text-xs text-muted-foreground">{banner.subtitle}</span>
                  </div>
                </td>
                <td className="p-4 align-middle font-mono text-xs">{banner.link}</td>
                <td className="p-4 align-middle">
                  <button onClick={() => toggleStatus(banner._id, banner.isActive)} className="flex items-center gap-1">
                    {banner.isActive ? (
                      <div className="flex items-center text-green-600 gap-1 font-bold text-xs uppercase">
                        <CheckCircle className="h-3 w-3" />
                        Live
                      </div>
                    ) : (
                      <div className="flex items-center text-muted-foreground gap-1 font-bold text-xs uppercase">
                        <XCircle className="h-3 w-3" />
                        Draft
                      </div>
                    )}
                  </button>
                </td>
                <td className="p-4 align-middle text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(banner)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteBanner(banner._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(!banners || banners.length === 0) && (
        <div className="p-8 text-center text-muted-foreground">No banners created yet</div>
      )}
    </div>
  );
}
