import { headers } from "next/headers";
import {
  ADSENSE_CLIENT,
  ADSENSE_PATHNAME_HEADER,
  ADSENSE_SCRIPT_SRC,
  isAdSensePublicPath,
} from "@/lib/adsense";

/** Loads Auto Ads only on public marketing pages. Rendered on the server so the AdSense crawler sees the script on `/`. */
export async function AdSensePublicScript() {
  const headerStore = await headers();
  const pathname = headerStore.get(ADSENSE_PATHNAME_HEADER) || "/";
  if (!isAdSensePublicPath(pathname)) return null;

  return (
    <script
      async
      src={ADSENSE_SCRIPT_SRC}
      crossOrigin="anonymous"
      data-ad-client={ADSENSE_CLIENT}
    />
  );
}
