"use client";

import { useState } from 'react';
import Link from 'next/link';
import { StrapiImage } from "./StrapiImage";
import { Button } from '../ui/button';

// Define the structure of Article data
interface ArticleDataProps {
    id: string;
    documentId: string;
    title: string;
    slug: string;
    description: string;
    publishedAt: string;
    image: {
        id: string;
        documentId: string;
        url: string;
        alternativeText: string;
        width: number;
        height: number;
    };
    tags: {
        id: string;
        documentId: string;
        tag: string;
    }[];
    project: {
        id: string;
        documentId: string;
        title: string;
        description: string;
        slug: string;
    };
}

// Define the structure of Article meta data (pagination info)
interface ArticleMetaProps {
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    }
}

// Define the structure of Article props
interface ArticleProps {
    data: ArticleDataProps[];
    meta: ArticleMetaProps;
}

// Define the structure of Tag props
interface TagsProps {
    id: string;
    documentId: string;
    tag: string;
}

// Define the structure of Project props
interface ProjectsProps {
    id: string;
    documentId: string;
    title: string;
    slug: string;
}

// Main component to list blog articles
export function BlogArticlesList({ articles, projects, tags }: { readonly articles: ArticleProps, readonly projects: ProjectsProps[], readonly tags: TagsProps[] }) {
    // State to keep track of the selected project and tag for filtering articles
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Extract articles data and meta information
    const articlesData = articles.data;
    const articleMeta = articles.meta;

    // Filter articles based on the selected project and tag
    const filteredArticles = articlesData.filter(article => {
        const matchesProject = selectedProject ? article.project?.documentId === selectedProject : true;
        const matchesTag = selectedTag ? article.tags.some(tag => tag.documentId === selectedTag) : true;
        return matchesProject && matchesTag;
    });

    return (
        <div className="pb-24">
            <div className="max-w-[1348px] w-full mx-auto">

                {/* Filter by Projects */}
                <div className="lg:flex-row">
                    <div className="mb-4">Filter by Projects</div>
                    <div className="flex flex-wrap gap-4">
                        {/* Button to reset filter to show all projects */}
                        <div
                            className={`p-4 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 ${!selectedProject ? 'bg-gray-400' : ''}`}
                            onClick={() => setSelectedProject(null)}
                        >
                            All projects
                        </div>
                        {/* List all projects as filter options */}
                        {projects.map((project) => (
                            <div
                                key={project.documentId}
                                className={`p-4 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 ${selectedProject === project.documentId ? 'bg-gray-400' : ''}`}
                                onClick={() => setSelectedProject(project.documentId)}
                            >
                                {project.title}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filter by Tags */}
                <div className="mt-6 lg:flex-row">
                    <div className="mb-4">Filter by Tags</div>
                    <div className="flex flex-wrap gap-4">
                        {/* Button to reset filter to show all tags */}
                        <div
                            className={`p-4 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 ${!selectedTag ? 'bg-gray-400' : ''}`}
                            onClick={() => setSelectedTag(null)}
                        >
                            All tags
                        </div>
                        {/* List all tags as filter options */}
                        {tags.map((tag) => (
                            <div
                                key={tag.documentId}
                                className={`p-4 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 ${selectedTag === tag.documentId ? 'bg-gray-400' : ''}`}
                                onClick={() => setSelectedTag(tag.documentId)}
                            >
                                {tag.tag}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Display the filtered list of articles */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => (
                        <div key={article.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                            {/* Display article image */}
                            <div className="relative w-full h-48">
                                <StrapiImage
                                    src={article.image.url}
                                    alt={article.image.alternativeText}
                                    width={article.image.width}
                                    height={article.image.height}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                            {/* Display article details */}
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                                <p className="text-gray-700 mb-2">{article.description}</p>
                                <p className="text-gray-500 mb-4">{new Date(article.publishedAt).toLocaleDateString()}</p>
                                <Link href={`/blog/${article.slug}`}>
                                    <Button className="text-lg font-medium h-10">
                                        Read More
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}