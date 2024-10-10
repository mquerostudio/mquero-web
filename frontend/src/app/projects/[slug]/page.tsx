import { StrapiImage } from "@/components/custom/StrapiImage";
import { getProjectData } from "@/data/loaders";
import { BlocksContent, BlocksRenderer } from "@strapi/blocks-react-renderer";
import Link from "next/link";

export default async function ProjectPage({ params }: {
    params: { slug: string }
}) {

    const { slug } = params;
    const projectData = await getProjectData(slug);


    const { title, description, mainText, updatedAt, publishedAt } = projectData.data[0];

    return (
        <main className="max-w-[1152px] w-full mx-auto py-8">

            <header>
                {/* Back Button */}
                <div className="mb-6">
                    <Link href="/blog">
                        <button className="text-lg font-medium">
                            &larr; Back
                        </button>
                    </Link>
                </div>

                {/* Category and Date */}
                <div className="text-red-500 uppercase text-sm font-bold mb-2">
                    {title} | {new Date(publishedAt).toLocaleDateString()}
                </div>

                {/* Article Title */}
                <h1 className="text-4xl font-bold mb-6">
                    {title}
                </h1>


                {/* Article Image */}
                {/* <div className="w-full h-80 bg-gray-200 mb-8">
                    <StrapiImage
                        src={image?.url}
                        alt={image?.alternativeText}
                        width={image?.width}
                        height={image?.height}
                        className="w-full h-full object-cover"
                    />
                </div> */}
            </header>

            {/* Article Intro Text */}
            <p className="font-bold text-lg mb-6">
                {description}
            </p>

            {/* Main Article Content */}
            <div className="text-gray-800 leading-relaxed">
                <BlocksRenderer content={mainText as BlocksContent} />
            </div>



        </main>
    );
}