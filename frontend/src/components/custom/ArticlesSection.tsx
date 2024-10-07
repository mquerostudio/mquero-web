import Link from "next/link";
import { Button } from "../ui/button";
import { ArticleCard } from "./ArticleCard";

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
}

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
            <div className="max-w-[1348px] w-full flex flex-col justify-between items-center mx-auto space-y-8">
                <h2 className="text-4xl font-bold w-full">
                    {heading}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full mt-8">
                    {article && article.length > 0 ? (
                        article.slice(0, 3).map((art) => (
                            <ArticleCard key={art.id} article={art} />
                        ))
                    ) : (
                        Array.from({ length: 3 }).map((_, index) => (
                            <ArticleCard key={index} />
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