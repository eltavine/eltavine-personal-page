import { describe, expect, it } from "vitest";
import { onRequestGet } from "../../functions/index.ts";

const call = (headers: Record<string, string>) => {
	const request = new Request("https://eltavine.com/", { headers });
	const context = {
		env: { ASSETS: { fetch: async (url: URL) => new Response(`card from ${new URL(url).pathname}`) } },
		next: async () => new Response("<html>page</html>", { headers: { "Content-Type": "text/html" } }),
		request,
	};
	return onRequestGet(context as never);
};

describe("terminal content negotiation", () => {
	it("serves the ASCII card to curl", async () => {
		const response = await call({ "user-agent": "curl/8.7.1" });
		expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
		expect(response.headers.get("vary")).toContain("User-Agent");
		expect(await response.text()).toBe("card from /card.txt");
	});

	it("serves the card when plain text is explicitly accepted", async () => {
		const response = await call({ accept: "text/plain", "user-agent": "Mozilla/5.0" });
		expect(await response.text()).toBe("card from /card.txt");
	});

	it("passes browsers through untouched but varies the cache", async () => {
		const response = await call({ accept: "text/html", "user-agent": "Mozilla/5.0 (Macintosh) Chrome/140" });
		expect(await response.text()).toBe("<html>page</html>");
		expect(response.headers.get("vary")).toContain("User-Agent");
	});
});
