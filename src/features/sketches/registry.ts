import type { Diagram } from "../../lib/diagram.ts";

const modules = import.meta.glob<{ default: Diagram }>("./diagrams/*.ts", { eager: true });

export const diagrams: Readonly<Record<string, Diagram>> = Object.fromEntries(
	Object.entries(modules).map(([path, module]) => [path.replace(/^.*\/|\.ts$/g, ""), module.default]),
);

export function getDiagram(key: string): Diagram {
	const diagram = diagrams[key];
	if (!diagram) {
		throw new Error(`Unknown diagram "${key}". Add src/features/sketches/diagrams/${key}.ts.`);
	}
	return diagram;
}
