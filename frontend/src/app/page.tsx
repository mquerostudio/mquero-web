import { HeroSection } from "@/components/custom/HeroSection";
import { getHomePageData } from "@/data/loaders";

function blockRenderer(block: any) {
  switch (block.__component) {
    case "layout.hero-section":
      return <HeroSection key={block.id} data={block} />;
    // case "layout.skills-section":
    //   return <SkillsSection key={block.id} data={block} />;
    default:
      return null;
  }
}


export default async function Home() {
  const homeData = await getHomePageData();

  const { blocks } = homeData.data;
  if (!blocks) return <div>No blocks found</div>

  return <main>{blocks.map(blockRenderer)}</main>;
}
