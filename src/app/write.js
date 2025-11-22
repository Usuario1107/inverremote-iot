// ========================================
// 🔥 FIREBASE WRITE (ESCRITURA)
// ========================================
// Este archivo maneja la ESCRITURA de datos en Firebase Realtime Database
// Solo usuarios autenticados pueden escribir

import { database } from './firebase.js';
import { ref, set, update } from 'firebase/database';
import { obtenerUsuarioActual } from './auth.js';

// ========================================
// 💾 GUARDAR CONFIGURACIÓN COMPLETA
// ========================================
// Guarda TODO el objeto de configuración
export async function guardarConfiguracion(configuracion) {
  // 1. Verificar autenticación
  const authState = obtenerUsuarioActual();
  
  if (!authState.isAuthenticated) {
    console.error('❌ Usuario no autenticado');
    return {
      success: false,
      error: 'Debes iniciar sesión para guardar cambios',
      errorCode: 'auth/not-authenticated'
    };
  }
  
  try {
    // 2. Referencia a la ruta en Firebase
    const configRef = ref(database, 'invernadero/configuracion');
    
    // 3. Guardar datos
    await set(configRef, configuracion);
    
    console.log('✅ Configuración guardada exitosamente');
    
    return {
      success: true,
      message: 'Configuración guardada correctamente'
    };
    
  } catch (error) {
    console.error('❌ Error al guardar configuración:', error);
    
    // Mensajes de error personalizados
    let errorMessage = 'Error al guardar la configuración';
    
    switch (error.code) {
      case 'PERMISSION_DENIED':
        errorMessage = 'No tienes permisos para modificar la configuración';
        break;
      case 'permission-denied':
        errorMessage = 'Tu cuenta no está autorizada para escribir datos';
        break;
      case 'NETWORK_ERROR':
        errorMessage = 'Error de conexión. Verifica tu internet';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Error de red al conectar con Firebase';
        break;
      default:
        errorMessage = error.message || 'Error desconocido al guardar';
    }
    
    return {
      success: false,
      error: errorMessage,
      errorCode: error.code
    };
  }
}

// ========================================
// 📝 ACTUALIZAR UN CAMPO ESPECÍFICO
// ========================================
// Actualiza solo UN campo sin sobrescribir los demás
export async function actualizarCampoConfiguracion(campo, valor) {
  // 1. Verificar autenticación
  const authState = obtenerUsuarioActual();
  
  if (!authState.isAuthenticated) {
    console.error('❌ Usuario no autenticado');
    return {
      success: false,
      error: 'Debes iniciar sesión para guardar cambios',
      errorCode: 'auth/not-authenticated'
    };
  }
  
  try {
    // 2. Referencia a la ruta en Firebase
    const configRef = ref(database, 'invernadero/configuracion');
    
    // 3. Crear objeto con el campo a actualizar
    const updates = {
      [campo]: valor
    };
    
    // 4. Actualizar solo ese campo
    await update(configRef, updates);
    
    console.log(`✅ Campo '${campo}' actualizado a: ${valor}`);
    
    return {
      success: true,
      message: `${campo} actualizado correctamente`,
      campo: campo,
      valor: valor
    };
    
  } catch (error) {
    console.error(`❌ Error al actualizar ${campo}:`, error);
    
    // Mensajes de error personalizados
    let errorMessage = 'Error al guardar el cambio';
    
    switch (error.code) {
      case 'PERMISSION_DENIED':
        errorMessage = 'No tienes permisos para modificar la configuración';
        break;
      case 'permission-denied':
        errorMessage = 'Tu cuenta no está autorizada para escribir datos';
        break;
      case 'NETWORK_ERROR':
        errorMessage = 'Error de conexión. Verifica tu internet';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Error de red al conectar con Firebase';
        break;
      default:
        errorMessage = error.message || 'Error desconocido al guardar';
    }
    
    return {
      success: false,
      error: errorMessage,
      errorCode: error.code
    };
  }
}

// ========================================
// 🔧 FUNCIONES ESPECÍFICAS POR CAMPO
// ========================================
// Estas funciones facilitan el guardado de cada campo específico

export async function guardarDuracionMinutos(minutos) {
  return await actualizarCampoConfiguracion('duracion_minutos', Number(minutos));
}

export async function guardarHoraProgramada(hora) {
  return await actualizarCampoConfiguracion('hora_programada', hora);
}

export async function guardarUmbralHumedad(porcentaje) {
  return await actualizarCampoConfiguracion('humedad_umbral_activacion', Number(porcentaje));
}

export async function guardarTempMaxVentilador(temperatura) {
  return await actualizarCampoConfiguracion('max_temp_ventilador', Number(temperatura));
}

export async function guardarTempMinLuz(temperatura) {
  return await actualizarCampoConfiguracion('min_temp_luz', Number(temperatura));
}