import { ProjectBigCard } from "@/components/custom/ProjectBigCard";
import { getProjectPageData, getProjectsData } from "@/data/loaders";
import { Metadata } from "next";

export const runtime = 'edge';

export const metadata : Metadata = {
    title: "Projects",
}

interface Image {
    id: number;
    documentId: string;
    url: string;
    alternativeText: string;
    width: number;
    height: number;
}

interface Tags {
    id: number;
    documentId: string;
    tag: string;
}

interface Articles {
    id: number;
    documentId: string;
    title: string;
    description: string;
    slug: string;
    image: Image;
    publishedAt: string;
}

interface ProjectProps {
    id: number;
    documentId: string;
    title: string;
    description: string;
    publishedAt: string;
    slug: string;
    updatedAt: string;
    image: Image;
    tags: Tags[];
    articles: Articles[];
}

export default async function Projects() {

    const projectPage = await getProjectPageData();
    const projects = await getProjectsData();

    const { title, description } = projectPage.data;
    const projectsData = projects.data;
    const projectsMeta = projects.meta;

    return (
        <main>

            <header className="py-12">
                <div className="max-w-[1348px] w-full flex flex-col justify-between items-start mx-auto space-y-4 h-auto">
                    <h1 className="text-2xl sm:text-4xl font-bold">
                        {title}
                    </h1>
                    <p className="text-base sm:text-xl">
                        {description}
                    </p>
                </div>
            </header>

            <div className="pb-24">
                <div className="max-w-[1348px] w-full mx-auto grid grid-cols-1 gap-6">
                    {projectsData && projectsData.length > 0 ? (
                        projectsData.map((proj: ProjectProps) => (
                            <ProjectBigCard
                            key={proj.documentId}
                            {...proj}
                            />
                        ))
                    ) : (
                        Array.from({ length: 3 }).map((_, index) => (
                            <ProjectBigCard
                                key={index}
                            />
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}