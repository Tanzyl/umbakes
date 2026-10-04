"use client";
import { useEffect } from "react";
import { toast } from "sonner";

/** Shows a one-off toast for messages carried across a redirect via the URL. */
export function Flash({ created, error }: { created?: boolean; error?: string }) {
  useEffect(() => {
    if (error) toast.error(`Saved, but a photo couldn't be uploaded: ${error}`);
    else if (created) toast.success("Created");
    if (created || error) history.replaceState(null, "", location.pathname);
  }, [created, error]);
  return null;
}
