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
    "Eltavine builds Android security inspection tools, native runtime probes, and backend systems with modular boundaries.",
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
  lead: "I build Android security tooling, native runtime probes, and backend systems with modular boundaries and local evidence in mind.",
  name: "Eltavine",
  principles: ["Modular detectors", "Native probes", "Clear boundaries"],
  role: "Software engineer",
  summary:
    "A focused view of the systems I work on, the signals I trust, and the seams I keep visible.",
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
      "Duck Detector keeps each signal in its own detector so bootloader state, hook frameworks, mount changes, and attestation checks can evolve without a monolithic scan pipeline.",
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
      "Detector coverage spans bootloader state, root traces, hook frameworks, mount changes, virtualization, and attestation trust signals.",
      "The app layer is Kotlin and Jetpack Compose, split by feature with view models, repositories, coroutines, and DataStore-backed settings.",
      "Native probes use the Android NDK with C++, CMake, and arm64 assembly where syscall timing or mount visibility needs a lower-level view.",
    ],
    icon: "lucide:shield-check",
    section: "Android / Security",
    stack: pickStack("android", "kotlin", "cpp", "asm"),
    status: "Native Android security tooling",
    summary:
      "Duck Detector is a device-side Android security inspection app that keeps analysis local and composes results from modular detectors rather than one monolithic scan flow.",
    title: "Duck Detector",
  },
  {
    emphasis:
      "The work is organized as a contract-first monorepo: product surfaces, generated clients, backend modules, identity boundaries, migrations, and release guardrails move together without exposing the private product name.",
    id: "anonymous-platform",
    availability: {
      icon: "lucide:lock-keyhole",
      label: "Private source, anonymized project",
    },
    notes: [
      "A pnpm and Turborepo workspace coordinates an Astro public site, React/Vite console apps, shared TypeScript packages, and generated web contracts.",
      "The backend is a Go resource server with ConnectRPC, Protobuf/Buf governance, SQLC-backed PostgreSQL access, Redis caching, and OpenTelemetry instrumentation.",
      "Operational boundaries include Ory identity services, Cloudflare Pages frontends, Docker-based service deployment, migration checks, SBOM generation, dependency audits, and secret scanning.",
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
    status: "Anonymous private platform",
    summary:
      "A private multi-app platform project with separate public, customer, operator, and API surfaces, built around explicit service contracts and production deployment guardrails.",
    title: "Private Platform",
  },
];

export const stackGroups = [
  {
    description: "Where ABI control, memory layout, and runtime behavior matter most.",
    eyebrow: "Core",
    icon: "lucide:cpu",
    items: pickStack("cpp", "c", "rust", "go"),
    title: "Core Languages",
  },
  {
    description: "Where UI, orchestration, and service logic turn into shipped software.",
    eyebrow: "Application",
    icon: "lucide:braces",
    items: pickStack("kotlin", "typescript", "javascript", "java", "react", "astro", "vite"),
    title: "Application Languages",
  },
  {
    description: "Where OS behavior and deployment constraints shape the design.",
    eyebrow: "Platform",
    icon: "lucide:monitor",
    items: pickStack("linux", "windowsKernel", "android", "docker", "cloudflare", "ory"),
    title: "Systems and Platform",
  },
  {
    description: "Where state must stay durable, queryable, and recoverable.",
    eyebrow: "Data",
    icon: "lucide:database",
    items: pickStack("postgresql", "redis", "protobuf", "connectRpc"),
    title: "Data Layer",
  },
  {
    description: "Where monorepo boundaries, repeatable checks, and generated code keep releases honest.",
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
