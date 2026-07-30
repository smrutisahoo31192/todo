const DEFAULT_API_URL = 'http://localhost:8000';

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
  normalizeBaseUrl(import.meta.env.VITE_API_URL || DEFAULT_API_URL);

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(joinApiPath(getApiBaseUrl(), path), {
    headers: {
      Accept: 'application/json',
      ...init.headers,
    },
    ...init,
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

export interface HealthResponse {
  status: string;
}

export const healthApi = {
  check: (signal?: AbortSignal): Promise<HealthResponse> =>
    apiRequest<HealthResponse>('/health', { signal }),
};
