import Link from "next/link";
import { StrapiImage } from "./StrapiImage";
import { Button } from "../ui/button";

interface Image {
    id: number;
    documentId: string;
    url: string;
    alternativeText: string;
    width: number;
    height: number;
}

interface Link {
    id: number;
    url: string;
    text: string;
    isExternal: boolean;
}

interface HeroSectionProps {
    id: number;
    __component: string;
    heading: string;
    subHeading: string;
    image: Image;
    button: Link;
}

export function HeroSection({ data }: { readonly data: HeroSectionProps }) {

    const { heading, subHeading, image, button } = data;

    const highlightedHeading = heading.replace(/(Manuel Quero|electrónica, programar y fabricar cosas)/g, '<span style="color: #ffaa00ff;">$1</span>');

    return (
        <header className="py-12">
            <div className="max-w-[1348px] w-full flex flex-col lg:flex-row justify-between items-center mx-auto space-y-4 lg:space-y-0 lg:space-x-6 h-auto border-4 border-gray-300 rounded-3xl p-4 sm:p-8 bg-white">

                <div className="sm:rounded-[80px] rounded-[40px] overflow-hidden h-32 w-64 sm:h-64 sm:w-64 relative">
                    <StrapiImage
                        src={image.url}
                        alt={image.alternativeText}
                        height={image.height}
                        width={image.width}
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>

                <div className="flex flex-col items-center justify-center w-full text-center gap-4 max-w-[1054px]">
                    <h1 className="text-2xl sm:text-4xl font-bold" dangerouslySetInnerHTML={{ __html: highlightedHeading }}></h1>
                    <p className="text-base sm:text-xl">{subHeading}</p>
                    <Link href={button.url}>
                        <Button className="text-base sm:text-xl font-medium bg-gray-800 text-white hover:bg-[#ffaa00ff] hover:text-black">
                            {button.text}
                        </Button>
                    </Link>
                </div>

            </div>
        </header>
    );
}