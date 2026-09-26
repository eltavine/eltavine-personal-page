const signals = ["bootloader", "root", "hook", "mount", "virtualization", "attestation"];

const fleet = [216, 254, 292].flatMap((x) => [154, 208].map((y) => ({ x, y })));

export const sketches = {
  "duck-detector": {
    caption: "Fig. 01 — local inspection flow",
    description:
      "Sketch: bootloader, root, hook, mount, virtualization, and attestation signals feed Kotlin checks and native C++ and ASM probes, which produce a local report on the device.",
    height: 262,
    items: [
      { type: "frame", x: 4, y: 14, w: 332, h: 196, r: 16, dashed: true },
      { type: "text", x: 18, y: 36, text: "On device", kind: "small" },
      ...signals.flatMap((signal, index) => [
        { type: "check", x: 18, y: 52 + index * 23 },
        { type: "text", x: 34, y: 60 + index * 23, text: signal, kind: "mono" },
      ]),
      { type: "brace", x: 134, y1: 48, y2: 180 },
      { type: "arrow", points: [[147, 114], [154, 96], [162, 86]] },
      { type: "arrow", points: [[147, 114], [154, 132], [162, 144]] },
      { type: "box", x: 164, y: 60, w: 104, h: 46, label: "Kotlin", sub: "checks · Compose" },
      { type: "box", x: 164, y: 124, w: 104, h: 46, label: "Native", sub: "C++ · ASM probes" },
      { type: "arrow", points: [[269, 83], [278, 102]] },
      { type: "arrow", points: [[269, 147], [278, 128]] },
      { type: "box", x: 279, y: 86, w: 52, h: 56, label: "Local", sub: "report", fill: true },
      { type: "text", x: 336, y: 246, text: "analysis stays on the device", kind: "hand", anchor: "end" },
      { type: "arrow", points: [[160, 239], [138, 232], [126, 214]], accent: true },
    ],
  },
  "pingora-panel": {
    caption: "Fig. 02 — config pipeline and release safety",
    description:
      "Sketch: a versioned DSL goes through the compiler to an engine-neutral IR and ports and adapters, then through CAS activation with atomic snapshots into the Pingora data plane, with a Last Known Good snapshot as the rollback path.",
    height: 300,
    items: [
      { type: "box", x: 12, y: 10, w: 156, h: 34, label: "Versioned DSL" },
      { type: "arrow", points: [[90, 46], [90, 64]] },
      { type: "box", x: 12, y: 66, w: 156, h: 34, label: "Compiler" },
      { type: "arrow", points: [[90, 102], [90, 120]] },
      { type: "box", x: 12, y: 122, w: 156, h: 34, label: "Engine-neutral IR" },
      { type: "arrow", points: [[90, 158], [90, 176]] },
      { type: "box", x: 12, y: 178, w: 156, h: 34, label: "Ports & adapters" },
      { type: "arrow", points: [[170, 195], [194, 195]] },
      { type: "box", x: 196, y: 172, w: 136, h: 46, label: "Activation", sub: "CAS · atomic snapshots" },
      { type: "arrow", points: [[264, 220], [264, 246]] },
      { type: "box", x: 196, y: 248, w: 136, h: 46, label: "Pingora", sub: "data plane", fill: true },
      { type: "box", x: 12, y: 248, w: 156, h: 46, label: "Last known good", sub: "rollback snapshot" },
      { type: "arrow", points: [[170, 271], [194, 271]], dashed: true },
      { type: "text", x: 204, y: 62, text: "drains gracefully,", kind: "hand" },
      { type: "text", x: 204, y: 86, text: "fails closed", kind: "hand" },
      { type: "arrow", points: [[284, 94], [294, 128], [278, 166]], accent: true },
    ],
  },
  yurimashi: {
    caption: "Fig. 03 — runtime layers",
    description:
      "Sketch: a Flutter UI for Android, iOS, macOS, Windows, and Linux talks through Buf-managed Protobuf contracts to a Rust runtime with an agent core, AI and TTS provider adapters, and an encrypted store built on CAS and SQLCipher.",
    height: 300,
    items: [
      { type: "box", x: 12, y: 10, w: 316, h: 40, label: "Flutter UI" },
      { type: "text", x: 170, y: 68, text: "android · ios · macos · windows · linux", kind: "mono", anchor: "middle" },
      { type: "text", x: 170, y: 91, text: "Protobuf contracts · Buf", kind: "small", anchor: "middle" },
      { type: "line", points: [[12, 98], [328, 98]], dashed: true },
      { type: "arrow", points: [[40, 76], [40, 116]] },
      { type: "arrow", points: [[300, 116], [300, 76]] },
      { type: "frame", x: 12, y: 120, w: 316, h: 132, r: 12 },
      { type: "text", x: 22, y: 142, text: "Rust runtime", kind: "small" },
      { type: "box", x: 22, y: 156, w: 96, h: 56, label: "Agent", sub: "core services" },
      { type: "box", x: 122, y: 156, w: 96, h: 56, label: "Providers", sub: "AI · TTS" },
      { type: "box", x: 222, y: 156, w: 96, h: 56, label: "Store", sub: "CAS · SQLCipher", fill: true },
      { type: "text", x: 332, y: 290, text: "local-first, encrypted at rest", kind: "hand", anchor: "end" },
      { type: "arrow", points: [[300, 272], [292, 244], [276, 216]], accent: true },
    ],
  },
  "yunheshiguang-droid-farm": {
    caption: "Fig. 04 — fleet control path",
    description:
      "Sketch: a Tauri shell with a React and TypeScript UI calls Rust commands through generated Protobuf contracts, and those commands drive ADB and scrcpy across a fleet of Android devices in batches.",
    height: 272,
    items: [
      { type: "box", x: 12, y: 10, w: 156, h: 46, label: "Tauri shell", sub: "React · TypeScript UI" },
      { type: "arrow", points: [[90, 58], [90, 96]] },
      { type: "text", x: 100, y: 81, text: "generated protobuf", kind: "small" },
      { type: "box", x: 12, y: 98, w: 156, h: 46, label: "Rust commands", sub: "devices · groups · tasks" },
      { type: "arrow", points: [[90, 146], [90, 182]] },
      { type: "box", x: 12, y: 184, w: 156, h: 40, label: "ADB · scrcpy" },
      { type: "arrow", points: [[170, 204], [200, 196]] },
      { type: "frame", x: 202, y: 124, w: 130, h: 140, r: 12, dashed: true },
      { type: "text", x: 214, y: 144, text: "Fleet", kind: "small" },
      ...fleet.map(({ x, y }, index) => ({ type: "phone", x, y, w: 26, h: 44, fill: index === 2 })),
      { type: "text", x: 214, y: 32, text: "one action,", kind: "hand" },
      { type: "text", x: 214, y: 56, text: "the whole batch", kind: "hand" },
      { type: "arrow", points: [[282, 66], [294, 93], [280, 120]], accent: true },
    ],
  },
};
