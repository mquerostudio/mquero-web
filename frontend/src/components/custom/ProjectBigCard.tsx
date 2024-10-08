import { StrapiImage } from "./StrapiImage";

export function ProjectBigCard({
    id,
    title,
    description,
    slug,
    publishedAt,
    image,
    tags,
    articles,
}: {
    id?: number;
    title?: string;
    description?: string;
    slug?: string;
    publishedAt?: string;
    image?: {
        id: number;
        documentId: string;
        url: string;
        alternativeText: string;
        width: number;
        height: number;
    };
    tags?: {
        id: string;
        documentId: string;
        tag: string;
    }[];
    articles?: {
        id: string;
        documentId: string;
        title: string;
        description: string;
        slug: string;
        image: {
            id: number;
            documentId: string;
            url: string;
            alternativeText: string;
            width: number;
            height: number;
        };
    }[];
}) {
    return (
        <div>
            <div
            className="border rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 bg-white"
            >
                {id && title && description && slug && image && tags ? (
                    <h1>Hola mundo</h1>
                ) :(
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
                        <div className="flex flex-col mx-auto justify-center p-5 h-30">
                            <div className="h-6 bg-gray-300 mb-2 w-3/4"></div>
                            <div className="h-4 bg-gray-300 mb-2 w-full"></div>
                            <div className="h-4 bg-gray-300 mb-4 w-5/6"></div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
