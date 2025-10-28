import { getDatabase } from '@/data/db';
import { Todo } from '@/models/Todo';

// Mapeamos una fila de la bd a un objecto TODO
function mapRow(row: any): Todo {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
    createdAt: row.createdAt, 
  };
}

// Repositorio para manejar las operaciones de la tabla de TODOS
export const todoRepository = {
  // Obtenemos todos los TODOS
  async getAll(): Promise<Todo[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<any>(
      'SELECT * FROM todos ORDER BY createdAt DESC'
    );
    return rows.map(mapRow);
  },

  // Creamos un nuevo TODO
  async add(title: string): Promise<Todo> {
    const db = await getDatabase();
    const createdAt = new Date().toISOString(); // ✅ corregido
    const result = await db.runAsync(
      'INSERT INTO todos (title, completed, createdAt) VALUES (?, ?, ?)',
      title.trim(),
      0,
      createdAt
    );
    return {
      id: result.lastInsertRowId,
      title: title.trim(),
      completed: false,
      createdAt, 
    };
  },

  // Actualizamos un TODO existente
  async updateCompleted(id: number, completed: boolean): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      'UPDATE todos SET completed = ? WHERE id = ?',
      completed ? 1 : 0,
      id
    );
  },

  // Eliminamos un TODO por su ID
  async remove(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM todos WHERE id = ?', id);
  },
};
