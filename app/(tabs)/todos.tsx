import { useTodosController } from "@/controllers/useTodosController";
import { Todo } from "@/models/Todo";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Componente principal de la pantalla de TODOS
export default function TodosScreen() {
    const { todos, addTodo, toggleTodo, deleteTodo } = useTodosController();
    const [inputText, setInputText] = useState("");

    // Función para renderizar un TODO
    const renderTodo = ({ item }: { item: Todo }) => (
        <View style={styles.todoItem}>
            {/* Botón para marcar como completado */}
            <TouchableOpacity
                style={styles.todoContent}
                onPress={() => toggleTodo(item.id)}
            >
                <View
                    style={[styles.checkbox, item.completed && styles.checkboxChecked]}
                >
                    {item.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>

                {/* Título del TODO  */}
                <Text
                    style={[styles.todoText, item.completed && styles.todoTextCompleted]}
                >
                    {item.title}
                </Text>
            </TouchableOpacity>

            {/* Botón para eliminar el TODO */}
            <TouchableOpacity
                onPress={() => deleteTodo(item.id)}
                style={styles.deleteButton}
            >
                <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Título principal */}
            <Text style={styles.title}>Mis Tareas</Text>

            {/* Sección para agregar una tarea */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Nueva tarea... xcddsadasd"
                    placeholderTextColor="#999"
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={async () => {
                        await addTodo(inputText);
                        setInputText("");
                    }}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de todos */}
            <FlatList
                data={todos}
                renderItem={renderTodo}
                keyExtractor={(item) => item.id.toString()}
                style={styles.list}
                contentContainerStyle={styles.listContent}
            />

            {/* Footer con estadísticas */}
            <Text style={styles.footer}>
                Total: {todos.length} | Completados:{" "}
                {todos.filter((t) => t.completed).length}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 20,
        marginTop: 40,
    },
    inputContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    input: {
        flex: 1,
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        marginRight: 10,
    },
    addButton: {
        backgroundColor: "#007AFF",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    addButtonText: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 20,
    },
    todoItem: {
        flexDirection: "row",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    todoContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#007AFF",
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxChecked: {
        backgroundColor: "#007AFF",
    },
    checkmark: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    todoText: {
        fontSize: 16,
        flex: 1,
    },
    todoTextCompleted: {
        textDecorationLine: "line-through",
        color: "#999",
    },
    deleteButton: {
        padding: 8,
    },
    deleteButtonText: {
        fontSize: 20,
    },
    footer: {
        textAlign: "center",
        color: "#666",
        marginTop: 10,
        fontSize: 14,
    },
});
