"use client"
import Image from "next/image";
import { StrapiImage } from "./StrapiImage";
import { Button } from "../ui/button";
import Link from "next/link";
import { Logo } from "./Logo";
import { useEffect, useState } from "react";

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

            <div className="hidden sm:flex links-container items-center flex-1 justify-between space-x-10 sm:justify-end h-full">
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

            <div className="sm:hidden flex items-center h-full">
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
                <DropdownMenuContent className="w-56">
                    {headerLink.map((link) => (
                    <DropdownMenuItem key={link.id}>
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
