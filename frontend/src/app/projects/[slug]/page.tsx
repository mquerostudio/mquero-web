import { StrapiImage } from "@/components/custom/StrapiImage";
import { getProjectData } from "@/data/loaders";
import { BlocksContent, BlocksRenderer } from "@strapi/blocks-react-renderer";
import Link from "next/link";
import BlockRendererClient from "@/components/custom/BlockRendererClient";
import { Metadata } from "next";
// import { ImageResponse } from "next/og";

export async function generateMetadata({ params }: {params: { slug: string }}): Promise<Metadata> {

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

// export default async function textImage() {
//     return new ImageResponse((
//         <div
//         style={{
//           fontSize: 128,
//           background: 'white',
//           width: '100%',
//           height: '100%',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         About
//       </div>
//     ))
// }

export default async function ProjectPage({ params }: {
    params: { slug: string }
}) {

    const { slug } = params;
    const projectData = await getProjectData(slug);

    const { title, description, updatedAt, publishedAt, image } = projectData.data[0];

    const content: BlocksContent = projectData.data[0].mainText;


    return (
        <main className="max-w-[760px] w-full mx-auto py-8">

            <header>
                <div className="mb-6">
                    <Link href="/projects">
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
