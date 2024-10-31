import Link from "next/link";
import { ArticleCard } from "./ArticleCard";
import { StrapiImage } from "./StrapiImage";
import { Button } from "../ui/button";

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
    id?: number;
    documentId?: string;
    title?: string;
    description?: string;
    publishedAt?: string;
    slug?: string;
    updatedAt?: string;
    image?: Image;
    tags?: Tags[];
    articles?: Articles[];
}[];

export function ProjectBigCard({
    id,
    documentId,
    title,
    description,
    publishedAt,
    slug,
    updatedAt,
    image,
    tags,
    articles
}: ProjectProps) {
    return (
        <div>
            <div
                className="border-2 rounded-xl overflow-hidden shadow-lg bg-white"
            >
                {id && title && description && slug && image && tags ? (

                    <div className="p-6 flex flex-col mx-auto gap-4">
                        <div className="flex flex-col lg:flex-row justify-center items-start space-y-4 lg:space-y-0 gap-4">
                            <div className="flex flex-col justify-between w-full min-h-72 mx-auto">

                                <Link href={`/projects/${slug}`}>
                                    <h2 className="text-2xl sm:text-4xl font-bold mb-4">
                                        {title}
                                    </h2>
                                    <p className="text-base sm:text-xl h-full text-justify">
                                        {description}
                                    </p>
                                </Link>


                                <div className="flex justify-between">
                                    <Link href={`/projects/${slug}`} className="items-end flex">
                                        <Button className="text-2xl font-medium bg-gray-800 text-white hover:bg-[#ffaa00ff] hover:text-black pb-3.5 w-16">
                                            {'>'}
                                        </Button>
                                    </Link>
                                    <div>
                                        <div className="flex flex-row gap-2 justify-end">
                                            {tags.map((tag) => (
                                                <p key={tag.documentId} className="p-2 bg-gray-50 rounded-xl border-2 text-justify">{tag.tag}</p>
                                            ))}
                                        </div>
                                        <p className="text-gray-500 text-sm mt-2 text-end">
                                            {publishedAt ? new Date(publishedAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative w-full h-72 overflow-hidden">
                                <StrapiImage
                                    src={image.url}
                                    alt={image.alternativeText}
                                    width={image.width}
                                    height={image.height}
                                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="top-1/2 w-full border-t border-gray-300 transform -translate-y-1/2"></div>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold">Related articles</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-4">
                                {articles && articles.length > 0 ? (
                                    articles.slice(0, 3).map((art) => (
                                        <ArticleCard
                                            key={art.documentId}
                                            id={art.id}
                                            title={art.title}
                                            slug={art.slug}
                                            description={art.description.length > 100 ? art.description.substring(0, 100) + '...' : art.description}
                                            publishedAt={art.publishedAt}
                                            image={art.image}
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

                ) : (
                    <div className="animate-pulse">
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
        </div >
    );
}
