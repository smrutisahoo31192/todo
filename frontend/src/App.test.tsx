import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { ApiError, todoApi } from './lib/api';

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
  todoApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

const todoApiMock = {
  list: vi.mocked(todoApi.list),
  create: vi.mocked(todoApi.create),
  update: vi.mocked(todoApi.update),
  remove: vi.mocked(todoApi.remove),
};

const createDeferred = <T,>() => {
  let resolvePromise: ((value: T) => void) | null = null;

  const promise = new Promise<T>((resolve) => {
    resolvePromise = resolve;
  });

  return {
    promise,
    resolve: (value: T) => {
      if (resolvePromise === null) {
        throw new Error('Deferred promise was not initialized.');
      }

      resolvePromise(value);
    },
  };
};

describe('App', () => {
  beforeEach(() => {
    todoApiMock.list.mockReset();
    todoApiMock.create.mockReset();
    todoApiMock.update.mockReset();
    todoApiMock.remove.mockReset();
  });

  it('loads todos from the backend on page load', async () => {
    todoApiMock.list.mockResolvedValue([{ id: 1, title: 'Ship backend integration', completed: false }]);

    render(<App />);

    expect(await screen.findByDisplayValue('Ship backend integration')).toBeInTheDocument();
    expect(todoApiMock.list).toHaveBeenCalledOnce();
  });

  it('shows a visible loading state while the initial request is running', async () => {
    const deferredTodos = createDeferred<readonly { id: number; title: string; completed: boolean }[]>();
    todoApiMock.list.mockReturnValue(deferredTodos.promise);

    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent(/loading todos/i);

    deferredTodos.resolve([{ id: 7, title: 'Wait for data', completed: false }]);

    expect(await screen.findByDisplayValue('Wait for data')).toBeInTheDocument();
  });

  it('creates, updates, and deletes todos through the shared API client', async () => {
    todoApiMock.list.mockResolvedValue([{ id: 1, title: 'Existing task', completed: false }]);
    todoApiMock.create.mockResolvedValue({ id: 2, title: 'Write tests', completed: false });
    todoApiMock.update.mockResolvedValue({ id: 1, title: 'Existing task', completed: true });
    todoApiMock.remove.mockResolvedValue();

    render(<App />);

    expect(await screen.findByDisplayValue('Existing task')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/add a new todo/i), { target: { value: 'Write tests' } });
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));

    await waitFor(() => {
      expect(todoApiMock.create).toHaveBeenCalledWith({ title: 'Write tests' });
    });
    expect(await screen.findByDisplayValue('Write tests')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: /toggle completion for existing task/i }));

    await waitFor(() => {
      expect(todoApiMock.update).toHaveBeenCalledWith(1, {
        title: 'Existing task',
        completed: true,
      });
    });

    fireEvent.click(screen.getByRole('button', { name: /delete write tests/i }));

    await waitFor(() => {
      expect(todoApiMock.remove).toHaveBeenCalledWith(2);
    });
    await waitFor(() => {
      expect(screen.queryByDisplayValue('Write tests')).not.toBeInTheDocument();
    });
  });

  it('shows mutation failures without clearing the current list', async () => {
    todoApiMock.list.mockResolvedValue([{ id: 1, title: 'Keep me visible', completed: false }]);
    todoApiMock.update.mockRejectedValue(new ApiError('backend unavailable', 503, 'offline'));

    render(<App />);

    expect(await screen.findByDisplayValue('Keep me visible')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: /toggle completion for keep me visible/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/updating todo failed \(503\)/i);
    expect(screen.getByDisplayValue('Keep me visible')).toBeInTheDocument();
  });

  it('shows an error and retry action when loading todos fails', async () => {
    todoApiMock.list.mockRejectedValueOnce(new ApiError('backend unavailable', 503, 'offline'));
    todoApiMock.list.mockResolvedValueOnce([{ id: 3, title: 'Retry succeeded', completed: false }]);

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/loading todos failed \(503\)/i);

    fireEvent.click(screen.getByRole('button', { name: /retry load/i }));

    expect(await screen.findByDisplayValue('Retry succeeded')).toBeInTheDocument();
  });
});
