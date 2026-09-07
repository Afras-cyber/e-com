"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Instagram } from "@/components/shared/BrandIcons";
import { siteConfig } from "@/config/site";

export default function SocialLinks() {
  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() =>
          window.open(
            siteConfig.social.instagram,
            "_blank",
          )
        }
        aria-label="Instagram"
      >
        <Instagram size={20} />
      </Button>
      {siteConfig.social.facebook && (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() =>
            window.open(
              siteConfig.social.facebook,
              "_blank",
            )
          }
          aria-label="Facebook"
        >
          <Facebook size={20} />
        </Button>
      )}
    </div>
  );
}
