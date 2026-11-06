// The stages an enquiry moves through, in order.
// "Lost" is not on the track: an enquiry can be marked lost from any stage.
export type Status = "New" | "Contacted" | "Quoted" | "Won" | "Lost";

export const STAGES: Status[] = ["New", "Contacted", "Quoted", "Won"];

export type Service =
  | "Website"
  | "AI chatbot"
  | "Student project"
  | "Python automation"
  | "Other";

export const SERVICES: Service[] = [
  "Website",
  "AI chatbot",
  "Student project",
  "Python automation",
  "Other",
];

export interface Enquiry {
  id: string;
  name: string;
  business: string;
  phone: string;
  service: Service;
  budget: number; // in rupees
  status: Status;
  notes: string;
  createdAt: string; // ISO date string
}

// What the form holds while the user is typing (every input is a string).
export interface FormValues {
  name: string;
  business: string;
  phone: string;
  service: Service;
  budget: string;
  notes: string;
}

export type FormErrors = Partial<Record<keyof FormValues, string>>;
