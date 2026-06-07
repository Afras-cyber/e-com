'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SendSquareLinear, RefreshLinear, ArrowLeftLinear, EyeLinear } from "solar-icon-set";;
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    content: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.content) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!confirm('Are you sure you want to send this campaign to all active subscribers?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Campaign sent successfully');
        router.push('/admin/newsletter');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to send campaign');
      }
    } catch (error) {
      console.error(error);
      toast.error('Internal server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/newsletter">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeftLinear className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Campaign</h1>
            <p className="text-muted-foreground">Broadcast an email to all active subscribers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setPreview(!preview)}
            className="gap-2"
          >
            <EyeLinear className="h-4 w-4" />
            {preview ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? <RefreshLinear className="h-4 w-4 animate-spin" /> : <SendSquareLinear className="h-4 w-4" />}
            SendSquareLinear Broadcast
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {!preview ? (
          <form className="space-y-6 bg-card border rounded-2xl p-8 shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Email Subject</label>
              <input 
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Exciting updates from StepKicks!"
                className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Email Content (HTML allowed)</label>
              <textarea 
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="<h1>Hello!</h1><p>Check out our latest collection...</p>"
                className="w-full h-[400px] p-6 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono text-sm leading-relaxed"
              />
            </div>
          </form>
        ) : (
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-muted/50 p-4 border-b flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preview Mode</span>
              <span className="text-sm font-bold">{formData.subject || '(No Subject)'}</span>
            </div>
            <div className="p-10 bg-white">
              <div 
                className="prose max-w-none mx-auto"
                style={{ fontFamily: 'sans-serif' }}
                dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-muted-foreground italic text-center">No content yet...</p>' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
