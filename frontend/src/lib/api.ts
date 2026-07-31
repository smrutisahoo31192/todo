const DEFAULT_API_BASE_URL = '/api';

export class ApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(message: string, status: number, body: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

const normalizeBaseUrl = (baseUrl: string): string => baseUrl.replace(/\/$/, '');

const joinApiPath = (baseUrl: string, path: string): string => {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
};

export const getApiBaseUrl = (): string =>
  normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL);

export type HealthResponse = Readonly<{
  status: string;
}>;

export type Todo = Readonly<{
  id: number;
  title: string;
  completed: boolean;
}>;

export type CreateTodoRequest = Readonly<{
  title: string;
}>;

export type UpdateTodoRequest = Readonly<{
  title: string;
  completed: boolean;
}>;

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(joinApiPath(getApiBaseUrl(), path), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      `API request failed with status ${response.status}`,
      response.status,
      await response.text(),
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const healthApi = {
  check: (signal?: AbortSignal): Promise<HealthResponse> =>
    apiRequest<HealthResponse>('/health', { signal }),
};

export const todoApi = {
  list: (signal?: AbortSignal): Promise<readonly Todo[]> =>
    apiRequest<readonly Todo[]>('/todos', { signal }),
  create: (payload: CreateTodoRequest, signal?: AbortSignal): Promise<Todo> =>
    apiRequest<Todo>('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    }),
  update: (todoId: number, payload: UpdateTodoRequest, signal?: AbortSignal): Promise<Todo> =>
    apiRequest<Todo>(`/todos/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    }),
};
