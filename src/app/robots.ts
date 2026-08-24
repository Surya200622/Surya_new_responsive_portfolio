import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/login', 
        '/register', 
        '/forgot-password', 
        '/reset-password', 
        '/admin',
        '/admin/',
        '/dashboard',
        '/dashboard/',
        '/api/'
      ],
    },
    sitemap: 'https://suryacs-web.vercel.app/sitemap.xml',
  }
}
