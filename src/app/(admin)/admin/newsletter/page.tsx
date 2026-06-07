'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { LetterLinear, RefreshLinear, DownloadLinear, SendSquareLinear } from "solar-icon-set";;
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminNewsletterPage() {
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['admin-newsletter'],
    queryFn: async () => {
      const res = await fetch('/api/admin/newsletter');
      if (!res.ok) throw new Error('Failed to fetch subscribers');
      return res.json();
    }
  });

  const exportCSV = () => {
    if (!subscribers) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Date Subscribed\n"
      + subscribers.map((s: any) => `${s.email},${s.createdAt}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "newsletter_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter Subscriptions</h1>
          <p className="text-muted-foreground">Manage and export your newsletter audience</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/newsletter/new">
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              <SendSquareLinear className="h-4 w-4" />
              New Campaign
            </Button>
          </Link>
          <Button onClick={exportCSV} variant="outline" disabled={!subscribers || subscribers.length === 0} className="gap-2">
            <DownloadLinear className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshLinear className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-muted/50 transition-colors">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email Address</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Subscribed On</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscribers?.map((sub: any) => (
                  <tr key={sub._id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">
                      <div className="flex items-center gap-2">
                        <LetterLinear className="h-4 w-4 text-muted-foreground" />
                        {sub.email}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {format(new Date(sub.createdAt), 'MMMM dd, yyyy')}
                    </td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
                {(!subscribers || subscribers.length === 0) && (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-muted-foreground">
                      No subscribers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
