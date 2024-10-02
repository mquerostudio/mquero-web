import { StrapiImage } from "./StrapiImage";

interface ImageProps {
    documentId: string;
    name: string;
    alternativeText: string;
    width: number;
    height: number;
    url: string;
}

interface SocialMediaProps {
    id: number;
    url: string;
    isExternal: boolean;
    text: string;
    image: ImageProps;
}

interface HeaderLinkProps {
    id: number;
    url: string;
    text: string;
    isExternal: boolean;
}

interface FooterColumnOneProps {
    id: number;
    heading: string;
    text: string;
    logo: {
        id: number;
        url: string;
        isExternal: boolean;
        text: string;
        image: ImageProps;
    }

}

interface FooterColumnTwoProps {
    id: number;
    heading: string;
}

interface FooterColumnThreeProps {
    id: number;
    heading: string;
    text: string;
    socialMedia: SocialMediaProps[];
}

interface FooterProps {
    data: {
        footerColumnOne: FooterColumnOneProps;
        footerColumnTwo: FooterColumnTwoProps;
        footerColumnThree: FooterColumnThreeProps;
    }
    headerLink: HeaderLinkProps[];
}

export async function Footer({ data, headerLink }: Readonly<FooterProps>) {
    const { footerColumnOne, footerColumnTwo, footerColumnThree } = data;

    return (
        <div className="w-full bg-gray-900 text-white flex flex-col items-center justify-center min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 min-w-[1152] mx-auto">
                <div>
                    <h2>{footerColumnOne.heading}</h2>
                    <p>{footerColumnOne.text}</p>
                    <div className="h-[49px] w-[119px] flex items-center justify-center">
                        <StrapiImage
                            alt={footerColumnOne.logo.image.alternativeText}
                            src={footerColumnOne.logo.image.url}
                            height={footerColumnOne.logo.image.height}
                            width={footerColumnOne.logo.image.width}
                        />
                    </div>
                </div>

                <div>
                    <h2>{footerColumnTwo.heading}</h2>
                    <ul>
                        {headerLink.map((link) => (
                            <li key={link.id}>
                                <a
                                    href={link.url}
                                    className="text-lg font-medium text-gray-300 hover:text-gray-400"
                                >
                                    {link.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2>{footerColumnThree.heading}</h2>
                    <ul>
                        {footerColumnThree.socialMedia.map((social) => (
                            <li key={social.id}>
                                <a
                                    href={social.url}
                                    target={social.isExternal ? "_blank" : "_self"}
                                    rel={social.isExternal ? "noopener noreferrer" : ""}
                                    className="flex items-center space-x-2 text-lg font-medium text-gray-300 hover:text-gray-400"
                                >
                                    <StrapiImage
                                        alt={social.image.alternativeText}
                                        src={social.image.url}
                                        height={social.image.height}
                                        width={social.image.width}
                                        className=""
                                    />
                                    <span>{social.text}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
