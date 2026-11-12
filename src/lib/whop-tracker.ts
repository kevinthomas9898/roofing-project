import { WHOP_CONFIG } from "./whop-config";

export interface TrackedEvent {
  id: string;
  name: string;
  data: Record<string, any>;
  timestamp: string;
}

declare global {
  interface Window {
    whop?: {
      track: (eventName: string, data?: Record<string, any>) => void;
      setScope: (accountId: string) => void;
    };
    __WHOP_EVENT_HISTORY__?: TrackedEvent[];
    __WHOP_EVENT_LISTENERS__?: Array<(event: TrackedEvent) => void>;
  }
}

export function trackWhopEvent(eventName: string, data: Record<string, any> = {}): TrackedEvent {
  const event: TrackedEvent = {
    id: "evt_" + Math.random().toString(36).substring(2, 9),
    name: eventName,
    data: {
      ...data,
      accountId: WHOP_CONFIG.accountId,
      url: typeof window !== "undefined" ? window.location.href : "",
    },
    timestamp: new Date().toLocaleTimeString(),
  };

  if (typeof window !== "undefined") {
    // 1. Send to official Whop Pixel SDK if loaded
    if (window.whop && typeof window.whop.track === "function") {
      try {
        window.whop.track(eventName, event.data);
      } catch (err) {
        console.warn("[Whop Pixel] Failed to track:", err);
      }
    }

    // 2. Add to event history for real-time demonstration
    if (!window.__WHOP_EVENT_HISTORY__) {
      window.__WHOP_EVENT_HISTORY__ = [];
    }
    window.__WHOP_EVENT_HISTORY__.unshift(event);

    // Notify listeners
    if (window.__WHOP_EVENT_LISTENERS__) {
      window.__WHOP_EVENT_LISTENERS__.forEach((fn) => fn(event));
    }
  }

  console.log(`%c[Whop Tracked Event] ${eventName}`, "color: #FA4616; font-weight: bold", event.data);
  return event;
}

export function subscribeToWhopEvents(callback: (event: TrackedEvent) => void) {
  if (typeof window === "undefined") return () => {};
  if (!window.__WHOP_EVENT_LISTENERS__) {
    window.__WHOP_EVENT_LISTENERS__ = [];
  }
  window.__WHOP_EVENT_LISTENERS__.push(callback);
  return () => {
    if (window.__WHOP_EVENT_LISTENERS__) {
      window.__WHOP_EVENT_LISTENERS__ = window.__WHOP_EVENT_LISTENERS__.filter((fn) => fn !== callback);
    }
  };
}

export function getWhopEventHistory(): TrackedEvent[] {
  if (typeof window === "undefined" || !window.__WHOP_EVENT_HISTORY__) return [];
  return window.__WHOP_EVENT_HISTORY__;
}

