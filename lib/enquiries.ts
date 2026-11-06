import type { Enquiry, FormErrors, FormValues, Status } from "./types";

// Pure functions: no React, no browser APIs. That makes them easy to unit test.

const INDIAN_MOBILE = /^[6-9]\d{9}$/;

export function cleanPhone(phone: string): string {
  return phone.replace(/[\s-]/g, "");
}

export function validateEnquiry(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) errors.name = "Enter the contact's name.";
  if (!values.business.trim()) errors.business = "Enter the business or project name.";
  if (!INDIAN_MOBILE.test(cleanPhone(values.phone))) {
    errors.phone = "Enter a 10-digit mobile number, like 98450 12345.";
  }
  if (values.budget !== "" && (Number.isNaN(Number(values.budget)) || Number(values.budget) < 0)) {
    errors.budget = "Budget must be a number of rupees, or leave it empty.";
  }

  return errors;
}

export function createEnquiry(values: FormValues): Enquiry {
  return {
    id: crypto.randomUUID(),
    name: values.name.trim(),
    business: values.business.trim(),
    phone: cleanPhone(values.phone),
    service: values.service,
    budget: values.budget === "" ? 0 : Number(values.budget),
    status: "New",
    notes: values.notes.trim(),
    createdAt: new Date().toISOString(),
  };
}

export function filterEnquiries(
  enquiries: Enquiry[],
  status: Status | "All",
  search: string,
): Enquiry[] {
  const query = search.trim().toLowerCase();

  return enquiries.filter((enquiry) => {
    const matchesStatus = status === "All" || enquiry.status === status;
    const matchesSearch =
      query === "" ||
      enquiry.name.toLowerCase().includes(query) ||
      enquiry.business.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });
}

export function getSummary(enquiries: Enquiry[]) {
  const open = enquiries.filter((e) => e.status !== "Won" && e.status !== "Lost");

  return {
    openCount: open.length,
    openValue: open.reduce((total, e) => total + e.budget, 0),
    won: enquiries.filter((e) => e.status === "Won").length,
    lost: enquiries.filter((e) => e.status === "Lost").length,
  };
}

export function formatRupees(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPhone(phone: string): string {
  return `${phone.slice(0, 5)} ${phone.slice(5)}`;
}

// Shown the first time someone opens the app, so the demo isn't empty.
export const sampleEnquiries: Enquiry[] = [
  {
    id: "sample-1",
    name: "Kavya R",
    business: "Smile Care Dental Clinic, Hebbal",
    phone: "9845000001",
    service: "Website",
    budget: 25000,
    status: "Quoted",
    notes: "Wants online appointment booking. Sent quote on WhatsApp.",
    createdAt: "2026-11-02T10:30:00.000Z",
  },
  {
    id: "sample-2",
    name: "Manjunath S",
    business: "Kaveri Bakery, Yelahanka",
    phone: "9900000002",
    service: "Website",
    budget: 15000,
    status: "Contacted",
    notes: "Current site is down. Call back after 6 pm.",
    createdAt: "2026-11-04T08:15:00.000Z",
  },
  {
    id: "sample-3",
    name: "Arjun P",
    business: "Final year project, CSE",
    phone: "8123000003",
    service: "Student project",
    budget: 8000,
    status: "New",
    notes: "AI chatbot for college FAQs. Needs report and demo.",
    createdAt: "2026-11-05T14:00:00.000Z",
  },
  {
    id: "sample-4",
    name: "Shreya N",
    business: "GreenLeaf PG, Jakkur",
    phone: "7019000004",
    service: "Python automation",
    budget: 12000,
    status: "Won",
    notes: "Rent reminder script on WhatsApp. Paid 50% advance.",
    createdAt: "2026-10-28T11:45:00.000Z",
  },
];
