# 🔌 Integración Kommo CRM - Mayo Dental Monitor

## 📋 Descripción

Este documento describe la integración del sistema Mayo Dental Monitor con el CRM Kommo, permitiendo la visualización y gestión de leads en tiempo real.

## ✨ Funcionalidades Implementadas

### 🎯 **Visualización de Leads**
- Dashboard completo de leads del pipeline de Mayo Dental
- Estadísticas en tiempo real (total de leads, valor promedio, tasa de conversión)
- Filtrado por status y pipeline
- Paginación automática para grandes volúmenes de datos

### 📊 **Gestión de Prospectos**
- Envío automático de prospectos como nuevos leads a Kommo
- Creación automática de contactos asociados
- Mapeo inteligente de datos del prospecto
- Cálculo automático de precios basado en tratamientos detectados

### 🏷️ **Sistema de Tags Automáticos**
- Tags basados en score de interés
- Tags de urgencia detectada
- Tags de carrera/plantel de interés
- Tags estáticos (NUEVO, MAYO DENTAL)

## 🛠️ Configuración Técnica

### **Variables de Entorno**
```bash
VITE_KOMMO_ACCESS_TOKEN=tu_token_aqui
VITE_KOMMO_BASE_URL=https://bizmakermx.kommo.com/api/v4
```

### **Pipeline ID**
- **Mayo Dental Pipeline**: `10619619`

### **Endpoints Utilizados**
- `/leads` - Crear y obtener leads
- `/contacts` - Crear contactos
- `/events` - Crear actividades/notas
- `/tasks` - Crear tareas (fallback)

## 🔄 Flujo de Datos

### **1. Prospecto → Lead**
```
Prospecto (Monitor) → Contacto (Kommo) → Lead (Kommo) → Notas/Actividades
```

### **2. Mapeo de Datos**
- **Nombre**: `prospecto.nombre + " - Mayo Dental"`
- **Precio**: Cálculo inteligente basado en tratamientos
- **Status**: Primer status disponible del pipeline
- **Tags**: Generación automática basada en datos del prospecto

### **3. Cálculo de Precios**
```typescript
const treatmentPrices = {
  'limpieza': 800,
  'implante': 18000,
  'ortodoncia': 25000,
  // ... más tratamientos
};
```

## 🚀 Uso del Sistema

### **Enviar Prospecto a Kommo**
1. Navegar a la pestaña "Prospectos"
2. Seleccionar un prospecto
3. Hacer clic en "Enviar a Kommo" (botón con icono Building2)
4. El sistema creará automáticamente:
   - Contacto en Kommo
   - Lead asociado al contacto
   - Tags automáticos
   - Notas con resumen del prospecto

### **Visualizar CRM**
1. Navegar a la pestaña "CRM Kommo"
2. Ver dashboard completo de leads
3. Filtrar por status o pipeline
4. Acceder a estadísticas en tiempo real

## ⚠️ Limitaciones Actuales

### **Notas Automáticas**
- Las notas se intentan crear usando múltiples estrategias
- Si fallan, se muestran en consola para agregación manual
- El lead se crea exitosamente aunque las notas fallen

### **Campos Personalizados**
- Los IDs de campos personalizados pueden variar entre pipelines
- Se requiere configuración manual para campos específicos

## 🔧 Solución de Problemas

### **Error 400: Campo Personalizado Inválido**
- Eliminar campos personalizados del payload
- Usar solo campos estándar de Kommo
- Verificar IDs de campos en la documentación oficial

### **Error 404: Endpoint No Encontrado**
- Probar diferentes endpoints para notas
- Usar `/events` como alternativa a `/notes`
- Implementar fallback a tareas

## 📈 Próximas Mejoras

1. **Configuración de Campos Personalizados**
   - Detección automática de IDs de campos
   - Mapeo dinámico de campos del prospecto

2. **Sincronización Bidireccional**
   - Actualización automática desde Kommo
   - Sincronización de cambios de status

3. **Métricas Avanzadas**
   - Análisis de funnel por status
   - Predicciones de conversión
   - Reportes automáticos

## 🔗 Enlaces Útiles

- [API Kommo Documentation](https://www.kommo.com/developers/api)
- [Pipeline Mayo Dental](https://bizmakermx.kommo.com/leads/pipeline/10619619)
- [Monitor Original](https://github.com/Novaisolutions/Monitor_MKT)

---

*Desarrollado por Novai Solutions para Mayo Dental*