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
        <div className="pb-[96px] px-2">
            <div className="max-w-[1348px] w-full flex flex-col justify-between items-center mx-auto space-y-8">
                <h2 className="text-4xl font-bold w-full">
                    {heading}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full relative">
                    {skill.map(({ id, heading, subHeading, icon }) => (
                        <div
                            key={id}
                            className="p-4 flex flex-col items-start"
                        >
                            <div className="flex items-center mb-2">
                                {icon === "TbCircuitResistor" && <TbCircuitResistor className="mr-2" />}
                                {icon === "FaLaptopCode" && <FaLaptopCode className="mr-2" />}
                                {icon === "FaTools" && <FaTools className="mr-2" />}
                                {icon === "GrTest" && <GrTest className="mr-2" />}
                                {icon === "FaRobot" && <FaRobot className="mr-2" />}
                                {icon === "RiNextjsFill" && <RiNextjsFill className="mr-2" />}

                                <h3 className="text-2xl font-bold">
                                    {heading}
                                </h3>
                            </div>
                            <p className="text-xl">{subHeading}</p>
                        </div>
                    ))}
                    <div className="absolute top-1/2 w-full border-t border-gray-300 transform -translate-y-1/2"></div>
                    <div className="absolute left-1/3 top-0 h-full border-l border-gray-300"></div>
                    <div className="absolute left-2/3 top-0 h-full border-l border-gray-300"></div>
                </div>

            </div>
        </div>
    );
}