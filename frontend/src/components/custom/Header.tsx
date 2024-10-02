import Image from "next/image";
import { StrapiImage } from "./StrapiImage";
import { Button } from "../ui/button";
import Link from "next/link";

interface ImageProps {
    documentId: string;
    name: string;
    alternativeText: string;
    width: number;
    height: number;
    url: string;
}

interface HeaderLinkProps {
    id: number;
    url: string;
    text: string;
    isExternal: boolean;
}

interface HeaderProps {
    data: {
        logo: {
            id: number;
            url: string;
            isExternal: boolean;
            text: string;
            image: ImageProps;
        }
        headerLink: HeaderLinkProps[];
    }
}

export async function Header({ data }: Readonly<HeaderProps>) {
    const { logo, headerLink } = data;

    return (
        <div className="justify-center items-center w-full">
            <div className="flex items-center justify-between px-4 py-3 max-w-[1152px] mx-auto">
                <div className="h-[49px] w-[119px] flex items-center justify-center">
                    <StrapiImage
                        alt={logo.image.alternativeText}
                        src={logo.image.url}
                        height={logo.image.height}
                        width={logo.image.width}
                    />
                </div>
                <div className="flex items-center space-x-10">
                    {headerLink.map((link) => (
                        link.url === "/about-me" ? (
                            <Link href={link.url} key={link.id}>
                                <Button className="text-lg font-medium h-13">{link.text}</Button>
                            </Link>
                        ) : (
                            <a
                                key={link.id}
                                href={link.url}
                                className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                            >
                                {link.text}
                            </a>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}