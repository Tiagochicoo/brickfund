import type { DealEventRow } from "@/lib/server/types";
import { formatDate } from "@/lib/format";

export function DealTimeline({ events }: { events: DealEventRow[] }) {
  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-ink/45">Timeline</p>
      {events.length === 0 ? (
        <p className="mt-3 text-sm text-ink/45">No events yet.</p>
      ) : (
        <ol className="mt-4 space-y-3 border-l-2 border-cream-200 pl-4">
          {events.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute -left-[22px] top-1 h-2.5 w-2.5 rounded-full bg-brand-500 ring-4 ring-cream-50" />
              <div className="text-sm text-ink/80">{e.message}</div>
              <div className="mt-0.5 text-xs text-ink/40">
                {formatDate(e.created)} · <code className="text-ink/35">{e.type}</code>
                {e.expand?.actor && <span className="text-ink/35"> · {e.expand.actor.name}</span>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
