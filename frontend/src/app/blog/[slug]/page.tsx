import { getArticleData } from "@/data/loaders";
import { StrapiImage } from "@/components/custom/StrapiImage";
import Link from 'next/link';
import { BlocksRenderer, type BlocksContent } from "@strapi/blocks-react-renderer";
import BlockRendererClient from "@/components/custom/BlockRendererClient";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const projectData = await getArticleData(slug);

    const { title, description, mainText, publishedAt, updatedAt, image, tags, project, users_permissions_users } = projectData.data[0];

    const content: BlocksContent = mainText;

    return (
        <main>

            <div className="max-w-[1152px] w-full mx-auto mb-8">
                {/* Back Button
                <div className="mb-6">
                    <Link href="/blog">
                        <button className="text-lg font-medium">
                            &larr; Back
                        </button>
                    </Link>
                </div> */}

                {/* Article Image */}
                <div className="w-full h-aut mb-8">
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
                    <h1 className="text-5xl font-bold text-center">
                        {title}
                    </h1>

                    {/* Article Description */}
                    <p className="font-normal text-3xl mb-6 text-center text-gray-700">
                        {description}
                    </p>

                    <div className="flex items-center justify-center gap-4">

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

            </div>

            {/* Main Article Content */}
            <div className="prose prose-lg mt-4 max-w-[760px] w-full mx-auto">
                <BlockRendererClient content={content} />
            </div>



        </main>
    );
}