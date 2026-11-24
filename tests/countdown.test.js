// Run with: npm test
import { test, describe, afterEach } from "node:test";
import assert from "node:assert/strict";
import { birthdayConfig } from "../src/data/birthdayConfig.js";
import { DAY_MS, isLockedAt, offsetFromDateHeader, splitRemaining } from "../src/utils/unlock.js";

const IST = (local) => Date.parse(`${local}+05:30`);
const UNLOCK = Date.parse(birthdayConfig.countdown.unlockAt);
const httpDate = (ms) => new Date(ms).toUTCString();

describe("deploy-ready config", () => {
  test("countdown is switched on", () => {
    assert.equal(birthdayConfig.countdown.enabled, true, "set countdown.enabled back to true before deploying");
  });

  test("unlocks at exactly midnight 25 Nov 2026, India time", () => {
    assert.equal(new Date(UNLOCK).toISOString(), "2026-11-24T18:30:00.000Z");
    assert.equal(UNLOCK, IST("2026-11-25T00:00:00"));
  });

  test("unlock date matches the birthday date", () => {
    assert.equal(birthdayConfig.countdown.unlockAt.slice(0, 10), birthdayConfig.birthdayDate);
  });
});

describe("lock / unlock", () => {
  const cases = [
    ["24 Nov, 6:07 PM", "2026-11-24T18:07:00", true],
    ["24 Nov, 11:59:59.999 PM", "2026-11-24T23:59:59.999", true],
    ["25 Nov, 12:00:00 AM sharp", "2026-11-25T00:00:00", false],
    ["25 Nov, 9:00 AM", "2026-11-25T09:00:00", false],
    ["a week later", "2026-12-02T12:00:00", false],
    ["next year", "2027-06-01T12:00:00", false],
  ];
  for (const [label, time, locked] of cases) {
    test(`${label} → ${locked ? "countdown" : "site open"}`, () => {
      assert.equal(isLockedAt(IST(time), UNLOCK, true), locked);
    });
  }

  test("enabled: false always opens the site", () => {
    assert.equal(isLockedAt(IST("2026-11-01T00:00:00"), UNLOCK, false), false);
  });

  test("same moment for every visitor's timezone", () => {
    // 11:59 PM in India is 6:29 PM UTC and 1:29 PM in New York — all still locked.
    const justBefore = Date.parse("2026-11-24T13:29:00-05:00");
    assert.equal(justBefore, IST("2026-11-24T23:59:00"));
    assert.equal(isLockedAt(justBefore, UNLOCK, true), true);
    assert.equal(isLockedAt(Date.parse("2026-11-24T13:30:00-05:00"), UNLOCK, true), false);
  });
});

describe("server clock offset", () => {
  test("a phone clock 2 days fast is corrected", () => {
    const server = IST("2026-11-24T18:07:00");
    const phone = server + 2 * DAY_MS;
    const offset = offsetFromDateHeader(httpDate(server), phone);
    assert.ok(Math.abs(phone + offset - server) <= 1000);
    assert.equal(isLockedAt(phone + offset, UNLOCK, true), true);
  });

  test("a phone clock 1 hour slow is corrected", () => {
    const server = IST("2026-11-25T00:30:00");
    const phone = server - 3600000;
    const offset = offsetFromDateHeader(httpDate(server), phone);
    assert.equal(isLockedAt(phone + offset, UNLOCK, true), false);
  });

  test("missing or broken header falls back to the phone clock", () => {
    assert.equal(offsetFromDateHeader(null, Date.now()), 0);
    assert.equal(offsetFromDateHeader("not a date", Date.now()), 0);
  });
});

describe("countdown display", () => {
  test("6:07 PM → 5h 53m 00s to go", () => {
    assert.deepEqual(splitRemaining(UNLOCK - IST("2026-11-24T18:07:00")), {
      total: 21180, days: 0, hours: 5, minutes: 53, seconds: 0,
    });
  });

  test("days appear when more than a day is left", () => {
    const t = splitRemaining(3 * DAY_MS + 4 * 3600000 + 5 * 60000 + 6000);
    assert.deepEqual([t.days, t.hours, t.minutes, t.seconds], [3, 4, 5, 6]);
  });

  test("partial seconds round up, so it never shows 0 early", () => {
    assert.equal(splitRemaining(400).seconds, 1);
    assert.equal(splitRemaining(1500).seconds, 2);
  });

  test("past the deadline shows all zeros, never negative", () => {
    assert.deepEqual(splitRemaining(-5000), { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe("serverTime module (real file, mocked browser)", () => {
  let n = 0;
  const load = async (fetchImpl) => {
    globalThis.window = { location: { origin: "https://example.test" } };
    globalThis.fetch = fetchImpl;
    // A fresh copy each time, so every test starts with a clean offset.
    const mod = await import(`../src/utils/serverTime.js?case=${n++}`);
    await mod.timeSynced;
    return mod;
  };
  const respond = (ms) => async () => ({ headers: { get: () => httpDate(ms) } });

  afterEach(() => {
    delete globalThis.window;
    delete globalThis.fetch;
  });

  test("server says 24 Nov evening → countdown", async () => {
    const { isLocked } = await load(respond(IST("2026-11-24T18:07:00")));
    assert.equal(isLocked(), true);
  });

  test("server says just past midnight → site open", async () => {
    const { isLocked } = await load(respond(IST("2026-11-25T00:00:02")));
    assert.equal(isLocked(), false);
  });

  test("network error → uses the phone clock", async () => {
    const { isLocked } = await load(async () => { throw new Error("offline"); });
    assert.equal(isLocked(), Date.now() < UNLOCK);
  });
});
