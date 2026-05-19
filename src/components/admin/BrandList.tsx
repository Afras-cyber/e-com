'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AddCircleLinear, PenLinear, TrashBinTrashLinear, DisketteLinear, CloseCircleLinear, RefreshLinear, StarLinear } from "solar-icon-set";;
import { toast } from 'sonner';

export default function BrandList() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', slug: '', isActive: true, isFeatured: false });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/admin/brands');
      const data = await res.json();
      setBrands(data);
    } catch (error) {
      toast.error('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (brand: any) => {
    try {
      const res = await fetch(`/api/admin/brands/${brand._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !brand.isActive }),
      });
      if (res.ok) {
        toast.success(`Brand ${brand.isActive ? 'deactivated' : 'activated'}`);
        fetchBrands();
      }
    } catch (error) {
      toast.error('Failed to update brand');
    }
  };

  const handleToggleFeatured = async (brand: any) => {
    try {
      const res = await fetch(`/api/admin/brands/${brand._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !brand.isFeatured }),
      });
      if (res.ok) {
        toast.success(`Brand ${brand.isFeatured ? 'unfeatured' : 'featured'}`);
        fetchBrands();
      }
    } catch (error) {
      toast.error('Failed to update brand');
    }
  };

  const handleSave = async (id?: string) => {
    try {
      const url = id ? `/api/admin/brands/${id}` : '/api/admin/brands';
      const method = id ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        toast.success(id ? 'Brand updated' : 'Brand created');
        setIsEditing(null);
        setIsAdding(false);
        setEditForm({ name: '', slug: '', isActive: true, isFeatured: false });
        fetchBrands();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save brand');
      }
    } catch (error) {
      toast.error('Error saving brand');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will fail if products are linked to this brand.')) return;
    
    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Brand deleted');
        fetchBrands();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to delete brand');
      }
    } catch (error) {
      toast.error('Error deleting brand');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Brands</h2>
        <Button onClick={() => { setIsAdding(true); setEditForm({ name: '', slug: '', isActive: true, isFeatured: false }); }}>
          <AddCircleLinear className="w-4 h-4 mr-2" /> Add Brand
        </Button>
      </div>

      <div className="grid gap-4">
        {isAdding && (
          <div className="p-4 border rounded-xl bg-muted/20 flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold uppercase">Name</label>
              <input 
                className="w-full p-2 border rounded-md" 
                value={editForm.name} 
                onChange={e => setEditForm({ ...editForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold uppercase">Slug</label>
              <input 
                className="w-full p-2 border rounded-md" 
                value={editForm.slug} 
                onChange={e => setEditForm({ ...editForm, slug: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleSave()} size="sm">DisketteLinear</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)} size="sm">Cancel</Button>
            </div>
          </div>
        )}

        <div className="border rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-4 text-left font-bold">Brand Name</th>
                <th className="p-4 text-left font-bold">Slug</th>
                <th className="p-4 text-center font-bold">Featured</th>
                <th className="p-4 text-center font-bold">Status</th>
                <th className="p-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {brands.map((brand) => (
                <tr key={brand._id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    {isEditing === brand._id ? (
                      <input 
                        className="p-1 border rounded" 
                        value={editForm.name} 
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    ) : (
                      <span className="font-medium">{brand.name}</span>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {isEditing === brand._id ? (
                      <input 
                        className="p-1 border rounded" 
                        value={editForm.slug} 
                        onChange={e => setEditForm({ ...editForm, slug: e.target.value })}
                      />
                    ) : (
                      brand.slug
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleToggleFeatured(brand)}>
                      <StarLinear className={`w-5 h-5 ${brand.isFeatured ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300'}`} />
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleToggleActive(brand)} className="transition-transform active:scale-95">
                      {brand.isActive ? (
                        <div className="flex items-center gap-1 text-green-500 font-bold justify-center">
                          <RefreshLinear className="w-6 h-6" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-zinc-400 font-bold justify-center">
                          <RefreshLinear className="w-6 h-6" />
                          <span>Inactive</span>
                        </div>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {isEditing === brand._id ? (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => handleSave(brand._id)}>
                            <DisketteLinear className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setIsEditing(null)}>
                            <CloseCircleLinear className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => { setIsEditing(brand._id); setEditForm({ name: brand.name, slug: brand.slug, isActive: brand.isActive, isFeatured: brand.isFeatured }); }}>
                            <PenLinear className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(brand._id)}>
                            <TrashBinTrashLinear className="w-4 h-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
