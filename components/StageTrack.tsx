import { STAGES, type Status } from "@/lib/types";

interface StageTrackProps {
  status: Status;
  onChange: (status: Status) => void;
}

// A clickable progress bar: New → Contacted → Quoted → Won.
export default function StageTrack({ status, onChange }: StageTrackProps) {
  const currentIndex = STAGES.indexOf(status);

  return (
    <ol className="grid grid-cols-4 gap-1.5" aria-label="Stage">
      {STAGES.map((stage, index) => {
        const reached = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const barColour = !reached ? "bg-line" : status === "Won" ? "bg-won" : "bg-accent";

        return (
          <li key={stage}>
            <button
              type="button"
              onClick={() => onChange(stage)}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={isCurrent ? `${stage} (current stage)` : `Move to ${stage}`}
              className="group block w-full rounded-sm pt-2 pb-1 text-left"
            >
              <span
                className={`block h-2 rounded-full transition-colors group-hover:opacity-80 ${barColour}`}
              />
              <span
                className={`mt-2 block text-xs ${
                  isCurrent ? "font-semibold text-ink" : "text-muted group-hover:text-ink"
                }`}
              >
                {stage}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
