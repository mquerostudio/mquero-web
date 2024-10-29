"use client"
import Image from "next/image";
import { StrapiImage } from "./StrapiImage";
import { Button } from "../ui/button";
import Link from "next/link";
import { Logo } from "./Logo";
import { useEffect, useState } from "react";
import { TbWorld } from "react-icons/tb";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


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


export function Header({ data }: Readonly<HeaderProps>) {
    const { logo, headerLink } = data;
    const [isDropdown, setIsDropdown] = useState(false);

    // const handleLanguageChange = (language: string) => {
    //     const currentPath = window.location.pathname; // Captura la ruta actual
    //     const newDomain = language === "en" ? "https://mquero.com" : "https://mquero.es";
    //     window.location.href = `${newDomain}${currentPath}`; // Redirige manteniendo la ruta actual
    // };


    return (
        <div className="sticky top-0 z-50 w-full h-14 backdrop-blur">

            <div className="flex justify-between items-center max-w-[1544px] mx-auto h-full px-4">

                <div className="md:flex mr-4 items-center">
                    <Logo
                        pageSrc="/"
                        imgSrc={logo.image.url}
                        alt={logo.image.alternativeText}
                        height={logo.image.height}
                        width={logo.image.width}
                        classname="h-8"
                    />
                </div>

                <div className="hidden md:flex links-container items-center flex-1 justify-between space-x-10 md:justify-end h-full">
                    <div className="flex items-center space-x-4">
                        <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                            <span
                                className={`cursor-pointer ${window.location.href.includes('mquero.com') ? 'text-[#ffaa00ff]' : 'hover:text-gray-600 dark:hover:text-gray-400'}`}
                                // onClick={() => handleLanguageChange("en")}
                            >
                                en
                            </span>
                            <span><TbWorld className="inline mx-1 mb-0.5 align-middle" /></span>
                            <span
                                className={`cursor-pointer ${window.location.href.includes('mquero.es') ? 'text-[#ffaa00ff]' : 'hover:text-gray-600 dark:hover:text-gray-400'}`}
                                // onClick={() => handleLanguageChange("es")}
                            >
                                es
                            </span>
                        </div>
                    </div>

                    {headerLink.map((link) => (
                        link.url === "/about-me" ? (
                            <Link href={link.url} key={link.id}>
                                <Button className="text-lg font-medium h-8 bg-gray-800 text-white hover:bg-[#ffaa00ff] hover:text-black">
                                    {link.text}
                                </Button>
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

                <div className="md:hidden flex items-center h-full">
                    <div className="flex items-center mr-4">
                        <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                            <span
                                className={`cursor-pointer ${window.location.href.includes('mquero.com') ? 'text-[#ffaa00ff]' : 'hover:text-gray-600 dark:hover:text-gray-400'}`}
                                // onClick={() => handleLanguageChange("en")}
                            >
                                en
                            </span>
                            <span><TbWorld className="inline mx-1 mb-0.5 align-middle" /></span>
                            <span
                                className={`cursor-pointer ${window.location.href.includes('mquero.es') ? 'text-[#ffaa00ff]' : 'hover:text-gray-600 dark:hover:text-gray-400'}`}
                                // onClick={() => handleLanguageChange("es")}
                            >
                                es
                            </span>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <div className="space-y-1">
                                    <div className="w-6 h-0.5 bg-black dark:bg-white"></div>
                                    <div className="w-6 h-0.5 bg-black dark:bg-white"></div>
                                    <div className="w-6 h-0.5 bg-black dark:bg-white"></div>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mr-4">
                            {headerLink.map((link) => (
                                <DropdownMenuItem key={link.id} className="justify-center p-0 py-1">
                                    <Link href={link.url}>
                                        {link.text}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

        </div>
    );
}
