"use client";

import { useState } from "react";
import { validateEnquiry } from "@/lib/enquiries";
import { SERVICES, type FormErrors, type FormValues, type Service } from "@/lib/types";

const emptyForm: FormValues = {
  name: "",
  business: "",
  phone: "",
  service: "Website",
  budget: "",
  notes: "",
};

interface EnquiryFormProps {
  onSave: (values: FormValues) => void;
  onCancel: () => void;
}

const inputClass =
  "mt-1.5 w-full rounded-md border border-line bg-panel px-3 py-2 text-ink placeholder:text-muted/70 aria-invalid:border-lost";

export default function EnquiryForm({ onSave, onCancel }: EnquiryFormProps) {
  // Controlled inputs: every field's value lives in React state.
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  function update(field: keyof FormValues, value: string) {
    setValues({ ...values, [field]: value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from reloading the page

    const found = validateEnquiry(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSave(values);
    setValues(emptyForm);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-8 rounded-lg border border-line bg-panel p-5 sm:p-6"
    >
      <h2 className="text-xl font-semibold">New enquiry</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Contact name" error={errors.name} id="name">
          <input
            id="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClass}
            autoComplete="off"
          />
        </Field>

        <Field label="Business or project" error={errors.business} id="business">
          <input
            id="business"
            value={values.business}
            onChange={(e) => update("business", e.target.value)}
            aria-invalid={Boolean(errors.business)}
            aria-describedby={errors.business ? "business-error" : undefined}
            className={inputClass}
            placeholder="Kaveri Bakery, Yelahanka"
          />
        </Field>

        <Field label="Mobile number" error={errors.phone} id="phone">
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={inputClass}
            placeholder="98450 12345"
          />
        </Field>

        <Field label="Service" id="service">
          <select
            id="service"
            value={values.service}
            onChange={(e) => update("service", e.target.value as Service)}
            className={inputClass}
          >
            {SERVICES.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </select>
        </Field>

        <Field label="Budget in rupees (optional)" error={errors.budget} id="budget">
          <input
            id="budget"
            type="number"
            min={0}
            step={500}
            value={values.budget}
            onChange={(e) => update("budget", e.target.value)}
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={errors.budget ? "budget-error" : undefined}
            className={inputClass}
            placeholder="15000"
          />
        </Field>

        <Field label="Notes (optional)" id="notes" wide>
          <textarea
            id="notes"
            rows={3}
            value={values.notes}
            onChange={(e) => update("notes", e.target.value)}
            className={inputClass}
            placeholder="What they need, when to follow up"
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 font-medium text-white hover:opacity-90 dark:text-paper"
        >
          Save enquiry
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-line px-4 py-2 font-medium hover:bg-paper"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  wide?: boolean;
  children: React.ReactNode;
}

// Small helper so every field gets the same label + error layout.
function Field({ id, label, error, wide, children }: FieldProps) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-lost">
          {error}
        </p>
      )}
    </div>
  );
}
