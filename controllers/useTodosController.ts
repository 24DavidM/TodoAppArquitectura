import { Todo } from "@/models/Todo";
import { todoRepository } from "@/repositories/todoRepository";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

// Controlador para manejar la logica de los TODOS
export function useTodosController() {
    // Estado para almacenar los TODOS
    const [todos, setTodos] = useState<Todo[]>([])

    // Efecto para cargar los TODOS al iniciar el componente
    useEffect(() => {
        // Cargamos los TODOS desde el repositorio
        (async () => {
            // Manejo de errores si falla la carga de los TODOS
            try {
                // Obtenemos los TODOS desde el repositorio
                const data = await todoRepository.getAll()
                // Almacenamos los todos en el estados
                setTodos(data)
            } catch (e) {
                // Mostramos una alerta en caso de error
                console.error(e)
                Alert.alert("Error", "No se pudieron cargar los TODOS")
            }
        })()
    }, [])

    // Funcion para agregar un nuevo TODO
    const addTodo = async (title: string) => {
        // Validamos que el titulo no este vacio
        if (!title.trim()) return
        // Manejo de errores al agregar un nuevo TODO
        try {
            // Agrregamos el TODO mediante el repositorio
            const created = await todoRepository.add(title)
            // Actualizamos el estado con el nuevo TODO
            setTodos(prev => [created, ...prev])
        } catch (e) {
            // Mostramos una alerta en caso de error
            console.error(e)
            Alert.alert("Error", "No se pudo agregar el TODO")
        }
    }

    // Funcion para alternar el estado completado de un TODO
    const toggleTodo = async (id: number) => {
        // Buscamos el TODO actual
        const current = todos.find(t => t.id === id)
        // Si no existe salimos
        if (!current) return
        // Calculamos el nuevo estado
        const next = !current.completed
        // Manejo de erorres para actualizar el TODO
        try {
            // Actualizamos el TODO mediante el repositorio
            await todoRepository.updateCompleted(id, next)
            // Actualizamos el estado con el nuevo valor
            setTodos(prev => prev.map((t) => (t.id === id ? { ...t, completed: next } : t)))
        } catch (e) {
            // Mostramos una alerta en caso de error
            console.error(e)
            Alert.alert("Error", "No se pudo actualizar el TODO")
        }
    }

    // Funcion para eliminar un TODO
    const deleteTodo = async (id: number) => {
        try {
            // Eliminamos el TODO mediante el repositorio
            await todoRepository.remove(id)
            // Actualizamos el estado eliminando el TODO
            setTodos(prev => prev.filter(t => t.id !== id))
        } catch (e) {
            // Mostramos una alerta en caso de error
            console.error(e)
            Alert.alert("Error", "No se pudo eliminar el TODO")
        }
    }

    // Retormamos los datos y funcionalidades del controlador
    return { todos, addTodo, toggleTodo, deleteTodo }
}