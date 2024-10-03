import { ArticlesSection } from "@/components/custom/ArticlesSection";
import { HeroSection } from "@/components/custom/HeroSection";
import { ProjectsSection } from "@/components/custom/ProjectsSection";
import { SkillsSection } from "@/components/custom/SkillsSection";
import { getHomePageData, getLatestArticlesData, getLatestProjectsData } from "@/data/loaders";

export default async function Home() {
  const homeData = await getHomePageData();
  const latestProjectsData = await getLatestProjectsData();
  const latestArticlesData = await getLatestArticlesData();

  const { blocks } = homeData.data;
  if (!blocks) return <div>No blocks found</div>

  // console.dir(latestArticlesData, { depth: null });

  return (
    <main>
      <HeroSection data={blocks.find((block: { __component: string }) => block.__component === 'layout.hero-section')} />
      <ProjectsSection project={latestProjectsData.data} />
      <ArticlesSection article={latestArticlesData.data} />
      <SkillsSection data={blocks.find((block: { __component: string }) => block.__component === 'layout.skill-section')} />
    </main>
  );
}

