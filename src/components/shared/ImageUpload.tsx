"use client";

import { useState } from "react";
import { UploadLinear, CloseCircleLinear, RefreshLinear } from "solar-icon-set";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[], newFile?: File) => void;
  onRemove: (value: string) => void;
  deferredUpload?: boolean;
  disabled?: boolean;
  isUploading?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  deferredUpload = false,
  disabled = false,
  isUploading = false,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (deferredUpload) {
      const objectUrl = URL.createObjectURL(file);
      onChange([...value, objectUrl], file);
      return;
    }

    setLoading(true);
    try {
      // 1. Get presigned URL
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to get upload URL");
        return;
      }
      const { uploadUrl, fileUrl } = await res.json();

      // 2. Upload file directly to S3 via presigned URL
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (uploadRes.ok) {
        onChange([...value, fileUrl]);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(`Upload failed (${uploadRes.status})`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-wrap gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[150px] h-[150px] rounded-md overflow-hidden border"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                className="h-6 w-6"
                disabled={disabled || loading || isUploading}
              >
                <CloseCircleLinear className="h-4 w-4" />
              </Button>
            </div>
            <img className="object-cover w-full h-full" alt="Image" src={url} />
          </div>
        ))}
        {loading || isUploading ? (
          <div className="w-[150px] h-[150px] rounded-md border-2 border-dashed flex items-center justify-center">
            <RefreshLinear className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <label className={`w-[150px] h-[150px] rounded-md border-2 border-dashed flex flex-col items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted'} transition-colors`}>
            <UploadLinear className="h-6 w-6 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground">
              Upload Image
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onUpload}
              disabled={disabled || loading || isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
