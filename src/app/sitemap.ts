import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://suryadev-nine.vercel.app',
      lastModified: new Date(),
    },
    {
      url: 'https://suryadev-nine.vercel.app/about',
      lastModified: new Date(),
    },
    {
      url: 'https://suryadev-nine.vercel.app/projects',
      lastModified: new Date(),
    },
    {
      url: 'https://suryadev-nine.vercel.app/contact',
      lastModified: new Date(),
    },
  ]
}
