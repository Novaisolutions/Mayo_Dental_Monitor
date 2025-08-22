# 🔗 Integración Kommo CRM - Mayo Dental Monitor

## 📋 **Descripción General**

Este documento describe la integración del Monitor Mayo Dental con el CRM Kommo, permitiendo la sincronización bidireccional de datos entre el sistema de prospectos y el pipeline de ventas de Mayo Dental.

## 🎯 **Funcionalidades Principales**

### ✅ **Envío de Prospectos a Kommo**
- **Creación automática de leads** desde prospectos del monitor
- **Mapeo inteligente de datos** con cálculo automático de precios
- **Generación de contactos** asociados a cada lead
- **Sistema de tags automáticos** basado en datos del prospecto
- **Notas inteligentes** con resumen completo de información

### ✅ **Visualización de Datos Kommo**
- **Dashboard en tiempo real** del pipeline de Mayo Dental
- **Estadísticas de leads** y conversiones
- **Filtrado por estados** del pipeline
- **Información detallada** de cada lead

## 🏗️ **Arquitectura de la Integración**

### **Componentes Principales**

1. **`useKommo` Hook** - Lógica de comunicación con API Kommo
2. **`KommoView` Component** - Dashboard de visualización
3. **`ProspectosView` Component** - Envío de prospectos
4. **Proxy Vite** - Resolución de CORS para desarrollo local

### **Flujo de Datos**

```
Prospecto (Monitor) → Análisis IA → Mapeo Inteligente → Kommo API → Lead + Contacto + Notas
```

## 🔧 **Configuración Técnica**

### **Variables de Entorno**

```bash
VITE_KOMMO_ACCESS_TOKEN=tu_token_aqui
VITE_KOMMO_BASE_URL=https://bizmakermx.kommo.com
VITE_MAYO_DENTAL_PIPELINE_ID=10619619
```

### **Endpoints de API Utilizados**

- `GET /leads` - Obtener leads del pipeline
- `POST /leads` - Crear nuevo lead
- `POST /contacts` - Crear contacto asociado
- `GET /pipelines` - Obtener pipelines disponibles

### **Proxy de Desarrollo**

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api/kommo': {
      target: 'https://bizmakermx.kommo.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/kommo/, '')
    }
  }
}
```

## 📊 **Mapeo de Datos Prospecto → Kommo**

### **Campos Principales**

| Campo Prospecto | Campo Kommo | Lógica de Mapeo |
|----------------|-------------|------------------|
| `nombre` | `name` | Nombre descriptivo + tratamiento detectado |
| `numero_telefono` | `phone` | Campo personalizado de teléfono |
| `score_interes` | `tags` | Tags automáticos (ALTO/MEDIO/NORMAL) |
| `presupuesto_mencionado` | `price` | Precio directo o cálculo inteligente |
| `resumen_ia` | `notes` | Notas consolidadas del prospecto |

### **Cálculo Inteligente de Precios**

```typescript
const calculateDentalPrice = (prospecto) => {
  // 1. Usar presupuesto mencionado si existe
  if (prospecto.presupuesto_mencionado > 0) {
    return prospecto.presupuesto_mencionado;
  }
  
  // 2. Detectar tratamientos y asignar precios
  const treatmentPrices = {
    'limpieza': 800,
    'implante': 18000,
    'ortodoncia': 25000,
    // ... más tratamientos
  };
  
  // 3. Fallback basado en score de interés
  if (prospecto.score_interes > 80) return 15000;
  if (prospecto.score_interes > 60) return 8000;
  return 3000;
};
```

### **Generación de Tags Automáticos**

```typescript
const autoTags = [
  // Basado en score
  prospecto.score_interes > 80 ? 'ALTO INTERÉS' : 'NORMAL',
  
  // Basado en urgencia
  prospecto.urgencia_detectada?.includes('alta') ? 'URGENTE' : null,
  
  // Basado en carrera
  prospecto.carrera_interes?.toUpperCase(),
  
  // Tags estáticos
  'NUEVO', 'MAYO DENTAL'
].filter(Boolean);
```

## 🚀 **Proceso de Envío a Kommo**

### **Paso 1: Creación de Contacto**
```typescript
const contactData = {
  name: prospecto.nombre,
  phone: prospecto.numero_telefono,
  custom_fields: [
    {
      field_id: 859046, // Tipo de contacto
      values: [{ enum_id: 714886 }] // "Prospecto"
    }
  ]
};

const contact = await createContact(contactData);
```

### **Paso 2: Creación del Lead**
```typescript
const leadData = {
  name: `${prospecto.nombre} - Mayo Dental`,
  price: estimatedPrice,
  status_id: selectedStatus.id,
  pipeline_id: 10619619,
  tags: autoTags,
  contact_id: contact.id,
  notes: smartNotes
};

const lead = await createLead(leadData);
```

### **Paso 3: Manejo de Errores y Reintentos**
```typescript
// Intentar con diferentes status si falla
const statusesToTry = [statuses[1], statuses[0], statuses[2]];
let leadCreated = false;

for (const status of statusesToTry) {
  try {
    await createLead({ ...leadData, status_id: status.id });
    leadCreated = true;
    break;
  } catch (error) {
    console.log(`Falló con status ${status.name}`);
  }
}
```

## 📱 **Interfaz de Usuario**

### **Vista de Prospectos**
- Botón "Enviar a Kommo" en cada prospecto
- Indicador de estado de envío
- Confirmación de éxito con detalles del lead creado

### **Dashboard Kommo**
- Estadísticas en tiempo real
- Visualización del pipeline por estados
- Lista de leads con información detallada
- Filtros y navegación intuitiva

## 🔍 **Solución de Problemas**

### **Error 400: Campo Personalizado Inválido**
- **Causa**: ID de campo personalizado incorrecto para el pipeline
- **Solución**: Eliminar campos personalizados problemáticos o ajustar IDs

### **Error 404: Endpoint de Notas**
- **Causa**: Endpoint `/notes` no disponible en esta instancia de Kommo
- **Solución**: Usar estrategias alternativas (eventos, tareas, descripción)

### **Problemas de CORS en Desarrollo**
- **Causa**: Restricciones de CORS en navegador
- **Solución**: Configurar proxy en Vite para desarrollo local

## 📈 **Métricas y Monitoreo**

### **Datos de Rendimiento**
- Tiempo de respuesta de API Kommo
- Tasa de éxito en creación de leads
- Número de prospectos enviados por día
- Errores y reintentos necesarios

### **Logs de Debug**
```typescript
console.log('=== ANÁLISIS DE LEADS EXISTENTES ===');
console.log('=== DEBUG PIPELINES ===');
console.log('=== MAPEO DE DATOS PROSPECTO → KOMMO ===');
console.log('=== 🚀 LEAD DATA COMPLETO A ENVIAR ===');
```

## 🔮 **Mejoras Futuras**

1. **Sincronización Bidireccional** - Actualizar prospectos desde Kommo
2. **Webhooks** - Notificaciones en tiempo real de cambios en Kommo
3. **Mapeo de Campos Personalizados** - Detección automática de IDs válidos
4. **Historial de Sincronización** - Log de todas las operaciones realizadas
5. **Validación de Datos** - Verificación antes del envío a Kommo

## 📚 **Referencias**

- [Documentación API Kommo](https://www.kommo.com/developers)
- [Guía de Integración](https://www.kommo.com/developers/api)
- [Campos Personalizados](https://www.kommo.com/developers/api/custom_fields)

---

**Desarrollado por Novai Solutions**  
**Versión**: 1.0.0  
**Última actualización**: Agosto 2025