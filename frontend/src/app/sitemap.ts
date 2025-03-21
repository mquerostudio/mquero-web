import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

// Define types for projects and articles
interface Project {
  slug: string;
  date_updated?: string;
  date_created: string;
}

interface Article {
  slug: string;
  date_updated?: string;
  date_created: string;
}

// Function to fetch projects from Directus
async function fetchProjects(): Promise<Project[]> {
  try {
    // Replace with your actual Directus API URL and authentication if needed
    const response = await fetch('https://tardis.mquero.com/items/projects?fields=slug,date_updated,date_created')
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`)
    }
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

// Function to fetch articles from Directus
async function fetchArticles(): Promise<Article[]> {
  try {
    // Replace with your actual Directus API URL and authentication if needed
    const response = await fetch('https://tardis.mquero.com/items/articles?fields=slug,date_updated,date_created')
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`)
    }
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { locales } = routing
  const baseUrl = 'https://www.mquero.com'
  
  // Define static pages
  const staticPages = [
    '',          // Home page
    'about',
    'projects',  // Projects listing page
    'articles',  // Articles listing page
    'contact'
  ]
  
  // Generate sitemap entries for static pages
  const staticSitemapEntries = staticPages.flatMap(page => 
    locales.map(locale => {
      const path = page ? `/${locale}/${page}` : `/${locale}`
      
      return {
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly' as 'weekly' | 'monthly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map(altLocale => [
              altLocale,
              `${baseUrl}/${altLocale}${page ? `/${page}` : ''}`
            ])
          )
        }
      }
    })
  )
  
  // Fetch projects and articles in parallel
  const [projects, articles] = await Promise.all([
    fetchProjects(),
    fetchArticles()
  ])
  
  // Generate sitemap entries for projects
  const projectSitemapEntries = projects.flatMap((project: Project) => 
    locales.map(locale => ({
      url: `${baseUrl}/${locale}/projects/${project.slug}`,
      lastModified: new Date(project.date_updated || project.date_created),
      changeFrequency: 'monthly' as 'monthly',
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map(altLocale => [
            altLocale,
            `${baseUrl}/${altLocale}/projects/${project.slug}`
          ])
        )
      }
    }))
  )
  
  // Generate sitemap entries for articles
  const articleSitemapEntries = articles.flatMap((article: Article) => 
    locales.map(locale => ({
      url: `${baseUrl}/${locale}/articles/${article.slug}`,
      lastModified: new Date(article.date_updated || article.date_created),
      changeFrequency: 'weekly' as 'weekly',
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map(altLocale => [
            altLocale,
            `${baseUrl}/${altLocale}/articles/${article.slug}`
          ])
        )
      }
    }))
  )
  
  // Combine all entries
  return [
    ...staticSitemapEntries,
    ...projectSitemapEntries,
    ...articleSitemapEntries
  ]
} 