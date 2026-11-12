import { useState, useEffect } from "react";
import { subscribeToWhopEvents, getWhopEventHistory, type TrackedEvent } from "@/lib/whop-tracker";

export function WhopEventInspector() {
  const [events, setEvents] = useState<TrackedEvent[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEvents([...getWhopEventHistory()]);
    const unsubscribe = subscribeToWhopEvents((newEvent) => {
      setEvents((prev) => [newEvent, ...prev]);
    });
    return () => unsubscribe();
  }, []);

  const getEventMeta = (evt: TrackedEvent) => {
    switch (evt.name) {
      case "estimate_requested":
        return {
          title: "Estimate Request Submitted",
          detail: evt.data?.service ? `${evt.data.service} • ${evt.data.city || "Austin, TX"}` : "Estimate form submitted",
          tag: "estimate_requested",
          required: true,
        };
      case "deposit_started":
        return {
          title: "Project Deposit Checkout",
          detail: "$500 Project Deposit modal opened",
          tag: "deposit_started",
          required: true,
        };
      case "service_viewed":
        return {
          title: "Service Explored",
          detail: evt.data?.service ? `Viewed ${evt.data.service}` : "Homeowner explored scope",
          tag: "service_viewed",
          required: true,
        };
      case "checkout_completed":
        return {
          title: "Payment Completed",
          detail: evt.data?.service ? `${evt.data.service} paid` : "Whop Elements checkout confirmed",
          tag: "checkout_completed",
          required: false,
        };
      case "invoice_created":
        return {
          title: "Final Invoice Created",
          detail: "$7,300 Final Balance Invoice generated",
          tag: "invoice_created",
          required: false,
        };
      case "invoice_charged":
        return {
          title: "Card-on-File Charged",
          detail: "$7,300 Balance auto-charged via Invoices API",
          tag: "invoice_charged",
          required: false,
        };
      default:
        return {
          title: evt.name,
          detail: "Whop tracking event recorded",
          tag: evt.name,
          required: false,
        };
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {!open ? (
        /* Sleek, unobtrusive pill button */
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#10243A] text-white rounded-full shadow-lg border border-white/15 text-xs font-medium hover:bg-[#10243A]/90 transition-all hover:scale-105 select-none"
          aria-label="Open tracking activity stream"
        >
          <span className="w-2 h-2 rounded-full bg-[#E87932] animate-pulse" />
          <span>Whop Event Stream</span>
          {events.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-[#E87932] text-white text-[10px] font-bold rounded-full leading-tight">
              {events.length}
            </span>
          )}
        </button>
      ) : (
        /* Elegant activity drawer card */
        <div className="w-84 sm:w-96 bg-[#10243A] text-white border border-white/15 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Card Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E87932]" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Whop Event Stream
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-white/60 hover:text-white px-2 py-1 rounded transition-colors"
            >
              Minimize
            </button>
          </div>

          {/* Subheader */}
          <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-[11px] text-white/60 flex items-center justify-between">
            <span>Verified Pixel Events</span>
            {events.length > 0 && (
              <button
                onClick={() => setEvents([])}
                className="text-[11px] text-white/50 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Event Stream List */}
          <div className="p-3 max-h-72 overflow-y-auto space-y-2">
            {events.length === 0 ? (
              <div className="py-8 text-center text-xs text-white/50">
                Interact with service buttons, checkout, or the estimate form to fire events.
              </div>
            ) : (
              events.map((evt) => {
                const meta = getEventMeta(evt);
                return (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-left"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white">
                        {meta.title}
                      </span>
                      <span className="text-[10px] text-white/40">
                        {evt.timestamp}
                      </span>
                    </div>
                    <div className="text-xs text-white/70">
                      {meta.detail}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#E87932] bg-[#E87932]/10 px-2 py-0.5 rounded">
                        whop.track("{meta.tag}")
                      </span>
                      <span className="text-[10px] text-emerald-400 font-medium">
                        Verified
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
