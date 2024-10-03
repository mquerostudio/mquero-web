import Link from "next/link";
import { Button } from "../ui/button";
import { StrapiImage } from "./StrapiImage";


interface TextProps {
    type: string;
    children: {
        type: string;
        text: string;
    }[];
}

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
    publishedAt: string;
    updatedAt: string;
    description: string;
    mainText: TextProps[];
    image: Image;
}

interface ProjectsSectionProps {
    project: ProjectProps[];
}[];


export function ProjectsSection({ project }: ProjectsSectionProps) {

    return (
        <div className="pb-[96px] px-2">
            <div className="max-w-[1348px] w-full flex flex-col justify-between items-center mx-auto space-y-8">

                <h2 className="text-4xl font-bold w-full">
                    latest projects
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
                    {project.map((proj) => (
                        <div
                            key={proj.id}
                            className="border rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
                        >
                            <div className="relative w-full h-[200px] overflow-hidden">
                                <StrapiImage
                                    src={proj.image.url}
                                    alt={proj.image.alternativeText}
                                    width={proj.image.width}
                                    height={proj.image.height}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <div className="text-2xl font-semibold mb-2">{proj.title}</div>
                                <div className="text-lg">{proj.description}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <Link href="/projects">
                    <Button className="text-lg font-medium h-10">
                        see all projects
                    </Button>
                </Link>

            </div>
        </div>
    )
}