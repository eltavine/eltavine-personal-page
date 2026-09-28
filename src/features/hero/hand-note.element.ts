import { defineElement } from "../../lib/events.ts";
import { pickNote, type TimedNote } from "../../lib/hand-notes.ts";

class HandNote extends HTMLElement {
	connectedCallback() {
		let notes: TimedNote[] = [];
		try {
			notes = JSON.parse(this.dataset.notes ?? "[]") as TimedNote[];
		} catch {}
		this.textContent = pickNote(
			notes,
			this.dataset.fallback ?? this.textContent ?? "",
			new Date().getHours(),
		);
	}
}

defineElement("hand-note", HandNote);
