import { getArticlesInProject } from "@/data/loaders";

export default async function ArticlesInProject({ projectName }: { projectName: string }) {
    const articles = await getArticlesInProject(projectName);

    const articlesData = articles.data;

    return (
        <div>
            {articlesData.map((article) => (
                <div key={article.id} className="card">
                    <img src={article.image} alt={article.title} className="card-img-top" />
                    <div className="card-body">
                        <h5 className="card-title">{article.title}</h5>
                        <p className="card-text">{article.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}