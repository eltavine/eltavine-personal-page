const stackRegistry = {
  android: { icon: "devicon:android", label: "Android" },
  adb: { icon: "lucide:terminal", label: "ADB" },
  astro: { icon: "devicon:astro", label: "Astro" },
  asm: { icon: "lucide:binary", label: "ASM" },
  axum: { icon: "lucide:route", label: "Axum" },
  buf: { icon: "lucide:boxes", label: "Buf" },
  c: { icon: "devicon:c", label: "C" },
  cloudflare: { icon: "devicon:cloudflare", label: "Cloudflare" },
  connectRpc: { icon: "lucide:radio-tower", label: "ConnectRPC" },
  cpp: { icon: "devicon:cplusplus", label: "C++" },
  dart: { icon: "lucide:code-2", label: "Dart" },
  docker: { icon: "devicon:docker", label: "Docker" },
  go: { icon: "devicon:go", label: "Go" },
  ios: { icon: "simple-icons:ios", label: "iOS" },
  java: { icon: "devicon:java", label: "Java" },
  javascript: { icon: "devicon:javascript", label: "JavaScript" },
  kotlin: { icon: "devicon:kotlin", label: "Kotlin" },
  linux: { icon: "logos:linux-tux", label: "Linux" },
  macos: { icon: "simple-icons:macos", label: "macOS" },
  ory: { icon: "devicon:ory", label: "Ory" },
  pingora: { icon: "lucide:network", label: "Pingora" },
  pnpm: { icon: "devicon:pnpm", label: "pnpm" },
  postgresql: { icon: "devicon:postgresql", label: "PostgreSQL" },
  protobuf: { icon: "lucide:boxes", label: "Protobuf" },
  riverpod: { icon: "lucide:git-branch", label: "Riverpod" },
  react: { icon: "devicon:react", label: "React" },
  redis: { icon: "devicon:redis", label: "Redis" },
  rust: { icon: "devicon:rust", label: "Rust" },
  scrcpy: { icon: "lucide:monitor", label: "scrcpy" },
  sqlcipher: { icon: "lucide:database", label: "SQLCipher" },
  tauri: { icon: "lucide:app-window", label: "Tauri" },
  tailwind: { icon: "lucide:wind", label: "Tailwind CSS" },
  tonic: { icon: "lucide:radio", label: "Tonic" },
  tokio: { icon: "lucide:timer-reset", label: "Tokio" },
  turborepo: { icon: "simple-icons:turborepo", label: "Turborepo" },
  typescript: { icon: "devicon:typescript", label: "TypeScript" },
  vite: { icon: "devicon:vite", label: "Vite" },
  vitest: { icon: "lucide:flask-conical", label: "Vitest" },
  windowsKernel: { icon: "devicon:windows8", label: "Windows Kernel" },
};

const pickStack = (...keys) =>
  keys.map((key) => ({
    key,
    ...stackRegistry[key],
  }));

export const siteMeta = {
  description:
    "Eltavine builds Android security tools, network infrastructure, and local-first workspaces with clear signals and practical reliability.",
  image: "/eltavine.png",
  locale: "en_US",
  siteUrl: "https://eltavine.com",
  title: "Eltavine",
};

export const navigation = [
  { href: "#projects", icon: "lucide:folder-kanban", label: "Projects" },
  { href: "#about", icon: "lucide:notebook-pen", label: "About" },
  { href: "#stack", icon: "lucide:layers-3", label: "Stack" },
  { href: "#contact", icon: "lucide:mail", label: "Contact" },
];

export const profile = {
  avatarSrcset: "/eltavine-avatar-80.webp 80w, /eltavine-avatar-160.webp 160w",
  avatarUrl: "/eltavine-avatar-160.webp",
  figureCaption: "Fig. 01 — Eltavine, crayon on paper",
  handNote: "hi, that's me!",
  headlineLines: ["Android,", "Windows,", "native."],
  lead: "I build Android security tools, network infrastructure, and local-first workspaces with clear signals and practical reliability in mind.",
  name: "Eltavine",
  principles: [
    { crayon: "sage", label: "Local checks" },
    { crayon: "blue", label: "Native probes" },
    { crayon: "marigold", label: "Reliable systems" },
  ],
  readoutLabel: "Signals",
  role: "Software engineer",
  summary:
    "A compact portfolio of security tools, platform work, and the technologies behind them.",
};

export const about = {
  bench: ["pingora-panel", "yurimashi", "yunheshiguang-droid-farm"],
  greeting: "hello!",
  lead: "The short version of who I am, plus the rules I keep coming back to.",
  marginNote: "long version: the projects",
  paragraphs: [
    "I'm Eltavine, a software engineer who likes to work close to the platform: Android internals, native code, and the infrastructure that keeps services running.",
    "A lot of my work starts with a trust question. Is this device in the state it claims? Is this config safe to roll out? Does this data need to leave the machine at all? I like answering those with tools that check locally and show their evidence.",
    "I care about calm software: clear signals, honest status, and failure modes that are designed rather than discovered.",
  ],
  rules: [
    {
      body: "Checks run on the device, and data stays on the machine by default.",
      crayon: "sage",
      title: "Keep it local.",
    },
    {
      body: "Contracts, an engine-neutral IR, ports and adapters: the seams are written down so each side can change safely.",
      crayon: "blue",
      title: "Make boundaries explicit.",
    },
    {
      body: "When something breaks, stop safely, fall back to a last known good state, and treat recovery as a normal path.",
      crayon: "marigold",
      title: "Fail closed, recover cleanly.",
    },
  ],
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
    crayon: "marigold",
    emphasis:
      "It turns device trust signals into focused local checks, from bootloader state to root traces and attestation results.",
    id: "duck-detector",
    github: {
      href: "https://github.com/eltavine/Duck-Detector-Refactoring",
      repo: "eltavine/Duck-Detector-Refactoring",
    },
    availability: {
      icon: "lucide:globe",
      kind: "public",
      label: "Public",
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
    crayon: "blue",
    emphasis:
      "It turns Pingora into a durable control plane for team operated gateways, keeping configuration, activation, rollback, and recovery explicit.",
    id: "pingora-panel",
    github: {
      href: "https://github.com/eltavine/pingora-panel",
      repo: "eltavine/pingora-panel",
    },
    starHistory: {
      href: "https://www.star-history.com/?repos=eltavine%2Fpingora-panel&type=date&legend=top-left",
      darkSrc:
        "https://api.star-history.com/chart?repos=eltavine/pingora-panel&type=date&theme=dark&legend=top-left",
      lightSrc:
        "https://api.star-history.com/chart?repos=eltavine/pingora-panel&type=date&legend=top-left",
    },
    availability: {
      icon: "lucide:globe",
      kind: "public",
      label: "Public",
    },
    notes: [
      "Uses a versioned DSL, compiler pipeline, engine neutral IR, and ports and adapters to keep configuration semantics independent from the data plane.",
      "Exercises durable systems behavior through CAS activation, atomic snapshots, Last Known Good recovery, graceful drain, and fail closed management boundaries.",
      "Connects a Pingora data plane to Proto first contracts, Tonic gRPC health, REST adapter foundations, observability, and black box verification.",
    ],
    icon: "lucide:network",
    section: "Rust / Networks / Reliability",
    stack: pickStack(
      "rust",
      "pingora",
      "tokio",
      "axum",
      "tonic",
      "protobuf",
      "docker",
      "linux",
    ),
    status: "In progress / durable gateway foundation",
    summary:
      "Pingora Panel is a team operations gateway control platform built around a Pingora data plane, versioned configuration, and durable release workflows.",
    title: "Pingora Panel",
  },
  {
    crayon: "lavender",
    emphasis:
      "It brings a secure native runtime, provider adapters, encrypted local storage, and a cross platform Flutter shell together behind explicit contracts.",
    id: "yurimashi",
    availability: {
      icon: "lucide:code-2",
      kind: "internal",
      label: "Internal development",
    },
    notes: [
      "Organizes an Android, iOS, macOS, Windows, and Linux workspace around Flutter UI, Rust runtime and persistence, and Buf managed Protobuf boundaries.",
      "Treats local first storage, encrypted CAS, SQLCipher, backups, privacy controls, and fail closed capability handling as product behavior.",
      "Provides a modular agent foundation with multiple AI and TTS provider adapters, durable runtime services, IPC, and independently testable package boundaries.",
    ],
    icon: "lucide:bot",
    section: "Flutter / Rust / Local-first",
    stack: pickStack(
      "dart",
      "rust",
      "protobuf",
      "riverpod",
      "sqlcipher",
      "linux",
      "android",
      "ios",
      "macos",
    ),
    status: "Internal development",
    summary:
      "Yurimashi is a local-first, cross-platform AI workspace with a Flutter interface and a secure Rust runtime.",
    title: "Yurimashi",
  },
  {
    crayon: "sage",
    emphasis:
      "It is shaped as a high-density Android operations desk: connect devices, see their live state, and send carefully bounded actions across a batch.",
    id: "yunheshiguang-droid-farm",
    availability: {
      icon: "lucide:code-2",
      kind: "internal",
      label: "Internal development",
    },
    notes: [
      "Builds a Tauri desktop shell with React, TypeScript, Vite, Tailwind CSS, and Shadcn inspired UI conventions.",
      "Models devices, groups, tasks, diagnostics, and localization as separate boundaries, with Rust commands exposed through generated Protobuf contracts.",
      "Covers ADB and scrcpy workflows including device discovery, batch screenshots, recordings, file transfer, app actions, text input, and recovery diagnostics.",
    ],
    icon: "lucide:smartphone",
    section: "Tauri / Android / Device operations",
    stack: pickStack(
      "tauri",
      "react",
      "typescript",
      "vite",
      "tailwind",
      "rust",
      "protobuf",
      "adb",
      "scrcpy",
      "vitest",
    ),
    status: "Internal development",
    summary:
      "yunheshiguang is a modular Tauri workbench for managing and automating Android device fleets.",
    title: "yunheshiguang",
  },
];

export const thisSite = {
  crayon: "heart",
  id: "this-site",
  stack: pickStack("astro", "typescript", "javascript", "vite", "pnpm", "cloudflare"),
  title: "This site",
};

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
    items: pickStack("linux", "windowsKernel", "android", "ios", "macos", "docker", "cloudflare", "ory"),
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
