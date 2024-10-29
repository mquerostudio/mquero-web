import { TbCircuitResistor } from "react-icons/tb";
import { FaLaptopCode } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { GrTest } from "react-icons/gr";
import { FaRobot } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";

interface SkillProps {
    id: number;
    heading: string;
    subHeading: string;
    icon: string;
}

interface SkillsSectionProps {
    id: number;
    __component: string;
    heading: string;
    skill: SkillProps[];
}

export function SkillsSection({ data }: { readonly data: SkillsSectionProps }) {

    const { heading, skill } = data;

    return (
        <div className="pb-12">
            <div className="max-w-[1348px] w-full flex flex-col justify-between items-center mx-auto gap-8">
                <h2 className="text-2xl sm:text-4xl font-bold w-full">
                    {heading}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  w-full relative bg-white shadow-sm">
                    {skill.map(({ id, heading, subHeading, icon }) => (
                        <div
                            key={id}
                            className="p-4 flex flex-col items-start border"
                        >
                            <div className="flex items-center mb-2">
                                {icon === "TbCircuitResistor" && <TbCircuitResistor className="mr-2" />}
                                {icon === "FaLaptopCode" && <FaLaptopCode className="mr-2" />}
                                {icon === "FaTools" && <FaTools className="mr-2" />}
                                {icon === "GrTest" && <GrTest className="mr-2" />}
                                {icon === "FaRobot" && <FaRobot className="mr-2" />}
                                {icon === "RiNextjsFill" && <RiNextjsFill className="mr-2" />}

                                <h3 className="text-lg sm:text-2xl font-bold">
                                    {heading}
                                </h3>
                            </div>
                            <p className="text-base sm:text-lg">{subHeading}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}