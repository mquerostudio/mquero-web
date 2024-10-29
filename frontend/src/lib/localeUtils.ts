import { headers } from "next/headers";

export function getLocaleFromHost(): "en" | "es" {
    const host = headers().get("host") || "";
    return host.endsWith(".es") ? "es" : "en";
}

