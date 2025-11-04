import { User } from "../entities/User";
export interface AuthRepository {
    // Registrar nuevo usuario con datos adicionales
    register(
        email: string,
        password: string,
        displayName: string
    ): Promise<User>;
    login(email: string, password: string): Promise<User>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
    onAuthStateChanged(callback: (user: User | null) => void): () => void;
    updateProfile(displayName: string): Promise<User>;
    sendPasswordReset(email: string): Promise<void>;
}