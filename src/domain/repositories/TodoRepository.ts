import { CreateTodoDTO, Todo, UpdateTodoDTO } from "../entities/Todo";

// DEFINE LAS OPERACIONES QUE EXISTEN NO CMO SE IMPLEMENTAN
export interface TodoRepository{
    getAll(): Promise<Todo[]>
    getById(id:string): Promise<Todo | null>
    create(todo:CreateTodoDTO): Promise<Todo>
    update(todo:UpdateTodoDTO): Promise<Todo>
    delete(id:string): Promise<void>

}