import { getStrapiURL } from "@/lib/utils";
import { getAuthToken } from "./services/get-token";
import qs from "qs";

const baseUrl = getStrapiURL();

async function fetchData(url: string) {
    let authToken = await getAuthToken();
    if (!authToken) {
        const strapiUrlToken = process.env.STRAPI_TOKEN;
        if (!strapiUrlToken) {
            throw new Error("STRAPI_URL is not defined in the environment variables");
        }
        authToken = strapiUrlToken;
    }
    const headers = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    };

    try {
        const response = await fetch(url, authToken ? headers : {});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
        throw error;
    }
}

export async function getGlobalPageData() {
    const url = new URL("/api/global", baseUrl);

    const query = qs.stringify({
        populate: [
            "header.logo.image",
            "header.headerLink",
            "footer.footerColumnOne.logo.image",
            "footer.footerColumnTwo",
            "footer.footerColumnThree.socialMedia.image"
        ]
    });

    url.search = query;

    return await fetchData(url.href);
}

export async function getHomePageData() {
    const url = new URL("/api/home-page", baseUrl);

    const query = qs.stringify({
        populate: {
            blocks: {
                on: {
                    'layout.hero-section': {
                        populate: {
                            image: {
                                fields: ["url", "alternativeText", "height", "width"]
                            },
                            button: {
                                populate: true
                            }
                        },
                    },
                    'layout.latest-projects': {
                        populate: "*",
                    },
                    'layout.latest-articles-section': {
                        populate: "*",
                    },
                    'layout.skill-section': {
                        populate: "*",
                    }
                }
            }
        }
    });

    url.search = query;

    return await fetchData(url.href);
}

export async function getLatestProjectsData() {
    const url = new URL("/api/projects", baseUrl);

    const query = qs.stringify({
        sort: [
            {
                publishedAt: "desc"
            }
        ],
        pagination: {
            page: 1,
            pageSize: 2
        },
        populate: {
            image: {
                fields: ["id", "documentId", "url", "alternativeText", "width", "height"]
            }
        }
    });

    url.search = query;

    return await fetchData(url.href);
}

export async function getLatestArticlesData() {
    const url = new URL("/api/articles", baseUrl);

    const query = qs.stringify({
        sort: [
            {
                publishedAt: "desc"
            }
        ],
        pagination: {
            page: 1,
            pageSize: 3
        },
        fields: ["id", "title", "description", "publishedAt", "slug"],
        populate: {
            image: {
                fields: ["id", "documentId", "url", "alternativeText", "width", "height"]
            },
        }
    });

    url.search = query;
    return await fetchData(url.href);
}

export async function getProjectsData() {
    const url = new URL("/api/projects", baseUrl);

    const query = qs.stringify({
        sort: [
            {
                publishedAt: "desc"
            }
        ],
        fields: ["id", "title", "description", "publishedAt", "slug", "updatedAt"],
        populate: {
            image: {
                fields: ["id", "documentId", "url", "alternativeText", "width", "height"]
            },
            tags: {
                fields: ["id", "documentId", "tag"]
            },
            articles: {
                fields: ["id", "documentId", "title", "description", "slug", "publishedAt"],
                populate:{
                    image: {
                        fields: ["id", "documentId", "url", "alternativeText", "width", "height"]
                    },
                }
            }
        }
    });

    url.search = query;
    return await fetchData(url.href);
}

export async function getArticlesData() {

    const query = qs.stringify({
        sort: [
            {
                publishedAt: "desc"
            }
        ],
        fields: ["id", "title", "description", "publishedAt", "slug"],
        populate: {
            image: {
                fields: ["id", "documentId", "url", "alternativeText", "width", "height"]
            },
            tags: {
                fields: ["id", "documentId", "tag"]
            },
            project: {
                fields: ["id", "documentId", "title", "description", "slug"]
            }
        }
    });

    const url = new URL("/api/articles", baseUrl);
    url.search = query;

    return await fetchData(url.href);
}

export async function getProjectData(slug: string) {
    const url = new URL("/api/projects", baseUrl);

    const query = qs.stringify({
        filters: {
            slug: {
                $eq: slug
            },
        },
        populate: {
            image: {
                fields: ["id", "documentId", "url", "alternativeText", "width", "height"]
            },
        }
    });

    url.search = query;

    return await fetchData(url.href);
}

export async function getArticleData(slug: string) {
    const url = new URL("/api/articles", baseUrl);

    const query = qs.stringify({
        filters: {
            slug: {
                $eq: slug
            },
        },
        populate: {
            image: {
                fields: ["id", "documentId", "url", "alternativeText", "width", "height"]
            },
            tags: {
                fields: ["id", "documentId", "tag"]
            },
            project: {
                fields: ["id", "documentId", "title", "description", "slug"]
            },
            users_permissions_users: {
                fields: ["id", "name", "surname", "username"],
                populate: {
                    profileImg: {
                        fields: ["id", "documentId", "url", "alternativeText", "width", "height"]
                    },
                }
            }
        }
    });

    url.search = query;

    return await fetchData(url.href);
}

export async function getTagsData() {
    const url = new URL("/api/tags", baseUrl);

    const query = qs.stringify({
        fields: ["id", "documentId", "tag"]
    });

    url.search = query;

    return await fetchData(url.href);
}

export async function getProjectsNames() {
    const url = new URL("/api/projects", baseUrl);

    const query = qs.stringify({
        fields: ["title", "slug"]
    });

    url.search = query;

    return await fetchData(url.href);
}

export async function getArticlesInProject(projectSlug: string) {
    const url = new URL("/api/articles", baseUrl);

    const query = qs.stringify({
        filters: {
            project: {
                slug: {
                    $eq: "mq-one"
                }
            }
        },
        fields: ["title", "description"],
        populate: {
            image: {
                fields: ["id", "documentId", "url", "alternativeText", "width", "height"]
            }
        }
    });

    url.search = query;
    return await fetchData(url.href);
}

export async function getBlogPageData() {
    const url = new URL("/api/blog-page", baseUrl);

    const query = qs.stringify({
        fields: ["title", "description", "heading1", "heading2"],
    });

    url.search = query;
    return await fetchData(url.href);
}

export async function getProjectPageData() {
    const url = new URL("/api/project-page", baseUrl);

    const query = qs.stringify({
        fields: ["title", "description"],
    });

    url.search = query;
    return await fetchData(url.href);
}