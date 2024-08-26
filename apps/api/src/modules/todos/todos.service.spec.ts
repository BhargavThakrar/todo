import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { TodoRepository } from '@lib/database/repositories/todo.repository';
import { Todo } from '@lib/database/entities/todo.entity';
import { DataSource } from 'typeorm';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import {
  CreateTodoRequestDto,
  FetchQueryParamsDto,
  PatchTodoRequestDto,
} from './todos.dto';
import { TODO_REPOSITORY_TOKEN } from '@lib/database/constants';
import { getTestDatabaseConfig } from '../../test/ormconfig.test';

describe('TodosService', () => {
  let service: TodosService;
  let todoRepository: TodoRepository;
  let dataSource: DataSource;

  const todoRepositoryProvider = {
    provide: TODO_REPOSITORY_TOKEN,
    useClass: TodoRepository,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getTestDatabaseConfig()),
        TypeOrmModule.forFeature([Todo]),
      ],
      providers: [todoRepositoryProvider, TodosService],
      exports: [todoRepositoryProvider],
    }).compile();

    service = module.get<TodosService>(TodosService);
    todoRepository = module.get(TODO_REPOSITORY_TOKEN);
    dataSource = module.get<DataSource>(getDataSourceToken());

    // Seed data
    await todoRepository.repository.save([
      {
        description: 'First Todo',
        dueDate: new Date('2024-01-01'),
        completed: false,
      },
      {
        description: 'Second Todo',
        dueDate: new Date('2024-02-01'),
        completed: true,
      },
    ]);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should fetch all todos', async () => {
    const todos = await service.fetchAllTodos();
    expect(todos).toHaveLength(2);
    expect(todos[0].description).toBe('First Todo');
    expect(todos[1].description).toBe('Second Todo');
  });

  it('should fetch todos with filter', async () => {
    const params: FetchQueryParamsDto = { completed: 'true' };
    const todos = await service.fetchAllTodos(params);
    expect(todos).toHaveLength(1);
    expect(todos[0].description).toBe('Second Todo');
  });

  it('should fetch todos with sorting', async () => {
    const params: FetchQueryParamsDto = { sortBy: 'dueDate:desc' };
    const todos = await service.fetchAllTodos(params);
    expect(todos).toHaveLength(2);
    expect(todos[0].description).toBe('Second Todo');
    expect(todos[1].description).toBe('First Todo');
  });

  it('should create a new todo', async () => {
    const dto: CreateTodoRequestDto = { description: 'New Todo' };
    const todo = await service.createTodo(dto);
    expect(todo.description).toBe('New Todo');
    const todos = await todoRepository.repository.find();
    expect(todos).toHaveLength(3); // Two existing todos plus the new one
  });

  it('should update an existing todo', async () => {
    const todos = await todoRepository.repository.find();
    const existingTodo = todos[0];
    const dto: PatchTodoRequestDto = { description: 'Updated Todo' };
    const updatedTodo = await service.updateTodo(existingTodo.id, dto);
    expect(updatedTodo.description).toBe('Updated Todo');
  });

  it('should delete a todo', async () => {
    const todos = await todoRepository.repository.find();
    const todoToDelete = todos[0];
    await service.deleteTodo(todoToDelete.id);
    const remainingTodos = await todoRepository.repository.find();
    expect(remainingTodos).toHaveLength(2); // Should be 2 remaining todos
  });
});
