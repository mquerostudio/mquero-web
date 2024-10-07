import Link from "next/link";
import { StrapiImage } from "./StrapiImage";

interface LogoProps {
    pageSrc: string;
    imgSrc: string;
    alt: string;
    height: number;
    width: number;
    classname?: string;
}

export function Logo({
    pageSrc,
    imgSrc,
    alt,
    height,
    width,
    classname
}: Readonly<LogoProps>) {
    return (
        <Link className="flex items-center gap-2" href={pageSrc}>
            <StrapiImage
                alt={alt}
                src={imgSrc}
                height={height}
                width={width}
                className={classname}
            />
        </Link>

    );
}
