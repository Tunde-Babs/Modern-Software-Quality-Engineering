import type { Clock } from "./models.js";

/**
 * A fake clock: it implements the clock boundary but advances virtual time
 * immediately, so tests state timing behaviour without waiting in real time.
 */
export class DeterministicClock implements Clock {
  private elapsedMs = 0;
  readonly sleepRequests: number[] = [];

  now(): number {
    return this.elapsedMs;
  }

  async sleep(milliseconds: number): Promise<void> {
    if (!Number.isFinite(milliseconds) || milliseconds < 0) {
      throw new Error("A deterministic clock cannot sleep for a negative or non-finite duration.");
    }

    this.sleepRequests.push(milliseconds);
    this.elapsedMs += milliseconds;
  }
}
