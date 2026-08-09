/**
 * Intentionally over-responsible example for Chapter 1.
 *
 * It combines setup, authentication, data creation, API calls, assertions,
 * retry behaviour, logging, and cleanup. It is useful for code-reading and
 * decomposition discussion, not as a pattern to copy.
 */

export interface AccountRecoveryCheckDependencies {
  fetchJson(url: string, options?: { method?: string; body?: string }): Promise<unknown>;
  log(event: string, details: Record<string, unknown>): void;
  sleep(milliseconds: number): Promise<void>;
}

export interface AccountRecoveryCheckInput {
  environmentUrl: string;
  email: string;
  newPassword: string;
}

export async function runInheritedAccountRecoveryCheck(
  input: AccountRecoveryCheckInput,
  dependencies: AccountRecoveryCheckDependencies,
): Promise<boolean> {
  let createdUserId: string | undefined;

  try {
    dependencies.log("account-recovery-check-started", { email: input.email });

    const createdUser = (await dependencies.fetchJson(`${input.environmentUrl}/test-users`, {
      method: "POST",
      body: JSON.stringify({ email: input.email, password: "TemporaryPassword1!" }),
    })) as { id: string };
    createdUserId = createdUser.id;

    const recoveryRequest = (await dependencies.fetchJson(`${input.environmentUrl}/recovery`, {
      method: "POST",
      body: JSON.stringify({ email: input.email }),
    })) as { token?: string };

    if (!recoveryRequest.token) {
      dependencies.log("account-recovery-check-failed", { reason: "missing-token" });
      return false;
    }

    let resetCompleted = false;
    for (let attempt = 1; attempt <= 3 && !resetCompleted; attempt += 1) {
      const reset = (await dependencies.fetchJson(`${input.environmentUrl}/recovery/reset`, {
        method: "POST",
        body: JSON.stringify({ token: recoveryRequest.token, password: input.newPassword }),
      })) as { completed?: boolean };

      resetCompleted = reset.completed === true;
      dependencies.log("account-recovery-reset-attempt", { attempt, resetCompleted });

      if (!resetCompleted) {
        await dependencies.sleep(250);
      }
    }

    const signIn = (await dependencies.fetchJson(`${input.environmentUrl}/sessions`, {
      method: "POST",
      body: JSON.stringify({ email: input.email, password: input.newPassword }),
    })) as { authenticated?: boolean };

    const passed = resetCompleted && signIn.authenticated === true;
    dependencies.log("account-recovery-check-completed", { passed });
    return passed;
  } catch (error: unknown) {
    dependencies.log("account-recovery-check-error", {
      message: error instanceof Error ? error.message : "unknown-error",
    });
    return false;
  } finally {
    if (createdUserId) {
      // Intentionally unguarded: a cleanup rejection overrides a pending Boolean result.
      await dependencies.fetchJson(`${input.environmentUrl}/test-users/${createdUserId}`, {
        method: "DELETE",
      });
    }
  }
}
