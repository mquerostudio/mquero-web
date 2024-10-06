import Link from "next/link";
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

interface ArticleProps {
    id: number;
    documetId: string;
    title: string;
    slug: string;
    description: string;
    publishedAt: string;
    image: Image;
}


interface ArticlesSectionProps {
    article: ArticleProps[];
}[];

interface LatestArticlesSectionProps {
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

export function ArticlesSection({ article, data }: ArticlesSectionProps & { data: LatestArticlesSectionProps }) {

    const { heading, button } = data;
    
    return (
        <div className="pb-[96px] px-2">
            <div className="max-w-[1348px] w-full flex flex-col justify-between items-center mx-auto">

                <h2 className="text-4xl font-bold w-full">
                    {heading}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full mt-8">

                    {article.slice(0, 3).map((art) => (
                        <Link href={`/blog/${art.slug}`} key={art.id}>
                            <div
                                key={art.id}
                                className="flex flex-col items-center border rounded-lg p-4 transition-transform duration-300 hover:scale-105"
                            >

                                <StrapiImage
                                    src={art.image.url}
                                    alt={art.image.alternativeText}
                                    width={480}
                                    height={480}
                                    className="w-full h-48 object-cover rounded-t-lg"
                                />
                                <div className="flex flex-col items-start p-4">
                                    <div className="text-2xl font-semibold">{art.title}</div>
                                    <div className="text-lg mt-2">{art.description}</div>
                                    <div className="text-sm mt-4 text-gray-500">{new Date(art.publishedAt).toISOString().split('T')[0]}</div>
                                </div>

                            </div>
                        </Link>
                    ))}

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