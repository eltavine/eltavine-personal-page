export const CRAYONS = ["heart", "marigold", "blue", "lavender", "sage", "pink", "butter"] as const;

export type Crayon = (typeof CRAYONS)[number];

export const crayonStyle = (crayon: Crayon, prefix: string) =>
	`--${prefix}-color: var(--crayon-${crayon}); --${prefix}-ink: var(--crayon-${crayon}-ink);`;
