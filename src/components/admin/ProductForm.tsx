"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, ProductInput } from "@/lib/validations/product.schema";
import { toast } from "sonner";

interface ProductFormProps {
  initialData?: any;
}

const ToggleSwitch = ({
  enabled,
  onChange,
  disabled = false,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-[26px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border transition-all duration-200 ${
      enabled ? "bg-black border-black" : "bg-[#E9E9EC] border-[#E9E9EC]"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    role="switch"
    aria-checked={enabled}
  >
    <span
      className={`inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
        enabled ? "translate-x-[21px]" : "translate-x-[2px]"
      }`}
    />
  </button>
);

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

  const [newColor, setNewColor] = useState({
    name: "",
    hex: "#000000",
    imageIndex: "",
  });
  const [newSize, setNewSize] = useState("");

  const defaultValues: ProductInput = initialData
    ? {
        ...initialData,
        categoryId:
          typeof initialData.categoryId === "object"
            ? initialData.categoryId?._id
            : initialData.categoryId || "",
        brandId:
          typeof initialData.brandId === "object"
            ? initialData.brandId?._id
            : initialData.brandId || "",
        category: initialData.category || "",
        brand: initialData.brand || "",
        subcategory: initialData.subcategory || "",
        images: initialData.images || [],
        sizes: initialData.sizes || [],
        colors: initialData.colors || [],
        isDiscount: initialData.isDiscount ?? false,
        isAvailable: initialData.isAvailable ?? true,
        isFeatured: initialData.isFeatured ?? false,
        isOnSale: initialData.isOnSale ?? false,
        stock: initialData.stock ?? 10,
        price: initialData.price ?? 0,
        discountPrice: initialData.discountPrice,
        shortDescription: initialData.shortDescription || "",
        description: initialData.description || "",
      }
    : {
        name: "",
        shortDescription: "",
        description: "",
        categoryId: "",
        brandId: "",
        category: "",
        brand: "",
        subcategory: "",
        price: 0,
        isDiscount: false,
        discountPrice: undefined,
        images: [],
        sizes: [],
        colors: [],
        stock: 10,
        isAvailable: true,
        isFeatured: false,
        isOnSale: false,
      };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
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
        setCategories(Array.isArray(cats) ? cats : []);
        setBrands(Array.isArray(brs) ? brs : []);
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
    if (selectedCategoryId && categories.length > 0) {
      const cat = categories.find((c) => c._id === selectedCategoryId);
      if (cat) {
        setValue("category", cat.name);

        // Auto-populate sizes if empty
        const currentSizes = watch("sizes") || [];
        if (currentSizes.length === 0 && cat.sizes && cat.sizes.length > 0) {
          setValue("sizes", cat.sizes, { shouldValidate: true });
        }
      }
    }
  }, [selectedCategoryId, categories, setValue, watch]);

  useEffect(() => {
    if (selectedBrandId && brands.length > 0) {
      const brand = brands.find((b) => b._id === selectedBrandId);
      if (brand) setValue("brand", brand.name);
    }
  }, [selectedBrandId, brands, setValue]);

  const name = watch("name");
  const price = watch("price");
  const stock = watch("stock");
  const isDiscount = watch("isDiscount") ?? false;
  const isFeatured = watch("isFeatured") ?? false;
  const isAvailable = watch("isAvailable") ?? true;
  const shortDescription = watch("shortDescription") || "";
  const description = watch("description") || "";
  const images = watch("images") || [];
  const colors = watch("colors") || [];
  const sizes = watch("sizes") || [];
  const categoryName = watch("category") || "";
  const brandName = watch("brand") || "";
  const subcategory = watch("subcategory") || "";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newObjectUrls: string[] = [];
    const newPending: { url: string; file: File }[] = [];

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newObjectUrls.push(url);
      newPending.push({ url, file });
    });

    setValue("images", [...images, ...newObjectUrls], {
      shouldValidate: true,
    });
    setPendingFiles((prev) => [...prev, ...newPending]);
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setValue(
      "images",
      images.filter((img) => img !== urlToRemove),
      { shouldValidate: true }
    );
    setPendingFiles((prev) => prev.filter((p) => p.url !== urlToRemove));
  };

  const handleAddColor = () => {
    if (!newColor.name.trim()) return;
    const colorObj: { name: string; hex: string; imageIndex?: number } = {
      name: newColor.name.trim(),
      hex: newColor.hex || "#000000",
    };
    if (newColor.imageIndex !== "" && !isNaN(Number(newColor.imageIndex))) {
      colorObj.imageIndex = Number(newColor.imageIndex);
    }
    setValue("colors", [...colors, colorObj], { shouldValidate: true });
    setNewColor({ name: "", hex: "#000000", imageIndex: "" });
  };

  const handleRemoveColor = (indexToRemove: number) => {
    setValue(
      "colors",
      colors.filter((_, idx) => idx !== indexToRemove),
      { shouldValidate: true }
    );
  };

  const handleAddSize = () => {
    if (!newSize.trim()) return;
    const sizeItems = newSize
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setValue("sizes", [...sizes, ...sizeItems], { shouldValidate: true });
    setNewSize("");
  };

  const handleRemoveSize = (indexToRemove: number) => {
    setValue(
      "sizes",
      sizes.filter((_, idx) => idx !== indexToRemove),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: ProductInput) => {
    setLoading(true);
    try {
      const finalImages = [...data.images];

      const hasPending = finalImages.some((imgUrl) =>
        imgUrl.startsWith("blob:")
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
        toast.success(
          initialData
            ? "Product updated successfully"
            : "Product created successfully"
        );
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

  const skuDisplay = initialData?.sku
    ? initialData.sku
    : initialData?._id
    ? `SKU • ${initialData._id.slice(-8).toUpperCase()}`
    : "NEW PRODUCT";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-[#F9F9FB] text-[#111113] font-[Inter,ui-sans-serif,system-ui] antialiased -m-4 sm:-m-6 lg:-m-8"
    >
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-[#E9E9EC] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1360px] items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#E9E9EC] bg-white hover:bg-[#F9F9FB] transition"
              aria-label="Back"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="hidden md:block h-6 w-px bg-[#E9E9EC]" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-semibold tracking-[-0.02em] leading-none">
                  {initialData ? "Edit Product" : "Create Product"}
                </h1>
                <span className="hidden md:inline-flex items-center rounded-full bg-[#F2F2F4] px-2.5 py-0.5 text-[11px] font-medium text-[#6E6E77]">
                  {skuDisplay}
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-none text-[#6E6E77]">
                {initialData
                  ? "Update your product details and inventory."
                  : "Add new product details and inventory."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="h-[40px] rounded-full border border-[#E9E9EC] bg-white px-5 text-[14px] font-medium hover:bg-[#F9F9FB] transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-[40px] rounded-full bg-black px-5 text-[14px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] hover:bg-[#1a1a1a] active:translate-y-px transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {loading
                ? uploadingImages
                  ? "Uploading Images..."
                  : "Saving..."
                : initialData
                ? "Update Product"
                : "Create Product"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-6 px-5 py-6 md:grid-cols-12 md:px-8 md:py-8">
        {/* Left Column (Main Form Sections) */}
        <div className="md:col-span-8 flex flex-col gap-5">
          {/* Section 1: Product Information */}
          <section className="rounded-[20px] border border-[#E9E9EC] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[14px] font-semibold tracking-[-0.01em]">
                Product Information
              </h2>
              <span className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
                General • Required
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E77]">
                  Product Name
                </label>
                <input
                  {...register("name")}
                  className="h-[44px] w-full rounded-xl border border-[#E9E9EC] bg-white px-4 text-[14px] font-medium outline-none placeholder:text-[#A1A1AA] focus:border-black focus:ring-[3px] focus:ring-black/10 transition"
                  placeholder="e.g. Nike Air Zoom Mercurial Vapor 16"
                />
                {errors.name && (
                  <p className="mt-1.5 text-[12px] text-red-500 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E77]">
                    Brand
                  </label>
                  <div className="relative">
                    <select
                      value={selectedBrandId}
                      {...register("brandId")}
                      disabled={fetchingData}
                      className="h-[44px] w-full appearance-none rounded-xl border border-[#E9E9EC] bg-white px-4 pr-10 text-[14px] font-medium outline-none focus:border-black focus:ring-[3px] focus:ring-black/10 disabled:opacity-50"
                    >
                      <option value="">Select Brand</option>
                      {brands.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </div>
                  {errors.brandId && (
                    <p className="mt-1.5 text-[12px] text-red-500 font-medium">
                      {errors.brandId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E77]">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategoryId}
                      {...register("categoryId")}
                      disabled={fetchingData}
                      className="h-[44px] w-full appearance-none rounded-xl border border-[#E9E9EC] bg-white px-4 pr-10 text-[14px] font-medium outline-none focus:border-black focus:ring-[3px] focus:ring-black/10 disabled:opacity-50"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </div>
                  {errors.categoryId && (
                    <p className="mt-1.5 text-[12px] text-red-500 font-medium">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E77]">
                    Subcategory (Optional)
                  </label>
                  <input
                    {...register("subcategory")}
                    placeholder="e.g. Futsal"
                    className="h-[44px] w-full rounded-xl border border-[#E9E9EC] bg-white px-4 text-[14px] font-medium outline-none placeholder:text-[#A1A1AA] focus:border-black focus:ring-[3px] focus:ring-black/10 transition"
                  />
                  {errors.subcategory && (
                    <p className="mt-1.5 text-[12px] text-red-500 font-medium">
                      {errors.subcategory.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Pricing & Inventory */}
          <section className="rounded-[20px] border border-[#E9E9EC] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-7">
            <h2 className="mb-6 text-[14px] font-semibold tracking-[-0.01em]">
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E77]">
                  Price (LKR)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-medium text-[#6E6E77]">
                    LKR
                  </span>
                  <input
                    type="number"
                    step="any"
                    {...register("price", { valueAsNumber: true })}
                    className="h-[44px] w-full rounded-xl border border-[#E9E9EC] bg-white pl-[52px] pr-4 text-[14px] font-medium outline-none focus:border-black focus:ring-[3px] focus:ring-black/10 transition"
                    placeholder="19990"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1.5 text-[12px] text-red-500 font-medium">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E77]">
                  Stock Count
                </label>
                <input
                  type="number"
                  {...register("stock", { valueAsNumber: true })}
                  className="h-[44px] w-full rounded-xl border border-[#E9E9EC] bg-white px-4 text-[14px] font-medium outline-none focus:border-black focus:ring-[3px] focus:ring-black/10 transition"
                  placeholder="10"
                />
                {errors.stock && (
                  <p className="mt-1.5 text-[12px] text-red-500 font-medium">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {/* Enable Discount Toggle */}
              <div className="flex items-center justify-between rounded-[14px] border border-[#E8E8EB] bg-[#FBFBFD] px-4 py-3.5">
                <div className="pr-4">
                  <p className="text-[13px] font-medium">Enable Discount</p>
                  <p className="mt-0.5 text-[12px] text-[#6E6E77]">
                    Apply a promotional price. Overrides base price.
                  </p>
                </div>
                <ToggleSwitch
                  enabled={isDiscount}
                  onChange={(val) =>
                    setValue("isDiscount", val, { shouldValidate: true })
                  }
                />
              </div>

              {/* Conditional Discount Price Input */}
              {isDiscount && (
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E77]">
                    Discount Price (LKR)
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-medium text-[#6E6E77]">
                      LKR
                    </span>
                    <input
                      type="number"
                      step="any"
                      {...register("discountPrice", {
                        setValueAs: (v) =>
                          v === "" || v === null || v === undefined
                            ? undefined
                            : isNaN(Number(v))
                            ? undefined
                            : Number(v),
                      })}
                      className="h-[44px] w-full rounded-xl border border-[#E9E9EC] bg-white pl-[52px] pr-4 text-[14px] font-medium outline-none focus:border-black focus:ring-[3px] focus:ring-black/10 transition"
                      placeholder="e.g. 14990"
                    />
                  </div>
                  {errors.discountPrice && (
                    <p className="mt-1.5 text-[12px] text-red-500 font-medium">
                      {errors.discountPrice.message}
                    </p>
                  )}
                </div>
              )}

              {/* Toggles Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-[14px] border border-[#E9E9EC] bg-[#FBFBFD] px-4 py-3.5">
                  <div>
                    <p className="text-[13px] font-medium">Featured product</p>
                    <p className="mt-0.5 text-[12px] text-[#6E6E77]">
                      Show on homepage highlight.
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={isFeatured}
                    onChange={(val) =>
                      setValue("isFeatured", val, { shouldValidate: true })
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-[14px] border border-black bg-black px-4 py-3.5 text-white">
                  <div>
                    <p className="text-[13px] font-medium">Active</p>
                    <p className="mt-0.5 text-[12px] text-white/60">
                      Visible to customers.
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={isAvailable}
                    onChange={(val) =>
                      setValue("isAvailable", val, { shouldValidate: true })
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Description */}
          <section className="rounded-[20px] border border-[#E9E9EC] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-7">
            <h2 className="mb-6 text-[14px] font-semibold">Description</h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E77]">
                  Short Description
                </label>
                <input
                  {...register("shortDescription")}
                  className="h-[44px] w-full rounded-xl border border-[#E9E9EC] bg-white px-4 text-[14px] outline-none focus:border-black focus:ring-[3px] focus:ring-black/10 transition"
                  placeholder="e.g. Nike Mercurial TF"
                />
                <div className="mt-2 flex justify-between text-[11px] text-[#9CA3AF]">
                  <span>Shown in listings & cards</span>
                  <span>{shortDescription.length}/200</span>
                </div>
                {errors.shortDescription && (
                  <p className="mt-1 text-[12px] text-red-500 font-medium">
                    {errors.shortDescription.message}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E77]">
                    Full Description (Optional)
                  </label>
                  <span className="text-[11px] text-[#9CA3AF]">
                    Markdown supported • {description.length} chars
                  </span>
                </div>
                <div className="rounded-xl border border-[#E9E9EC] bg-white focus-within:border-black focus-within:ring-[3px] focus-within:ring-black/10 transition">
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="min-h-[118px] w-full resize-y rounded-xl bg-transparent px-4 py-3.5 text-[14px] leading-[1.6] outline-none placeholder:text-[#A1A1AA]"
                    placeholder="Full product details..."
                  />
                  <div className="flex items-center gap-2 border-t border-[#F1F1F3] px-3 py-2 text-[11px] text-[#9CA3AF]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Auto-save on
                    </span>
                    <span className="mx-1 h-3 w-px bg-[#E9E9EC]" />
                    <span>Use line breaks for formatting</span>
                  </div>
                </div>
                {errors.description && (
                  <p className="mt-1 text-[12px] text-red-500 font-medium">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Section 4: Product Images */}
          <section className="rounded-[20px] border border-[#E9E9EC] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-7">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[14px] font-semibold">Product Images</h2>
              <span className="rounded-full bg-[#F2F2F4] px-2.5 py-1 text-[11px] font-medium text-[#6E6E77]">
                {images.length}/10 images
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {images.map((url, idx) => (
                <div
                  key={url}
                  className="group relative overflow-hidden rounded-[16px] border border-[#E9E9EC] bg-[#FBFBFD] aspect-square"
                >
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white shadow-sm border border-black/5 opacity-0 group-hover:opacity-100 transition"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                  {idx === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold text-white">
                      Cover
                    </span>
                  )}
                </div>
              ))}

              {/* Upload Input Tile */}
              <label className="group grid aspect-square place-items-center rounded-[16px] border border-dashed border-[#D4D4D8] bg-[#FBFBFD] p-4 text-center cursor-pointer transition hover:border-black hover:bg-white">
                <div>
                  <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-white border border-[#E9E9EC] shadow-sm group-hover:border-black transition">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <path d="M12 5v14M5 12h14" />
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    </svg>
                  </div>
                  <p className="mt-3 text-[13px] font-medium">Upload Image</p>
                  <p className="mt-1 text-[11px] leading-[1.3] text-[#6E6E77]">
                    Select file or drag
                    <br />
                    PNG, JPG up to 8MB
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  disabled={loading}
                />
              </label>
            </div>

            {errors.images && (
              <p className="mt-3 text-[12px] text-red-500 font-medium">
                {errors.images.message}
              </p>
            )}

            <div className="mt-4 flex items-center gap-2 text-[11px] text-[#6E6E77]">
              <div className="h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-[#E9E9EC]">
                <div className="h-full w-[68%] rounded-full bg-black" />
              </div>
              <span>Uploads optimized • WebP auto</span>
            </div>
          </section>

          {/* Section 5: Variants */}
          <section className="rounded-[20px] border border-[#E9E9EC] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-7">
            <h2 className="mb-6 text-[14px] font-semibold">Variants</h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Colors */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E77]">
                    Colors
                  </label>
                  <span className="text-[11px] text-[#9CA3AF]">
                    {colors.length} variant{colors.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={newColor.name}
                    onChange={(e) =>
                      setNewColor({ ...newColor, name: e.target.value })
                    }
                    placeholder="Color name"
                    className="h-[40px] min-w-0 flex-1 rounded-xl border border-[#E9E9EC] bg-white px-3 text-[13px] outline-none placeholder:text-[#A1A1AA] focus:border-black focus:ring-[3px] focus:ring-black/10"
                  />
                  <div className="relative h-[40px] w-[40px] shrink-0 overflow-hidden rounded-xl border border-[#E9E9EC] bg-white">
                    <input
                      type="color"
                      value={newColor.hex}
                      onChange={(e) =>
                        setNewColor({ ...newColor, hex: e.target.value })
                      }
                      className="absolute inset-[-6px] h-[52px] w-[52px] cursor-pointer border-0 p-0"
                    />
                  </div>
                  <input
                    type="number"
                    value={newColor.imageIndex}
                    onChange={(e) =>
                      setNewColor({ ...newColor, imageIndex: e.target.value })
                    }
                    placeholder="Img"
                    className="h-[40px] w-[48px] rounded-xl border border-[#E9E9EC] bg-white px-2 text-center text-[13px] outline-none focus:border-black focus:ring-[3px] focus:ring-black/10"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="h-[40px] shrink-0 rounded-xl bg-black px-4 text-[13px] font-medium text-white hover:bg-[#1a1a1a] transition"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {colors.map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 rounded-full bg-[#F2F2F4] py-1 pl-1 pr-1 text-[12px] font-medium"
                    >
                      <span
                        className="grid h-6 w-6 place-items-center rounded-full border border-black/10"
                        style={{ background: c.hex }}
                      />
                      <span className="pr-1">{c.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(i)}
                        className="grid h-5 w-5 place-items-center rounded-full bg-white border border-[#E9E9EC] hover:bg-black hover:text-white hover:border-black transition"
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        >
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                {errors.colors && (
                  <p className="mt-2 text-[12px] text-red-500 font-medium">
                    {errors.colors.message}
                  </p>
                )}
              </div>

              {/* Sizes */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E77]">
                    Sizes
                  </label>
                  <span className="text-[11px] text-[#9CA3AF]">
                    Size options
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSize();
                      }
                    }}
                    placeholder="e.g. 42, XL, 9.5"
                    className="h-[40px] min-w-0 flex-1 rounded-xl border border-[#E9E9EC] bg-white px-3 text-[13px] outline-none placeholder:text-[#A1A1AA] focus:border-black focus:ring-[3px] focus:ring-black/10"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="h-[40px] shrink-0 rounded-xl bg-black px-4 text-[13px] font-medium text-white hover:bg-[#1a1a1a] transition"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {sizes.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#E9E9EC] bg-white px-1 py-1 text-[12px] font-medium shadow-[0_1px_1px_rgba(0,0,0,0.03)]"
                    >
                      <span className="rounded-full bg-[#111113] px-2.5 py-1 text-white">
                        {s}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(i)}
                        className="grid h-6 w-6 place-items-center rounded-full hover:bg-[#F2F2F4] transition"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                {errors.sizes && (
                  <p className="mt-2 text-[12px] text-red-500 font-medium">
                    {errors.sizes.message}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (Sidebar Preview & Tips) */}
        <div className="md:col-span-4">
          <div className="sticky top-[88px] flex flex-col gap-5">
            {/* Live Preview Card */}
            <div className="rounded-[20px] border border-[#E9E9EC] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold">Preview</h3>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    isAvailable
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-[#F2F2F4] text-[#6E6E77]"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isAvailable ? "bg-emerald-500" : "bg-[#9CA3AF]"
                    }`}
                  />
                  {isAvailable ? "Active" : "Draft"}
                </span>
              </div>

              <div className="overflow-hidden rounded-[14px] border border-[#E9E9EC] bg-[#FBFBFD]">
                {images.length > 0 ? (
                  <img
                    src={images[0]}
                    alt="preview"
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[4/3] w-full bg-[#F2F2F4] flex items-center justify-center text-[#9CA3AF] text-[13px]">
                    No Cover Image
                  </div>
                )}
                <div className="p-3.5">
                  <p className="line-clamp-2 text-[13px] font-semibold leading-[1.35]">
                    {name || "Product Name"}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-[14px] font-semibold tracking-tight">
                      LKR {Number(price || 0).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-[#6E6E77]">
                      {stock || 0} in stock
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {colors.slice(0, 2).map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full bg-[#F2F2F4] px-2 py-1 text-[10px] font-medium"
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full border border-black/10"
                          style={{ background: c.hex }}
                        />
                        {c.name}
                      </span>
                    ))}
                    <span className="rounded-full bg-black px-2 py-1 text-[10px] font-medium text-white">
                      {sizes.length} sizes
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-xl bg-[#F9F9FB] p-3">
                  <p className="text-[#6E6E77]">Category</p>
                  <p className="mt-1 font-medium truncate">
                    {categoryName || "Not set"}{" "}
                    {subcategory ? `• ${subcategory}` : ""}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F9F9FB] p-3">
                  <p className="text-[#6E6E77]">Brand</p>
                  <p className="mt-1 font-medium truncate">
                    {brandName || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions / Tips */}
            <div className="rounded-[20px] border border-[#E9E9EC] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <h3 className="text-[13px] font-semibold">Quick actions</h3>
              <div className="mt-4 space-y-3 text-[12px] leading-[1.5] text-[#6E6E77]">
                <div className="flex gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                  <span>
                    <b className="font-medium text-[#111113]">
                      Image order matters.
                    </b>{" "}
                    First image is cover.
                  </span>
                </div>
                <div className="flex gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                  <span>
                    Link color variants to image index for accurate preview.
                  </span>
                </div>
                <div className="flex gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                  <span>
                    Stock 1 will show low-stock warning to shoppers.
                  </span>
                </div>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="rounded-[20px] border border-dashed border-[#D4D4D8] bg-[#FCFCFD] p-4">
              <p className="text-[12px] font-medium">Need help?</p>
              <p className="mt-1 text-[12px] leading-[1.5] text-[#6E6E77]">
                Pricing, inventory and variants update instantly on the
                storefront. Use Active toggle to hide without deleting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

