import { getProjectsData, getArticlesData } from "@/data/loaders";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap > {

    const projects = await getProjectsData();
    const projectsData: Array<{ id: string; slug: string; updatedAt: string }> = projects.data;

    const projectEntries: MetadataRoute.Sitemap = projectsData.map(({id, slug, updatedAt}) => ({
        url: `https://www.mquero.com/projects/${slug}`,
        lastModified: updatedAt ? new Date(updatedAt) : new Date(),
        // changeFrequency: 'monthly',
        // priority: 0.8
    }))

    const articles = await getArticlesData();
    const articlesData: Array<{ id: string; slug: string; publishedAt: string }> = articles.data;

    const articleEntries: MetadataRoute.Sitemap = articlesData.map(({id, slug, publishedAt}) => ({
        url: `https://www.mquero.com/articles/${slug}`,
        lastModified: publishedAt ? new Date(publishedAt) : new Date(),
        // changeFrequency: 'monthly',
        // priority: 0.8
    }))

        return [
        {
            url: 'https://www.mquero.com/',
            lastModified: new Date()
        },
        {
            url: 'https://www.mquero.com/about-me',
            lastModified: new Date()
        },
        {
            url: 'https://www.mquero.com/blog',
            lastModified: new Date()
        },
        {
            url: 'https://www.mquero.com/collaborations',
            lastModified: new Date()
        },
        {
            url: 'https://www.mquero.com/projects',
            lastModified: new Date()
        },
        ...projectEntries,
        ...articleEntries
    ]
}
