import { getArticleData } from "@/data/loaders";
import { StrapiImage } from "@/components/custom/StrapiImage";
import Link from 'next/link';
import { BlocksContent } from "@strapi/blocks-react-renderer";
import BlockRendererClient from "@/components/custom/BlockRendererClient";
import { Metadata } from "next";

export const runtime = 'edge';

// Dynamically generate metadata for the article page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = params;
    const articleData = await getArticleData(slug);
    const { title, description, image } = articleData.data[0];

    return {
        title,
        description,
        openGraph: {
            images: [
                {
                    url: image.url,
                    width: image.width,
                    height: image.height,
                    alt: image.alternativeText,
                }
            ]
        }
    };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const articleData = await getArticleData(slug);

    const { title, description, mainText, publishedAt, updatedAt, image, tags, project, users_permissions_users } = articleData.data[0];
    const content: BlocksContent = mainText;

    return (
        <main>
            <header className="max-w-[1152px] w-full mx-auto mb-8">

                {/* Article Image */}
                <div className="w-full h-auto mb-8">
                    <StrapiImage
                        src={image?.url}
                        alt={image?.alternativeText}
                        width={image?.width}
                        height={image?.height}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="max-w-[956px] w-full mx-auto">
                    {/* Article Title */}
                    <h1 className="md:text-5xl text-4xl font-bold text-center mb-4">
                        {title}
                    </h1>

                    {/* Article Description */}
                    <h2 className="font-medium md:text-3xl text-xl mb-6 text-center text-gray-700">
                        {description}
                    </h2>

                    <div className="flex items-center justify-center md:gap-4 gap-2 mb-10">
                        {/* Author Section */}
                        <div className="flex items-center">
                            <div className="w-12 h-auto rounded-full flex items-center justify-center">
                                <StrapiImage
                                    src={users_permissions_users[0].profileImg.url}
                                    alt={users_permissions_users[0].profileImg.alternativeText}
                                    width={users_permissions_users[0].profileImg.width}
                                    height={users_permissions_users[0].profileImg.height}
                                    className="object-cover rounded-full"
                                />
                            </div>
                            <div className="ml-2">
                                <p className="font-bold text-lg text-gray-700">
                                    {users_permissions_users[0].name}&nbsp;
                                    {users_permissions_users[0].surname}
                                </p>
                            </div>
                        </div>

                        <span className="font-bold text-3xl pb-1 text-slate-500">·</span>

                        <div className="uppercase font-bold text-lg text-gray-700">
                            {new Date(publishedAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Article Content */}
            <div className="prose prose-xl max-w-[760px] w-full mx-auto text-justify prose-img:mx-auto">
                <BlockRendererClient content={content} />
            </div>
        </main>
    );
}
