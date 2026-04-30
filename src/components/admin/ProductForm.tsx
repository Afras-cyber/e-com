'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema, ProductInput } from '@/lib/validations/product.schema';
import { Button } from '@/components/ui/button';
import ImageUpload from '../shared/ImageUpload';
import { X, Plus } from 'lucide-react';

interface ProductFormProps {
  initialData?: any;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    defaultValues: initialData || {
      images: [],
      sizes: [],
      colors: [],
      isOnSale: false,
      isActive: true,
      inStock: true,
    }
  });

  const images = watch('images');
  const colors = watch('colors');
  const sizes = watch('sizes');

  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [newSize, setNewSize] = useState('');

  const onSubmit = async (data: ProductInput) => {
    setLoading(true);
    try {
      const url = initialData ? `/api/products/${initialData._id}` : '/api/products';
      const method = initialData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Product Name</label>
            <input {...register('name')} className="w-full p-2 border rounded-md mt-1" placeholder="e.g. Air Max 90" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          
          <div>
            <label className="text-sm font-medium">Brand</label>
            <input {...register('brand')} className="w-full p-2 border rounded-md mt-1" placeholder="e.g. Nike" />
            {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <select {...register('category')} className="w-full p-2 border rounded-md mt-1">
                <option value="shoes">Shoes</option>
                <option value="bags">Bags</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Subcategory</label>
              <input {...register('subcategory')} className="w-full p-2 border rounded-md mt-1" placeholder="e.g. Sneakers" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Price (LKR)</label>
            <input type="number" {...register('price', { valueAsNumber: true })} className="w-full p-2 border rounded-md mt-1" />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Discount Price (Optional)</label>
            <input type="number" {...register('discountPrice', { valueAsNumber: true })} className="w-full p-2 border rounded-md mt-1" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Short Description</label>
            <textarea {...register('shortDescription')} className="w-full p-2 border rounded-md mt-1 h-20" />
          </div>
          
          <div>
            <label className="text-sm font-medium">Full Description</label>
            <textarea {...register('description')} className="w-full p-2 border rounded-md mt-1 h-40" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Stock Count</label>
              <input type="number" {...register('stockCount', { valueAsNumber: true })} className="w-full p-2 border rounded-md mt-1" />
            </div>
            <div className="flex items-end gap-4 pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('isFeatured')} />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('isActive')} />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <label className="text-lg font-bold block mb-4">Product Images</label>
        <ImageUpload 
          value={images} 
          onChange={(urls) => setValue('images', urls)} 
          onRemove={(url) => setValue('images', images.filter(i => i !== url))} 
        />
        {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
        {/* Colors Section */}
        <div>
          <label className="text-lg font-bold block mb-4">Colors</label>
          <div className="flex gap-2 mb-4">
            <input 
              value={newColor.name} 
              onChange={e => setNewColor({...newColor, name: e.target.value})}
              placeholder="Color name" 
              className="flex-1 p-2 border rounded-md text-sm"
            />
            <input 
              type="color" 
              value={newColor.hex}
              onChange={e => setNewColor({...newColor, hex: e.target.value})}
              className="w-10 h-10 p-1 border rounded-md"
            />
            <Button type="button" variant="outline" onClick={() => {
              if (newColor.name) {
                setValue('colors', [...colors, newColor]);
                setNewColor({ name: '', hex: '#000000' });
              }
            }}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                <span>{c.name}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => setValue('colors', colors.filter((_, idx) => idx !== i))} />
              </div>
            ))}
          </div>
        </div>

        {/* Sizes Section */}
        <div>
          <label className="text-lg font-bold block mb-4">Sizes</label>
          <div className="flex gap-2 mb-4">
            <input 
              value={newSize} 
              onChange={e => setNewSize(e.target.value)}
              placeholder="e.g. 42, XL, 9.5" 
              className="flex-1 p-2 border rounded-md text-sm"
            />
            <Button type="button" variant="outline" onClick={() => {
              if (newSize) {
                setValue('sizes', [...sizes, newSize]);
                setNewSize('');
              }
            }}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm font-medium">
                <span>{s}</span>
                <X className="h-3 w-3 cursor-pointer" onClick={() => setValue('sizes', sizes.filter((_, idx) => idx !== i))} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-8">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
