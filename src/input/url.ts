export function parseImageUrl(text: string): URL | null {
  const trimmed = text.trim();
  if (!/^https?:\/\//i.test(trimmed)) return null;
  try {
    return new URL(trimmed);
  } catch {
    return null;
  }
}

const PROXY_ERRORS: Record<string, string> = {
  invalid_url: "That link isn't a valid web address.",
  unsupported_protocol: "Only http and https links can be loaded.",
  blocked_address:
    "That link points to a private or local address, which can't be loaded.",
  upstream_status:
    "The site didn't return the image. Check that the link opens in your browser.",
  upstream_unreachable: "The site couldn't be reached.",
  not_an_image: "That link doesn't point to an image.",
  too_large:
    "That image is too large to load by link. Download it and open the file instead.",
  timeout: "The site took too long to respond.",
  too_many_redirects: "The link redirects too many times.",
  bad_redirect: "The link redirects somewhere invalid.",
};

const GENERIC_ERROR = "The image couldn't be loaded from that link.";

export class ImageUrlError extends Error {}

function isImage(response: Response): boolean {
  return (response.headers.get("content-type") ?? "")
    .toLowerCase()
    .startsWith("image/");
}

// Tries a direct CORS request first. If the site refuses cross-origin access (fetch throws),
// the image goes once through the stateless proxy so the canvas isn't tainted.
export async function fetchImage(
  url: URL,
  proxyUrl: string,
  fetcher: typeof fetch = fetch,
): Promise<Blob> {
  let direct: Response | null = null;
  try {
    direct = await fetcher(url.href, { mode: "cors", credentials: "omit" });
  } catch {
    direct = null;
  }
  if (direct) {
    if (!direct.ok) throw new ImageUrlError(PROXY_ERRORS.upstream_status);
    if (!isImage(direct)) throw new ImageUrlError(PROXY_ERRORS.not_an_image);
    return direct.blob();
  }

  let proxied: Response;
  try {
    proxied = await fetcher(`${proxyUrl}?url=${encodeURIComponent(url.href)}`);
  } catch {
    throw new ImageUrlError(GENERIC_ERROR);
  }
  if (!proxied.ok) {
    const code = await proxied
      .json()
      .then((body: { error?: string }) => body.error ?? "")
      .catch(() => "");
    throw new ImageUrlError(PROXY_ERRORS[code] ?? GENERIC_ERROR);
  }
  if (!isImage(proxied)) throw new ImageUrlError(PROXY_ERRORS.not_an_image);
  return proxied.blob();
}
