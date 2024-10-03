import { Logo } from "./Logo";
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
        <div className="dark bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between space-y-11 md:space-y-0">

                <div className="flex flex-col items-center space-y-5">
                    <h2 className="font-bold text-base">{footerColumnOne.heading}</h2>
                    <p>{footerColumnOne.text}</p>
                    <Logo
                        pageSrc="/"
                        imgSrc={footerColumnOne.logo.image.url}
                        alt={footerColumnOne.logo.image.alternativeText}
                        height={footerColumnOne.logo.image.height}
                        width={footerColumnOne.logo.image.width}
                    />
                </div>

                <div className="flex flex-col items-center space-y-5">
                    <h2 className="font-bold text-base">{footerColumnTwo.heading}</h2>
                    <ul className="text-center">
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

                <div className="flex flex-col items-center space-y-5">
                    <h2 className="font-bold text-base">{footerColumnThree.heading}</h2>
                    <ul className="flex flex-col items-center space-y-2">
                        {footerColumnThree.socialMedia.map((social) => (
                            <li key={social.id} className="w-full">
                                <a
                                    href={social.url}
                                    target={social.isExternal ? "_blank" : "_self"}
                                    rel={social.isExternal ? "noopener noreferrer" : ""}
                                    className="flex items-center justify-center space-x-2 text-lg font-medium text-gray-300 hover:text-gray-400"
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
