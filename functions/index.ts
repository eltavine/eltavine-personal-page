interface Env {
	ASSETS: Fetcher;
}

const TERMINAL_CLIENT = /^(curl|wget|httpie|xh|powershell)\b/i;

/** `curl eltavine.com` gets the ASCII postcard; browsers get the page untouched. Only `/` runs this. */
export const onRequestGet: PagesFunction<Env> = async ({ env, next, request }) => {
	const agent = request.headers.get("user-agent") ?? "";
	const accept = request.headers.get("accept") ?? "";
	if (TERMINAL_CLIENT.test(agent) || accept.startsWith("text/plain")) {
		const card = await env.ASSETS.fetch(new URL("/card.txt", request.url));
		return new Response(card.body, {
			headers: {
				"Cache-Control": "public, max-age=3600",
				"Content-Type": "text/plain; charset=utf-8",
				Vary: "User-Agent, Accept",
			},
			status: card.status,
		});
	}

	const response = await next();
	const headers = new Headers(response.headers);
	headers.append("Vary", "User-Agent, Accept");
	return new Response(response.body, { headers, status: response.status, statusText: response.statusText });
};
