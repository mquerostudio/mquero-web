import { ProjectBigCard } from "@/components/custom/ProjectBigCard";
import { getProjectsData } from "@/data/loaders";

export default async function Projects() {

    const projects = await getProjectsData();
    const projectsData = projects.data;
    const projectsMeta = projects.meta;

    return (
        <main>
            <div className="max-w-[1348px] w-full mx-auto">
                <ProjectBigCard/>
            </div>
        </main>
    );
}