import type { NestExpressApplication } from '@nestjs/platform-express';
import { CreateTodoRequestDto } from 'src/modules/todos/todos.dto';
import { TodosService } from 'src/modules/todos/todos.service';
import { getFutureDate, getPastDate, formatDate } from '../util/date.util';

export const seed = async (app: NestExpressApplication) => {
  const todosService = app.get(TodosService);

  /**
   * Ideally the seed should be running only on development mode
   * This is just for demo purpose
   */

  const todos = [{
    description: 'Buy groceries for the week',
    dueDate: getFutureDate(7),
  }, {
    description: 'Start reading the new novel',
  }, {
    description: 'Plan weekend trip to the mountains',
    dueDate: getPastDate(5),
  }, {
    description: 'Schedule a dentist appointment',
    dueDate: formatDate(new Date()),
    completed: true,
  }] as CreateTodoRequestDto[];

  for (const todo of todos) {
    await todosService.createTodo(todo);
  }
};
