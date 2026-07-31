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
  todoApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

const listTodosMock = vi.mocked(todoApi.list);
const createTodoMock = vi.mocked(todoApi.create);
const updateTodoMock = vi.mocked(todoApi.update);

describe('App', () => {
  beforeEach(() => {
    listTodosMock.mockReset();
    createTodoMock.mockReset();
    updateTodoMock.mockReset();
  });

  it('creates a todo from the shared form and resets back to create state', async () => {
    listTodosMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: 1, title: 'Write release notes', completed: false }]);
    createTodoMock.mockResolvedValue({ id: 1, title: 'Write release notes', completed: false });

    render(<App />);

    expect(await screen.findByText(/no todos yet/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: '  Write release notes  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));

    await waitFor(() => {
      expect(createTodoMock).toHaveBeenCalledWith({ title: 'Write release notes' });
    });
    expect(await screen.findByText('Write release notes')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/mark as completed/i)).not.toBeChecked();
    expect(screen.getByRole('heading', { name: /add a todo/i })).toBeInTheDocument();
  });

  it('opens edit mode with existing values and saves updates back to the list', async () => {
    listTodosMock
      .mockResolvedValueOnce([{ id: 7, title: 'Draft release', completed: false }])
      .mockResolvedValueOnce([{ id: 7, title: 'Publish release', completed: true }]);
    updateTodoMock.mockResolvedValue({ id: 7, title: 'Publish release', completed: true });

    render(<App />);

    expect(await screen.findByText('Draft release')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /edit draft release/i }));

    expect(screen.getByRole('heading', { name: /edit todo/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue('Draft release');
    expect(screen.getByLabelText(/mark as completed/i)).not.toBeChecked();

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Publish release' } });
    fireEvent.click(screen.getByLabelText(/mark as completed/i));
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(updateTodoMock).toHaveBeenCalledWith(7, {
        title: 'Publish release',
        completed: true,
      });
    });
    const updatedTodo = await screen.findByText('Publish release');
    expect(updatedTodo).toBeInTheDocument();
    expect(updatedTodo.closest('li')).toHaveTextContent('Completed');
    expect(screen.getByRole('heading', { name: /add a todo/i })).toBeInTheDocument();
  });

  it('cancels editing without saving changes', async () => {
    listTodosMock.mockResolvedValue([{ id: 2, title: 'Keep original', completed: false }]);

    render(<App />);

    expect(await screen.findByText('Keep original')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /edit keep original/i }));
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Changed locally' } });
    fireEvent.click(screen.getByRole('button', { name: /cancel edit/i }));

    expect(updateTodoMock).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: /add a todo/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByText('Keep original')).toBeInTheDocument();
  });

  it('blocks blank submissions with validation feedback', async () => {
    listTodosMock.mockResolvedValue([]);

    render(<App />);

    expect(await screen.findByText(/no todos yet/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));

    expect(createTodoMock).not.toHaveBeenCalled();
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });

  it('shows request failures without leaving the current form mode', async () => {
    listTodosMock.mockResolvedValue([]);
    createTodoMock.mockRejectedValue(new ApiError('validation failed', 503, 'offline'));

    render(<App />);

    expect(await screen.findByText(/no todos yet/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Retry later' } });
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));

    expect(
      await screen.findByText(/backend request failed \(503\)\. try again after the api is available/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /add a todo/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue('Retry later');
  });
});
