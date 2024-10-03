import { getStrapiURL } from "@/lib/utils";
import { getAuthToken } from "./services/get-token";

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

