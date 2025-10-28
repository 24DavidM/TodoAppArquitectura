// 🟢 DEPENDENCY INJECTION: Aquí se conectan todas las piezas
// Este es el único lugar que conoce las implementaciones concretas
 
import { SQLiteTodoDataSource } from '@/src/data/datasources/SQLiteTodoDataSource';
import { TodoRepositoryImpl } from '@/src/data/repositories/TodoRepositoryImpl';
import { CreateTodo } from '@/src/domain/usecases/CreateTodo';
import { DeleteTodo } from '@/src/domain/usecases/DeleteTodo';
import { GetAllTodos } from '../domain/usecases/GetAllTodo';
import { ToogleTodo } from '../domain/usecases/ToogleTodo';
 
// 🟢 Singleton para mantener una sola instancia
class DIContainer {
  private static instance: DIContainer;
  private _dataSource: SQLiteTodoDataSource | null = null;
  private _repository: TodoRepositoryImpl | null = null;
 
  private constructor() {}
 
  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }
 
  async initialize(): Promise<void> {
    this._dataSource = new SQLiteTodoDataSource();
    await this._dataSource.initialize();
    this._repository = new TodoRepositoryImpl(this._dataSource);
  }
 
  // 🟢 Use Cases - cada uno recibe el repository
  //Cada caso de uso necesita un repository para acceder a los datos
  get getAllTodos(): GetAllTodos {
    if (!this._repository) throw new Error('Container not initialized');
    return new GetAllTodos(this._repository);
  }
 
  get createTodo(): CreateTodo {
    if (!this._repository) throw new Error('Container not initialized');
    return new CreateTodo(this._repository);
  }
 
  get toggleTodo(): ToogleTodo {
    if (!this._repository) throw new Error('Container not initialized');
    return new ToogleTodo(this._repository);
  }
 
  get deleteTodo(): DeleteTodo {
    if (!this._repository) throw new Error('Container not initialized');
    return new DeleteTodo(this._repository);
  }
}
 
export const container = DIContainer.getInstance();