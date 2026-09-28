import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { contact, profile, site } from "../config/site.ts";
import { renderAsciiCard } from "../lib/ascii-card.ts";

export const GET: APIRoute = async ({ site: siteUrl }) => {
	const projects = (await getCollection("projects")).sort((a, b) => a.data.order - b.data.order);
	const card = renderAsciiCard({
		fingerprint: contact.fingerprint,
		githubUrl: contact.githubUrl,
		lead: profile.lead,
		name: profile.name,
		projects: projects.map(({ data }) => ({ summary: data.summary, title: data.title })),
		publicKeyUrl: contact.publicKeyUrl,
		role: profile.role,
		url: siteUrl?.toString() ?? site.url,
	});
	return new Response(card, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
