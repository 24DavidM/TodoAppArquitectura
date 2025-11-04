import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { container } from "@/src/di/container";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
    const { user } = useAuth();
    const [name, setName] = useState(user?.displayName || "");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleSave = async () => {
        if (!name.trim() || name.trim().length < 2) {
            Alert.alert("Error", "El nombre debe tener al menos 2 caracteres");
            return;
        }
        setLoading(true);
        try {
            await container.authRepository.updateProfile(name.trim());
            Alert.alert("Éxito", "Perfil actualizado", [{ text: "OK", onPress: () => router.back() }]);
        } catch (err: any) {
            Alert.alert("Error", err?.message || "No se pudo actualizar el perfil");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>No hay usuario autenticado</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{name.charAt(0).toUpperCase() || "U"}</Text>
                </View>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
            </View>

            {/* Email Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>✉️</Text>
                    </View>
                    <Text style={styles.label}>Correo electrónico</Text>
                </View>
                <Text style={styles.value}>{user.email}</Text>
            </View>

            {/* Name Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>👤</Text>
                    </View>
                    <Text style={styles.label}>Nombre de usuario</Text>
                </View>
                <TextInput 
                    value={name} 
                    onChangeText={setName} 
                    style={styles.input}
                    placeholder="Ingresa tu nombre"
                    placeholderTextColor="#999"
                />
            </View>

            {/* Created Date Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>📅</Text>
                    </View>
                    <Text style={styles.label}>Registrado desde</Text>
                </View>
                <Text style={styles.value}>{formatDate(user.createdAt)}</Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleSave} 
                disabled={loading}
                activeOpacity={0.8}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <Text style={styles.buttonText}>Guardar cambios</Text>
                    </>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#f8f9fa" 
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40
    },
    center: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#f8f9fa"
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        fontWeight: "500"
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
        marginTop: 10
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#3480c7ff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5
    },
    avatarText: {
        fontSize: 36,
        color: "#fff",
        fontWeight: "bold"
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1a1a1a"
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12
    },
    iconContainer: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },
    icon: {
        fontSize: 16
    },
    label: { 
        fontSize: 14, 
        color: "#666",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5
    },
    value: { 
        fontSize: 17, 
        color: "#1a1a1a",
        fontWeight: "500",
        lineHeight: 24
    },
    input: { 
        backgroundColor: "#f8f9fa", 
        padding: 14, 
        borderRadius: 10,
        fontSize: 17,
        color: "#1a1a1a",
        borderWidth: 1.5, 
        borderColor: "#e0e0e0",
        fontWeight: "500"
    },
    button: { 
        backgroundColor: "#3480c7ff",
        padding: 18, 
        borderRadius: 14, 
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#34C759",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5
    },
    buttonDisabled: { 
        backgroundColor: "#999",
        shadowOpacity: 0.1
    },
    buttonText: { 
        color: "#fff", 
        fontWeight: "bold",
        fontSize: 17,
        letterSpacing: 0.3
    }
});