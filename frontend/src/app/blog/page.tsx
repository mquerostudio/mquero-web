import { BlogArticlesList } from "@/components/custom/BlogArticlesList";
import { StrapiImage } from "@/components/custom/StrapiImage";
import { getArticlesData, getTagsData, getProjectsNames } from "@/data/loaders";

export default async function Blog() {

    const articles = await getArticlesData();
    const tags = await getTagsData();
    const projects = await getProjectsNames();

    const tagsData = tags.data;
    const projectsData = projects.data;

    return (
        <main>
            <header className="py-24">
                <div className="max-w-[1348px] w-full flex flex-col justify-between items-start mx-auto space-y-4 lg:space-y-0 h-auto">
                    <h1 className="text-[40px] font-bold">
                        Blog
                    </h1>
                    <p className="text-xl">
                        The best maker blog
                    </p>
                </div>
            </header>


            <div className="pb-24">
                <div className="max-w-[1348px] w-full mx-auto p-10 bg-white shadow-2xl rounded-3xl flex flex-col lg:flex-row items-center space-y-10 lg:space-y-0 lg:space-x-10">

                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        <h2 className="text-2xl font-bold mb-2">{articles.data[0].title}</h2>
                        <p className="text-gray-700 mb-2">{articles.data[0].description}</p>
                        <p className="text-gray-500 mb-4">{new Date(articles.data[0].publishedAt).toLocaleDateString()}</p>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                            Read More
                        </button>
                    </div>

                    <div className="relative w-full h-[300px] overflow-hidden">
                        <StrapiImage
                            src={articles.data[0].image.url}
                            alt={articles.data[0].image.alternativeText}
                            width={articles.data[0].image.width}
                            height={articles.data[0].image.height}
                            className=" absolute inset-0 w-full h-full object-cover rounded-lg"
                        />
                    </div>

                </div>
            </div>

            <BlogArticlesList articles={articles} projects = {projectsData} tags = {tagsData}/>

        </main>
    );
}