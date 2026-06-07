'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AddCircleLinear, CloseCircleLinear } from "solar-icon-set";;
import BannerTable from '@/components/admin/BannerTable';
import BannerForm from '@/components/admin/BannerForm';

export default function AdminBannersPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setIsAdding(false);
    setEditingBanner(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotional Banners</h1>
          <p className="text-muted-foreground">Manage the sliders and offers on your homepage</p>
        </div>
        <Button onClick={() => {
          if (isAdding || editingBanner) {
            setIsAdding(false);
            setEditingBanner(null);
          } else {
            setIsAdding(true);
          }
        }} variant={(isAdding || editingBanner) ? "outline" : "default"} className="gap-2">
          {(isAdding || editingBanner) ? <CloseCircleLinear className="h-4 w-4" /> : <AddCircleLinear className="h-4 w-4" />}
          {(isAdding || editingBanner) ? "Cancel" : "Create Banner"}
        </Button>
      </div>

      {(isAdding || editingBanner) && (
        <div className="rounded-xl border bg-card p-6 shadow-sm max-w-3xl mx-auto w-full animate-in fade-in zoom-in duration-200">
          <h2 className="text-lg font-bold mb-4">{editingBanner ? 'Edit Banner' : 'Create New Banner'}</h2>
          <BannerForm 
            initialData={editingBanner} 
            onSuccess={handleSuccess} 
          />
        </div>
      )}

      <BannerTable key={refreshKey} onEdit={(banner) => {
        setEditingBanner(banner);
        setIsAdding(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}
