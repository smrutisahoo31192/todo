import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, getApiBaseUrl, healthApi, todoApi } from './api';

const fetchMock = vi.fn<typeof fetch>();

describe('api client', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('uses the default API base URL when no override is configured', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify([{ id: 1, title: 'Ship ticket', completed: false }]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(todoApi.list()).resolves.toEqual([{ id: 1, title: 'Ship ticket', completed: false }]);
    expect(getApiBaseUrl()).toBe('/api');
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/todos',
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/json' }),
      }),
    );
  });

  it('honors the configured API base URL for todo mutations', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test');
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ id: 4, title: 'Review PR', completed: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(todoApi.update(4, { title: 'Review PR', completed: true })).resolves.toEqual({
      id: 4,
      title: 'Review PR',
      completed: true,
    });
    expect(getApiBaseUrl()).toBe('https://api.example.test');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/todos/4',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ title: 'Review PR', completed: true }),
      }),
    );
  });

  it('returns no value for successful delete requests', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(todoApi.remove(1)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/todos/1',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('raises an ApiError when the backend responds with a failure status', async () => {
    fetchMock.mockResolvedValue(new Response('backend offline', { status: 503 }));

    const request = healthApi.check();

    await expect(request).rejects.toBeInstanceOf(ApiError);
    await expect(request).rejects.toMatchObject({
      status: 503,
      body: 'backend offline',
    });
  });
});
