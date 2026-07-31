import type { FormEvent } from 'react';

type TodoFormState = {
  readonly title: string;
  readonly completed: boolean;
};

type TodoFormPanelProps = {
  readonly heading: string;
  readonly submitLabel: string;
  readonly editingTodoId: number | null;
  readonly formState: TodoFormState;
  readonly validationError: string | null;
  readonly submitError: string | null;
  readonly isSubmitting: boolean;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly onTitleChange: (nextTitle: string) => void;
  readonly onCompletedChange: (nextCompleted: boolean) => void;
  readonly onCancelEdit: () => void;
};

export function TodoFormPanel({
  heading,
  submitLabel,
  editingTodoId,
  formState,
  validationError,
  submitError,
  isSubmitting,
  onSubmit,
  onTitleChange,
  onCompletedChange,
  onCancelEdit,
}: TodoFormPanelProps) {
  return (
    <section className="panel-card form-panel" aria-labelledby="todo-form-heading">
      <div className="panel-header">
        <div>
          <p className="section-label">Shared form</p>
          <h2 id="todo-form-heading">{heading}</h2>
        </div>
        {editingTodoId !== null ? (
          <span className="edit-pill" aria-live="polite">
            Editing #{editingTodoId}
          </span>
        ) : null}
      </div>

      <form className="todo-form" onSubmit={onSubmit}>
        <label className="field-group" htmlFor="todo-title">
          <span>Title</span>
          <input
            id="todo-title"
            name="title"
            value={formState.title}
            onChange={(event) => {
              onTitleChange(event.target.value);
            }}
            placeholder="What needs to get done?"
          />
        </label>

        <label className="checkbox-row" htmlFor="todo-completed">
          <input
            id="todo-completed"
            name="completed"
            type="checkbox"
            checked={formState.completed}
            onChange={(event) => {
              onCompletedChange(event.target.checked);
            }}
          />
          <span>Mark as completed</span>
        </label>

        {validationError !== null ? (
          <p className="feedback-banner error-banner" role="alert">
            {validationError}
          </p>
        ) : null}

        {submitError !== null ? (
          <p className="feedback-banner error-banner" role="alert">
            {submitError}
          </p>
        ) : null}

        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {submitLabel}
          </button>
          {editingTodoId !== null ? (
            <button
              className="secondary-button"
              type="button"
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
