import { getArticleData } from "@/data/loaders";
import { StrapiImage } from "@/components/custom/StrapiImage";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const projectData = await getArticleData(slug);

    const { title, description, mainText, publishedAt, updatedAt, image, tags, project, users_permissions_users } = projectData.data[0];

    return (
        <main className="max-w-[1152px] w-full mx-auto py-8">
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
                {project?.title} | {new Date(publishedAt).toLocaleDateString()}
            </div>

            {/* Author Section */}
            <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <StrapiImage
                        src={users_permissions_users[0].profileImg.url}
                        alt={users_permissions_users[0].profileImg.alternativeText}
                        width={users_permissions_users[0].profileImg.width}
                        height={users_permissions_users[0].profileImg.height}
                        className="object-cover rounded-full"
                    />
                </div>
                <div className="ml-4">
                    <p className="font-bold">
                        {users_permissions_users[0].name}&nbsp;
                        {users_permissions_users[0].surname}
                    </p>
                    <p className="text-sm text-gray-500">
                        @{users_permissions_users[0].username}
                    </p>
                </div>
            </div>

            {/* Article Title */}
            <h1 className="text-4xl font-bold mb-6">
                {title}
            </h1>

            {/* Article Image */}
            <div className="w-full h-80 bg-gray-200 mb-8">
                <StrapiImage
                    src={image?.url}
                    alt={image?.alternativeText}
                    width={image?.width}
                    height={image?.height}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Article Intro Text */}
            <p className="font-bold text-lg mb-6">
                {description}
            </p>

            {/* Main Article Content
            <div className="text-gray-800 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: mainText }} />
            </div> */}
        </main>
    );
}