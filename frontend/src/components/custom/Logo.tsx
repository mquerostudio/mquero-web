import Link from "next/link";
import { StrapiImage } from "./StrapiImage";

interface LogoProps {
    pageSrc: string;
    imgSrc: string;
    alt: string;
    height: number;
    width: number;
}

export function Logo({
    pageSrc,
    imgSrc,
    alt,
    height,
    width,
}: Readonly<LogoProps>) {
    return (
        <Link className="flex items-center gap-2" href={pageSrc}>
            <StrapiImage
                alt={alt}
                src={imgSrc}
                height={height}
                width={width}
            />
        </Link>

    );
}
