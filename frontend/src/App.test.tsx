import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
const todoListMock = vi.mocked(todosApi.list);

const todoFixture = [
  { id: 1, title: 'Buy Milk', completed: false },
  { id: 2, title: 'MILK the cat', completed: true },
  { id: 3, title: 'File taxes', completed: true },
  { id: 4, title: 'Schedule dentist', completed: false },
];

describe('App', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    healthCheckMock.mockReset();
    todoListMock.mockReset();
    window.sessionStorage.clear();
    healthCheckMock.mockResolvedValue({ status: 'ok' });
    todoListMock.mockResolvedValue(todoFixture);
  });

  it('shows all loaded todos with the All filter selected by default', async () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /filter and search your tasks from one client-side view/i }),
    ).toBeInTheDocument();

    const todoItems = await screen.findAllByRole('listitem');

    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    expect(todoItems).toHaveLength(4);
    expect(screen.getByText('Buy Milk')).toBeInTheDocument();
    expect(screen.getByText('MILK the cat')).toBeInTheDocument();
    expect(healthCheckMock).toHaveBeenCalledOnce();
    expect(todoListMock).toHaveBeenCalledOnce();
  });

  it('filters visible todos when switching between Active and Completed', async () => {
    render(<App />);

    await screen.findByText('File taxes');

    fireEvent.click(screen.getByRole('button', { name: 'Active' }));

    expect(screen.getByRole('button', { name: 'Active' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Buy Milk')).toBeInTheDocument();
    expect(screen.getByText('Schedule dentist')).toBeInTheDocument();
    expect(screen.queryByText('MILK the cat')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Completed' }));

    expect(screen.getByRole('button', { name: 'Completed' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('MILK the cat')).toBeInTheDocument();
    expect(screen.getByText('File taxes')).toBeInTheDocument();
    expect(screen.queryByText('Schedule dentist')).not.toBeInTheDocument();
  });

  it('matches todo titles case-insensitively from the search field', async () => {
    render(<App />);

    await screen.findByText('Buy Milk');

    fireEvent.change(screen.getByRole('searchbox', { name: /search todos/i }), {
      target: { value: 'milk' },
    });

    expect(screen.getByText('Buy Milk')).toBeInTheDocument();
    expect(screen.getByText('MILK the cat')).toBeInTheDocument();
    expect(screen.queryByText('File taxes')).not.toBeInTheDocument();
  });

  it('applies the selected status filter and search text together', async () => {
    render(<App />);

    await screen.findByText('Buy Milk');

    fireEvent.click(screen.getByRole('button', { name: 'Active' }));
    fireEvent.change(screen.getByRole('searchbox', { name: /search todos/i }), {
      target: { value: 'milk' },
    });

    expect(screen.getByText('Buy Milk')).toBeInTheDocument();
    expect(screen.queryByText('MILK the cat')).not.toBeInTheDocument();
    expect(screen.queryByText('Schedule dentist')).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('restores the prior filter and search state from session storage during the same session', async () => {
    const firstRender = render(<App />);

    await screen.findByText('Buy Milk');

    fireEvent.click(screen.getByRole('button', { name: 'Completed' }));
    fireEvent.change(screen.getByRole('searchbox', { name: /search todos/i }), {
      target: { value: 'milk' },
    });

    expect(screen.getByText('MILK the cat')).toBeInTheDocument();
    expect(screen.queryByText('File taxes')).not.toBeInTheDocument();

    firstRender.unmount();

    render(<App />);

    expect(screen.getByRole('button', { name: 'Completed' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('searchbox', { name: /search todos/i })).toHaveValue('milk');
    expect(await screen.findByText('MILK the cat')).toBeInTheDocument();
    expect(screen.queryByText('Buy Milk')).not.toBeInTheDocument();
  });

  it('shows backend startup guidance when the health check fails', async () => {
    healthCheckMock.mockRejectedValue(new ApiError('backend unavailable', 503, 'offline'));

    render(<App />);

    expect(
      await screen.findByText(/backend request failed \(503\)\. start the fastapi app/i),
    ).toBeInTheDocument();
  });
});
