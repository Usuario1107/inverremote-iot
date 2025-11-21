// src/app/read.js
// Funciones para LEER datos de Firebase Realtime Database

import { database } from './firebase.js';
import { ref, onValue, get } from "firebase/database";

// ========================================
// 📊 LEER SENSORES (tiempo real)
// ========================================
export function leerSensores(callback) {
  const sensoresRef = ref(database, 'invernadero/sensores');
  
  // Escuchar cambios en tiempo real
  onValue(sensoresRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('📊 Datos de sensores:', data);
      callback(data); // Llamar función que pasaste como parámetro
    } else {
      console.log('⚠️ No hay datos de sensores');
      callback(null);
    }
  }, (error) => {
    console.error('❌ Error al leer sensores:', error);
  });
}

// ========================================
// ⚙️ LEER CONFIGURACIÓN (tiempo real)
// ========================================
export function leerConfiguracion(callback) {
  const configRef = ref(database, 'invernadero/configuracion');
  
  // Escuchar cambios en tiempo real
  onValue(configRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('⚙️ Datos de configuración:', data);
      callback(data);
    } else {
      console.log('⚠️ No hay datos de configuración');
      callback(null);
    }
  }, (error) => {
    console.error('❌ Error al leer configuración:', error);
  });
}

// ========================================
// 📡 LEER ESTADO GENERAL (tiempo real)
// ========================================
export function leerEstadoGeneral(callback) {
  const estadoRef = ref(database, 'invernadero/estado_general');
  
  // Escuchar cambios en tiempo real
  onValue(estadoRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('📡 Estado general:', data);
      callback(data);
    } else {
      console.log('⚠️ No hay datos de estado general');
      callback(null);
    }
  }, (error) => {
    console.error('❌ Error al leer estado general:', error);
  });
}

// ========================================
// 🔍 LEER TODO UNA SOLA VEZ (sin tiempo real)
// ========================================
export async function leerDatosCompletos() {
  const invernaderoRef = ref(database, 'invernadero');
  
  try {
    const snapshot = await get(invernaderoRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('🌱 Todos los datos del invernadero:', data);
      return data;
    } else {
      console.log('⚠️ No hay datos en invernadero');
      return null;
    }
  } catch (error) {
    console.error('❌ Error al leer datos completos:', error);
    return null;
  }
}

console.log('📖 Módulo read.js cargado correctamente');