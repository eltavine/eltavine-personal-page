import sticker from "../../assets/eltavine-sticker.png";

/** One source of truth for the hero sticker, shared by the <picture> and its <head> preload. */
export const stickerImage = {
	sizes: "(min-width: 1080px) 380px, (min-width: 560px) 300px, 62vw",
	src: sticker,
	widths: [280, 400, 569],
} as const;
