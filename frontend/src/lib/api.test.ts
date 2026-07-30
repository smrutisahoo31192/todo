import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRequest, getApiBaseUrl, healthApi } from './api';

const fetchMock = vi.fn();

describe('api client', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock as typeof fetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('uses the configured API base URL for backend requests', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '/backend');
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(healthApi.check()).resolves.toEqual({ status: 'ok' });
    expect(getApiBaseUrl()).toBe('/backend');
    expect(fetchMock).toHaveBeenCalledWith(
      '/backend/health',
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/json' }),
      }),
    );
  });

  it('raises an ApiError when the backend responds with a failure status', async () => {
    fetchMock.mockResolvedValue(new Response('backend offline', { status: 503 }));

    await expect(apiRequest('/health')).rejects.toMatchObject({
      name: 'ApiError',
      status: 503,
      body: 'backend offline',
    });
  });

  it('returns undefined for successful no-content responses', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(apiRequest<void>('/todos/1', { method: 'DELETE' })).resolves.toBeUndefined();
  });
});
