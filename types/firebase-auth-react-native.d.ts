declare module 'firebase/auth/react-native' {
  // Minimal declaration for getReactNativePersistence to satisfy TypeScript.
  // Adjust `any` to more precise types if your firebase version exposes them.
  export function getReactNativePersistence(storage: any): any;
}
