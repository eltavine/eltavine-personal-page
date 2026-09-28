import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { githubLoader } from "./content/loaders/github.ts";
import { CRAYONS } from "./lib/crayons.ts";

const crayon = z.enum(CRAYONS);
const icon = z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/, "Use an Iconify name such as lucide:cpu");

const stack = defineCollection({
	loader: file("src/content/stack/items.yaml"),
	schema: z.object({ icon, label: z.string() }),
});

const stackGroups = defineCollection({
	loader: file("src/content/stack/groups.yaml"),
	schema: z.object({
		crayon,
		description: z.string(),
		eyebrow: z.string(),
		icon,
		items: z.array(reference("stack")).min(1),
		order: z.number().int(),
		title: z.string(),
	}),
});

export const PAPERS = ["plain", "checklist", "drafting", "tracing", "tractor"] as const;

const projects = defineCollection({
	loader: glob({ base: "./src/content/projects", pattern: "*.yaml" }),
	schema: z.object({
		availability: z.enum(["public", "internal"]),
		crayon,
		doodle: z.string(),
		emphasis: z.string(),
		github: z
			.string()
			.regex(/^[\w.-]+\/[\w.-]+$/)
			.optional(),
		icon,
		notes: z.array(z.string()).min(1),
		order: z.number().int().positive(),
		paper: z.enum(PAPERS).default("plain"),
		revision: z.string().default("A"),
		section: z.string(),
		sketch: z.string().optional(),
		stack: z.array(reference("stack")).min(1),
		status: z.string(),
		summary: z.string(),
		title: z.string(),
		updated: z
			.string()
			.regex(/^\d{4}-\d{2}$/)
			.optional(),
		wireframe: z.string().optional(),
	}),
});

const about = defineCollection({
	loader: glob({ base: "./src/content/about", pattern: "*.mdx" }),
	schema: z.object({
		bench: z.array(reference("projects")),
		greeting: z.string(),
		lead: z.string(),
		marginNote: z.string(),
		rules: z
			.array(
				z.object({
					body: z.string(),
					crayon,
					evidence: z
						.object({ label: z.string(), project: reference("projects"), segment: z.string().default("all") })
						.optional(),
					title: z.string(),
				}),
			)
			.min(1),
	}),
});

const repos = defineCollection({
	loader: githubLoader({
		projectsDir: "src/content/projects",
		snapshot: "src/content/snapshots/github.json",
	}),
	schema: z.object({
		fetchedAt: z.string(),
		forks: z.number().int().nonnegative(),
		history: z.array(z.object({ date: z.string(), stars: z.number().int().nonnegative() })),
		pushedAt: z.string().nullable(),
		repo: z.string(),
		source: z.enum(["live", "snapshot"]),
		stars: z.number().int().nonnegative(),
	}),
});

export const collections = { about, projects, repos, stack, stackGroups };
