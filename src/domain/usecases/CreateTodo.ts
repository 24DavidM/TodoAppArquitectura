import { CreateTodoDTO, Todo } from "../entities/Todo";
import { TodoRepository } from "../repositories/TodoRepository";

export class CreateTodo {
    constructor(private repository: TodoRepository) { }

    async execute(data: CreateTodoDTO): Promise<Todo> {

        // AQUI SE PUEDE REALIZAR LAS VALIDACIONES DE NEGOCIO
        if (!data.title.trim()) {
            throw new Error("El titulo no puede estar  vacio")
        }
        if (data.title.length > 200) {
            throw new Error("El titulo es demasiado largo")
        }
        return await this.repository.create(data)

    }

}