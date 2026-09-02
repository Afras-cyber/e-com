"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/format-price";
import { format } from "date-fns";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { buildInvoiceWhatsAppURL } from "@/lib/whatsapp";

export default function OrderManager({ id }: { id: string }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);
  const [priceInput, setPriceInput] = useState<string>("");
  const [savedPriceSuccess, setSavedPriceSuccess] = useState(false);

  const {
    data: order,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${id}`);
      return res.json();
    },
  });

  useEffect(() => {
    if (order) {
      setPriceInput(
        (order.negotiatedTotal ?? order.totalAmount ?? 0).toString()
      );
    }
  }, [order]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note }),
      });
      if (res.ok) {
        setNote("");
        refetch();
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating status");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNegotiatedPrice = async () => {
    const numericPrice = parseInt(priceInput.replace(/[^\d]/g, ""), 10);
    if (isNaN(numericPrice)) {
      toast.error("Please enter a valid price");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ negotiatedTotal: numericPrice }),
      });
      if (res.ok) {
        refetch();
        setSavedPriceSuccess(true);
        toast.success("Negotiated price updated");
        setTimeout(() => setSavedPriceSuccess(false), 2000);
      } else {
        toast.error("Failed to update price");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating price");
    } finally {
      setUpdating(false);
    }
  };

  const handleCopyOrderId = async () => {
    if (order?.orderNumber) {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      toast.success("Order ID copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-zinc-500 font-medium">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-zinc-500 gap-2">
        <p className="text-lg font-semibold">Order not found</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-zinc-900 underline font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  const pipelineStatuses = [
    "inquiry",
    "contacted",
    "negotiating",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const displayStatuses = [
    "Inquiry",
    "Contacted",
    "Negotiating",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const currentStatusLower = (order.status || "inquiry").toLowerCase();
  const currentStatusIndex = pipelineStatuses.indexOf(currentStatusLower);
  const activeStepIndex = currentStatusIndex !== -1 ? currentStatusIndex : 0;
  const isCancelled = currentStatusLower === "cancelled";
  const totalSteps = 7;
  const currentStepDisplay = isCancelled ? 7 : Math.min(activeStepIndex + 1, 7);

  const historyMap = new Map<string, { timestamp: string; note?: string }>();
  (order.statusHistory || []).forEach((item: any) => {
    if (item.status) {
      historyMap.set(item.status.toLowerCase(), {
        timestamp: item.timestamp
          ? format(new Date(item.timestamp), "MMM dd · p")
          : "",
        note: item.note,
      });
    }
  });

  const getInitials = (name: string) => {
    if (!name) return "CU";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const customerInitials = getInitials(order.customer?.name || "");
  const items = order.items || [
    {
      ...order.product,
      quantity: 1,
    },
  ];

  const displayTotal =
    order.negotiatedTotal ?? order.totalAmount ?? order.product?.price ?? 0;

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white -m-4 sm:-m-6 lg:-m-8">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 border-b border-[#E8E8EB]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 h-[64px] sm:h-[72px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.back()}
              className="h-9 w-9 shrink-0 rounded-full border border-[#E8E8EB] bg-white hover:bg-zinc-50 flex items-center justify-center transition"
              aria-label="Back"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[14px] sm:text-[16px] font-semibold tracking-[-0.01em]">
                  Manage Order
                </h1>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[12px] sm:text-[10px] tracking-wide bg-zinc-900 text-white px-2.5 py-1 rounded-full">
                    {order.orderNumber}
                  </span>
                  <button
                    onClick={handleCopyOrderId}
                    className="h-7 w-7 rounded-full border border-[#E8E8EB] bg-white hover:bg-zinc-50 flex items-center justify-center transition relative"
                    aria-label="Copy order id"
                  >
                    {copied ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15V9a2 2 0 0 1 2-2h6" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-zinc-500">
                  Received{" "}
                  {order.createdAt
                    ? format(new Date(order.createdAt), "MMM dd, yyyy · p")
                    : ""}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-wide uppercase px-2 py-0.8 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 capitalize">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="sm:hidden inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 capitalize">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {order.status}
            </span>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-medium">
                Total
              </span>
              <span className="text-[14px] font-semibold tracking-[-0.02em]">
                {formatPrice(displayTotal)}
              </span>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="grid grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 space-y-5 sm:space-y-6">
            {/* Customer & Items Card */}
            <div className="bg-white border border-[#E8E8EB] rounded-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1.4fr] divide-y md:divide-y-0 md:divide-x divide-[#E8E8EB]">
                {/* Customer Info */}
                <div className="p-6 sm:p-7">
                  <div className="text-[11px] tracking-[0.12em] font-semibold text-zinc-500 uppercase mb-5">
                    Customer
                  </div>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white flex items-center justify-center font-semibold text-[14px] shadow-sm shrink-0">
                      {customerInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[16px] font-semibold leading-tight tracking-[-0.01em]">
                        {order.customer?.name}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 text-[13.5px] text-zinc-600">
                        <span className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5 12.07a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4 1h3a2 2 0 0 1 2 1.72c.12 1.02.37 2.02.73 2.98a2 2 0 0 1-.45 2.11L9 8.5a16.5 16.5 0 0 0 6.5 6.5l.68-.3a2 2 0 0 1 2.11-.45c.96.36 1.96.61 2.98.73A2 2 0 0 1 22 17z" />
                          </svg>
                        </span>
                        {order.customer?.phone}
                      </div>
                      <div className="mt-1.5 text-[13px] text-zinc-400">
                        {order.customer?.email || "No email"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      window.open(
                        `https://wa.me/${(order.customer?.phone || "").replace(/\+/g, "")}`,
                        "_blank"
                      )
                    }
                    className="mt-6 w-full h-11 rounded-full bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1ea94f] text-white text-[14px] font-semibold flex items-center justify-center gap-2 transition shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.05 4.94A9.82 9.82 0 0 0 12.03 2C6.53 2 2.04 6.5 2.04 12c0 1.76.46 3.48 1.32 4.99L2 22l5.18-1.36A9.87 9.87 0 0 0 12.03 22c5.5 0 9.98-4.5 9.98-10 0-2.67-1.04-5.18-2.96-7.06ZM12.03 20.1a8.03 8.03 0 0 1-4.1-1.12l-.29-.17-3.08.81.82-3-.18-.31a8.04 8.04 0 0 1-1.24-4.31c0-4.45 3.61-8.07 8.07-8.07a8 8 0 0 1 5.7 2.36 8.03 8.03 0 0 1 2.35 5.71c0 4.46-3.61 8.1-8.05 8.1Zm4.42-6.04c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.57.18 1.1.15 1.51.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                    </svg>
                    Chat on WhatsApp
                  </button>

                  <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Usually replies within 2h
                  </div>
                </div>

                {/* Items List */}
                <div className="p-6 sm:p-7">
                  <div className="flex items-center justify-between mb-5">
                    <div className="text-[11px] tracking-[0.12em] font-semibold text-zinc-500 uppercase">
                      Items · {items.length}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">LKR</div>
                  </div>

                  <div className="space-y-4">
                    {items.map((item: any, i: number) => (
                      <div key={i} className="flex gap-4">
                        <div className="h-[76px] w-[76px] rounded-[14px] bg-[#F2F2F3] border border-[#E8E8EB] flex items-center justify-center shrink-0 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.productName || "Product"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              width="44"
                              height="44"
                              viewBox="0 0 48 48"
                              fill="none"
                            >
                              <path
                                d="M8 28c2-6 8-11 16-13l10-2c3-.6 6 1.5 6 4.5v4c0 2-1.2 3.8-3 4.5L23 28H8Z"
                                fill="#D9D9DC"
                                stroke="#B8B8BD"
                                strokeWidth="1.2"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M16 28l6-4"
                                stroke="#9A9AA0"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                              />
                              <circle cx="32" cy="22" r="1.6" fill="#9A9AA0" />
                            </svg>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-[14.5px] font-semibold leading-[1.35] tracking-[-0.01em] line-clamp-2">
                            {item.productName || order.product?.name}
                          </div>
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {item.selectedSize && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-medium border border-zinc-200 uppercase">
                                SIZE {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white text-zinc-700 text-[11px] font-medium border border-[#E8E8EB] uppercase">
                                {item.selectedColor}
                              </span>
                            )}
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-medium">
                              Qty {item.quantity || 1}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="text-[14px] font-semibold">
                            {formatPrice(
                              (item.price || order.product?.price || 0) *
                              (item.quantity || 1)
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500 mt-1">
                            each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-[#E8E8EB] divide-y divide-[#E8E8EB]">
                    <div className="flex items-center justify-between py-3.5">
                      <span className="text-[13px] text-zinc-500">Subtotal</span>
                      <span className="text-[13.5px] font-medium font-mono">
                        {formatPrice(
                          order.totalAmount || order.product?.price || 0
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-medium">
                          Negotiated Total
                        </span>
                        <span className="inline-flex h-5 px-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold tracking-wide uppercase ring-1 ring-emerald-200">
                          Final
                        </span>
                      </div>
                      <span className="text-[20px] font-bold tracking-[-0.02em]">
                        {formatPrice(displayTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:hidden px-6 py-3.5 bg-zinc-50 border-t border-[#E8E8EB] flex items-center justify-between">
                <span className="text-[12px] uppercase tracking-widest text-zinc-500 font-semibold">
                  Order Total
                </span>
                <span className="text-[15px] font-semibold">
                  {formatPrice(displayTotal)}
                </span>
              </div>
            </div>

            {/* Status Pipeline Card */}
            <div className="bg-white border border-[#E8E8EB] rounded-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-[15px] font-semibold tracking-[-0.01em]">
                    Status Pipeline
                  </div>
                  <div className="mt-1 text-[13px] text-zinc-500">
                    Track order progress from inquiry to delivery.
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-zinc-900 text-white text-[12px] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    {currentStepDisplay}/{totalSteps}
                  </span>
                </div>
              </div>

              <div className="relative pl-[2px]">
                <div className="absolute left-[15px] top-[8px] bottom-[8px] w-[2px] bg-zinc-100 rounded-full" />
                <div
                  className="absolute left-[15px] top-[8px] w-[2px] bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    height: isCancelled
                      ? "100%"
                      : `${Math.min((activeStepIndex / 6) * 100, 100)}%`,
                  }}
                />

                <div className="space-y-0">
                  {pipelineStatuses
                    .filter((status) => status !== "cancelled")
                    .map((statusKey, index) => {
                      const isCompleted =
                        index < activeStepIndex && !isCancelled;
                      const isCurrent =
                        index === activeStepIndex && !isCancelled;
                      const displayLabel = displayStatuses[index];
                      const historyInfo = historyMap.get(statusKey);

                      return (
                        <div
                          key={statusKey}
                          className="relative flex gap-4 py-3.5 group"
                        >
                          <div className="relative z-10 shrink-0">
                            {isCompleted ? (
                              <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_0_4px_white] ring-1 ring-emerald-200">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                >
                                  <path d="M5 12l5 5L20 7" />
                                </svg>
                              </div>
                            ) : isCurrent ? (
                              <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-[0_0_0_4px_white] ring-1 ring-zinc-900">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                >
                                  <path d="M5 12l5 5L20 7" />
                                </svg>
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-white border-2 border-zinc-200 flex items-center justify-center shadow-[0_0_0_4px_white]">
                                <span className="h-2 w-2 rounded-full bg-zinc-300" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 pt-0.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-[14px] font-semibold tracking-[-0.01em] ${isCurrent
                                  ? "text-zinc-900"
                                  : isCompleted
                                    ? "text-zinc-900"
                                    : "text-zinc-400"
                                  }`}
                              >
                                {displayLabel}
                              </span>
                              {isCurrent && (
                                <span className="inline-flex px-2 py-0.5 rounded-full bg-zinc-900 text-white text-[10px] font-semibold tracking-wide uppercase">
                                  Current
                                </span>
                              )}
                              {isCompleted && (
                                <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold tracking-wide uppercase ring-1 ring-emerald-200">
                                  Done
                                </span>
                              )}
                            </div>

                            {historyInfo?.timestamp ? (
                              <div className="mt-1 text-[12.5px] text-zinc-500 font-mono">
                                {historyInfo.timestamp}
                              </div>
                            ) : (
                              <div className="mt-1 text-[12.5px] text-zinc-400">
                                —
                              </div>
                            )}
                            {historyInfo?.note && (
                              <div className="mt-1 text-[12.5px] italic text-zinc-500 bg-zinc-50 p-2 rounded border border-zinc-100">
                                "{historyInfo.note}"
                              </div>
                            )}
                          </div>

                          <div className="absolute inset-0 -mx-2 rounded-xl bg-zinc-50 opacity-0 group-hover:opacity-100 transition -z-0" />
                        </div>
                      );
                    })}

                  {/* Cancelled Step */}
                  <div className="relative flex gap-4 py-3.5">
                    <div className="relative z-10 shrink-0">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shadow-[0_0_0_4px_white] border-2 ${isCancelled
                          ? "bg-red-600 border-red-600 text-white"
                          : "bg-white border-red-200 text-red-500"
                          }`}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[14px] font-semibold ${isCancelled ? "text-red-600" : "text-red-500"
                            }`}
                        >
                          Cancelled
                        </span>
                        {isCancelled && (
                          <span className="inline-flex px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-semibold tracking-wide uppercase">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-[12.5px] text-zinc-400">
                        {historyMap.get("cancelled")?.timestamp ||
                          "If order is cancelled"}
                      </div>
                      {historyMap.get("cancelled")?.note && (
                        <div className="mt-1 text-[12.5px] italic text-red-600 bg-red-50 p-2 rounded border border-red-100">
                          "{historyMap.get("cancelled")?.note}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-[88px] space-y-5">
              <div className="bg-white border border-[#E8E8EB] rounded-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] p-6 sm:p-6">
                <h2 className="text-[15px] font-semibold tracking-[-0.01em]">
                  Update Status
                </h2>

                <div className="mt-6">
                  <div className="text-[11px] tracking-[0.12em] font-semibold text-zinc-500 uppercase mb-3">
                    Pipeline Action
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {pipelineStatuses.map((s, idx) => {
                      const isCancelBtn = s === "cancelled";
                      const isCurrentBtn = currentStatusLower === s;
                      const label = displayStatuses[idx];

                      return (
                        <button
                          key={s}
                          onClick={() => updateStatus(s)}
                          disabled={updating}
                          className={`h-11 rounded-full text-[13px] font-medium border flex items-center justify-center gap-1.5 transition-all ${isCurrentBtn
                            ? isCancelBtn
                              ? "bg-red-600 border-red-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                              : "bg-zinc-900 border-zinc-900 text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                            : isCancelBtn
                              ? "bg-white border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
                              : "bg-white border-[#E8E8EB] text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                            }`}
                        >
                          {isCurrentBtn && (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          )}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-[11px] tracking-[0.12em] font-semibold text-zinc-500 uppercase mb-3">
                    Internal Note
                  </div>
                  <div className="relative">
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      maxLength={280}
                      placeholder="Add internal note..."
                      className="w-full min-h-[108px] rounded-[14px] border border-[#E8E8EB] bg-[#FCFCFD] px-4 py-3.5 text-[13.5px] placeholder:text-zinc-400 outline-none focus:ring-[3px] focus:ring-zinc-900/10 focus:border-zinc-900 transition resize-none"
                    />
                    <div className="absolute bottom-3 right-3 text-[11px] text-zinc-400 font-mono">
                      {note.length}/280
                    </div>
                  </div>
                </div>

                <button
                  disabled={updating}
                  onClick={() => {
                    const message = `Hi ${order.customer?.name}! This is an update regarding your order *${order.orderNumber}*.

Current Status: *${order.status.toUpperCase()}*
${note ? `Note: ${note}` : ""}

You can track your order here: ${window.location.origin}/track?order=${order.orderNumber}

Thank you for choosing ${siteConfig.name}!`.trim();
                    window.open(
                      `https://wa.me/${(order.customer?.phone || "").replace(/\+/g, "")}?text=${encodeURIComponent(message)}`,
                      "_blank"
                    );
                  }}
                  className="mt-5 w-full h-11 rounded-full bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1ea94f] text-white text-[14px] font-semibold flex items-center justify-center gap-2 transition shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.05 4.94A9.82 9.82 0 0 0 12.03 2C6.53 2 2.04 6.5 2.04 12c0 1.76.46 3.48 1.32 4.99L2 22l5.18-1.36A9.87 9.87 0 0 0 12.03 22c5.5 0 9.98-4.5 9.98-10 0-2.67-1.04-5.18-2.96-7.06ZM12.03 20.1a8.03 8.03 0 0 1-4.1-1.12l-.29-.17-3.08.81.82-3-.18-.31a8.04 8.04 0 0 1-1.24-4.31c0-4.45 3.61-8.07 8.07-8.07a8 8 0 0 1 5.7 2.36 8.03 8.03 0 0 1 2.35 5.71c0 4.46-3.61 8.1-8.05 8.1Zm4.42-6.04c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.57.18 1.1.15 1.51.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                  </svg>
                  Send Update via WhatsApp
                </button>

                <div className="mt-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E8E8EB]" />
                  <span className="text-[10.5px] tracking-[0.14em] font-semibold text-zinc-400 uppercase whitespace-nowrap">
                    Notify customer manually
                  </span>
                  <div className="h-px flex-1 bg-[#E8E8EB]" />
                </div>

                <div className="mt-6">
                  <div className="text-[11px] tracking-[0.12em] font-semibold text-zinc-500 uppercase mb-3">
                    Invoice & PDF
                  </div>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => {
                        const invoiceUrl = `${window.location.origin}/api/orders/${order.orderNumber}/invoice`;
                        const whatsappUrl = buildInvoiceWhatsAppURL({
                          customerName: order.customer?.name || "",
                          customerPhone: order.customer?.phone || "",
                          orderNumber: order.orderNumber,
                          invoiceUrl: invoiceUrl,
                          totalAmount:
                            order.negotiatedTotal ?? order.totalAmount,
                        });
                        window.open(whatsappUrl, "_blank");
                      }}
                      className="w-full h-11 rounded-full bg-zinc-900 hover:bg-black active:bg-zinc-800 text-white text-[14px] font-medium flex items-center justify-center gap-2 transition shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19.05 4.94A9.82 9.82 0 0 0 12.03 2C6.53 2 2.04 6.5 2.04 12c0 1.76.46 3.48 1.32 4.99L2 22l5.18-1.36A9.87 9.87 0 0 0 12.03 22c5.5 0 9.98-4.5 9.98-10 0-2.67-1.04-5.18-2.96-7.06ZM12.03 20.1a8.03 8.03 0 0 1-4.1-1.12l-.29-.17-3.08.81.82-3-.18-.31a8.04 8.04 0 0 1-1.24-4.31c0-4.45 3.61-8.07 8.07-8.07a8 8 0 0 1 5.7 2.36 8.03 8.03 0 0 1 2.35 5.71c0 4.46-3.61 8.1-8.05 8.1Zm4.42-6.04c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.57.18 1.1.15 1.51.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                      </svg>
                      Send Invoice via WhatsApp
                    </button>

                    <button
                      onClick={() => {
                        window.open(
                          `/api/orders/${order.orderNumber}/invoice`,
                          "_blank"
                        );
                      }}
                      className="w-full h-11 rounded-full bg-white border border-[#E8E8EB] hover:border-zinc-300 hover:bg-zinc-50 text-zinc-900 text-[14px] font-medium flex items-center justify-center gap-2 transition"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                      Download Invoice PDF
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#E8E8EB]">
                  <div className="text-[11px] tracking-[0.12em] font-semibold text-zinc-500 uppercase mb-3">
                    Final Negotiated Price
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-[13px] font-semibold text-zinc-500 pointer-events-none">
                      LKR
                    </span>
                    <input
                      value={priceInput}
                      onChange={(e) =>
                        setPriceInput(e.target.value.replace(/[^\d]/g, ""))
                      }
                      className="w-full h-11 rounded-full border border-[#E8E8EB] bg-white pl-[52px] pr-12 text-[14px] font-semibold font-mono tracking-wide outline-none focus:ring-[3px] focus:ring-zinc-900/10 focus:border-zinc-900 transition"
                      placeholder="9500"
                    />
                    <button
                      onClick={handleSaveNegotiatedPrice}
                      disabled={updating}
                      className={`absolute right-1 h-9 w-9 rounded-full flex items-center justify-center transition ${savedPriceSuccess
                        ? "bg-emerald-500 text-white"
                        : "bg-zinc-900 text-white hover:bg-black"
                        }`}
                      aria-label="Save price"
                    >
                      {savedPriceSuccess ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                          <polyline points="17 21 17 13 7 13 7 21" />
                          <polyline points="7 3 7 8 15 8" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="mt-2 text-[11.5px] text-zinc-500">
                    Press save after changing the final price.
                  </div>
                </div>
              </div>

              <div className="px-1 text-[11.5px] text-zinc-400 leading-relaxed">
                Order ID{" "}
                <span className="font-mono text-zinc-600 font-medium">
                  {order.orderNumber}
                </span>{" "}
                • Secure • Encrypted notes are not shared with customer unless sent via WhatsApp.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

