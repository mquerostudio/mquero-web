import { directus, type ItemsQuery } from "@/lib/directus";
import { readItems } from "@directus/sdk";

export interface Tag {
  id: number;
  name: string;
}

export interface ArticleTagRelation {
  id: number;
  articles_id: string;
  tags_id: number;
}

/**
 * Get all tags
 * @param options Query options including fields and filters
 * @returns Promise<Tag[]> Array of tags
 */
export async function getTags(options?: ItemsQuery): Promise<Tag[]> {
  return directus.request(readItems('tags', options)) as unknown as Tag[];
}

/**
 * Get all article-tag relationships
 * @returns Promise<ArticleTagRelation[]> Array of article-tag relations
 */
export async function getArticleTagRelations(): Promise<ArticleTagRelation[]> {
  return directus.request(readItems('articles_tags')) as unknown as ArticleTagRelation[];
}

/**
 * Get tag names by tag IDs
 * @param tagIds Array of tag IDs
 * @param allTags Array of all tags (optional, will be fetched if not provided)
 * @returns Promise<string[]> Array of tag names
 */
export async function getTagNamesByIds(tagIds: number[], allTags?: Tag[]): Promise<string[]> {
  if (!tagIds || !tagIds.length) return [];
  
  // If allTags is not provided, fetch them
  const tags = allTags || await getTags();
  
  // Create a map for quick lookups
  const tagMap = new Map<number, string>();
  tags.forEach(tag => tagMap.set(tag.id, tag.name));
  
  // Return the names of the tags that match the provided IDs
  return tagIds
    .map(id => tagMap.get(id))
    .filter((name): name is string => !!name);
}

/**
 * Get all tags for a specific article
 * @param articleId The ID of the article
 * @param allRelations Optional pre-fetched relations
 * @param allTags Optional pre-fetched tags
 * @returns Promise<Tag[]> Array of tags for the article
 */
export async function getTagsByArticleId(
  articleId: string, 
  allRelations?: ArticleTagRelation[],
  allTags?: Tag[]
): Promise<Tag[]> {
  // Fetch relations if not provided
  const relations = allRelations || await getArticleTagRelations();
  
  // Filter relations for the specific article
  const articleTagIds = relations
    .filter(relation => relation.articles_id === articleId)
    .map(relation => relation.tags_id);
  
  // Fetch all tags if not provided
  const tags = allTags || await getTags();
  
  // Return only the tags that match the article's tag IDs
  return tags.filter(tag => articleTagIds.includes(tag.id));
} 