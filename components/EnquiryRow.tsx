import { formatPhone, formatRupees } from "@/lib/enquiries";
import type { Enquiry, Status } from "@/lib/types";
import StageTrack from "./StageTrack";

interface EnquiryRowProps {
  enquiry: Enquiry;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
}

export default function EnquiryRow({ enquiry, onStatusChange, onDelete }: EnquiryRowProps) {
  const isLost = enquiry.status === "Lost";
  const added = new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <li className="grid gap-4 border-t border-line py-6 md:grid-cols-[1fr_20rem] md:gap-10">
      <div className={isLost ? "opacity-60" : undefined}>
        <h3 className="text-lg leading-snug font-semibold">{enquiry.business}</h3>
        <p className="mt-0.5 text-muted">{enquiry.name}</p>

        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <div>
            <dt className="sr-only">Service</dt>
            <dd>{enquiry.service}</dd>
          </div>
          <div>
            <dt className="sr-only">Budget</dt>
            <dd className="font-medium tabular-nums">
              {enquiry.budget > 0 ? formatRupees(enquiry.budget) : "Budget not set"}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Phone</dt>
            <dd>
              <a href={`tel:+91${enquiry.phone}`} className="tabular-nums underline-offset-2 hover:underline">
                {formatPhone(enquiry.phone)}
              </a>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Added</dt>
            <dd className="text-muted">Added {added}</dd>
          </div>
        </dl>

        {enquiry.notes && <p className="mt-3 max-w-prose text-sm leading-relaxed">{enquiry.notes}</p>}
      </div>

      <div className="md:pt-1">
        {isLost ? (
          <p className="pt-2 text-sm font-semibold text-lost">Lost</p>
        ) : (
          <StageTrack
            status={enquiry.status}
            onChange={(status) => onStatusChange(enquiry.id, status)}
          />
        )}

        <div className="mt-3 flex gap-5 text-sm">
          <button
            type="button"
            onClick={() => onStatusChange(enquiry.id, isLost ? "New" : "Lost")}
            className="text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            {isLost ? "Reopen" : "Mark as lost"}
          </button>
          <button
            type="button"
            onClick={() => onDelete(enquiry.id)}
            className="text-muted underline-offset-2 hover:text-lost hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
