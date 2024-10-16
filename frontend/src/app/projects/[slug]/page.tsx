import { StrapiImage } from "@/components/custom/StrapiImage";
import { getProjectData } from "@/data/loaders";
import { BlocksContent, BlocksRenderer } from "@strapi/blocks-react-renderer";
import Link from "next/link";
import BlockRendererClient from "@/components/custom/BlockRendererClient";

export default async function ProjectPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const projectData = await getProjectData(slug);

    const { title, description, updatedAt, publishedAt, image } = projectData.data[0];

    const content: BlocksContent = projectData.data[0].mainText;


    return (
        <main className="max-w-[760px] w-full mx-auto py-8">

            <header>
                <div className="mb-6">
                    <Link href="/blog">
                        <button className="text-lg font-medium">&larr; Back</button>
                    </Link>
                </div>

                <div className="text-red-500 uppercase text-sm font-bold mb-2">
                    {title} | {new Date(publishedAt).toLocaleDateString()}
                </div>

                <h1 className="text-4xl font-bold mb-6">{title}</h1>
            </header>

            <div className="flex md:flex-row gap-4 justify-center">
                <p className="font-bold text-lg">{description}</p>

                <div className="overflow-hidden w-[720px]">
                    <StrapiImage
                        src={image.url}
                        alt={image.alternativeText}
                        height={image.height}
                        width={image.width}
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
            </div>

            <div className="prose prose-lg mt-4 max-w-none">
                <BlockRendererClient content={content} />
            </div>

        </main>
    );
}
