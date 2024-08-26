import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import {
  CreateTodoRequestDto,
  PatchTodoRequestDto,
  TodoResponseDto,
} from './todos.dto';

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  // Mock the TodosService
  const mockTodosService = {
    fetchAllTodos: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  describe('fetchAllTodos', () => {
    it('should return an array of todos', async () => {
      const result: TodoResponseDto[] = [
        {
          id: '1',
          description: 'Test Todo',
          createdAt: new Date().toISOString(),
          dueDate: new Date().toISOString(),
          completed: false,
        },
      ];

      jest.spyOn(service, 'fetchAllTodos').mockResolvedValue(result);

      expect(await controller.fetchAllTodos()).toBe(result);
    });
  });

  describe('createTodo', () => {
    it('should create and return a todo', async () => {
      const dto: CreateTodoRequestDto = { description: 'New Todo' };
      const result: TodoResponseDto = {
        id: '1',
        description: 'New Todo',
        createdAt: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        completed: false,
      };

      jest.spyOn(service, 'createTodo').mockResolvedValue(result);

      expect(await controller.createTodo(dto)).toBe(result);
    });
  });

  describe('updateTodo', () => {
    it('should update and return a todo', async () => {
      const dto: PatchTodoRequestDto = { description: 'Updated Todo' };
      const result: TodoResponseDto = {
        id: '1',
        description: 'Updated Todo',
        createdAt: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        completed: false,
      };

      jest.spyOn(service, 'updateTodo').mockResolvedValue(result);

      expect(await controller.updateTodo(dto, '1')).toBe(result);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      jest.spyOn(service, 'deleteTodo').mockResolvedValue(undefined);

      await expect(controller.deleteTodo('1')).resolves.toBeUndefined();
    });
  });
});
