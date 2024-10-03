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
    link: Link;
}

export function HeroSection({ data }: { readonly data: HeroSectionProps }) {

    const { heading, subHeading, image, link } = data;

    return (
        <header className="py-[96px] px-2">
            <div className="max-w-[1348px] w-full flex flex-col lg:flex-row justify-between items-center mx-auto space-y-4 lg:space-y-0 lg:space-x-[24px] h-auto">

                <div className="rounded-[80px] overflow-hidden">
                    <StrapiImage
                        src={image.url}
                        alt={image.alternativeText}
                        height={270}
                        width={270}
                    />
                </div>

                <div className="flex flex-col items-center justify-center w-full text-center space-y-[24px] max-w-[1054px]">
                    <h1 className="text-[40px] font-bold">{heading}</h1>
                    <p className="text-xl">{subHeading}</p>
                    <Link href={link.url}>
                        <Button className="text-lg font-medium h-10">
                            {link.text}
                        </Button>
                    </Link>
                </div>

            </div>
        </header>
    );
}