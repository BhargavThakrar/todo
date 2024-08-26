import { TODO_REPOSITORY_TOKEN } from '@lib/database/constants';
import { Todo } from '@lib/database/entities/todo.entity';
import { TodoRepository } from '@lib/database/repositories/todo.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateTodoRequestDto,
  FetchQueryParamsDto,
  PatchTodoRequestDto,
} from './todos.dto';
import { TodoMapper } from './todos.mapper';
import { SortOrder } from './types';

@Injectable()
export class TodosService {
  constructor(
    @Inject(TODO_REPOSITORY_TOKEN)
    private readonly todoRepository: TodoRepository,
  ) {}

  private async findOneById(id: string): Promise<Todo> {
    const todo = await this.todoRepository.repository.findOne({
      where: { id },
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async fetchAllTodos(params?: FetchQueryParamsDto) {
    const { completed, sortBy } = params || {};
    const filter: Partial<Todo> = {};
    const order: Partial<Record<keyof Todo, SortOrder>> = {};

    // Apply filtering based on the `completed` parameter
    if (typeof completed !== 'undefined') {
      filter.completed = completed.toLowerCase() === 'true';
    }

    // Apply ordering based on the `sortBy` parameter which has the following format - ?sortBy=dueDate:asc
    if (sortBy) {
      sortBy.split(',').forEach((field) => {
        const [sortKey, sortOrder] = field.split(':') as [
          keyof Todo,
          SortOrder,
        ];
        order[sortKey] = sortOrder;
      });
    } else {
      order.createdAt = 'desc';
    }

    const todos = await this.todoRepository.repository.find({
      where: filter,
      order,
    });

    if (Array.isArray(todos) && todos.length) {
      return todos.map(TodoMapper.toDto);
    }

    return [];
  }

  async createTodo(todoDto: CreateTodoRequestDto) {
    const todo = await this.todoRepository.repository.save(
      TodoMapper.toModel(todoDto),
    );
    return TodoMapper.toDto(todo);
  }

  async updateTodo(id: string, todoDto: PatchTodoRequestDto) {
    const todo = await this.findOneById(id);

    const updatedTodo = await this.todoRepository.repository.save(
      TodoMapper.toModel(todoDto, todo),
    );
    return TodoMapper.toDto(updatedTodo);
  }

  async deleteTodo(id: string) {
    const todo = await this.findOneById(id);
    await this.todoRepository.repository.remove(todo);
    return;
  }
}
