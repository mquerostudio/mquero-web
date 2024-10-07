import Link from "next/link";
import { Button } from "../ui/button";
import { StrapiImage } from "./StrapiImage";

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
    title: string;
    slug: string;
    description: string;
    image: Image;
}

export function ProjectCard({ project }: { project?: ProjectProps }) {
    return (
        <div
            className="border rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 w-full h-auto"
        >
            {project && Object.keys(project).length > 0 ? (
                <Link href={`/projects/${project.slug}`}>
                    <div className="relative w-full h-52 overflow-hidden">
                        <StrapiImage
                            src={project.image.url}
                            alt={project.image.alternativeText}
                            width={project.image.width}
                            height={project.image.height}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col items-start p-4">
                        <div className="text-2xl font-semibold">{project.title}</div>
                        <div className="text-lg">{project.description}</div>
                    </div>
                </Link>
            ) : (
            <div className="animate-pulse">
                <div className="relative w-full h-52 overflow-hidden">
                    <StrapiImage
                        src={"/uploads/img_placeholder_9590864e93.png"}
                        alt={"Placeholder image"}
                        width={1200}
                        height={800}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col mx-auto justify-center p-5 h-52">
                    <div className="h-6 bg-gray-300 mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-300 mb-2 w-full"></div>
                    <div className="h-4 bg-gray-300 mb-4 w-5/6"></div>
                </div>
            </div>
            )}
        </div>
    );
}