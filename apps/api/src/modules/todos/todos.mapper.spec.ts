import { Todo } from '@lib/database/entities/todo.entity';
import {
  CreateTodoRequestDto,
  PatchTodoRequestDto,
  TodoResponseDto,
} from './todos.dto';
import { TodoMapper } from './todos.mapper';
import { getFutureDate, getPastDate, formatDate } from '../../util/date.util';

describe('TodoMapper', () => {
  describe('toModel', () => {
    it('should map CreateTodoRequestDto to Todo entity', () => {
      const dto: CreateTodoRequestDto = {
        description: 'Test Todo',
        dueDate: formatDate(new Date()),
        completed: true,
      };

      const todo = TodoMapper.toModel(dto);

      expect(todo).toBeInstanceOf(Todo);
      expect(todo.description).toBe(dto.description);
      expect(todo.dueDate).toEqual(dto.dueDate && new Date(dto.dueDate));
      expect(todo.completed).toBe(dto.completed);
    });

    it('should map PatchTodoRequestDto to an existing Todo entity', () => {
      const existingTodo: Todo = {
        id: '1',
        description: 'Existing Todo',
        createdAt: new Date(new Date().toISOString()),
        updatedAt: new Date(new Date().toISOString()),
        dueDate: new Date(getFutureDate(2)),
        completed: false,
      };

      const dto: PatchTodoRequestDto = {
        description: 'Updated Todo',
        completed: true,
      };

      const updatedTodo = TodoMapper.toModel(dto, existingTodo);

      expect(updatedTodo).toBe(existingTodo); // Should be the same instance
      expect(updatedTodo.description).toBe(dto.description);
      expect(updatedTodo.dueDate).toEqual(existingTodo.dueDate); // Should not change
      expect(updatedTodo.completed).toBe(dto.completed);
    });

    it('should not override undefined fields in PatchTodoRequestDto', () => {
      const existingTodo: Todo = {
        id: '1',
        description: 'Existing Todo',
        createdAt: new Date(new Date().toISOString()),
        updatedAt: new Date(new Date().toISOString()),
        dueDate: new Date(getFutureDate(2)),
        completed: false,
      };

      const dto: PatchTodoRequestDto = {
        description: 'Updated Todo',
      };

      const updatedTodo = TodoMapper.toModel(dto, existingTodo);

      expect(updatedTodo.description).toBe(dto.description);
      expect(updatedTodo.dueDate).toEqual(existingTodo.dueDate); // Should not change
      expect(updatedTodo.completed).toBe(existingTodo.completed); // Should not change
    });
  });

  describe('toDto', () => {
    it('should map Todo entity to TodoResponseDto', () => {
      const todo: Todo = {
        id: '1',
        description: 'Test Todo',
        createdAt: new Date(new Date().toISOString()),
        updatedAt: new Date(new Date().toISOString()),
        dueDate: new Date(getFutureDate(2)),
        completed: true,
      };

      const dto = TodoMapper.toDto(todo);

      expect(dto).toBeInstanceOf(TodoResponseDto);
      expect(dto.id).toBe(todo.id);
      expect(dto.description).toBe(todo.description);
      expect(dto.createdAt).toBe(todo.createdAt.toISOString());
      expect(dto.dueDate).toBe(todo.dueDate && todo.dueDate.toISOString());
      expect(dto.completed).toBe(todo.completed);
    });

    it('should handle undefined optional fields in Todo entity', () => {
      const todo: Todo = {
        id: '1',
        description: 'Test Todo',
        createdAt: new Date(new Date().toISOString()),
        updatedAt: new Date(new Date().toISOString()),
        // dueDate is undefined
        completed: false,
      };

      const dto = TodoMapper.toDto(todo);

      expect(dto.dueDate).toBeUndefined(); // dueDate should be undefined
    });

    it('should default completed to false if undefined in Todo entity', () => {
      const todo: Todo = {
        id: '1',
        description: 'Test Todo',
        createdAt: new Date(new Date().toISOString()),
        updatedAt: new Date(new Date().toISOString()),
        // completed is undefined
      };

      const dto = TodoMapper.toDto(todo);

      expect(dto.completed).toBe(false); // completed should default to false
    });
  });
});
