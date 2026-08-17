export type PageMeta = {
  title: string;
  description: string;
  path: string;
  language?: 'fr' | 'en';
};

const productionOrigin = 'https://callofchess.vercel.app';

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function setPageMeta(meta: PageMeta) {
  const canonical = `${productionOrigin}${meta.path}`;
  document.documentElement.lang = meta.language ?? 'fr';
  document.title = meta.title;
  upsertMeta('name', 'description', meta.description);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:site_name', 'Call of Chess');
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('property', 'og:title', meta.title);
  upsertMeta('property', 'og:description', meta.description);
  upsertMeta('name', 'twitter:title', meta.title);
  upsertMeta('name', 'twitter:description', meta.description);
  const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (link) link.href = canonical;
}
