// ========================================
// 🔍 MONITOR ESP32 - DETECTOR DE DESCONEXIÓN
// ========================================
// Este archivo detecta cuando el ESP32 deja de enviar datos
// y actualiza automáticamente el estado a "offline"

import { leerEstadoGeneral } from './read.js';
import { actualizarCampoEstadoGeneral } from './write.js';

// Variable para guardar la última marca de tiempo
let ultimaMarcaTiempo = null;
let monitoreoActivo = false;

// ========================================
// ⏰ OBTENER FECHA Y HORA DE BOLIVIA
// ========================================
function obtenerFechaBolivia() {
  const ahora = new Date();
  
  // Bolivia está en UTC-4
  const boliviaOffset = -4 * 60; // -4 horas en minutos
  const offsetLocal = ahora.getTimezoneOffset(); // Offset de tu zona local
  const offsetTotal = offsetLocal + boliviaOffset;
  
  // Calcular hora de Bolivia
  const boliviaTime = new Date(ahora.getTime() - (offsetTotal * 60 * 1000));
  
  const año = boliviaTime.getFullYear();
  const mes = String(boliviaTime.getMonth() + 1).padStart(2, '0');
  const dia = String(boliviaTime.getDate()).padStart(2, '0');
  const hora = String(boliviaTime.getHours()).padStart(2, '0');
  const minutos = String(boliviaTime.getMinutes()).padStart(2, '0');
  
  // Formato: "2025-11-17,12:45"
  return `${año}-${mes}-${dia},${hora}:${minutos}`;
}

// ========================================
// 🚨 ACTUALIZAR ESTADO A OFFLINE
// ========================================
async function marcarComoOffline() {
  console.log('⚠️ ESP32 DESCONECTADO - Actualizando estado...');
  
  const fechaOffline = obtenerFechaBolivia();
  
  // Actualizar estado
  const resultadoEstado = await actualizarCampoEstadoGeneral('estado', 'offline');
  
  // Actualizar fecha_offline
  const resultadoFecha = await actualizarCampoEstadoGeneral('fecha_offline', fechaOffline);
  
  if (resultadoEstado.success && resultadoFecha.success) {
    console.log('✅ Estado actualizado a OFFLINE');
    console.log('📅 Fecha offline:', fechaOffline);
  } else {
    console.error('❌ Error al actualizar estado offline');
    if (!resultadoEstado.success) {
      console.error('   Error en estado:', resultadoEstado.error);
    }
    if (!resultadoFecha.success) {
      console.error('   Error en fecha:', resultadoFecha.error);
    }
  }
}

// ========================================
// 🔄 VERIFICAR CAMBIOS EN MARCA_TIEMPO
// ========================================
async function verificarConexion(marcaTiempoActual) {
  // Esperar 30 segundos
  await new Promise(resolve => setTimeout(resolve, 20000));
  
  console.log('🔍 Verificando si ESP32 sigue conectado...');
  console.log('   Marca anterior:', ultimaMarcaTiempo);
  console.log('   Marca actual:', marcaTiempoActual);
  
  // Si la marca de tiempo NO cambió = ESP32 desconectado
  if (ultimaMarcaTiempo === marcaTiempoActual) {
    console.log('⚠️ Marca de tiempo SIN CAMBIOS - ESP32 desconectado');
    await marcarComoOffline();
  } else {
    console.log('✅ Marca de tiempo CAMBIÓ - ESP32 conectado');
  }
}

// ========================================
// 🎬 INICIAR MONITOREO
// ========================================
export function iniciarMonitoreoESP32() {
  if (monitoreoActivo) {
    console.log('⚠️ El monitoreo ya está activo');
    return;
  }
  
  console.log('🚀 Iniciando monitoreo del ESP32...');
  monitoreoActivo = true;
  
  // Escuchar cambios en estado_general
  leerEstadoGeneral((datos) => {
    if (!datos) {
      console.log('⚠️ No hay datos de estado_general');
      return;
    }
    
    const { marca_tiempo, estado } = datos;
    
    // SOLO verificar si el estado es "online"
    if (estado !== 'online') {
      console.log('ℹ️ Estado actual:', estado, '- No se verifica conexión');
      return;
    }
    
    console.log('📡 Nueva marca de tiempo recibida:', marca_tiempo);
    
    // Guardar la marca de tiempo anterior
    const marcaTiempoAnterior = ultimaMarcaTiempo;
    
    // Actualizar a la nueva
    ultimaMarcaTiempo = marca_tiempo;
    
    // Si es el primer valor, no verificar aún
    if (marcaTiempoAnterior === null) {
      console.log('ℹ️ Primera lectura, esperando próximo cambio...');
      return;
    }
    
    // Iniciar verificación (espera 30s y compara)
    verificarConexion(marca_tiempo);
  });
  
  console.log('✅ Monitor activo - Escuchando cambios en marca_tiempo');
}

// ========================================
// 🛑 DETENER MONITOREO (opcional)
// ========================================
export function detenerMonitoreoESP32() {
  monitoreoActivo = false;
  ultimaMarcaTiempo = null;
  console.log('🛑 Monitoreo detenido');
}