import { describe, expect, it, vi, beforeEach } from "vitest";
import { PlatformApiError } from "../api/platformClient";

vi.mock("../api", () => {
  return {
    api: {
      preDeductCredits: vi.fn(),
      commitPreDeduct: vi.fn(),
      cancelPreDeduct: vi.fn()
    }
  };
});

import { api } from "../api";
import {
  cancelTaskHold,
  commitTaskCredits,
  holdTaskCredits,
  retryTaskHoldLifecycle
} from "./taskLifecycle";

const mockedApi = vi.mocked(api, true);

describe("taskLifecycle workflows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("holds credits with provided context", async () => {
    const preDeductResponse = {
      preDeductId: "pd_123",
      frozenAmount: 120,
      balanceAfter: 880,
      quotaSnapshot: { templateQuota: 10, userUsage: 2 },
      expireAt: new Date().toISOString()
    };
    mockedApi.preDeductCredits.mockResolvedValue(preDeductResponse as any);

    const result = await holdTaskCredits({
      tenantId: "tenant",
      templateId: "tmpl",
      userId: "user",
      taskId: "task",
      scene: "image.generate",
      estimatedCost: 120
    });

    expect(mockedApi.preDeductCredits).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: "task",
        templateId: "tmpl",
        tenantId: "tenant",
        userId: "user",
        scene: "image.generate",
        estimatedCost: 120
      }),
      undefined
    );
    expect(result.requestedCost).toBe(120);
    expect(result.frozenAmount).toBe(120);
  });

  it("commits credits and reports refund delta", async () => {
    mockedApi.commitPreDeduct.mockResolvedValue({
      preDeductId: "pd_123",
      frozenAmount: 80,
      balanceAfter: 900,
      quotaSnapshot: { templateQuota: 10, userUsage: 2 },
      expireAt: new Date().toISOString()
    } as any);

    const outcome = await commitTaskCredits({
      tenantId: "tenant",
      templateId: "tmpl",
      userId: "user",
      taskId: "task",
      scene: "image.generate",
      preDeductId: "pd_123",
      actualCost: 80,
      holdSnapshot: {
        preDeductId: "pd_123",
        frozenAmount: 120,
        balanceAfter: 880,
        quotaSnapshot: { templateQuota: 10, userUsage: 2 },
        expireAt: new Date().toISOString(),
        requestedCost: 120,
        scene: "image.generate"
      }
    });

    expect(mockedApi.commitPreDeduct).toHaveBeenCalledWith(
      expect.objectContaining({
        preDeductId: "pd_123",
        actualCost: 80,
        taskId: "task"
      }),
      undefined
    );
    expect(outcome.refundAmount).toBe(40);
  });

  it("cancels a hold with default reason", async () => {
    mockedApi.cancelPreDeduct.mockResolvedValue({
      preDeductId: "pd_123",
      status: "cancelled",
      reason: "user_cancelled",
      balanceAfter: "920"
    } as any);

    await cancelTaskHold({
      preDeductId: "pd_123",
      tenantId: "tenant"
    });

    expect(mockedApi.cancelPreDeduct).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: "user_cancelled"
      }),
      undefined
    );
  });

  it("retries lifecycle by cancelling previous hold and creating a new one", async () => {
    mockedApi.cancelPreDeduct.mockResolvedValue({
      preDeductId: "pd_old",
      status: "cancelled",
      reason: "retry_requested",
      balanceAfter: "910"
    } as any);
    mockedApi.preDeductCredits.mockResolvedValue({
      preDeductId: "pd_new",
      frozenAmount: 100,
      balanceAfter: 900,
      quotaSnapshot: { templateQuota: 10, userUsage: 3 },
      expireAt: new Date().toISOString()
    } as any);

    const outcome = await retryTaskHoldLifecycle({
      tenantId: "tenant",
      templateId: "tmpl",
      userId: "user",
      taskId: "task",
      scene: "image.generate",
      estimatedCost: 100,
      previousHold: {
        preDeductId: "pd_old",
        tenantId: "tenant",
        userId: "user"
      }
    });

    expect(mockedApi.cancelPreDeduct).toHaveBeenCalledTimes(1);
    expect(mockedApi.preDeductCredits).toHaveBeenCalledTimes(1);
    expect(outcome.hold.preDeductId).toBe("pd_new");
    expect(outcome.cancellation?.preDeductId).toBe("pd_old");
  });

  it("suppresses not-found/processed errors during retry cancellation", async () => {
    mockedApi.cancelPreDeduct.mockRejectedValue(
      new PlatformApiError("already processed", { status: 409, code: "pre_deduct_already_processed" })
    );
    mockedApi.preDeductCredits.mockResolvedValue({
      preDeductId: "pd_new",
      frozenAmount: 100,
      balanceAfter: 900,
      quotaSnapshot: { templateQuota: 10, userUsage: 3 },
      expireAt: new Date().toISOString()
    } as any);

    const outcome = await retryTaskHoldLifecycle({
      tenantId: "tenant",
      templateId: "tmpl",
      userId: "user",
      taskId: "task",
      scene: "image.generate",
      estimatedCost: 100,
      previousHold: {
        preDeductId: "pd_old",
        tenantId: "tenant"
      }
    });

    expect(mockedApi.preDeductCredits).toHaveBeenCalledTimes(1);
    expect(outcome.cancelError).toBeInstanceOf(PlatformApiError);
  });
});
