import { afterEach, describe, expect, it, vi } from "vitest";
import { createPlatformClient } from "./platformClient";

function jsonResponse(payload: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    },
    ...init
  });
}

describe("createPlatformClient authorization", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("attaches static auth token to requests", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          tenant_id: "tenant-001",
          user_id: null,
          balance: 1000,
          frozen: 0,
          currency: "point"
        })
      )
    );

    const client = createPlatformClient({
      baseUrl: "https://api.mock.local",
      fetchImpl: fetchMock as unknown as typeof fetch,
      authToken: "token-static"
    } as any);

    await client.fetchCreditsBalance({ tenantId: "tenant-001" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const firstCall = fetchMock.mock.calls[0];
    const init = (firstCall?.[1] ?? undefined) as RequestInit | undefined;
    const headers = init?.headers as Record<string, string> | undefined;
    expect(headers?.Authorization).toBe("Bearer token-static");
  });

  it("requests fresh tokens when getAuthToken is provided", async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      if (url.includes("/credits/balance")) {
        return Promise.resolve(
          jsonResponse({
            tenant_id: "tenant-001",
            user_id: null,
            balance: 900,
            frozen: 50,
            currency: "point"
          })
        );
      }
      return Promise.resolve(
        jsonResponse({
          tenant_id: "tenant-001",
          user_id: null,
          entries: []
        })
      );
    });

    const getAuthToken = vi.fn().mockResolvedValueOnce("alpha-token").mockResolvedValueOnce("beta-token");

    const client = createPlatformClient({
      baseUrl: "https://api.mock.local",
      fetchImpl: fetchMock as unknown as typeof fetch,
      getAuthToken
    } as any);

    await client.fetchCreditsBalance({ tenantId: "tenant-001" });
    await client.fetchCreditsLedger({ tenantId: "tenant-001" });

    expect(getAuthToken).toHaveBeenCalledTimes(2);
    const firstHeaders = (fetchMock.mock.calls[0]?.[1] as RequestInit | undefined)?.headers as Record<string, string> | undefined;
    const secondHeaders = (fetchMock.mock.calls[1]?.[1] as RequestInit | undefined)?.headers as Record<string, string> | undefined;
    expect(firstHeaders?.Authorization).toBe("Bearer alpha-token");
    expect(secondHeaders?.Authorization).toBe("Bearer beta-token");
  });
});

describe("platform client default headers", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("merges static default headers", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          tenant_id: "tenant-dh",
          user_id: null,
          balance: 760,
          frozen: 10,
          currency: "point"
        })
      )
    );

    const client = createPlatformClient({
      baseUrl: "https://platform.local",
      fetchImpl: fetchMock as unknown as typeof fetch,
      defaultHeaders: {
        "X-Client-Version": "edge-1",
        Authorization: "Bearer pre-signed"
      }
    } as any);

    await client.fetchCreditsBalance({ tenantId: "tenant-dh" });

    const firstCall = fetchMock.mock.calls[0];
    const init = (firstCall?.[1] ?? undefined) as RequestInit | undefined;
    const headers = init?.headers as Record<string, string> | undefined;
    expect(headers?.["X-Client-Version"]).toBe("edge-1");
    expect(headers?.Authorization).toBe("Bearer pre-signed");
  });

  it("merges RequestOptions query into search params", async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === "string" ? new URL(input) : input instanceof URL ? input : new URL((input as Request).url);
      const search = url.searchParams;
      expect(search.get("tenant_id")).toBe("tenant-query");
      expect(search.get("user_id")).toBe("user-1");
      expect(search.get("page")).toBe("2");
      expect(search.get("filter")).toBe("active");
      return Promise.resolve(
        jsonResponse({ tenant_id: "tenant-query", user_id: "user-1", entries: [] })
      );
    });

    const client = createPlatformClient({
      baseUrl: "https://platform.local",
      fetchImpl: fetchMock as unknown as typeof fetch
    } as any);

    await client.fetchCreditsLedger(
      { tenantId: "tenant-query", userId: "user-1" },
      { query: { page: 2, filter: "active" } }
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("passes AbortSignal through request options", async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn((input, init) =>
      new Promise<Response>((_, reject) => {
        init?.signal?.addEventListener("abort", () => reject(init.signal?.reason ?? new Error("aborted")), { once: true });
      })
    );

    const client = createPlatformClient({
      baseUrl: "https://platform.local",
      fetchImpl: fetchMock as unknown as typeof fetch
    } as any);

    const promise = client.fetchCreditsBalance(
      { tenantId: "tenant-signal" },
      { signal: controller.signal }
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const call = fetchMock.mock.calls[0];
    const init = (call?.[1] ?? undefined) as RequestInit | undefined;
    expect(init?.signal).toBeDefined();

    const expectation = expect(promise).rejects.toMatchObject({ message: "user_abort" });
    controller.abort(new Error("user_abort"));
    await expectation;
  });

  it("allows per-call headers to override defaults", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          tenant_id: "tenant-dh3",
          user_id: null,
          balance: 555,
          frozen: 5,
          currency: "point"
        })
      )
    );

    const defaultHeaders = vi.fn(async () => ({ Authorization: "Bearer default" }));
    const client = createPlatformClient({
      baseUrl: "https://platform.local",
      fetchImpl: fetchMock as unknown as typeof fetch,
      defaultHeaders,
      authToken: "ignored"
    } as any);

    await client.fetchCreditsBalance(
      { tenantId: "tenant-dh3" },
      { headers: { Authorization: "Bearer call-specific", "X-Debug": "trace" } }
    );

    expect(defaultHeaders).toHaveBeenCalledTimes(1);
    const call = fetchMock.mock.calls[0];
    const init = (call?.[1] ?? undefined) as RequestInit | undefined;
    const headers = init?.headers as Record<string, string> | undefined;
    expect(headers?.Authorization).toBe("Bearer call-specific");
    expect(headers?.["X-Debug"]).toBe("trace");
  });

  it("aborts when timeout is reached", async () => {
    vi.useFakeTimers();
    try {
      const fetchMock = vi.fn((input, init) =>
        new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener("abort", () => reject(init.signal?.reason ?? new Error("aborted")), { once: true });
        })
      );

      const client = createPlatformClient({
        baseUrl: "https://platform.local",
        fetchImpl: fetchMock as unknown as typeof fetch
      } as any);

      const promise = client.fetchCreditsBalance(
        { tenantId: "tenant-timeout" },
        { timeout: 1000 }
      );

      const expectation = expect(promise).rejects.toMatchObject({ message: "request_timeout" });
      await vi.advanceTimersByTimeAsync(1000);
      await expectation;
    } finally {
      vi.useRealTimers();
    }
  });

  it("marks PlatformApiError with retry metadata", async () => {
    let attempts = 0;
    const fetchMock = vi.fn(() => {
      attempts += 1;
      if (attempts < 3) {
        return Promise.reject(new Error(`fail-${attempts}`));
      }
      return Promise.reject(new Error("final"));
    });

    const onAttempt = vi.fn();

    const client = createPlatformClient({
      baseUrl: "https://platform.local",
      fetchImpl: fetchMock as unknown as typeof fetch
    } as any);

    await expect(
      client.fetchCreditsBalance({ tenantId: "tenant-retry" }, { retry: { attempts: 3, delayMs: 0, onAttempt } })
    ).rejects.toMatchObject({
      message: "Failed to execute request",
      detail: expect.any(Error)
    });

    expect(onAttempt).toHaveBeenCalledTimes(3 - 1);
  });

  it("retries failed requests per RequestOptions", async () => {
    let attempts = 0;
    const fetchMock = vi.fn(() => {
      attempts += 1;
      if (attempts < 3) {
        return Promise.reject(new Error("network_error"));
      }
      return Promise.resolve(
        jsonResponse({ tenant_id: "tenant-retry", user_id: null, balance: 222, frozen: 0, currency: "point" })
      );
    });

    const client = createPlatformClient({
      baseUrl: "https://platform.local",
      fetchImpl: fetchMock as unknown as typeof fetch
    } as any);

    const result = await client.fetchCreditsBalance(
      { tenantId: "tenant-retry" },
      { retry: { attempts: 3, delayMs: 0 } }
    );

    expect(result.balance).toBe(222);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("wraps fetch errors in PlatformApiError with detail", async () => {
    const cause = new TypeError("network exploded");
    const fetchMock = vi.fn(() => Promise.reject(cause));

    const client = createPlatformClient({
      baseUrl: "https://platform.local",
      fetchImpl: fetchMock as unknown as typeof fetch
    } as any);

    await expect(client.fetchCreditsBalance({ tenantId: "tenant-error" })).rejects.toMatchObject({
      message: "Failed to execute request",
      detail: cause,
      status: 0
    });
  });

  it("calls retry.onAttempt for each failure", async () => {
    let attempts = 0;
    const fetchMock = vi.fn(() => {
      attempts += 1;
      if (attempts < 3) {
        return Promise.reject(new Error(`fail-${attempts}`));
      }
      return Promise.resolve(
        jsonResponse({ tenant_id: "tenant-observe", user_id: null, balance: 999, frozen: 0, currency: "point" })
      );
    });

    const onAttempt = vi.fn();

    const client = createPlatformClient({
      baseUrl: "https://platform.local",
      fetchImpl: fetchMock as unknown as typeof fetch
    } as any);

    const result = await client.fetchCreditsBalance(
      { tenantId: "tenant-observe" },
      { retry: { attempts: 3, delayMs: 0, onAttempt } }
    );

    expect(result.balance).toBe(999);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(onAttempt).toHaveBeenCalledTimes(2);
    expect(onAttempt).toHaveBeenNthCalledWith(1, 1, expect.any(Error));
    expect(onAttempt).toHaveBeenNthCalledWith(2, 2, expect.any(Error));
  });

  it("applies RequestOptions fetchOptions", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          tenant_id: "tenant-fetch",
          user_id: null,
          balance: 111,
          frozen: 0,
          currency: "point"
        })
      )
    );

    const client = createPlatformClient({
      baseUrl: "https://platform.local",
      fetchImpl: fetchMock as unknown as typeof fetch
    } as any);

    await client.fetchCreditsBalance(
      { tenantId: "tenant-fetch" },
      { fetchOptions: { credentials: "include", cache: "no-store" } }
    );

    const call = fetchMock.mock.calls[0];
    const init = (call?.[1] ?? undefined) as RequestInit | undefined;
    expect(init?.credentials).toBe("include");
    expect(init?.cache).toBe("no-store");
  });

  it("awaits async default headers and preserves per-request overrides", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          tenant_id: "tenant-dh2",
          user_id: null,
          entries: []
        })
      )
    );

    const defaultHeaders = vi.fn(async () => {
      await Promise.resolve();
      return {
        Authorization: "Bearer from-default",
        "X-Client-Version": "edge-2"
      };
    });

    const client = createPlatformClient({
      baseUrl: "https://platform.local",
      fetchImpl: fetchMock as unknown as typeof fetch,
      defaultHeaders,
      authToken: "ignored-token"
    } as any);

    await client.fetchCreditsLedger({ tenantId: "tenant-dh2", userId: "user-1" });
    await client.fetchCreditsLedger({ tenantId: "tenant-dh2", userId: "user-2" });

    expect(defaultHeaders).toHaveBeenCalledTimes(2);
    const ledgerCallA = fetchMock.mock.calls[0];
    const ledgerCallB = fetchMock.mock.calls[1];
    const ledgerHeadersA = (ledgerCallA?.[1] ?? undefined) as RequestInit | undefined;
    const ledgerHeadersB = (ledgerCallB?.[1] ?? undefined) as RequestInit | undefined;
    expect((ledgerHeadersA?.headers as Record<string, string> | undefined)?.Authorization).toBe("Bearer from-default");
    expect((ledgerHeadersB?.headers as Record<string, string> | undefined)?.Authorization).toBe("Bearer from-default");

    await client.fetchCreditsBalance({ tenantId: "tenant-dh2", userId: "user-3" });
    const balanceCall1 = fetchMock.mock.calls[2];
    const balanceInit1 = (balanceCall1?.[1] ?? undefined) as RequestInit | undefined;
    const balanceHeaders1 = balanceInit1?.headers as Record<string, string> | undefined;
    expect(balanceHeaders1?.Authorization).toBe("Bearer from-default");
    expect(balanceHeaders1?.["X-Client-Version"]).toBe("edge-2");
  });
});


describe("platform client endpoint mappings", () => {
  const baseUrl = "https://platform.mock";

  function toUrl(input: RequestInfo | URL): URL {
    if (typeof input === "string") {
      return new URL(input);
    }
    if (input instanceof URL) {
      return input;
    }
    return new URL((input as Request).url);
  }

  it("posts estimate credits with correct payload and maps response", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          currency: "point",
          template_id: "tpl-001",
          scene: "render",
          resolution: "hd",
          priority: "accelerated",
          current_balance: 880,
          selected_cost: 42,
          estimated_cost: 45,
          min_cost: 40,
          max_cost: 70,
          calculation_basis: "historical_avg",
          policy_tag: "A1",
          audit_id: "audit-42",
          suggest_topup: 120,
          extras: { frames: 8 },
          options: [
            { priority: "standard", total_cost: 40, eta_minutes: 10 },
            { priority: "accelerated", total_cost: 45, eta_minutes: 4 }
          ]
        })
      )
    );

    const client = createPlatformClient({ baseUrl, fetchImpl: fetchMock as unknown as typeof fetch } as any);

    const result = await client.estimateCredits(
      {
        tenantId: "tenant-1",
        userId: "user-2",
        templateId: "tpl-001",
        scene: "render",
        resolution: "hd",
        priority: "accelerated",
        extras: { frames: 8 },
        idempotencyKey: "idem-123"
      },
      { headers: { "X-Custom": "header" } }
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [request, init] = fetchMock.mock.calls[0];
    const url = toUrl(request as RequestInfo | URL);
    expect(url.pathname).toBe("/api/v1/credits/estimate");
    expect(init?.method).toBe("POST");
    const body = JSON.parse((init?.body ?? "{}") as string);
    expect(body).toMatchObject({
      tenant_id: "tenant-1",
      user_id: "user-2",
      template_id: "tpl-001",
      scene: "render",
      resolution: "hd",
      priority: "accelerated",
      extras: { frames: 8 }
    });
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers["X-Idempotency-Key"]).toBe("idem-123");
    expect(headers["X-Custom"]).toBe("header");

    expect(result).toMatchObject({
      currency: "point",
      templateId: "tpl-001",
      policyTag: "A1",
      auditId: "audit-42",
      suggestTopup: 120,
      options: [
        { priority: "standard", totalCost: 40, etaMinutes: 10 },
        { priority: "accelerated", totalCost: 45, etaMinutes: 4 }
      ]
    });
  });

  it("pre-deducts credits with defaults and maps quota snapshot", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          pre_deduct_id: "pd-1",
          frozen_amount: 30,
          balance_after: 850,
          quota_snapshot: { template_quota: 200, user_usage: 12 },
          expire_at: "2025-09-20T10:20:00+08:00"
        })
      )
    );

    const client = createPlatformClient({ baseUrl, fetchImpl: fetchMock as unknown as typeof fetch } as any);

    const result = await client.preDeductCredits({
      taskId: "task-1",
      templateId: "tpl-1",
      tenantId: "tenant-1",
      userId: "user-1",
      scene: "render",
      estimatedCost: 30
    });

    const [request, init] = fetchMock.mock.calls[0];
    const url = toUrl(request as RequestInfo | URL);
    expect(url.pathname).toBe("/api/v1/credits/pre-deduct");
    expect(init?.method).toBe("POST");
    const body = JSON.parse((init?.body ?? "{}") as string);
    expect(body).toMatchObject({
      currency: "point",
      expire_in: 600
    });

    expect(result).toEqual({
      preDeductId: "pd-1",
      frozenAmount: 30,
      balanceAfter: 850,
      quotaSnapshot: { templateQuota: 200, userUsage: 12 },
      expireAt: "2025-09-20T10:20:00+08:00"
    });
  });

  it("commits and cancels pre-deduct with proper payloads", async () => {
    const responses = [
      jsonResponse({
        pre_deduct_id: "pd-2",
        frozen_amount: 22,
        balance_after: 810,
        quota_snapshot: { template_quota: 200, user_usage: 18 },
        expire_at: "2025-09-20T11:20:00+08:00"
      }),
      jsonResponse({
        pre_deduct_id: "pd-2",
        status: "cancelled",
        reason: "user_cancel",
        balance_after: "834"
      })
    ];
    const fetchMock = vi.fn(() => Promise.resolve(responses[fetchMock.mock.calls.length - 1]));

    const client = createPlatformClient({ baseUrl, fetchImpl: fetchMock as unknown as typeof fetch } as any);

    const commitResult = await client.commitPreDeduct({
      preDeductId: "pd-2",
      actualCost: 22,
      taskId: "task-2",
      tenantId: "tenant-1",
      templateId: "tpl-1",
      userId: "user-1"
    });

    const [commitRequest, commitInit] = fetchMock.mock.calls[0];
    const commitBody = JSON.parse((commitInit?.body ?? "{}") as string);
    expect(toUrl(commitRequest as RequestInfo | URL).pathname).toBe("/api/v1/credits/commit");
    expect(commitBody).toMatchObject({ actual_cost: 22, pre_deduct_id: "pd-2" });
    expect(commitResult.preDeductId).toBe("pd-2");

    const cancelPromise = client.cancelPreDeduct({
      preDeductId: "pd-2",
      tenantId: "tenant-1",
      userId: "user-1",
      reason: "user_cancel"
    });
    const [cancelRequest, cancelInit] = fetchMock.mock.calls[1];
    expect(toUrl(cancelRequest as RequestInfo | URL).pathname).toBe("/api/v1/credits/cancel");
    const cancelBody = JSON.parse((cancelInit?.body ?? "{}") as string);
    expect(cancelBody).toMatchObject({ reason: "user_cancel" });

    const cancelResult = await cancelPromise;
    expect(cancelResult.balanceAfter).toBe(834);
  });

  it("charges credits with idempotency header and maps ledger info", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          ledger_id: "ledger-1",
          tenant_id: "tenant-1",
          user_id: "user-1",
          task_id: "task-9",
          balance_after: 720,
          change: -60,
          reason: "task_commit",
          policy_tag: null,
          created_at: "2025-09-20T12:00:00+08:00"
        })
      )
    );

    const client = createPlatformClient({ baseUrl, fetchImpl: fetchMock as unknown as typeof fetch } as any);

    const result = await client.chargeCredits({
      tenantId: "tenant-1",
      userId: "user-1",
      templateId: "tpl-1",
      taskId: "task-9",
      amount: 60,
      reason: "task_commit",
      idempotencyKey: "charge-1"
    });

    const [request, init] = fetchMock.mock.calls[0];
    expect(toUrl(request as RequestInfo | URL).pathname).toBe("/api/v1/credits/charge");
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers["X-Idempotency-Key"]).toBe("charge-1");
    const body = JSON.parse((init?.body ?? "{}") as string);
    expect(body.priority).toBe("standard");
    expect(body.amount).toBe(60);

    expect(result).toEqual({
      ledgerId: "ledger-1",
      tenantId: "tenant-1",
      userId: "user-1",
      taskId: "task-9",
      balanceAfter: 720,
      change: -60,
      reason: "task_commit",
      policyTag: null,
      createdAt: "2025-09-20T12:00:00+08:00"
    });
  });

  it("fetches ledger and balance with query parameters", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce((input: RequestInfo | URL) => {
        const url = toUrl(input);
        expect(url.pathname).toBe("/api/v1/credits/ledger");
        expect(url.searchParams.get("tenant_id")).toBe("tenant-1");
        expect(url.searchParams.get("user_id")).toBe("user-5");
        expect(url.searchParams.get("cursor")).toBe("next");
        return Promise.resolve(
          jsonResponse({
            tenant_id: "tenant-1",
            user_id: "user-5",
            entries: [
              {
                ledger_id: "ledger-1",
                task_id: null,
                change: -10,
                balance_after: 900,
                reason: "task_commit",
                created_at: "2025-09-20T09:00:00+08:00"
              }
            ]
          })
        );
      })
      .mockImplementationOnce((input: RequestInfo | URL) => {
        const url = toUrl(input);
        expect(url.pathname).toBe("/api/v1/credits/balance");
        expect(url.searchParams.get("tenant_id")).toBe("tenant-1");
        expect(url.searchParams.get("user_id")).toBeNull();
        return Promise.resolve(
          jsonResponse({ tenant_id: "tenant-1", user_id: null, balance: 880, frozen: 20, currency: "point" })
        );
      });

    const client = createPlatformClient({ baseUrl, fetchImpl: fetchMock as unknown as typeof fetch } as any);

    const ledger = await client.fetchCreditsLedger(
      { tenantId: "tenant-1", userId: "user-5" },
      { query: { cursor: "next" } }
    );
    expect(ledger.entries[0]).toMatchObject({ ledgerId: "ledger-1", balanceAfter: 900 });

    const balance = await client.fetchCreditsBalance({ tenantId: "tenant-1" });
    expect(balance).toEqual({ tenantId: "tenant-1", userId: null, balance: 880, frozen: 20, currency: "point" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("posts license check and maps enum fields", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          is_authorized: false,
          reason_code: "missing_documents",
          remaining_quota: 0,
          daily_remaining: 0,
          valid_until: null,
          policy_tag: "B2",
          requirements: ["upload_authorization_contract"]
        })
      )
    );

    const client = createPlatformClient({ baseUrl, fetchImpl: fetchMock as unknown as typeof fetch } as any);

    const result = await client.checkLicense({
      tenantId: "tenant-1",
      templateId: "tpl-1",
      userId: "user-blocked",
      channel: "external",
      sessionId: "session-1"
    });

    const [request, init] = fetchMock.mock.calls[0];
    expect(toUrl(request as RequestInfo | URL).pathname).toBe("/api/v1/licenses/check");
    const body = JSON.parse((init?.body ?? "{}") as string);
    expect(body.channel).toBe("external");
    expect(result).toEqual({
      isAuthorized: false,
      reasonCode: "missing_documents",
      remainingQuota: 0,
      dailyRemaining: 0,
      validUntil: null,
      policyTag: "B2",
      requirements: ["upload_authorization_contract"]
    });
  });

  it("fetches task stream config and maps cadence", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          ws_url: "wss://mock/ws",
          sse_url: "https://mock/sse",
          token: "jwt",
          cadence: [
            { event: "task.accepted", delay_seconds: 0, stage: "ingest" },
            { event: "task.completed", delay_seconds: 120, stage: "delivery" }
          ],
          retry_backoff_seconds: [1, 2, 5]
        })
      )
    );

    const client = createPlatformClient({ baseUrl, fetchImpl: fetchMock as unknown as typeof fetch } as any);

    const config = await client.fetchTaskStreamConfig();
    expect(config).toEqual({
      wsUrl: "wss://mock/ws",
      sseUrl: "https://mock/sse",
      token: "jwt",
      cadence: [
        { event: "task.accepted", delaySeconds: 0, stage: "ingest" },
        { event: "task.completed", delaySeconds: 120, stage: "delivery" }
      ],
      retryBackoffSeconds: [1, 2, 5]
    });
  });

  it("raises PlatformApiError with details from response payload", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({ message: "payload_invalid", code: "42201", detail: { field: "tenant_id" } }),
          { status: 422, headers: { "Content-Type": "application/json" } }
        )
      )
    );

    const client = createPlatformClient({ baseUrl, fetchImpl: fetchMock as unknown as typeof fetch } as any);

    await expect(
      client.estimateCredits({
        tenantId: "tenant-1",
        userId: "user-1",
        templateId: "tpl-1",
        scene: "render"
      })
    ).rejects.toMatchObject({
      message: "payload_invalid",
      code: "42201",
      status: 422,
      detail: expect.objectContaining({
        detail: { field: "tenant_id" }
      })
    });
  });
});
