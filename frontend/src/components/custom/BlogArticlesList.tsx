"use client";

import { useState } from 'react';
import { ArticleCard } from "./ArticleCard";

// Define the structure of Article data
interface ArticleDataProps {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    description: string;
    publishedAt: string;
    image: {
        id: number;
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
    // State to keep track of the selected project and tags for filtering articles
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Extract articles data and meta information
    const articlesData = articles.data;
    const articleMeta = articles.meta;

    // Filter articles based on the selected project and tags
    const filteredArticles = articlesData.filter(article => {
        const matchesProject = selectedProject ? article.project?.documentId === selectedProject : true;
        const matchesTags = selectedTags.length > 0 ? selectedTags.every(tagId => article.tags.some(tag => tag.documentId === tagId)) : true;
        return matchesProject && matchesTags;
    });

    // Function to handle tag selection
    const toggleTagSelection = (tagId: string) => {
        if (selectedTags.includes(tagId)) {
            setSelectedTags(selectedTags.filter(id => id !== tagId));
        } else {
            setSelectedTags([...selectedTags, tagId]);
        }
    };

    return (
        <div className="pb-24">
            <div className="max-w-[1348px] w-full mx-auto">

                <div className='flex flex-col lg:flex-row lg:space-x-16 lg:space-y-0'>
                    {/* Filter by Projects */}
                    <div className="lg:flex-row">
                        <div className="mb-4">Filter by Projects</div>
                        <div className="flex flex-wrap gap-4">
                            {/* Button to reset filter to show all projects */}
                            <div
                                className={`p-2 bg-white rounded-xl cursor-pointer hover:bg-gray-100 border-2 ${!selectedProject ? 'shadow-[0_0px_6px_1px_#ffaa00ff]' : ''}`}
                                onClick={() => setSelectedProject(null)}
                            >
                                All projects
                            </div>
                            {/* List all projects as filter options */}
                            {projects.map((project) => (
                                <div
                                    key={project.documentId}
                                    className={`p-2 bg-white rounded-xl cursor-pointer hover:bg-gray-100 border-2 ${selectedProject === project.documentId ? 'shadow-[0_0px_6px_1px_#ffaa00ff]' : ''}`}
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
                                className={`p-2 bg-white rounded-xl cursor-pointer hover:bg-gray-100 border-2 ${selectedTags.length === 0 ? 'shadow-[0_0px_6px_1px_#ffaa00ff]' : ''}`}
                                onClick={() => setSelectedTags([])}
                            >
                                All tags
                            </div>
                            {/* List all tags as filter options */}
                            {tags.map((tag) => (
                                <div
                                    key={tag.documentId}
                                    className={`p-2 bg-white rounded-xl cursor-pointer hover:bg-gray-100 border-2 ${selectedTags.includes(tag.documentId) ? 'shadow-[0_0px_6px_1px_#ffaa00ff]' : ''}`}
                                    onClick={() => toggleTagSelection(tag.documentId)}
                                >
                                    {tag.tag}
                                </div>
                            ))}
                        </div>

                        {/* Display selected tags */}
                        {selectedTags.length > 0 && (
                            <div className="mt-4">
                                <div className="mb-2">Selected Tags:</div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTags.map(tagId => {
                                        const tag = tags.find(t => t.documentId === tagId);
                                        return tag ? (
                                            <div key={tag.documentId} className="p-2 bg-yellow-100 rounded-lg">
                                                {tag.tag}
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>



                {/* Display the filtered list of articles */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full mt-8">
                    {filteredArticles.length > 0 ? (
                        filteredArticles.map((article: ArticleDataProps) => (
                            <ArticleCard
                                key={article.documentId}
                                id={article.id}
                                title={article.title}
                                slug={article.slug}
                                description={article.description}
                                publishedAt={article.publishedAt}
                                image={article.image}
                            />
                        ))
                    ) : (
                        Array.from({ length: 3 }).map((_, index) => (
                            <ArticleCard key={index} />
                        ))
                    )}
                </div>



            </div>
        </div>
    );
}