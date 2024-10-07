import Link from "next/link";
import { StrapiImage } from "./StrapiImage";

interface Image {
    id: number;
    documentId: string;
    url: string;
    alternativeText: string;
    width: number;
    height: number;
}

interface ArticleProps {
    id: number;
    title: string;
    slug: string;
    description: string;
    publishedAt: string;
    image: Image;
}

export function ArticleCard({ article }: { article?: ArticleProps }) {

    return (
        <div
            className="border rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 w-full h-auto"
        >
            {article && Object.keys(article).length > 0 ? (
                <Link href={`/blog/${article.slug}`} key={article.id}>
                    <div
                        className="flex flex-col items-center border rounded-lg p-4 transition-transform duration-300 hover:scale-105 w-full h-auto"
                    >
                        <div className="relative w-full h-48 overflow-hidden">
                            <StrapiImage
                                src={article.image.url}
                                alt={article.image.alternativeText}
                                width={480}
                                height={480}
                                className="w-full h-full object-cover rounded-t-lg"
                            />
                        </div>
                        <div className="flex flex-col items-start p-4">
                            <div className="text-2xl font-semibold">{article.title}</div>
                            <div className="text-lg mt-2">{article.description}</div>
                            <div className="text-sm mt-4 text-gray-500">{new Date(article.publishedAt).toISOString().split('T')[0]}</div>
                        </div>
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
    )


}