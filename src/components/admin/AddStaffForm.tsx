'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateStaffSchema, CreateStaffInput } from '@/lib/validations/user.schema';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function AddStaffForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateStaffInput>({
    resolver: zodResolver(CreateStaffSchema),
  });

  const onSubmit = async (data: CreateStaffInput) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        reset();
        onSuccess();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add staff');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <input {...register('name')} className="w-full p-2 border rounded-md" placeholder="John Doe" />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <input {...register('email')} type="email" className="w-full p-2 border rounded-md" placeholder="john@stepkicks.lk" />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <input {...register('phone')} className="w-full p-2 border rounded-md" placeholder="+94XXXXXXXXX" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <select {...register('role')} className="w-full p-2 border rounded-md">
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Add Staff Member
      </Button>
      <p className="text-[10px] text-muted-foreground text-center">
        A temporary password will be emailed to them.
      </p>
    </form>
  );
}
