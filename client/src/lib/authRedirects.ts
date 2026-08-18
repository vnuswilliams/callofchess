/**
 * Canonical destination used by confirmation and recovery emails.
 *
 * Keeping this origin outside window.location prevents a local development
 * origin from leaking into emails sent by the production Supabase project.
 * It can be replaced later with VITE_PUBLIC_SITE_URL without changing the
 * authentication flow.
 */
export const authRedirectOrigin = (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, "") || "https://www.callofchess.online";

export const authRedirect = (path: string) => `${authRedirectOrigin}${path.startsWith("/") ? path : `/${path}`}`;
