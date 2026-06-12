"use client";

import { Button } from "@/components/ui/button";
import { Instagram } from "@/components/shared/BrandIcons";

export default function SocialLinks() {
  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() =>
          window.open(
            "https://www.instagram.com/c_r_k_shoes/?hl=en",
            "_blank",
          )
        }
      >
        <Instagram size={20} />
      </Button>
    </div>
  );
}
