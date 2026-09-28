import type { APIRoute } from "astro";
import { sealIconSvg } from "../features/brand/brand.ts";

export const GET: APIRoute = () =>
	new Response(sealIconSvg(), { headers: { "Content-Type": "image/svg+xml" } });
