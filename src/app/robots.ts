import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/admin/'], // Hide protected routes from search engines
    },
    sitemap: 'https://suryadev-nine.vercel.app/sitemap.xml',
  };
}
