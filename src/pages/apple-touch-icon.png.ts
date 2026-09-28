import type { APIRoute } from "astro";
import { appleTouchIcon } from "../features/brand/brand.ts";

export const GET: APIRoute = async () =>
	new Response(new Uint8Array(await appleTouchIcon()), { headers: { "Content-Type": "image/png" } });
