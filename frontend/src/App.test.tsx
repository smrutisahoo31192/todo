import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { ApiError, healthApi } from './lib/api';

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
}));

const healthCheckMock = vi.mocked(healthApi.check);

describe('App', () => {
  beforeEach(() => {
    healthCheckMock.mockReset();
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
    expect(screen.getByText(/verify vite_api_url points at the backend/i)).toBeInTheDocument();
  });
});
