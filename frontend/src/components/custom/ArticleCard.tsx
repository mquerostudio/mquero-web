import Link from "next/link";
import { StrapiImage } from "./StrapiImage";

export function ArticleCard({
    id,
    title,
    slug,
    description,
    publishedAt,
    image,
}: {
    id?: number;
    title?: string;
    slug?: string;
    description?: string;
    publishedAt?: string;
    image?: {
        id: number;
        documentId: string;
        url: string;
        alternativeText: string;
        width: number;
        height: number;
    };
}) {
    return (
        <div>
            <div
                className="border rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 bg-white"
            >
                {id && title && slug && description && publishedAt && image ? (
                    <Link href={`/blog/${slug}`} key={id}>
                        <div
                            className="flex flex-col items-center p-4 space-y-4"
                        >
                            <div className="relative w-full h-48 overflow-hidden">
                                <StrapiImage
                                    src={image.url}
                                    alt={image.alternativeText}
                                    width={480}
                                    height={480}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                            <div className="flex-col mx-auto">
                                <div className="text-2xl font-semibold">{title}</div>
                                <div className="text-lg mt-2 text-start">{description}</div>
                                <div className="text-sm mt-4 text-gray-500">{publishedAt ? new Date(publishedAt).toLocaleDateString() : 'N/A'}</div>
                            </div>
                        </div>
                    </Link>
                ) : (
                    <div className="animate-pulse">
                        <div className="relative w-full h-52 overflow-hidden">
                            <StrapiImage
                                src={"img_placeholder_9590864e93.png"}
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