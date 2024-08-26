import { Todo } from '@lib/database/entities/todo.entity';
import {
  CreateTodoRequestDto,
  PatchTodoRequestDto,
  TodoResponseDto,
} from './todos.dto';

export class TodoMapper {
  static toModel(
    todoDto: CreateTodoRequestDto | PatchTodoRequestDto,
    todoModel?: Todo,
  ): Todo {
    const todo = todoModel || new Todo();

    if (todoDto.description) {
      todo.description = todoDto.description;
    }
    if (todoDto.dueDate) {
      todo.dueDate = new Date(todoDto.dueDate);
    }
    if (typeof todoDto.completed !== 'undefined') {
      todo.completed = todoDto.completed;
    }

    return todo;
  }

  static toDto(todo: Todo): TodoResponseDto {
    const todoDto = new TodoResponseDto();

    todoDto.id = todo.id;
    todoDto.description = todo.description;
    todoDto.createdAt = todo.createdAt?.toISOString();
    todoDto.dueDate = todo.dueDate?.toISOString();
    todoDto.completed = todo?.completed ?? false;

    return todoDto;
  }
}
