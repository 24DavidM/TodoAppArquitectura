import * as SQLite from 'expo-sqlite'

// Variable para almacenar la instancia de la bd
let instace: SQLite.SQLiteDatabase | null = null;

// Inicializa la base de datos y crea la tabla
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    // Si ya existe una instancia la retorna
    if (instace) return instace;
    // Si no existe crea una 
    const db = await SQLite.openDatabaseAsync('todos.db');
    // Configuramos el jaurnal model a WAL y creamos la tabla si no existe
    await db.execAsync(`
        PRAGMA journal_mode=WAL;
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            createdAt TEXT NOT NULL
        );
    `);
    // Guardamos la instancia y la retornamos
    instace = db;
    return db;
}
