import { writeFile } from "node:fs/promises";
import { readProjectRepos, readSnapshot } from "../src/content/loaders/github.ts";
import { fetchAll, mergeWithSnapshot } from "../src/lib/github.ts";

const snapshotPath = "src/content/snapshots/github.json";
const repos = await readProjectRepos("src/content/projects");
if (!process.env.GITHUB_TOKEN) {
	console.warn(
		"GITHUB_TOKEN is not set: counts will refresh, but star history needs an authenticated request.",
	);
}
const { errors, stats } = await fetchAll(repos, { log: console.warn, token: process.env.GITHUB_TOKEN });

for (const error of errors) {
	console.warn(`skipped ${error}`);
}

const previous = await readSnapshot(snapshotPath);
const merged = mergeWithSnapshot(stats, previous, repos);
const snapshot = Object.fromEntries(
	Object.entries(merged).map(([repo, { source: _source, ...entry }]) => [repo, entry]),
);
await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, "\t")}\n`);
console.log(`Snapshot updated for ${Object.keys(stats).length}/${repos.length} repos.`);
