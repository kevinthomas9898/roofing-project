import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Activity, ChevronDown, ChevronUp, Radio, Trash2, CheckCircle2 } from "lucide-react";
import { subscribeToWhopEvents, getWhopEventHistory, type TrackedEvent } from "@/lib/whop-tracker";

export function WhopEventInspector() {
  const [events, setEvents] = useState<TrackedEvent[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setEvents([...getWhopEventHistory()]);
    const unsubscribe = subscribeToWhopEvents((newEvent) => {
      setEvents((prev) => [newEvent, ...prev]);
    });
    return () => unsubscribe();
  }, []);

  const clearEvents = () => {
    if (typeof window !== "undefined" && window.__WHOP_EVENT_HISTORY__) {
      window.__WHOP_EVENT_HISTORY__ = [];
    }
    setEvents([]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full px-4 pointer-events-none">
      <div className="bg-[#10243A]/95 text-white border border-white/20 rounded-xl shadow-2xl backdrop-blur-md pointer-events-auto overflow-hidden transition-all">
        {/* Header Bar */}
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-white/5 transition-colors select-none"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FA4616] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FA4616]"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 font-display">
              <Activity size={14} className="text-[#FA4616]" /> Whop Pixel Live Stream
            </span>
            <Badge className="bg-[#FA4616] text-white hover:bg-[#FA4616] text-[10px] px-1.5 py-0 h-4">
              {events.length}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-white/70">
            {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </div>
        </div>

        {/* Collapsible Panel */}
        {expanded && (
          <div className="p-3.5 pt-0 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-white/60 pt-1">
              <span>Required Events: <code>estimate_requested</code>, <code>service_viewed</code>, <code>deposit_started</code></span>
              {events.length > 0 && (
                <button
                  onClick={clearEvents}
                  className="text-white/60 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={12} /> Clear
                </button>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 font-mono text-[11px]">
              {events.length === 0 ? (
                <div className="text-center py-6 text-white/50 text-xs">
                  No events fired yet. Interact with the website buttons or estimate form to test live firing.
                </div>
              ) : (
                events.map((evt) => {
                  const isRequired = ["estimate_requested", "service_viewed", "deposit_started"].includes(evt.name);
                  return (
                    <div
                      key={evt.id}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        isRequired
                          ? "bg-[#FA4616]/15 border-[#FA4616]/40 text-white"
                          : "bg-white/5 border-white/10 text-white/80"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs mb-1">
                        <span className={isRequired ? "text-[#FA4616]" : "text-white"}>
                          whop.track("{evt.name}")
                        </span>
                        <span className="text-[10px] text-white/50">{evt.timestamp}</span>
                      </div>
                      <div className="text-[10px] text-white/70 truncate">
                        {JSON.stringify(evt.data)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

