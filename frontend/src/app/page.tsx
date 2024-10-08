import { ArticlesSection } from "@/components/custom/ArticlesSection";
import { HeroSection } from "@/components/custom/HeroSection";
import { ProjectsSection } from "@/components/custom/ProjectsSection";
import { SkillsSection } from "@/components/custom/SkillsSection";
import { getHomePageData, getLatestProjectsData, getLatestArticlesData } from "@/data/loaders";

export default async function Home() {

  const numOfArticles = 3;

  const homeData = await getHomePageData();
  const latestProjectsData = await getLatestProjectsData();
  const latestArticlesData = await getLatestArticlesData();

  const { blocks } = homeData.data;
  if (!blocks) return <div>No blocks found</div>

  return (
    <main>
      <HeroSection
        data={blocks.find((block: { __component: string }) => block.__component === 'layout.hero-section')}
      />

      <ProjectsSection
        project={latestProjectsData.data}
        data={blocks.find((block: { __component: string }) => block.__component === 'layout.latest-projects')}
      />

      <ArticlesSection
        article={latestArticlesData.data}
        data={blocks.find((block: { __component: string }) => block.__component === 'layout.latest-articles-section')}
      />

      <SkillsSection
        data={blocks.find((block: { __component: string }) => block.__component === 'layout.skill-section')}
      />
    </main>
  );
}

