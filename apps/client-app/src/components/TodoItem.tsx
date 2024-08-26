import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { HttpClient } from '../lib/httpclient';
import { isDatePastdue, formatDate } from '../util/date.util';
import { toast } from 'react-toastify';

interface Todo {
  id: string;
  description: string;
  createdAt: string;
  dueDate: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  updateTodoList: (todo: Todo, action: 'save' | 'delete') => void;
  toggleEditView: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, updateTodoList, toggleEditView }) => {
  const apiClient = new HttpClient('/api');

  const toggleComplete = async (id: string) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      await apiClient.patch(`/todos/${id}`, { completed: updatedTodo.completed });
      updateTodoList(updatedTodo, 'save');

      toast.success(todo.completed ? 'Todo re-opened!' : 'Todo marked complete!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update todo';
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const confirmStatus = confirm("Are you sure?");
      if (confirmStatus !== true) {
        return;
      }

      await apiClient.delete(`/todos/${id}`);

      updateTodoList(todo, 'delete');

      toast.success('Todo deleted successfully!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete todo';
      toast.error(message);
    }
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 w-full max-w-3xl mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleComplete(todo.id)}
            className="form-checkbox mr-2"
          />
          <span className="text-lg">{todo.description}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleEditView(todo)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(todo.id)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
      <div className="text-gray-500 text-sm">
        Created at: {formatDate(todo.createdAt, { withTime: true })}
      </div>
      <div className="text-gray-500 text-sm">
        Due: {
          todo.dueDate
            ? <>
                {formatDate(todo.dueDate, { withTime: false })} {isDatePastdue(todo.dueDate) && <span className="text-red-500 italic">past due</span>}
              </>
            : '-'
        }
      </div>
    </div>
  )
}

export default TodoItem;
