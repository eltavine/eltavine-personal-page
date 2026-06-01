const stackRegistry = {
  android: { icon: "devicon:android", label: "Android" },
  astro: { icon: "devicon:astro", label: "Astro" },
  asm: { icon: "lucide:binary", label: "ASM" },
  c: { icon: "devicon:c", label: "C" },
  cloudflare: { icon: "devicon:cloudflare", label: "Cloudflare" },
  connectRpc: { icon: "lucide:radio-tower", label: "ConnectRPC" },
  cpp: { icon: "devicon:cplusplus", label: "C++" },
  docker: { icon: "devicon:docker", label: "Docker" },
  go: { icon: "devicon:go", label: "Go" },
  java: { icon: "devicon:java", label: "Java" },
  javascript: { icon: "devicon:javascript", label: "JavaScript" },
  kotlin: { icon: "devicon:kotlin", label: "Kotlin" },
  linux: { icon: "devicon:linux", label: "Linux" },
  ory: { icon: "devicon:ory", label: "Ory" },
  pnpm: { icon: "devicon:pnpm", label: "pnpm" },
  postgresql: { icon: "devicon:postgresql", label: "PostgreSQL" },
  protobuf: { icon: "lucide:boxes", label: "Protobuf" },
  react: { icon: "devicon:react", label: "React" },
  redis: { icon: "devicon:redis", label: "Redis" },
  rust: { icon: "devicon:rust", label: "Rust" },
  turborepo: { icon: "simple-icons:turborepo", label: "Turborepo" },
  typescript: { icon: "devicon:typescript", label: "TypeScript" },
  vite: { icon: "devicon:vite", label: "Vite" },
  windowsKernel: { icon: "devicon:windows8", label: "Windows Kernel" },
};

const pickStack = (...keys) =>
  keys.map((key) => ({
    key,
    ...stackRegistry[key],
  }));

export const siteMeta = {
  description:
    "Eltavine builds Android security tools, native probes, and web platforms that make system signals easier to understand.",
  image: "/eltavine.png",
  locale: "en_US",
  siteUrl: "https://eltavine.com",
  title: "Eltavine",
};

export const navigation = [
  { href: "#projects", icon: "lucide:folder-kanban", label: "Projects" },
  { href: "#stack", icon: "lucide:layers-3", label: "Stack" },
  { href: "#contact", icon: "lucide:mail", label: "Contact" },
];

export const profile = {
  avatarSrcset: "/eltavine-avatar-80.webp 80w, /eltavine-avatar-160.webp 160w",
  avatarUrl: "/eltavine-avatar-160.webp",
  headlineLines: ["Android,", "Windows,", "native."],
  lead: "I build Android security tools, native probes, and web platforms with clear signals and practical reliability in mind.",
  name: "Eltavine",
  principles: ["Local checks", "Native probes", "Reliable systems"],
  role: "Software engineer",
  summary:
    "A compact portfolio of security tools, platform work, and the technologies behind them.",
};

export const contact = {
  emailParts: {
    domain: "eltavine",
    tld: "com",
    user: "me",
  },
  fingerprint: "46CC2913C0B6460FF498DE6009E517BD5F0084C8",
  githubLabel: "github.com/eltavine",
  githubUrl: "https://github.com/eltavine/",
  keyId: "09E517BD5F0084C8",
  publicKeyUrl: "/eltavine-public-key.asc",
};

export const projects = [
  {
    emphasis:
      "It turns device trust signals into focused local checks, from bootloader state to root traces and attestation results.",
    id: "duck-detector",
    github: {
      href: "https://github.com/eltavine/Duck-Detector-Refactoring",
      repo: "eltavine/Duck-Detector-Refactoring",
    },
    starHistory: {
      href: "https://www.star-history.com/?repos=eltavine%2FDuck-Detector-Refactoring&type=date&legend=top-left",
      darkSrc:
        "https://api.star-history.com/chart?repos=eltavine/Duck-Detector-Refactoring&type=date&theme=dark&legend=top-left",
      lightSrc:
        "https://api.star-history.com/chart?repos=eltavine/Duck-Detector-Refactoring&type=date&legend=top-left",
    },
    notes: [
      "Checks risky device states locally, including bootloader, root, hook, mount, virtualization, and attestation signals.",
      "Uses Kotlin and Jetpack Compose for a clear Android inspection flow.",
      "Adds native probes where lower-level device evidence matters.",
    ],
    icon: "lucide:shield-check",
    section: "Android / Security",
    stack: pickStack("android", "kotlin", "cpp", "asm"),
    status: "Native Android security tooling",
    summary:
      "Duck Detector is a device-side Android security inspection app that keeps analysis local.",
    title: "Duck Detector",
  },
  {
    emphasis:
      "The private source and product name stay hidden here, but the work spans public pages, customer tools, operator views, and service APIs.",
    id: "anonymous-platform",
    availability: {
      icon: "lucide:lock-keyhole",
      label: "Private source, anonymized project",
    },
    notes: [
      "Built web surfaces for public visitors, customers, and operators.",
      "Connected account, data, caching, and API services into one product platform.",
      "Kept releases steady with practical deployment and dependency checks.",
    ],
    icon: "lucide:network",
    section: "Full-stack / Platform",
    stack: pickStack(
      "typescript",
      "react",
      "vite",
      "astro",
      "go",
      "protobuf",
      "connectRpc",
      "postgresql",
      "redis",
      "ory",
      "cloudflare",
      "docker",
    ),
    status: "Private platform work",
    summary:
      "A private multi-app platform project with separate web and API surfaces.",
    title: "Private Platform",
  },
];

export const stackGroups = [
  {
    description: "Languages for native code, services, and performance-sensitive work.",
    eyebrow: "Core",
    icon: "lucide:cpu",
    items: pickStack("cpp", "c", "rust", "go"),
    title: "Core Languages",
  },
  {
    description: "Tools for Android apps, web interfaces, and shipped product features.",
    eyebrow: "Application",
    icon: "lucide:braces",
    items: pickStack("kotlin", "typescript", "javascript", "java", "react", "astro", "vite"),
    title: "Application Languages",
  },
  {
    description: "Systems I use for device, server, and deployment work.",
    eyebrow: "Platform",
    icon: "lucide:monitor",
    items: pickStack("linux", "windowsKernel", "android", "docker", "cloudflare", "ory"),
    title: "Systems and Platform",
  },
  {
    description: "Storage, caching, and API tools for product data.",
    eyebrow: "Data",
    icon: "lucide:database",
    items: pickStack("postgresql", "redis", "protobuf", "connectRpc"),
    title: "Data Layer",
  },
  {
    description: "Package and workspace tools that keep builds repeatable.",
    eyebrow: "Workflow",
    icon: "lucide:workflow",
    items: pickStack("pnpm", "turborepo"),
    title: "Build and Governance",
  },
];

export function buildEmailAddress(parts = contact.emailParts) {
  return `${parts.user}@${parts.domain}.${parts.tld}`;
}

export function formatFingerprint(fingerprint) {
  return fingerprint.match(/.{1,4}/g) ?? [];
}
