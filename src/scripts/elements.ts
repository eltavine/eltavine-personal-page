// Every `*.element.ts` defines one custom element; adding a feature never touches this file.
import.meta.glob("../features/*/*.element.ts", { eager: true });
