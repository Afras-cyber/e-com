'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { StarLinear, CheckCircleLinear, CloseCircleLinear, TrashBinTrashLinear, RefreshLinear, ChatSquareLinear, DialogLinear, BoltLinear, CheckSquareLinear, StopLinear } from "solar-icon-set";;
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const res = await fetch('/api/admin/testimonials');
      if (!res.ok) throw new Error('Failed to fetch testimonials');
      return res.json();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update testimonial');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('Testimonial updated');
    },
    onError: () => toast.error('Failed to update')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete testimonial');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('Testimonial deleted');
    },
    onError: () => toast.error('Failed to delete')
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, update }: { ids: string[], update: any }) => {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, update }),
      });
      if (!res.ok) throw new Error('Bulk update failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      setSelectedIds([]);
      toast.success('Bulk update successful');
    },
    onError: () => toast.error('Bulk update failed')
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch('/api/admin/testimonials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error('Bulk delete failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      setSelectedIds([]);
      toast.success('Bulk deletion successful');
    },
    onError: () => toast.error('Bulk deletion failed')
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === testimonials?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(testimonials?.map((t: any) => t._id) || []);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshLinear className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground">Manage customer reviews and social proof</p>
        </div>
        
        {testimonials && testimonials.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleSelectAll}
            className="w-fit gap-2 h-10 px-4"
          >
            {selectedIds.length === testimonials.length ? <CheckSquareLinear className="w-4 h-4" /> : <StopLinear className="w-4 h-4" />}
            {selectedIds.length === testimonials.length ? 'Deselect All' : 'Select All'}
          </Button>
        )}
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col pr-6 border-r border-white/10">
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Selected</span>
            <span className="text-lg font-black">{selectedIds.length} items</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              className="bg-emerald-600 hover:bg-emerald-700 h-10 px-4 gap-2 rounded-xl"
              onClick={() => bulkUpdateMutation.mutate({ ids: selectedIds, update: { isApproved: true } })}
              disabled={bulkUpdateMutation.isPending}
            >
              <CheckCircleLinear className="w-4 h-4" /> Approve
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="bg-white/10 hover:bg-white/20 border-white/10 text-white h-10 px-4 gap-2 rounded-xl"
              onClick={() => bulkUpdateMutation.mutate({ ids: selectedIds, update: { isFeatured: true } })}
              disabled={bulkUpdateMutation.isPending}
            >
              <BoltLinear className="w-4 h-4 fill-current text-indigo-400" /> Feature
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              className="h-10 px-4 gap-2 rounded-xl"
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${selectedIds.length} testimonials?`)) {
                  bulkDeleteMutation.mutate(selectedIds);
                }
              }}
              disabled={bulkDeleteMutation.isPending}
            >
              <TrashBinTrashLinear className="w-4 h-4" /> Delete
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/50 hover:text-white hover:bg-transparent"
              onClick={() => setSelectedIds([])}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {testimonials?.map((t: any) => (
          <div 
            key={t._id} 
            onClick={() => toggleSelect(t._id)}
            className={`bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group cursor-pointer transition-all ${
              selectedIds.includes(t._id) ? 'ring-2 ring-primary border-primary bg-primary/5' : 'hover:border-primary/50'
            }`}
          >
            <div className="absolute top-4 right-4 z-20">
              {selectedIds.includes(t._id) ? (
                <CheckSquareLinear className="w-5 h-5 text-primary fill-current bg-white rounded-sm" />
              ) : (
                <StopLinear className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors bg-white/50 rounded-sm" />
              )}
            </div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {t.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{t.customerName}</h3>
                  <p className="text-xs text-muted-foreground">{format(new Date(t.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarLinear 
                    key={i} 
                    className={`w-3 h-3 ${i < t.rating ? 'fill-amber-500 text-amber-500' : 'text-muted'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="relative">
              <DialogLinear className="absolute -top-2 -left-2 w-8 h-8 text-muted/20 -z-0" />
              <p className="text-sm text-card-foreground/80 italic line-clamp-4 relative z-10">
                "{t.review}"
              </p>
            </div>

            {t.productName && (
              <div className="mt-auto pt-4 border-t border-dashed">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Product</p>
                <p className="text-xs font-medium line-clamp-1">{t.productName}</p>
              </div>
            )}

            <div className="flex items-center gap-2 mt-4">
              {t.isApproved ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-9 gap-2 text-xs"
                  onClick={() => updateMutation.mutate({ id: t._id, data: { isApproved: false } })}
                >
                  <CloseCircleLinear className="w-3.5 h-3.5 text-amber-500" />
                  Unapprove
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1 h-9 gap-2 text-xs bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => updateMutation.mutate({ id: t._id, data: { isApproved: true } })}
                >
                  <CheckCircleLinear className="w-3.5 h-3.5" />
                  Approve
                </Button>
              )}

              <Button 
                variant={t.isFeatured ? "default" : "outline"}
                size="sm" 
                className={`h-9 w-9 p-0 ${t.isFeatured ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
                title={t.isFeatured ? "Unfeature" : "Feature on Homepage"}
                onClick={() => updateMutation.mutate({ id: t._id, data: { isFeatured: !t.isFeatured } })}
              >
                <BoltLinear className={`w-3.5 h-3.5 ${t.isFeatured ? 'fill-current' : ''}`} />
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this testimonial?')) {
                    deleteMutation.mutate(t._id);
                  }
                }}
              >
                <TrashBinTrashLinear className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {testimonials?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground bg-card border rounded-2xl border-dashed">
            <ChatSquareLinear className="w-12 h-12 mb-4 opacity-10" />
            <p>No testimonials found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
