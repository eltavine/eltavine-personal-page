const stackRegistry = {
  android: { icon: "devicon:android", label: "Android" },
  asm: { icon: "lucide:binary", label: "ASM" },
  c: { icon: "devicon:c", label: "C" },
  cpp: { icon: "devicon:cplusplus", label: "C++" },
  java: { icon: "devicon:java", label: "Java" },
  javascript: { icon: "devicon:javascript", label: "JavaScript" },
  kotlin: { icon: "devicon:kotlin", label: "Kotlin" },
  linux: { icon: "devicon:linux", label: "Linux" },
  postgresql: { icon: "devicon:postgresql", label: "PostgreSQL" },
  rust: { icon: "devicon:rust", label: "Rust" },
  typescript: { icon: "devicon:typescript", label: "TypeScript" },
  windowsKernel: { icon: "devicon:windows8", label: "Windows Kernel" },
};

const pickStack = (...keys) =>
  keys.map((key) => ({
    key,
    ...stackRegistry[key],
  }));

export const siteMeta = {
  description:
    "Eltavine is a software engineer building Android security tooling, native runtime surfaces, modular clients, and backend systems.",
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
  lead: "I build across Android, low-level runtime surfaces, and service backends.",
  name: "Eltavine",
  principles: ["Modular systems", "Native-first tooling", "Clear boundaries"],
  role: "Software engineer",
  summary:
    "A short overview of the systems I work on, the tools I keep close, and the boundaries I prefer to keep legible.",
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
      "A device-side Android security inspection app built around modular detectors instead of one monolithic scan flow.",
    id: "duck-detector",
    links: [
      {
        href: "https://github.com/eltavine/Duck-Detector-Refactoring",
        label: "GitHub",
      },
    ],
    githubRepo: "eltavine/Duck-Detector-Refactoring",
    notes: [
      "Local evidence collection for root-related tampering, runtime hooking, mount manipulation, attestation trust, and virtualized execution environments.",
      "Kotlin-first app layer with Jetpack Compose, feature-scoped packages, view models, repositories, coroutines, and DataStore-backed settings.",
      "Native probes through the Android NDK with C++, CMake, and arm64 assembly paths where syscall timing or mount visibility matters.",
    ],
    icon: "lucide:shield-check",
    section: "Android / Security",
    stack: pickStack("android", "kotlin", "cpp", "asm"),
    status: "Native Android security tooling",
    summary:
      "Duck Detector surfaces detector cards for bootloader state, LSPosed / Zygisk traces, native root evidence, virtualization, TEE attestation trust, and other integrity signals while keeping most analysis local to the device.",
    title: "Duck Detector",
  },
];

export const stackGroups = [
  {
    description: "Lower-level work where control, layout, and runtime behavior matter most.",
    eyebrow: "Core",
    icon: "lucide:cpu",
    items: pickStack("cpp", "c", "rust"),
    title: "Core Languages",
  },
  {
    description: "Languages used to ship user-facing apps, services, and flexible product surfaces.",
    eyebrow: "Application",
    icon: "lucide:braces",
    items: pickStack("kotlin", "typescript", "javascript", "java"),
    title: "Application Languages",
  },
  {
    description: "Operating systems and platform-specific areas that shape how software lands in the real world.",
    eyebrow: "Platform",
    icon: "lucide:monitor",
    items: pickStack("linux", "windowsKernel", "android"),
    title: "Systems and Platform",
  },
  {
    description: "Persistent state and service storage when the product boundary reaches the data layer.",
    eyebrow: "Data",
    icon: "lucide:database",
    items: pickStack("postgresql"),
    title: "Data Layer",
  },
];

export function buildEmailAddress(parts = contact.emailParts) {
  return `${parts.user}@${parts.domain}.${parts.tld}`;
}

export function formatFingerprint(fingerprint) {
  return fingerprint.match(/.{1,4}/g) ?? [];
}
