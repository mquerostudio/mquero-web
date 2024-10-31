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
            className="border rounded-lg overflow-hidden shadow-lg w-full h-auto bg-white"
        >
            {project && Object.keys(project).length > 0 ? (
                <div >
                    <div className="w-full h-[200px] overflow-hidden">
                        <StrapiImage
                            src={project.image.url}
                            alt={project.image.alternativeText}
                            width={project.image.width}
                            height={project.image.height}
                            className="w-full h-auto object-scale-down"
                        />
                    </div>
                    <div className="flex-col mx-auto p-4">
                        <div className="sm:text-2xl text-xl font-semibold">{project.title}</div>
                        <div className="sm:text-lg text-base mt-2 text-justify mb-4">{project.description}</div>

                        <Link href={`/projects/${project.slug}`}>
                            <Button className="text-base sm:text-xl font-medium bg-gray-800 text-white hover:bg-[#ffaa00ff] hover:text-black">
                                ir al proyecto
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="animate-pulse bg-white">
                    <div className="relative w-full h-52 overflow-hidden">
                        <StrapiImage
                            src={"https://optimistic-kindness-c344eba2ae.media.strapiapp.com/img_placeholder_9590864e93.png"}
                            alt={"Placeholder image"}
                            width={1200}
                            height={800}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col mx-auto justify-center p-5 h-30">
                        <div className="h-6 bg-gray-300 mb-2 w-3/4"></div>
                        <div className="h-4 bg-gray-300 mb-2 w-full"></div>
                        <div className="h-4 bg-gray-300 mb-4 w-5/6"></div>
                    </div>
                </div>
            )}
        </div>
    );
}