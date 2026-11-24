// Pure date math for the birthday countdown — no browser APIs, so it's unit-testable.

export const DAY_MS = 86400000;

// How far the device clock is from the server clock, from an HTTP Date header.
// The header is truncated to whole seconds; +500ms centers the error.
export function offsetFromDateHeader(header, localNow) {
  const serverMs = Date.parse(header ?? "");
  return Number.isNaN(serverMs) ? 0 : serverMs + 500 - localNow;
}

export const isLockedAt = (now, unlockMs, enabled) => Boolean(enabled) && now < unlockMs;

export function splitRemaining(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return {
    total: s,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}
