import { afterEach, describe, expect, it, vi } from "vitest";
import { api, setApiAdapter, usePlatformClient } from "./index";
import { mockApi } from "./mockBackend";

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    },
    ...init
  });
}

describe("api global adapter integration", () => {
  afterEach(() => {
    setApiAdapter(mockApi);
    vi.useRealTimers();
  });

  it("applies Authorization header after switching to platform client", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          tenant_id: "tenant-global",
          user_id: null,
          balance: 840,
          frozen: 12,
          currency: "point"
        })
      )
    );

    usePlatformClient({
      baseUrl: "https://platform.example",
      fetchImpl: fetchMock as unknown as typeof fetch,
      authToken: "top-level-token"
    } as any);

    await api.fetchCreditsBalance({ tenantId: "tenant-global" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const firstCall = fetchMock.mock.calls[0];
    const init = (firstCall?.[1] ?? undefined) as RequestInit | undefined;
    const headers = init?.headers as Record<string, string> | undefined;
    expect(headers?.Authorization).toBe("Bearer top-level-token");
  });

  it("passes per-call headers through global api", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          tenant_id: "tenant-global",
          user_id: null,
          balance: 420,
          frozen: 0,
          currency: "point"
        })
      )
    );

    usePlatformClient({
      baseUrl: "https://platform.example",
      fetchImpl: fetchMock as unknown as typeof fetch,
      defaultHeaders: { Authorization: "Bearer default" }
    } as any);

    await api.fetchCreditsBalance({ tenantId: "tenant-global" }, { headers: { Authorization: "Bearer override" } });

    const call = fetchMock.mock.calls[0];
    const init = (call?.[1] ?? undefined) as RequestInit | undefined;
    const headers = init?.headers as Record<string, string> | undefined;
    expect(headers?.Authorization).toBe("Bearer override");
  });

  it("merges RequestOptions query when using api helpers", async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === "string" ? new URL(input) : input instanceof URL ? input : new URL((input as Request).url);
      const params = url.searchParams;
      expect(params.get("tenant_id")).toBe("tenant-global");
      expect(params.get("user_id")).toBeNull();
      expect(params.get("cursor")).toBe("next");
      return Promise.resolve(
        jsonResponse({ tenant_id: "tenant-global", user_id: null, entries: [] })
      );
    });

    usePlatformClient({
      baseUrl: "https://platform.example",
      fetchImpl: fetchMock as unknown as typeof fetch,
      defaultHeaders: { Authorization: "Bearer base" }
    } as any);

    await api.fetchCreditsLedger({ tenantId: "tenant-global" }, { query: { cursor: "next" } });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("passes fetchOptions via api helpers", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({ tenant_id: "tenant-global", user_id: null, entries: [] })
      )
    );

    usePlatformClient({
      baseUrl: "https://platform.example",
      fetchImpl: fetchMock as unknown as typeof fetch,
      defaultHeaders: { Authorization: "Bearer base" }
    } as any);

    await api.fetchCreditsLedger(
      { tenantId: "tenant-global" },
      { fetchOptions: { credentials: "same-origin", cache: "no-cache" } }
    );

    const call = fetchMock.mock.calls[0];
    const init = (call?.[1] ?? undefined) as RequestInit | undefined;
    expect(init?.credentials).toBe("same-origin");
    expect(init?.cache).toBe("no-cache");
  });

  it("aborts via timeout when using global api", async () => {
    vi.useFakeTimers();
    try {
      const fetchMock = vi.fn((input, init) =>
        new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener("abort", () => reject(init.signal?.reason ?? new Error("aborted")), { once: true });
        })
      );

      usePlatformClient({
        baseUrl: "https://platform.example",
        fetchImpl: fetchMock as unknown as typeof fetch
      } as any);

      const promise = api.fetchCreditsBalance(
        { tenantId: "tenant-timeout" },
        { timeout: 500 }
      );

      const expectation = expect(promise).rejects.toMatchObject({ message: "request_timeout" });
      await vi.advanceTimersByTimeAsync(500);
      await expectation;
    } finally {
      vi.useRealTimers();
    }
  });

  it("surfaces retry metadata via PlatformApiError on global api", async () => {
    let attempts = 0;
    const fetchMock = vi.fn(() => {
      attempts += 1;
      if (attempts < 2) {
        return Promise.reject(new Error(`fail-${attempts}`));
      }
      return Promise.reject(new Error("final"));
    });

    const onAttempt = vi.fn();

    usePlatformClient({
      baseUrl: "https://platform.example",
      fetchImpl: fetchMock as unknown as typeof fetch
    } as any);

    await expect(
      api.fetchCreditsBalance({ tenantId: "tenant-global" }, { retry: { attempts: 2, delayMs: 0, onAttempt } })
    ).rejects.toMatchObject({
      message: "Failed to execute request",
      detail: expect.any(Error)
    });

    expect(onAttempt).toHaveBeenCalledTimes(2 - 1);
  });

  it("propagates PlatformApiError detail to callers", async () => {
    const cause = new TypeError("upstream failed");
    const fetchMock = vi.fn(() => Promise.reject(cause));

    usePlatformClient({
      baseUrl: "https://platform.example",
      fetchImpl: fetchMock as unknown as typeof fetch
    } as any);

    await expect(
      api.fetchCreditsBalance({ tenantId: "tenant-global" })
    ).rejects.toMatchObject({
      message: "Failed to execute request",
      detail: cause,
      status: 0
    });
  });

  it("retries via global api when RequestOptions.retry is set", async () => {
    let attempts = 0;
    const fetchMock = vi.fn(() => {
      attempts += 1;
      if (attempts < 2) {
        return Promise.reject(new Error("temporary"));
      }
      return Promise.resolve(
        jsonResponse({ tenant_id: "tenant-global", user_id: null, entries: [] })
      );
    });

    usePlatformClient({
      baseUrl: "https://platform.example",
      fetchImpl: fetchMock as unknown as typeof fetch,
      defaultHeaders: { Authorization: "Bearer base" }
    } as any);

    const result = await api.fetchCreditsLedger(
      { tenantId: "tenant-global" },
      { retry: { attempts: 2, delayMs: 0 } }
    );

    expect(result.entries).toHaveLength(0);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("invokes retry.onAttempt when using global api", async () => {
    let attempts = 0;
    const fetchMock = vi.fn(() => {
      attempts += 1;
      if (attempts < 3) {
        return Promise.reject(new Error(`fail-${attempts}`));
      }
      return Promise.resolve(
        jsonResponse({ tenant_id: "tenant-global", user_id: null, entries: [] })
      );
    });

    const onAttempt = vi.fn();

    usePlatformClient({
      baseUrl: "https://platform.example",
      fetchImpl: fetchMock as unknown as typeof fetch
    } as any);

    const result = await api.fetchCreditsLedger(
      { tenantId: "tenant-global" },
      { retry: { attempts: 3, delayMs: 0, onAttempt } }
    );

    expect(result.entries).toHaveLength(0);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(onAttempt).toHaveBeenCalledTimes(2);
    expect(onAttempt).toHaveBeenNthCalledWith(1, 1, expect.any(Error));
    expect(onAttempt).toHaveBeenNthCalledWith(2, 2, expect.any(Error));
  });

  it("forwards AbortSignal via api helpers", async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn((input, init) =>
      new Promise<Response>((_, reject) => {
        init?.signal?.addEventListener("abort", () => reject(init.signal?.reason ?? new Error("aborted")), { once: true });
      })
    );

    usePlatformClient({
      baseUrl: "https://platform.example",
      fetchImpl: fetchMock as unknown as typeof fetch
    } as any);

    const promise = api.fetchCreditsBalance(
      { tenantId: "tenant-global" },
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
});
