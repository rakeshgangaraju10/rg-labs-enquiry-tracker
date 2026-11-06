"use client";

import { useEffect, useState } from "react";
import EnquiryForm from "./EnquiryForm";
import EnquiryRow from "./EnquiryRow";
import {
  createEnquiry,
  filterEnquiries,
  formatRupees,
  getSummary,
  sampleEnquiries,
} from "@/lib/enquiries";
import { loadEnquiries, saveEnquiries } from "@/lib/storage";
import type { Enquiry, FormValues, Status } from "@/lib/types";

const FILTERS: (Status | "All")[] = ["All", "New", "Contacted", "Quoted", "Won", "Lost"];

export default function EnquiryTracker() {
  // Start with whatever is saved in this browser, or the sample data on a first visit.
  // Passing a function means it only runs once, on the first render.
  const [enquiries, setEnquiries] = useState<Enquiry[]>(
    () => loadEnquiries() ?? sampleEnquiries,
  );
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [search, setSearch] = useState("");

  // Whenever the list changes, save it to the browser.
  useEffect(() => {
    saveEnquiries(enquiries);
  }, [enquiries]);

  function addEnquiry(values: FormValues) {
    setEnquiries([createEnquiry(values), ...enquiries]); // newest first
    setShowForm(false);
    setStatusFilter("All");
  }

  function changeStatus(id: string, status: Status) {
    setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status } : e)));
  }

  function deleteEnquiry(id: string) {
    const enquiry = enquiries.find((e) => e.id === id);
    if (enquiry && window.confirm(`Delete the enquiry from ${enquiry.business}?`)) {
      setEnquiries(enquiries.filter((e) => e.id !== id));
    }
  }

  function resetToSamples() {
    if (window.confirm("Replace all enquiries with the sample data?")) {
      setEnquiries(sampleEnquiries);
    }
  }

  const visible = filterEnquiries(enquiries, statusFilter, search);
  const summary = getSummary(enquiries);

  return (
    <main className="mx-auto max-w-5xl px-5 pt-10 pb-16 sm:px-8 sm:pt-14">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-semibold text-accent">RG Labs</p>
          <h1 className="mt-1 text-5xl leading-none font-bold tracking-tight sm:text-6xl">
            Enquiries
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            {formatRupees(summary.openValue)} in open work across {summary.openCount}{" "}
            {summary.openCount === 1 ? "enquiry" : "enquiries"}. {summary.won} won,{" "}
            {summary.lost} lost.
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-md bg-accent px-5 py-2.5 font-medium text-white hover:opacity-90 dark:text-paper"
          >
            Add enquiry
          </button>
        )}
      </header>

      {showForm && <EnquiryForm onSave={addEnquiry} onCancel={() => setShowForm(false)} />}

      <section aria-label="Enquiry list" className="mt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by stage">
            {FILTERS.map((filter) => {
              const count =
                filter === "All"
                  ? enquiries.length
                  : enquiries.filter((e) => e.status === filter).length;
              const active = statusFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  aria-pressed={active}
                  className={`rounded-full border px-3.5 py-1.5 text-sm ${
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-muted hover:border-muted hover:text-ink"
                  }`}
                >
                  {filter} <span className="tabular-nums opacity-70">{count}</span>
                </button>
              );
            })}
          </div>

          <label className="sm:w-64">
            <span className="sr-only">Search by name or business</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or business"
              className="w-full rounded-md border border-line bg-panel px-3 py-2 placeholder:text-muted/70"
            />
          </label>
        </div>

        {enquiries.length === 0 ? (
          <p className="mt-8 border-t border-line pt-8 text-muted">
            No enquiries yet. Add one when a client messages you.
          </p>
        ) : visible.length === 0 ? (
          <p className="mt-8 border-t border-line pt-8 text-muted">
            Nothing matches this filter. Try another stage or clear the search.
          </p>
        ) : (
          <ul className="mt-6 border-b border-line">
            {visible.map((enquiry) => (
              <EnquiryRow
                key={enquiry.id}
                enquiry={enquiry}
                onStatusChange={changeStatus}
                onDelete={deleteEnquiry}
              />
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-10 text-sm text-muted">
        Enquiries are saved in this browser.{" "}
        <button type="button" onClick={resetToSamples} className="underline underline-offset-2 hover:text-ink">
          Reset to sample data
        </button>
      </footer>
    </main>
  );
}
