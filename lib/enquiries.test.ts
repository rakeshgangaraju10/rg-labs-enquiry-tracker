import { describe, expect, test } from "vitest";
import {
  createEnquiry,
  filterEnquiries,
  getSummary,
  sampleEnquiries,
  validateEnquiry,
} from "./enquiries";
import type { FormValues } from "./types";

const validForm: FormValues = {
  name: "Kavya R",
  business: "Smile Care Dental Clinic",
  phone: "98450 12345",
  service: "Website",
  budget: "25000",
  notes: "",
};

describe("validateEnquiry", () => {
  test("accepts a complete form", () => {
    expect(validateEnquiry(validForm)).toEqual({});
  });

  test("flags missing name and business", () => {
    const errors = validateEnquiry({ ...validForm, name: " ", business: "" });
    expect(errors.name).toBeDefined();
    expect(errors.business).toBeDefined();
  });

  test("rejects phone numbers that are not 10-digit Indian mobiles", () => {
    expect(validateEnquiry({ ...validForm, phone: "12345" }).phone).toBeDefined();
    expect(validateEnquiry({ ...validForm, phone: "5845012345" }).phone).toBeDefined();
  });

  test("rejects a negative budget but allows an empty one", () => {
    expect(validateEnquiry({ ...validForm, budget: "-100" }).budget).toBeDefined();
    expect(validateEnquiry({ ...validForm, budget: "" }).budget).toBeUndefined();
  });
});

describe("createEnquiry", () => {
  test("starts as New, cleans the phone and converts the budget", () => {
    const enquiry = createEnquiry(validForm);
    expect(enquiry.status).toBe("New");
    expect(enquiry.phone).toBe("9845012345");
    expect(enquiry.budget).toBe(25000);
  });
});

describe("filterEnquiries", () => {
  test("filters by stage", () => {
    const won = filterEnquiries(sampleEnquiries, "Won", "");
    expect(won.every((e) => e.status === "Won")).toBe(true);
    expect(won).toHaveLength(1);
  });

  test("searches name and business, ignoring case", () => {
    expect(filterEnquiries(sampleEnquiries, "All", "BAKERY")).toHaveLength(1);
    expect(filterEnquiries(sampleEnquiries, "All", "kavya")).toHaveLength(1);
  });
});

describe("getSummary", () => {
  test("counts only open enquiries in the open value", () => {
    const summary = getSummary(sampleEnquiries);
    expect(summary.openCount).toBe(3);
    expect(summary.openValue).toBe(25000 + 15000 + 8000);
    expect(summary.won).toBe(1);
    expect(summary.lost).toBe(0);
  });
});
