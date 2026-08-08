import type { Clock } from "./models.js";

/**
 * Advances virtual time instead of waiting on wall-clock time. This keeps the
 * teaching scenarios fast and repeatable while preserving timing reasoning.
 */
export class DeterministicClock implements Clock {
  private currentTimeMs = 0;

  now(): number {
    return this.currentTimeMs;
  }

  async sleep(milliseconds: number): Promise<void> {
    if (!Number.isFinite(milliseconds) || milliseconds < 0) {
      throw new Error(`sleep duration must be a non-negative finite number; received ${milliseconds}.`);
    }

    this.currentTimeMs += milliseconds;
  }
}
