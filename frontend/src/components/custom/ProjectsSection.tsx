import Link from "next/link";
import { Button } from "../ui/button";
import { ProjectCard } from "./ProjectCard";

interface Image {
    id: number;
    documentId: string;
    url: string;
    alternativeText: string;
    width: number;
    height: number;
}

interface ProjectProps {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    publishedAt: string;
    updatedAt: string;
    description: string;
    mainText: any;
    image: Image;
}

interface ProjectsSectionProps {
    project: ProjectProps[];
}

interface LatestProjectsSectionProps {
    id: number;
    __component: string;
    heading: string;
    button: {
        id: number;
        text: string;
        url: string;
        isExternal: boolean;
    }
}

export function ProjectsSection({ project, data }: ProjectsSectionProps & { data: LatestProjectsSectionProps }) {
    const { heading, button } = data;

    return (
        <div className="pb-[96px] px-2">
            <div className="max-w-[1348px] w-full flex flex-col justify-between items-center mx-auto space-y-8">
                <h2 className="text-4xl font-bold w-full">
                    {heading}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8 w-full">
                    {project && project.length > 0 ? (
                        project.map((proj) => (
                            <ProjectCard key={proj.id} project={proj} />
                        ))
                    ) : (
                        Array.from({ length: 2 }).map((_, index) => (
                            <ProjectCard key={index} />
                        ))
                    )}
                </div>

                <Link href={button.url}>
                    <Button className="text-lg font-medium h-10">
                        {button.text}
                    </Button>
                </Link>
            </div>
        </div>
    );
}