export type TodoId = number;

export type TodoViewModel = {
  readonly id: TodoId;
  readonly title: string;
  readonly completed: boolean;
};

export type TodoActionHandler = (todoId: TodoId) => void;

export type TodoItemProps = {
  readonly todo: TodoViewModel;
  readonly onToggle: TodoActionHandler;
  readonly onDelete: TodoActionHandler;
};

export type TodoListProps = {
  readonly todos: readonly TodoViewModel[];
  readonly onToggle: TodoActionHandler;
  readonly onDelete: TodoActionHandler;
};
