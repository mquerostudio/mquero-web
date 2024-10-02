import { LogoutButton } from "@/components/custom/LogoutButton";
import { Search } from "@/components/custom/Search";
import { getBlogArticles } from "@/data/loaders";
import { PaginationComponent } from "@/components/custom/PaginationComponent";

interface searchParamsProps {
  searchParams?: {
    query?: string;
    page?: string;
  };
}

interface Article {
  documentId: string;
  title: string;
}

export default async function DashboardRoute({
  searchParams
}: Readonly<searchParamsProps>) {
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;

  const { data, meta } = await getBlogArticles(query, currentPage);
  const pageCount = meta.pagination.pageCount;

  if (!data) return null;
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <Search />
      <div>
        <h1>Dashboard</h1>
        <LogoutButton />
      </div>
      <div >
        <h2>Articles</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((article: Article) => (
            <li key={article.title}>
              <a href={`/blog/${article.title}`}> {article.title}</a>
            </li>
          ))}
        </ul>
      </div>
      <PaginationComponent pageCount={pageCount} />
    </div>
  );
}