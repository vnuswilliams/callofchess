export type ShareResult = "shared" | "copied";

function getShareNavigator() {
  if (typeof navigator === "undefined") return undefined;
  return navigator as Navigator & {
    canShare?: (data?: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  };
}

export function isShareAbortError(error: unknown) {
  return (
    typeof DOMException !== "undefined" &&
    error instanceof DOMException &&
    error.name === "AbortError"
  );
}

export async function copyText(value: string): Promise<void> {
  const shareNavigator = getShareNavigator();
  if (shareNavigator?.clipboard?.writeText) {
    try {
      await shareNavigator.clipboard.writeText(value);
      return;
    } catch {
      // Continue with the textarea fallback when clipboard permissions are unavailable.
    }
  }

  if (typeof document === "undefined" || !document.body)
    throw new Error("Clipboard unavailable");

  const area = document.createElement("textarea");
  area.value = value;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  try {
    if (!document.execCommand("copy")) throw new Error("Clipboard unavailable");
  } finally {
    area.remove();
  }
}

export async function shareOrCopy(data: ShareData): Promise<ShareResult> {
  const shareNavigator = getShareNavigator();
  const share = shareNavigator?.share;
  let supported = typeof share === "function";

  if (supported && typeof shareNavigator?.canShare === "function") {
    try {
      supported = shareNavigator.canShare(data);
    } catch {
      supported = false;
    }
  }

  if (supported && share) {
    try {
      await share(data);
      return "shared";
    } catch (error) {
      if (isShareAbortError(error)) throw error;
      // Some browsers expose navigator.share but cannot complete it in the current context.
      // Copying the public URL remains a usable, device-agnostic fallback.
    }
  }

  await copyText(data.url ?? data.text ?? "");
  return "copied";
}
