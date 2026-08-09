import { QualityUtilityError } from "./errors.js";
import type { QualityCheckObservation } from "./models.js";

/** Creates a local, repeatable asynchronous boundary from predetermined observations. */
export function scriptedObservations(
  observations: readonly QualityCheckObservation[],
): () => Promise<QualityCheckObservation> {
  if (observations.length === 0) {
    throw new QualityUtilityError("invalid-input", "A scripted operation needs at least one observation.", {
      operation: "scripted-observations",
    });
  }

  let nextIndex = 0;
  return async (): Promise<QualityCheckObservation> => {
    const observation = observations[Math.min(nextIndex, observations.length - 1)];
    nextIndex += 1;

    if (observation === undefined) {
      throw new Error("A scripted observation was unexpectedly unavailable.");
    }

    return observation;
  };
}

/** Creates a repeatable transient failure before returning the provided value. */
export function transientFailureThen<T>(failureCount: number, value: T): () => Promise<T> {
  let attempts = 0;
  return async (): Promise<T> => {
    attempts += 1;
    if (attempts <= failureCount) {
      throw new QualityUtilityError("dependency-failure", "Illustrative local dependency is temporarily unavailable.", {
        operation: "illustrative-local-dependency",
        attempt: attempts,
      });
    }

    return value;
  };
}
