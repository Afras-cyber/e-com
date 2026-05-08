'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoryList() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', slug: '', sizes: '', isActive: true });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (cat: any) => {
    try {
      const res = await fetch(`/api/admin/categories/${cat._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !cat.isActive }),
      });
      if (res.ok) {
        toast.success(`Category ${cat.isActive ? 'deactivated' : 'activated'}`);
        fetchCategories();
      }
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const handleSave = async (id?: string) => {
    try {
      const url = id ? `/api/admin/categories/${id}` : '/api/admin/categories';
      const method = id ? 'PATCH' : 'POST';
      const payload = {
        ...editForm,
        sizes: editForm.sizes ? editForm.sizes.split(',').map(s => s.trim()).filter(Boolean) : []
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(id ? 'Category updated' : 'Category created');
        setIsEditing(null);
        setIsAdding(false);
        setEditForm({ name: '', slug: '', sizes: '', isActive: true });
        fetchCategories();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save category');
      }
    } catch (error) {
      toast.error('Error saving category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will fail if products are linked to this category.')) return;
    
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Category deleted');
        fetchCategories();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to delete category');
      }
    } catch (error) {
      toast.error('Error deleting category');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Categories</h2>
        <Button onClick={() => { setIsAdding(true); setEditForm({ name: '', slug: '', sizes: '', isActive: true }); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Category
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
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold uppercase">Sizes (comma separated)</label>
              <input 
                className="w-full p-2 border rounded-md" 
                placeholder="e.g. S, M, L, XL"
                value={editForm.sizes} 
                onChange={e => setEditForm({ ...editForm, sizes: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleSave()} size="sm">Save</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)} size="sm">Cancel</Button>
            </div>
          </div>
        )}

        <div className="border rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-4 text-left font-bold">Category Name</th>
                <th className="p-4 text-left font-bold">Slug</th>
                <th className="p-4 text-left font-bold">Sizes</th>
                <th className="p-4 text-center font-bold">Status</th>
                <th className="p-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    {isEditing === cat._id ? (
                      <input 
                        className="p-1 border rounded" 
                        value={editForm.name} 
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    ) : (
                      <span className="font-medium">{cat.name}</span>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {isEditing === cat._id ? (
                      <input 
                        className="p-1 border rounded w-full" 
                        value={editForm.slug} 
                        onChange={e => setEditForm({ ...editForm, slug: e.target.value })}
                      />
                    ) : (
                      cat.slug
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {isEditing === cat._id ? (
                      <input 
                        className="p-1 border rounded w-full" 
                        placeholder="e.g. S, M, L"
                        value={editForm.sizes} 
                        onChange={e => setEditForm({ ...editForm, sizes: e.target.value })}
                      />
                    ) : (
                      cat.sizes?.join(', ') || '-'
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleToggleActive(cat)} className="transition-transform active:scale-95">
                      {cat.isActive ? (
                        <div className="flex items-center gap-1 text-green-500 font-bold">
                          <ToggleRight className="w-6 h-6" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-zinc-400 font-bold">
                          <ToggleLeft className="w-6 h-6" />
                          <span>Inactive</span>
                        </div>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {isEditing === cat._id ? (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => handleSave(cat._id)}>
                            <Save className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setIsEditing(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => { setIsEditing(cat._id); setEditForm({ name: cat.name, slug: cat.slug, sizes: cat.sizes?.join(', ') || '', isActive: cat.isActive }); }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(cat._id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
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
