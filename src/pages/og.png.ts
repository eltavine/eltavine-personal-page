import type { APIRoute } from "astro";
import { ogImage } from "../features/brand/brand.ts";

export const GET: APIRoute = async () =>
	new Response(new Uint8Array(await ogImage()), { headers: { "Content-Type": "image/png" } });
