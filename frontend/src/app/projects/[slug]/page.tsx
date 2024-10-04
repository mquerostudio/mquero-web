import { getProjectData } from "@/data/loaders";

export default async function ProjectPage({ params }: { params: { slug: string }
}) {

    const { slug } = params;
    const projectData = await getProjectData(slug);


    const { title, description, mainText, updatedAt, publishedAt } = projectData.data[0];

    return (
        <div>
            <h1>{title}</h1>
            <p>{description}</p>
            <p>{updatedAt}</p>
            <p>{publishedAt}</p>
        </div>
    );
}