"use client";

import { useEffect } from "react";
import { DangerTriangleLinear, RefreshCircleLinear } from "solar-icon-set";;
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="h-20 w-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
        <DangerTriangleLinear size={40} />
      </div>
      
      <h2 className="text-3xl font-bold mb-4 tracking-tight">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        We encountered an unexpected error while trying to load this page. Our team has been notified.
      </p>

      <Button 
        onClick={() => reset()} 
        className="gap-2"
        size="lg"
      >
        <RefreshCircleLinear size={18} />
        Try again
      </Button>
    </div>
  );
}
