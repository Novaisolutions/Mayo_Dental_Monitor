# 🚀 Guía de Instalación - Mayo Dental Monitor

## 📋 Prerrequisitos

- **Node.js**: Versión 18 o superior
- **npm**: Versión 9 o superior
- **Git**: Para clonar el repositorio
- **Cuenta Supabase**: Para el backend
- **Cuenta Kommo**: Para la integración CRM

## 🔧 Instalación Paso a Paso

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/Novaisolutions/Mayo_Dental_Monitor.git
cd Mayo_Dental_Monitor
```

### **2. Instalar Dependencias**
```bash
npm install
```

### **3. Configurar Variables de Entorno**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

### **4. Configurar Supabase**
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Obtener URL y Anon Key del proyecto
3. Configurar en `.env`:
```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### **5. Configurar Kommo CRM**
1. Obtener Access Token desde [Kommo](https://bizmakermx.kommo.com)
2. Configurar en `.env`:
```bash
VITE_KOMMO_ACCESS_TOKEN=tu_token_kommo_aqui
VITE_KOMMO_BASE_URL=https://bizmakermx.kommo.com/api/v4
```

### **6. Ejecutar en Desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 🗄️ Configuración de Base de Datos

### **Tablas Requeridas en Supabase**
- `prospectos_mkt` - Prospectos del marketing
- `conversaciones_mkt` - Conversaciones con prospectos
- `mensajes_mkt` - Mensajes individuales
- `seguimientos_mkt` - Seguimientos programados

### **Edge Functions Requeridas**
- `create-user-admin` - Crear usuarios administradores
- `seguimiento-4h` - Seguimiento automático cada 4 horas
- `seguimiento-8am` - Recordatorio diario a las 8 AM

## 🔌 Configuración de Kommo

### **Pipeline Configurado**
- **ID**: `10619619`
- **Nombre**: "CLINICA DENTAL MAYO"
- **Status**: Configurado automáticamente

### **Campos Personalizados**
- Teléfono: Campo ID `746980`
- Email: Campo ID `746982`
- Tipo de Contacto: Campo ID `859046`

## 🚀 Despliegue en Producción

### **Build de Producción**
```bash
npm run build
```

### **Servidor Web**
Los archivos generados en `dist/` pueden ser servidos por:
- Nginx
- Apache
- Vercel
- Netlify
- Cualquier servidor web estático

### **Variables de Producción**
```bash
VITE_APP_ENV=production
VITE_DEV_MODE=false
VITE_DEBUG_LOGS=false
```

## 🔧 Solución de Problemas

### **Error: "Cannot find module"**
```bash
# Limpiar cache e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
```

### **Error: "Supabase connection failed"**
- Verificar URL y Anon Key en `.env`
- Verificar que el proyecto Supabase esté activo
- Verificar políticas RLS en la base de datos

### **Error: "Kommo API failed"**
- Verificar Access Token en `.env`
- Verificar que el token no haya expirado
- Verificar permisos del token en Kommo

### **Error: "Port already in use"**
```bash
# Cambiar puerto en vite.config.ts
export default defineConfig({
  server: {
    port: 3001
  }
})
```

## 📱 Características del Sistema

### **Dashboard de Prospectos**
- Lista completa de prospectos
- Filtros por estado y score
- Búsqueda por nombre o teléfono
- Envío automático a Kommo

### **Integración Kommo**
- Visualización de leads en tiempo real
- Creación automática de leads
- Sincronización de contactos
- Sistema de tags automáticos

### **Seguimiento Automático**
- Recordatorios programados
- Seguimientos cada 4 horas
- Notificaciones diarias a las 8 AM

## 🔒 Seguridad

### **Variables de Entorno**
- **NUNCA** subir `.env` al repositorio
- Usar `.env.example` como plantilla
- Rotar tokens regularmente

### **Políticas RLS**
- Configurar Row Level Security en Supabase
- Limitar acceso por usuario/organización
- Validar datos de entrada

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/Novaisolutions/Mayo_Dental_Monitor/issues)
- **Documentación**: [docs/](docs/) del repositorio
- **Contacto**: soluciones.novai@gmail.com

---

*Desarrollado por Novai Solutions para Mayo Dental*