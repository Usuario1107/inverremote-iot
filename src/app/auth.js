// ========================================
// 🔥 FIREBASE AUTHENTICATION
// ========================================
// Este archivo maneja toda la autenticación de Firebase
// Importa 'firebase.js' automáticamente para usar la conexión

import { auth } from './firebase.js';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';

// ========================================
// 🔐 LOGIN CON EMAIL Y PASSWORD
// ========================================
export async function loginConEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Login exitoso con email:', user.email);
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email, // Si no tiene nombre, usa email
      },
      message: '¡Bienvenido! Has iniciado sesión correctamente.'
    };
    
  } catch (error) {
    console.error('❌ Error en login con email:', error);
    
    // Mensajes de error personalizados en español
    let errorMessage = 'Error al iniciar sesión';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No existe una cuenta con este correo';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Correo electrónico inválido';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Esta cuenta ha sido deshabilitada';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos. Intenta más tarde';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Error de conexión. Verifica tu internet';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña';
        break;
      default:
        errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
      errorCode: error.code
    };
  }
}

// ========================================
// 🔐 LOGIN CON GOOGLE (POPUP)
// ========================================
export async function loginConGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log('✅ Login exitoso con Google:', user.displayName);
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName, // Google siempre devuelve nombre
        photoURL: user.photoURL
      },
      message: `¡Bienvenido ${user.displayName}!`
    };
    
  } catch (error) {
    console.error('❌ Error en login con Google:', error);
    
    // Mensajes de error personalizados
    let errorMessage = 'Error al iniciar sesión con Google';
    
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = 'Cerraste la ventana de login';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'El navegador bloqueó la ventana emergente';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'Solicitud cancelada';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'Ya existe una cuenta con este correo usando otro método';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Error de conexión. Verifica tu internet';
        break;
      default:
        errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
      errorCode: error.code
    };
  }
}

// ========================================
// 🚪 CERRAR SESIÓN (LOGOUT)
// ========================================
export async function cerrarSesion() {
  try {
    await signOut(auth);
    console.log('✅ Sesión cerrada correctamente');
    
    return {
      success: true,
      message: 'Sesión cerrada correctamente'
    };
    
  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error);
    
    return {
      success: false,
      error: 'No se pudo cerrar la sesión',
      errorCode: error.code
    };
  }
}

// ========================================
// 👤 VERIFICAR USUARIO ACTUAL (OBSERVER)
// ========================================
// Esta función escucha cambios en el estado de autenticación
// Se ejecuta automáticamente cuando el usuario hace login/logout
export function verificarUsuario(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Usuario está logueado
      console.log('👤 Usuario detectado:', user.email);
      
      callback({
        isAuthenticated: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email,
          photoURL: user.photoURL
        }
      });
    } else {
      // Usuario NO está logueado
      console.log('🔓 No hay usuario autenticado');
      
      callback({
        isAuthenticated: false,
        user: null
      });
    }
  });
}

// ========================================
// 🔍 OBTENER USUARIO ACTUAL (SIN OBSERVER)
// ========================================
// Función para obtener el usuario actual sin escuchar cambios
export function obtenerUsuarioActual() {
  const user = auth.currentUser;
  
  if (user) {
    return {
      isAuthenticated: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email,
        photoURL: user.photoURL
      }
    };
  }
  
  return {
    isAuthenticated: false,
    user: null
  };
}