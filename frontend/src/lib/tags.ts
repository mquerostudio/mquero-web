import { directus, type ItemsQuery } from "@/lib/directus";
import { readItems } from "@directus/sdk";

export interface Tag {
  id: number;
  name: string;
}

export interface PostTagRelation {
  id: number;
  posts_slug: string;
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
 * Get all post-tag relationships
 * @returns Promise<PostTagRelation[]> Array of post-tag relations
 */
export async function getPostTagRelations(): Promise<PostTagRelation[]> {
  return directus.request(readItems('posts_tags')) as unknown as PostTagRelation[];
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
 * Get all tags for a specific post
 * @param postSlug The slug of the post
 * @param allRelations Optional pre-fetched relations
 * @param allTags Optional pre-fetched tags
 * @returns Promise<Tag[]> Array of tags for the post
 */
export async function getTagsByPostSlug(
  postSlug: string, 
  allRelations?: PostTagRelation[],
  allTags?: Tag[]
): Promise<Tag[]> {
  // Fetch relations if not provided
  const relations = allRelations || await getPostTagRelations();
  
  // Filter relations for the specific post
  const postTagIds = relations
    .filter(relation => relation.posts_slug === postSlug)
    .map(relation => relation.tags_id);
  
  // Fetch all tags if not provided
  const tags = allTags || await getTags();
  
  // Return only the tags that match the post's tag IDs
  return tags.filter(tag => postTagIds.includes(tag.id));
} 