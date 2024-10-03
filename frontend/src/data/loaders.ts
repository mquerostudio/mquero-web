import { getStrapiURL } from "@/lib/utils";
import { getAuthToken } from "./services/get-token";
import qs from "qs";

const baseUrl = getStrapiURL();

async function fetchData(url: string) {
    const authToken = await getAuthToken();
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

    return await fetchData(url.href);
}

export async function getHomePageData() {
    const url = new URL("/api/home-page", baseUrl);

    return await fetchData(url.href);
}

export async function getLatestProjectsData() {
    const url = new URL("/api/projects", baseUrl);

    url.search = "?sort[0][publishedAt]=desc&pagination[page]=1&pagination[pageSize]=2&populate[image][fields][0]=id&populate[image][fields][1]=documentId&populate[image][fields][2]=url&populate[image][fields][3]=alternativeText&populate[image][fields][4]=width&populate[image][fields][5]=height";
    return await fetchData(url.href);
}

export async function getLatestArticlesData() {
    const PAGE_SIZE = 4;

    const query = qs.stringify({
        sort: [
            {
                publishedAt: "desc"
            }
        ],
        pagination: {
            page: 1,
            pageSize: PAGE_SIZE
        },
        fields: ["id", "title", "description", "publishedAt"],
        populate: {
            image: {
                fields: ["id", "documentId", "url", "alternativeText", "width", "height"]
            }
        }
    });

    const url = new URL("/api/articles", baseUrl);
    url.search = query;

    return await fetchData(url.href);
}
