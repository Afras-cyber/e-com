'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Star, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Loader2, 
  MessageSquare, 
  Quote,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
        <p className="text-muted-foreground">Manage customer reviews and social proof</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {testimonials?.map((t: any) => (
          <div key={t._id} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
            {!t.isApproved && (
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-tighter">
                Pending Approval
              </div>
            )}
            
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
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < t.rating ? 'fill-amber-500 text-amber-500' : 'text-muted'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="relative">
              <Quote className="absolute -top-2 -left-2 w-8 h-8 text-muted/20 -z-0" />
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
                  <XCircle className="w-3.5 h-3.5 text-amber-500" />
                  Unapprove
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1 h-9 gap-2 text-xs bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => updateMutation.mutate({ id: t._id, data: { isApproved: true } })}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
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
                <Zap className={`w-3.5 h-3.5 ${t.isFeatured ? 'fill-current' : ''}`} />
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
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {testimonials?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground bg-card border rounded-2xl border-dashed">
            <MessageSquare className="w-12 h-12 mb-4 opacity-10" />
            <p>No testimonials found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
