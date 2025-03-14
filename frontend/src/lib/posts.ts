import { directus, type ItemsQuery } from "@/lib/directus";
import { readItems } from "@directus/sdk";

interface Post {
  title?: string;
}

export async function getPosts(options?: ItemsQuery) {
  return directus.request(readItems('posts', options)) as unknown as Post;
}