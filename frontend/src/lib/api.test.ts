import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRequest, getApiBaseUrl, healthApi, todoApi } from './api';

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

  it('lists todos through the shared todo API helper', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify([{ id: 1, title: 'Write tests', completed: false }]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(todoApi.list()).resolves.toEqual([{ id: 1, title: 'Write tests', completed: false }]);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/todos',
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/json' }),
      }),
    );
  });

  it('posts JSON when creating a todo', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ id: 2, title: 'Ship UI', completed: false }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(todoApi.create({ title: 'Ship UI' })).resolves.toEqual({
      id: 2,
      title: 'Ship UI',
      completed: false,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/todos',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ title: 'Ship UI' }),
        headers: expect.objectContaining({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('puts JSON when updating a todo', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ id: 3, title: 'Done', completed: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(todoApi.update(3, { title: 'Done', completed: true })).resolves.toEqual({
      id: 3,
      title: 'Done',
      completed: true,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/todos/3',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ title: 'Done', completed: true }),
        headers: expect.objectContaining({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('surfaces create failures as ApiError instances', async () => {
    fetchMock.mockResolvedValue(new Response('title must not be empty', { status: 422 }));

    await expect(todoApi.create({ title: '' })).rejects.toMatchObject({
      name: 'ApiError',
      status: 422,
      body: 'title must not be empty',
    });
  });
});
