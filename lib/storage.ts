import type { Enquiry } from "./types";

const STORAGE_KEY = "rg-labs-enquiries";

// Returns null when nothing has been saved yet (first visit).
export function loadEnquiries(): Enquiry[] | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Enquiry[]) : null;
  } catch {
    // Storage can be blocked (private mode) or contain broken JSON.
    return null;
  }
}

export function saveEnquiries(enquiries: Enquiry[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries));
  } catch {
    // If saving fails, the app still works for this session.
  }
}
