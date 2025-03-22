import { directus, type ItemsQuery } from "@/lib/directus";
import { readItems } from "@directus/sdk";

export interface Project {
  id: string;
  status: string;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  slug: string;
  gallery: string;
  link_repo: string;
  tags: number[];
  translations: number[];
  articles: number[];
}

export interface ProjectTranslation {
  id: number;
  projects_id: string;
  languages_code: string;
  title: string;
  summary: string;
  content: string;
  cover_image: string;
}

export interface ProjectWithTranslation extends Project {
  title?: string;
  summary?: string;
  content?: string;
  cover_image?: string;
  languages_code?: string;
}

export interface ProjectPostRelation {
  id: number;
  projects_slug: string;
  posts_slug: string;
}

export interface ProjectTagRelation {
  id: number;
  projects_id: string;
  tags_id: number;
}

export interface ProjectFileRelation {
  id: number;
  projects_slug: string;
  directus_files_id: string;
}

export interface ProjectArticleRelation {
  id: number;
  projects_id: string;
  articles_id: string;
}

/**
 * Get all projects
 * @param options Query options including fields and filters
 * @returns Promise<Project[]> Array of projects
 */
export async function getProjects(options?: ItemsQuery): Promise<Project[]> {
  return directus.request(readItems('projects', options)) as unknown as Project[];
}

/**
 * Get project translations
 * @param options Query options including fields and filters
 * @returns Promise<ProjectTranslation[]> Array of project translations
 */
export async function getProjectTranslations(options?: ItemsQuery): Promise<ProjectTranslation[]> {
  return directus.request(readItems('projects_translations', options)) as unknown as ProjectTranslation[];
}

/**
 * Get a single project by slug with the specified language translation
 * @param slug Project slug
 * @param languageCode Language code (e.g., 'en', 'es')
 * @returns Promise<ProjectWithTranslation | undefined> Project with translation or undefined if not found
 */
export async function getProjectBySlug(slug: string, languageCode: string): Promise<ProjectWithTranslation | undefined> {
  // Fetch the project by slug
  const projects = await getProjects({
    fields: ['id', 'slug', 'status', 'date_created', 'gallery', 'link_repo', 'translations', 'tags', 'articles'],
    filter: {
      _and: [
        { slug: { _eq: slug } },
        { status: { _eq: 'published' } }
      ]
    }
  });
  
  if (!Array.isArray(projects) || projects.length === 0) {
    return undefined;
  }
  
  const project = projects[0];
  
  // Fetch the translation for the requested language
  const translations = await getProjectTranslations({
    filter: {
      _and: [
        { projects_id: { _eq: project.id } },
        { languages_code: { _eq: languageCode } }
      ]
    }
  });
  
  if (!Array.isArray(translations) || translations.length === 0) {
    // If no translation found for requested language, return project without translation data
    return project;
  }
  
  const translation = translations[0];
  
  // Combine project and translation data
  return {
    ...project,
    title: translation.title,
    summary: translation.summary,
    content: translation.content,
    cover_image: translation.cover_image,
    languages_code: translation.languages_code
  };
}

/**
 * Get all projects with translations for a specific language
 * @param languageCode Language code (e.g., 'en', 'es')
 * @returns Promise<ProjectWithTranslation[]> Array of projects with translations
 */
export async function getProjectsWithTranslations(languageCode: string): Promise<ProjectWithTranslation[]> {
  // Fetch all published projects
  const projects = await getProjects({
    fields: ['id', 'slug', 'status', 'date_created', 'gallery', 'link_repo', 'translations', 'tags', 'articles'],
    filter: {
      status: { _eq: 'published' }
    }
  });
  
  if (!Array.isArray(projects) || projects.length === 0) {
    return [];
  }
  
  // Fetch all translations for the requested language
  const translations = await getProjectTranslations({
    filter: {
      languages_code: { _eq: languageCode }
    }
  });
  
  if (!Array.isArray(translations) || translations.length === 0) {
    return projects;
  }
  
  // Create a map of translations by project ID for quick lookup
  const translationMap = new Map<string, ProjectTranslation>();
  translations.forEach(translation => {
    translationMap.set(translation.projects_id, translation);
  });
  
  // Combine projects with their translations
  return projects.map(project => {
    const translation = translationMap.get(project.id);
    
    if (!translation) {
      return project;
    }
    
    return {
      ...project,
      title: translation.title,
      summary: translation.summary,
      content: translation.content,
      cover_image: translation.cover_image,
      languages_code: translation.languages_code
    };
  });
}

/**
 * Get project-post relationships
 * @returns Promise<ProjectPostRelation[]> Array of project-post relations
 */
export async function getProjectPostRelations(): Promise<ProjectPostRelation[]> {
  return directus.request(readItems('projects_posts')) as unknown as ProjectPostRelation[];
}

/**
 * Get project-tag relationships
 * @returns Promise<ProjectTagRelation[]> Array of project-tag relations
 */
export async function getProjectTagRelations(): Promise<ProjectTagRelation[]> {
  return directus.request(readItems('projects_tags')) as unknown as ProjectTagRelation[];
}

/**
 * Get project-file relationships
 * @returns Promise<ProjectFileRelation[]> Array of project-file relations
 */
export async function getProjectFileRelations(): Promise<ProjectFileRelation[]> {
  return directus.request(readItems('projects_files')) as unknown as ProjectFileRelation[];
}

/**
 * Get project-post relations by project slug
 * @param projectSlug The slug of the project
 * @returns Promise<ProjectPostRelation[]> Array of relations for the given project
 */
export async function getRelationsByProjectSlug(projectSlug: string): Promise<ProjectPostRelation[]> {
  const relations = await getProjectPostRelations();
  return relations.filter(relation => relation.projects_slug === projectSlug);
}

/**
 * Get project-file relations by project slug
 * @param projectSlug The slug of the project
 * @returns Promise<ProjectFileRelation[]> Array of gallery image relations for the given project
 */
export async function getGalleryImagesByProjectSlug(projectSlug: string): Promise<ProjectFileRelation[]> {
  const relations = await getProjectFileRelations();
  return relations.filter(relation => relation.projects_slug === projectSlug);
}

/**
 * Get project-article relationships
 * @returns Promise<ProjectArticleRelation[]> Array of project-article relations
 */
export async function getProjectArticleRelations(): Promise<ProjectArticleRelation[]> {
  return directus.request(readItems('projects_articles')) as unknown as ProjectArticleRelation[];
} 