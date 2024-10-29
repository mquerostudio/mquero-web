import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                // disallow: ["/admin"]
            }
        ],
        sitemap: [
            "https://www.mquero.com/sitemap.xml",
            "https://www.mquero.es/sitemap.xml"
        ]
    }
}
