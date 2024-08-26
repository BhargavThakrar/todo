import React, { useState, useEffect, useRef } from 'react';
import SlidingPanel from './SlidingPanel';
import TodoForm from './TodoForm';
import { HttpClient } from '../lib/httpclient';
import TodoFilter from './TodoFilter';
import { ToastContainer, toast } from 'react-toastify';
import TodoItem from './TodoItem';
import 'react-toastify/dist/ReactToastify.css';

interface Todo {
  id: string;
  description: string;
  createdAt: string;
  dueDate: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const apiClient = new HttpClient('/api');

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const isTodoFiltered = useRef(false); // Tracks if the filtering criteria is currently in place

  const fetchTodos = async (query?: string) => {
    try {
      const data = await apiClient.get<Todo[]>(query ? `/todos${query}` : '/todos');
      setTodos(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch todos';
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  /**
   * This function is responsible to refresh the list based on the actions taken:
   * save(add/edit) and delete
   */
  const updateTodoList = (updatedTodo: Todo, action: 'save' | 'delete') => {
    if (action === 'save') {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        )
      );
    }

    if (action === 'delete') {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== updatedTodo.id));
    }
  };

  const toggleEditView = (todo: Todo) => {
    setEditTodo(todo);
    setIsPanelOpen(true);
  };

  const toggleAddView = () => {
    setEditTodo(null);
    setIsPanelOpen(true);
  };

  const handleSaveTodo = async (todo: Omit<Todo, 'createdAt' | 'completed'>): Promise<void|string> => {
    try {
      const savedTodo = editTodo
        ? await apiClient.patch<Todo>(`/todos/${todo.id}`, todo)
        : await apiClient.post<Todo>('/todos', todo);

      toast.success(editTodo ? 'Todo edited successfully!' : 'Todo added successfully!');

      /**
       * If the filter is currently applied then,
       * clear the filter and refresh the list
       */
      if (isTodoFiltered.current) {
        isTodoFiltered.current = false;
        await fetchTodos();
        return;
      }

      if (editTodo) {
        updateTodoList(savedTodo, 'save')
      } else {
        setTodos([savedTodo, ...todos]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save todo';
      toast.error(message);
    }
  };

  return (
    <div className="bg-gray-100 px-4 py-8 h-full">
      <div className="left-0 bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between mx-auto max-w-3xl z-10">
        {/* Todo Filter */}
        <TodoFilter fetchTodos={fetchTodos} isTodoFiltered={isTodoFiltered} />

        {/* Add a Todo */}
        <button
          onClick={toggleAddView}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Todo
        </button>
      </div>

      {/* Todo List */}
      <div className="pt-10 flex flex-col items-center">
        {/* Todo Item */}
        {todos && todos.map((todo) => <TodoItem key={todo.id} todo={todo} updateTodoList={updateTodoList} toggleEditView={toggleEditView} />)}
      </div>

      {/* Sliding Panel for Add/Edit */}
      {isPanelOpen && (
        <SlidingPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)}>
          <TodoForm
            todo={editTodo}
            onSave={handleSaveTodo}
            onClose={() => setIsPanelOpen(false)}
          />
        </SlidingPanel>
      )}

      {/* Toast for notifications */}
      <ToastContainer />
    </div>
  );
};

export default TodoList;
