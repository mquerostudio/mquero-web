import qs from "qs";
import { flattenAttributes, getStrapiURL } from "@/lib/utils";
import { getAuthToken } from "./services/get-token";

const baseUrl = getStrapiURL();

async function fetchData(url: string) {
  const authToken = await getAuthToken(); // we will implement this later getAuthToken() later
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
    // console.dir(data, { depth: null });
    return flattenAttributes(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // or return null;
  }
}

export async function getHomePageData() {

  const url = new URL("/api/home-page/", baseUrl);

  return await fetchData(url.href);
}

export async function getGlobalPageData() {
  const url = new URL("/api/global/", baseUrl);

  return await fetchData(url.href);
}

export async function getGlobalPageMetadata() {
  const url = new URL("/api/global", baseUrl);

  url.search = qs.stringify({
    fields: ["title", "description"]
  });
  // console.log(url.href);

  return await fetchData(url.href);
}

export async function getBlogArticles(queryString: string, currentPage: number) {
  const PAGE_SIZE = 3;

  const query = qs.stringify({
    // sort: ["createdAt:desc"],
    // filters: {
    //   $or: [
    //     { title: { $containsi: queryString } },
    //     { summary: { $containsi: queryString } },
    //   ],
    // },
    pagination: {
      pageSize: PAGE_SIZE,
      page: currentPage,
    }
  });

  const url = new URL("/api/blogs/", baseUrl);
  url.search = query;

  return await fetchData(url.href);
}