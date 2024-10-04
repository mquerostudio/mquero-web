import { StrapiImage } from "@/components/custom/StrapiImage";
import { getLatestArticlesData } from "@/data/loaders";

export default async function Blog() {

    const latestArticleData = await getLatestArticlesData(1);

    const { title, description, publishedAt, slug, image } = latestArticleData.data[0];

    return (
        <main>
            <header className="py-[96px] px-2">
                <div className="max-w-[1348px] w-full flex flex-col justify-between items-start mx-auto space-y-4 lg:space-y-0 h-auto">
                    <h1 className="text-[40px] font-bold">
                        Blog
                    </h1>
                    <p className="text-xl">
                        The best maker blog
                    </p>
                </div>
            </header>

            <div>
                <h2>{title}</h2>
                <p>{description}</p>
                <p>{publishedAt}</p>
                <p>{slug}</p>
                <StrapiImage
                    src={image.url}
                    alt={image.alternativeText}
                    width={480}
                    height={480}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
            </div>



        </main>
    );
}