import { directus, type ItemsQuery } from "@/lib/directus";
import { readItems } from "@directus/sdk";

export interface Project {
  slug?: string;
  title?: string;
  body?: string;
  summary?: string;
  cover?: string;
  status?: string;
  projects?: number[];
  tags?: number[];
  user_created?: string;
  user_updated?: string;
  date_created?: string;
  date_updated?: string;
  linkRepo?: string;
  gallery?: number[];
}

export interface ProjectPostRelation {
  id: number;
  projects_slug: string;
  posts_slug: string;
}

export interface ProjectTagRelation {
  id: number;
  projects_slug: string;
  tags_id: number;
}

export interface ProjectFileRelation {
  id: number;
  projects_slug: string;
  directus_files_id: string;
}

/**
 * Get all projects with optional query parameters
 * @param options Query options including fields and filters
 * @returns Promise<Project[]> Array of projects
 */
export async function getProjects(options?: ItemsQuery): Promise<Project[]> {
  return directus.request(readItems('projects', options)) as unknown as Project[];
}

/**
 * Get a single project by slug
 * @param slug Project slug
 * @returns Promise<Project | undefined> Single project or undefined if not found
 */
export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects({
    fields: ['slug', 'title', 'body', 'summary', 'cover', 'date_created', 'projects', 'tags', 'status', 'user_created', 'linkRepo', 'gallery'],
    filter: {
      _and: [
        { slug: { _eq: slug } },
        { status: { _eq: 'published' } }
      ]
    }
  });
  
  return Array.isArray(projects) && projects.length > 0 ? projects[0] : undefined;
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