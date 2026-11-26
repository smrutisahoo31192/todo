import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { ApiError, healthApi, todosApi } from './lib/api';

vi.mock('./lib/api', () => ({
  ApiError: class extends Error {
    readonly status: number;
    readonly body: string;

    constructor(message: string, status: number, body: string) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.body = body;
    }
  },
  getApiBaseUrl: () => '/api',
  healthApi: {
    check: vi.fn(),
  },
  todosApi: {
    list: vi.fn(),
  },
}));

const healthCheckMock = vi.mocked(healthApi.check);
const todosListMock = vi.mocked(todosApi.list);

describe('App', () => {
  beforeEach(() => {
    healthCheckMock.mockReset();
    todosListMock.mockReset();
    todosListMock.mockResolvedValue([]);
  });

  it('renders the starter shell and loads backend health status', async () => {
    healthCheckMock.mockResolvedValue({ status: 'ok' });

    render(<App />);

    expect(
      screen.getByRole('heading', { name: /react \+ vite workspace ready for todo ui work/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/checking fastapi backend/i)).toBeInTheDocument();
    expect(await screen.findByText(/backend responded successfully with status/i)).toHaveTextContent(
      'ok',
    );
    expect(healthCheckMock).toHaveBeenCalledOnce();
  });

  it('shows backend startup guidance when the health check fails', async () => {
    healthCheckMock.mockRejectedValue(new ApiError('backend unavailable', 503, 'offline'));

    render(<App />);

    expect(
      await screen.findByText(/backend request failed \(503\)\. start the fastapi app/i),
    ).toBeInTheDocument();
  });

  it('shows an empty-state message when the todo list is empty', async () => {
    todosListMock.mockResolvedValue([]);
    healthCheckMock.mockResolvedValue({ status: 'ok' });

    render(<App />);

    expect(await screen.findByText('Nothing to do yet')).toBeInTheDocument();
    expect(todosListMock).toHaveBeenCalledOnce();
  });
});
