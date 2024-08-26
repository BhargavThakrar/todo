import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  ValidationPipe,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import {
  CreateTodoRequestDto,
  FetchQueryParamsDto,
  PatchTodoRequestDto,
  TodoResponseDto,
} from './todos.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @ApiOperation({
    description: 'Fetch the full or filtered list of todos',
    summary: 'Fetch todos',
  })
  async fetchAllTodos(
    @Query(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    params?: FetchQueryParamsDto,
  ): Promise<TodoResponseDto[]> {
    return this.todosService.fetchAllTodos(params);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({
    description: 'Create a todo',
    summary: 'Create todo',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createTodo(
    @Body(new ValidationPipe()) params: CreateTodoRequestDto,
  ): Promise<TodoResponseDto> {
    return this.todosService.createTodo(params);
  }

  @Patch(':id')
  @ApiOperation({
    description: 'Patch a todo',
    summary: 'Patch todo',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async updateTodo(
    @Body(new ValidationPipe()) params: PatchTodoRequestDto,
    @Param('id') id: string,
  ): Promise<TodoResponseDto> {
    return this.todosService.updateTodo(id, params);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    description: 'Delete a todo',
    summary: 'Delete todo',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async deleteTodo(@Param('id') id: string): Promise<void> {
    return this.todosService.deleteTodo(id);
  }
}
