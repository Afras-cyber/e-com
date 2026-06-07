'use client';

import StaffTable from '@/components/admin/StaffTable';
import AddStaffForm from '@/components/admin/AddStaffForm';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AddCircleLinear, CloseCircleLinear } from "solar-icon-set";;

export default function AdminStaffPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage your team and their access levels</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "default"} className="gap-2">
          {isAdding ? <CloseCircleLinear className="h-4 w-4" /> : <AddCircleLinear className="h-4 w-4" />}
          {isAdding ? "Cancel" : "Add Staff"}
        </Button>
      </div>

      {isAdding && (
        <div className="rounded-xl border bg-card p-6 shadow-sm max-w-2xl mx-auto w-full animate-in fade-in zoom-in duration-200">
          <h2 className="text-lg font-bold mb-4">Add New Staff Member</h2>
          <AddStaffForm onSuccess={() => {
            setIsAdding(false);
            setRefreshKey(prev => prev + 1);
          }} />
        </div>
      )}

      <StaffTable key={refreshKey} />
    </div>
  );
}
