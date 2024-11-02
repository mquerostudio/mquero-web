import { StrapiImage } from "@/components/custom/StrapiImage";
import { getProjectData } from "@/data/loaders";
import { BlocksContent, BlocksRenderer } from "@strapi/blocks-react-renderer";
import Link from "next/link";
import BlockRendererClient from "@/components/custom/BlockRendererClient";
import { Metadata } from "next";

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {

    const { slug } = params;
    const projectData = await getProjectData(slug);

    return {
        title: projectData.data[0].title,
        description: projectData.data[0].description,
        openGraph: {
            images: [
                {
                    url: projectData.data[0].image.url,
                    width: projectData.data[0].image.width,
                    height: projectData.data[0].image.height,
                    alt: projectData.data[0].image.alternativeText
                }
            ]
        }
    };
}

export default async function ProjectPage({ params }: {
    params: { slug: string }
}) {

    const { slug } = params;
    const projectData = await getProjectData(slug);

    const { title, description, updatedAt, publishedAt, image } = projectData.data[0];

    const content: BlocksContent = projectData.data[0].mainText;

    return (
        <main>
            <header className="max-w-[1152px] w-full mx-auto mb-8">

                <div className="w-full h-[500px] mb-8">
                    <StrapiImage
                        src={image.url}
                        alt={image.alternativeText}
                        height={image.height}
                        width={image.width}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="max-w-[956px] w-full mx-auto">
                    <h1 className="md:text-5xl text-4xl font-bold text-center mb-4">
                        {title}
                    </h1>

                    <h2 className="font-medium md:text-3xl text-xl mb-6 text-center text-gray-700">
                        {description}
                    </h2>

                    <div className="flex items-center justify-center md:gap-4 gap-2 mb-10">

                        {/* Author Section */}
                        {/* <div className="flex items-center">
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
                        </div> */}

                        <div className="uppercase font-bold text-lg text-gray-700">
                            {title}
                        </div>

                        <span className="font-bold text-3xl pb-1 text-slate-500">·</span>

                        <div className="uppercase font-bold text-lg text-gray-700">
                            {new Date(publishedAt).toLocaleDateString()}
                        </div>

                    </div>
                </div>

            </header>

            {/* Main Article Content */}
            <div className="prose prose-xl prose-img:mx-auto max-w-[760px] w-full mx-auto text-justify">
                <BlockRendererClient content={content} />
            </div>

        </main>
    );
}
