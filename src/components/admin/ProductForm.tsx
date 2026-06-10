"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, ProductInput } from "@/lib/validations/product.schema";
import { Button } from "@/components/ui/button";
import ImageUpload from "../shared/ImageUpload";
import {
  CloseCircleLinear,
  AddCircleLinear,
  RefreshLinear,
} from "solar-icon-set";
import { toast } from "sonner";

interface ProductFormProps {
  initialData?: any;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [pendingFiles, setPendingFiles] = useState<
    { url: string; file: File }[]
  >([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    defaultValues: initialData || {
      images: [],
      sizes: [],
      colors: [],
      isOnSale: false,
      isAvailable: true,
      isDiscount: false,
      stock: 10,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch("/api/admin/brands"),
        ]);
        const [cats, brs] = await Promise.all([
          catsRes.json(),
          brandsRes.json(),
        ]);
        setCategories(cats);
        setBrands(brs);
      } catch (error) {
        toast.error("Failed to load categories or brands");
      } finally {
        setFetchingData(false);
      }
    };
    fetchData();
  }, []);

  const selectedCategoryId = watch("categoryId");
  const selectedBrandId = watch("brandId");

  // Sync string names for convenience
  useEffect(() => {
    if (selectedCategoryId) {
      const cat = categories.find((c) => c._id === selectedCategoryId);
      if (cat) {
        setValue("category", cat.name);

        // Auto-populate sizes if empty
        const currentSizes = watch("sizes") || [];
        if (currentSizes.length === 0 && cat.sizes && cat.sizes.length > 0) {
          setValue("sizes", cat.sizes);
        }
      }
    }
  }, [selectedCategoryId, categories, setValue, watch]);

  useEffect(() => {
    if (selectedBrandId) {
      const brand = brands.find((b) => b._id === selectedBrandId);
      if (brand) setValue("brand", brand.name);
    }
  }, [selectedBrandId, brands, setValue]);

  const images = watch("images");
  const colors = watch("colors");
  const sizes = watch("sizes");
  const isDiscount = watch("isDiscount");

  const [newColor, setNewColor] = useState({ name: "", hex: "#000000" });
  const [newSize, setNewSize] = useState("");

  const onSubmit = async (data: ProductInput) => {
    setLoading(true);
    try {
      const finalImages = [...data.images];

      const hasPending = finalImages.some((imgUrl) =>
        imgUrl.startsWith("blob:"),
      );
      if (hasPending) setUploadingImages(true);

      const uploadPromises = finalImages.map(async (imgUrl, i) => {
        if (imgUrl.startsWith("blob:")) {
          const pending = pendingFiles.find((p) => p.url === imgUrl);
          if (pending) {
            const uploadResInfo = await fetch("/api/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                filename: pending.file.name,
                contentType: pending.file.type,
              }),
            });
            if (!uploadResInfo.ok) throw new Error("Failed to get upload URL");
            const { uploadUrl, fileUrl } = await uploadResInfo.json();

            const s3Res = await fetch(uploadUrl, {
              method: "PUT",
              headers: { "Content-Type": pending.file.type },
              body: pending.file,
            });

            if (!s3Res.ok) throw new Error("Failed to upload image to S3");
            finalImages[i] = fileUrl;
          }
        }
      });

      await Promise.all(uploadPromises);

      if (hasPending) setUploadingImages(false);

      data.images = finalImages;

      const url = initialData
        ? `/api/products/${initialData._id}`
        : "/api/products";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving product");
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
            <input
              {...register("name")}
              className="w-full p-2 border rounded-md mt-1"
              placeholder="e.g. Air Max 90"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Brand</label>
            <select
              {...register("brandId")}
              className="w-full p-2 border rounded-md mt-1"
              disabled={fetchingData}
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
            {errors.brandId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.brandId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                {...register("categoryId")}
                className="w-full p-2 border rounded-md mt-1"
                disabled={fetchingData}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">
                Subcategory (Optional)
              </label>
              <input
                {...register("subcategory")}
                className="w-full p-2 border rounded-md mt-1"
                placeholder="e.g. Sneakers"
              />
              {errors.subcategory && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.subcategory.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Price (LKR)</label>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              className="w-full p-2 border rounded-md mt-1"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Discount Toggle */}
          <div className="flex items-center gap-3 py-1">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("isDiscount")}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
            </label>
            <span className="text-sm font-medium">Enable Discount</span>
          </div>

          {isDiscount && (
            <div>
              <label className="text-sm font-medium">
                Discount Price (LKR)
              </label>
              <input
                type="number"
                {...register("discountPrice", {
                  setValueAs: (v) =>
                    v === "" || v === null || v === undefined
                      ? undefined
                      : isNaN(Number(v))
                        ? undefined
                        : Number(v),
                })}
                className="w-full p-2 border rounded-md mt-1"
                placeholder="e.g. 4500"
              />
              {errors.discountPrice && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.discountPrice.message}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Short Description</label>
            <textarea
              {...register("shortDescription")}
              className="w-full p-2 border rounded-md mt-1 h-20"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Full Description</label>
            <textarea
              {...register("description")}
              className="w-full p-2 border rounded-md mt-1 h-40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Stock Count</label>
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                className="w-full p-2 border rounded-md mt-1"
              />
            </div>
            <div className="flex items-end gap-4 pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("isFeatured")} />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("isAvailable")} />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <label className="text-lg font-bold block mb-4">Product Images</label>
        <ImageUpload
          deferredUpload
          isUploading={uploadingImages}
          disabled={loading}
          value={images}
          onChange={(urls, newFile) => {
            setValue("images", urls);
            if (newFile) {
              setPendingFiles((prev) => [
                ...prev,
                { url: urls[urls.length - 1], file: newFile },
              ]);
            }
          }}
          onRemove={(url) => {
            setValue(
              "images",
              images.filter((i) => i !== url),
            );
            setPendingFiles((prev) => prev.filter((p) => p.url !== url));
          }}
        />
        {errors.images && (
          <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
        {/* Colors Section */}
        <div>
          <label className="text-lg font-bold block mb-4">Colors</label>
          <div className="flex gap-2 mb-4">
            <input
              value={newColor.name}
              onChange={(e) =>
                setNewColor({ ...newColor, name: e.target.value })
              }
              placeholder="Color name"
              className="flex-1 p-2 border rounded-md text-sm"
            />
            <input
              type="color"
              value={newColor.hex}
              onChange={(e) =>
                setNewColor({ ...newColor, hex: e.target.value })
              }
              className="w-10 h-10 p-1 border rounded-md"
            />
            <input
              type="number"
              value={
                (newColor as any).imageIndex !== undefined
                  ? (newColor as any).imageIndex
                  : ""
              }
              onChange={(e) =>
                setNewColor({
                  ...newColor,
                  imageIndex:
                    e.target.value === ""
                      ? undefined
                      : parseInt(e.target.value),
                } as any)
              }
              placeholder="Img Idx"
              className="w-20 p-2 border rounded-md text-sm"
              min="0"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (newColor.name) {
                  setValue("colors", [...colors, newColor]);
                  setNewColor({ name: "", hex: "#000000" });
                }
              }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
                <CloseCircleLinear
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setValue(
                      "colors",
                      colors.filter((_, idx) => idx !== i),
                    )
                  }
                />
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
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="e.g. 42, XL, 9.5"
              className="flex-1 p-2 border rounded-md text-sm"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (newSize) {
                  setValue("sizes", [...sizes, newSize]);
                  setNewSize("");
                }
              }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm font-medium"
              >
                <span>{s}</span>
                <CloseCircleLinear
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setValue(
                      "sizes",
                      sizes.filter((_, idx) => idx !== i),
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <RefreshLinear className="h-4 w-4 animate-spin mr-2" />}
          {loading
            ? uploadingImages
              ? "Uploading Images..."
              : "Saving..."
            : initialData
              ? "Update Product"
              : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
