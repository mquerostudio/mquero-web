import { BlogArticlesList } from "@/components/custom/BlogArticlesList";
import { StrapiImage } from "@/components/custom/StrapiImage";
import { Button } from "@/components/ui/button";
import { getArticlesData, getTagsData, getProjectsNames, getBlogPageData } from "@/data/loaders";
import Link from "next/link";
import { Metadata } from "next";

export const runtime = 'edge';

// Dynamically generate metadata
export async function generateMetadata(): Promise<Metadata> {
    const blogPage = await getBlogPageData();
    const metaData = blogPage.data.seo || {};

    return {
        title: metaData.MetaTitle || "Blog",
        description: metaData.MetaDescription || "Articles and tutorials on electronics, programming, 3D printing...",
    };
}

export default async function Blog() {
    const blogPage = await getBlogPageData();
    const { title, description, heading1, heading2 } = blogPage.data;
    const filterBy = blogPage.data.filterBy;
    
    const tags = await getTagsData();
    const tagsData = tags.data;
    
    const projects = await getProjectsNames();
    const projectsData = projects.data;
    
    const articles = await getArticlesData();

    return (
        <main>
            <header className="py-12">
                <div className="max-w-[1348px] w-full flex flex-col justify-between items-start mx-auto space-y-4 lg:space-y-0 h-auto">
                    <h1 className="text-2xl sm:text-4xl font-bold w-full">
                        {title}
                    </h1>
                    <p className="text-base sm:text-2xl">
                        {description}
                    </p>
                </div>
            </header>

            <div className="pb-24 max-w-[1348px] w-full mx-auto">
                <h2 className="pb-6 text-2xl sm:text-4xl font-bold w-full">{heading1}</h2>
                {articles.data.length > 0 ? (
                    <div className="flex flex-col lg:flex-row justify-between items-center mx-auto space-y-4 lg:space-y-0 lg:space-x-6 h-auto p-8 bg-white shadow-lg rounded-3xl">
                        <div className="flex flex-col items-center w-full">
                            <h2 className="text-2xl sm:text-4xl font-bold mb-2">{articles.data[0].title}</h2>
                            <p className="text-gray-700 mb-2">{articles.data[0].description}</p>
                            <p className="text-gray-500 mb-4">{new Date(articles.data[0].publishedAt).toLocaleDateString()}</p>
                            <Link href={`/blog/${articles.data[0].slug}`}>
                                <Button className="text-2xl font-bold bg-gray-800 text-white hover:bg-[#ffaa00ff] hover:text-black pb-3.5 w-28">
                                    {'>'}
                                </Button>
                            </Link>
                        </div>

                        <div className="w-full h-[200px] content-center">
                            <StrapiImage
                                src={articles.data[0].image.url}
                                alt={articles.data[0].image.alternativeText}
                                width={articles.data[0].image.width}
                                height={articles.data[0].image.height}
                                className="w-full h-full object-scale-down rounded-xl"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="animate-pulse max-w-[1348px] w-full flex flex-col lg:flex-row justify-between items-center mx-auto space-y-4 lg:space-y-0 lg:space-x-6 h-auto p-8 bg-white shadow-lg rounded-3xl">
                        <div className="relative w-full h-52 overflow-hidden">
                            <StrapiImage
                                src={"https://optimistic-kindness-c344eba2ae.media.strapiapp.com/img_placeholder_9590864e93.png"}
                                alt={"Placeholder image"}
                                width={1200}
                                height={800}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex flex-col items-center text-center lg:items-start lg:text-left w-full">
                            <div className="h-8 w-3/4 bg-gray-300 mb-2 rounded"></div>
                            <div className="h-6 w-2/3 bg-gray-300 mb-2 rounded"></div>
                            <div className="h-4 w-1/2 bg-gray-300 mb-4 rounded"></div>
                        </div>
                    </div>
                )}
            </div>

            <h2 className="max-w-[1348px] w-full mx-auto pb-6 text-2xl sm:text-4xl font-bold">{heading2}</h2>
            <BlogArticlesList articles={articles} projects={projectsData} tags={tagsData} filterBy={filterBy}/>
        </main>
    );
}
