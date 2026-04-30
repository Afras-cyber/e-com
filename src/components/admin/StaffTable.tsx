'use client';

import { useQuery } from '@tanstack/react-query';
import { UserPlus, Shield, User as UserIcon, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function StaffTable() {
  const { data: staff, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-staff'],
    queryFn: async () => {
      const res = await fetch('/api/admin/staff');
      return res.json();
    }
  });

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/staff/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    try {
      const res = await fetch(`/api/admin/staff/${id}`, { method: 'DELETE' });
      if (res.ok) refetch();
      else {
        const err = await res.json();
        alert(err.error || 'Failed to delete');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading staff...</div>;

  return (
    <div className="rounded-md border bg-card">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Joined</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {staff?.map((user: any) => (
              <tr key={user._id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-1.5 capitalize font-medium">
                    {user.role === 'admin' ? (
                      <Shield className="h-3 w-3 text-orange-500" />
                    ) : (
                      <UserIcon className="h-3 w-3 text-blue-500" />
                    )}
                    {user.role}
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <button onClick={() => toggleStatus(user._id, user.isActive)} className="flex items-center gap-1">
                    {user.isActive ? (
                      <div className="flex items-center text-green-600 gap-1 font-bold text-xs uppercase">
                        <CheckCircle className="h-3 w-3" />
                        Active
                      </div>
                    ) : (
                      <div className="flex items-center text-muted-foreground gap-1 font-bold text-xs uppercase">
                        <XCircle className="h-3 w-3" />
                        Inactive
                      </div>
                    )}
                  </button>
                </td>
                <td className="p-4 align-middle text-muted-foreground">
                  {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="p-4 align-middle text-right">
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteStaff(user._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
