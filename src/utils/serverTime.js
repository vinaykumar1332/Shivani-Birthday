import { birthdayConfig } from "../data/birthdayConfig.js";
import { isLockedAt, offsetFromDateHeader } from "./unlock.js";

// The hosting server's clock (from the HTTP Date header) is the source of truth,
// so a phone with the wrong time can't unlock the site early or late.
let offset = 0;

const sync = fetch(`${window.location.origin}/?time=${Date.now()}`, { method: "HEAD", cache: "no-store" })
  .then((res) => {
    offset = offsetFromDateHeader(res.headers.get("date"), Date.now());
  })
  .catch(() => {});

export const timeSynced = Promise.race([sync, new Promise((r) => setTimeout(r, 2500))]);

export const serverNow = () => Date.now() + offset;

export const unlockTime = Date.parse(birthdayConfig.countdown.unlockAt);

export const isLocked = () => isLockedAt(serverNow(), unlockTime, birthdayConfig.countdown.enabled);
