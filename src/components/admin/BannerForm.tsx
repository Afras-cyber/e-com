'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import ImageUpload from '../shared/ImageUpload';
import { RefreshLinear } from "solar-icon-set";;
import { toast } from 'sonner';

export default function BannerForm({ initialData, onSuccess }: { initialData?: any, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [pendingFile, setPendingFile] = useState<{ url: string, file: File } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      subtitle: '',
      image: '',
      link: '',
      position: 1,
      isActive: true,
    }
  });

  const image = watch('image');

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (data.image && data.image.startsWith('blob:') && pendingFile) {
        setUploadingImage(true);
        const uploadResInfo = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: pendingFile.file.name,
            contentType: pendingFile.file.type,
          }),
        });
        if (!uploadResInfo.ok) throw new Error("Failed to get upload URL");
        const { uploadUrl, fileUrl } = await uploadResInfo.json();

        const s3Res = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": pendingFile.file.type },
          body: pendingFile.file,
        });

        if (!s3Res.ok) throw new Error("Failed to upload image to S3");
        data.image = fileUrl;
        setUploadingImage(false);
      }

      const url = initialData ? `/api/admin/banners/${initialData._id}` : '/api/admin/banners';
      const method = initialData ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(`Banner ${initialData ? 'updated' : 'created'} successfully`);
        onSuccess();
      } else {
        toast.error('Failed to save banner');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Banner Title</label>
          <input {...register('title', { required: true })} className="w-full p-2 border rounded-md" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Subtitle / Tagline</label>
          <input {...register('subtitle')} className="w-full p-2 border rounded-md" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Banner Image</label>
        <ImageUpload 
          deferredUpload
          isUploading={uploadingImage}
          disabled={loading}
          value={image ? [image] : []} 
          onChange={(urls, newFile) => {
            setValue('image', urls[0] || '');
            if (newFile) {
              setPendingFile({ url: urls[0], file: newFile });
            }
          }}
          onRemove={() => {
            setValue('image', '');
            setPendingFile(null);
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Redirect Link (URL)</label>
          <input {...register('link')} className="w-full p-2 border rounded-md" placeholder="/shop?category=shoes" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Display Position (Order)</label>
          <input {...register('position', { valueAsNumber: true })} type="number" className="w-full p-2 border rounded-md" />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <RefreshLinear className="h-4 w-4 animate-spin mr-2" />}
          {loading ? (uploadingImage ? 'Uploading Image...' : 'Saving...') : initialData ? 'Update Banner' : 'Create Banner'}
        </Button>
      </div>
    </form>
  );
}
