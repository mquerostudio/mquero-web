import { directus, type ItemsQuery } from "@/lib/directus";
import { readItems, readItem } from "@directus/sdk";

export interface Article {
  id: string;
  status: string;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  slug: string;
  translations: number[];
  tags: number[];
}

export interface ArticleTranslation {
  id: number;
  articles_id: string;
  languages_code: string;
  cover_image: string;
  summary: string;
  content: string;
  title: string;
}

export interface ArticleWithTranslation extends Article {
  title?: string;
  summary?: string;
  content?: string;
  cover_image?: string;
  languages_code?: string;
}

/**
 * Get all articles
 * @param options Query options including fields and filters
 * @returns Promise<Article[]> Array of articles
 */
export async function getArticles(options?: ItemsQuery): Promise<Article[]> {
  return directus.request(readItems('articles', options)) as unknown as Article[];
}

/**
 * Get article translations
 * @param options Query options including fields and filters
 * @returns Promise<ArticleTranslation[]> Array of article translations
 */
export async function getArticleTranslations(options?: ItemsQuery): Promise<ArticleTranslation[]> {
  return directus.request(readItems('articles_translations', options)) as unknown as ArticleTranslation[];
}

/**
 * Get a single article by slug with the specified language translation
 * @param slug Article slug
 * @param languageCode Language code (e.g., 'en', 'es')
 * @returns Promise<ArticleWithTranslation | undefined> Article with translation or undefined if not found
 */
export async function getArticleBySlug(slug: string, languageCode: string): Promise<ArticleWithTranslation | undefined> {
  // Fetch the article by slug
  const articles = await getArticles({
    fields: ['id', 'slug', 'status', 'date_created', 'translations', 'tags'],
    filter: {
      _and: [
        { slug: { _eq: slug } },
        { status: { _eq: 'published' } }
      ]
    }
  });
  
  if (!Array.isArray(articles) || articles.length === 0) {
    return undefined;
  }
  
  const article = articles[0];
  
  // Fetch the translation for the requested language
  const translations = await getArticleTranslations({
    filter: {
      _and: [
        { articles_id: { _eq: article.id } },
        { languages_code: { _eq: languageCode } }
      ]
    }
  });
  
  if (!Array.isArray(translations) || translations.length === 0) {
    // If no translation found for requested language, return article without translation data
    return article;
  }
  
  const translation = translations[0];
  
  // Combine article and translation data
  return {
    ...article,
    title: translation.title,
    summary: translation.summary,
    content: translation.content,
    cover_image: translation.cover_image,
    languages_code: translation.languages_code
  };
}

/**
 * Get all articles with translations for a specific language
 * @param languageCode Language code (e.g., 'en', 'es')
 * @returns Promise<ArticleWithTranslation[]> Array of articles with translations
 */
export async function getArticlesWithTranslations(languageCode: string): Promise<ArticleWithTranslation[]> {
  // Fetch all published articles
  const articles = await getArticles({
    fields: ['id', 'slug', 'status', 'date_created', 'translations', 'tags'],
    filter: {
      status: { _eq: 'published' }
    }
  });
  
  if (!Array.isArray(articles) || articles.length === 0) {
    return [];
  }
  
  // Fetch all translations for the requested language
  const translations = await getArticleTranslations({
    filter: {
      languages_code: { _eq: languageCode }
    }
  });
  
  if (!Array.isArray(translations) || translations.length === 0) {
    return articles;
  }
  
  // Create a map of translations by article ID for quick lookup
  const translationMap = new Map<string, ArticleTranslation>();
  translations.forEach(translation => {
    translationMap.set(translation.articles_id, translation);
  });
  
  // Combine articles with their translations
  return articles.map(article => {
    const translation = translationMap.get(article.id);
    
    if (!translation) {
      return article;
    }
    
    return {
      ...article,
      title: translation.title,
      summary: translation.summary,
      content: translation.content,
      cover_image: translation.cover_image,
      languages_code: translation.languages_code
    };
  });
}

/**
 * Parse tag IDs from an article
 * @param tags Tags as number[] or string representation of number[]
 * @returns Array of tag IDs
 */
export function parseTagIds(tags?: number[] | string): number[] {
  if (!tags) return [];
  
  if (Array.isArray(tags)) {
    return tags.filter(tag => typeof tag === 'number');
  }
  
  try {
    const parsedTags = JSON.parse(tags);
    return Array.isArray(parsedTags) 
      ? parsedTags.filter(tag => typeof tag === 'number')
      : [];
  } catch (e) {
    return [];
  }
}