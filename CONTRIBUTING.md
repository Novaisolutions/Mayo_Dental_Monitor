# 🤝 Contribuir al Proyecto

¡Gracias por tu interés en contribuir al Mayo Dental Monitor! Este documento te guiará a través del proceso de contribución.

## 📋 Cómo Contribuir

### **1. Reportar Bugs**
- Usa el [sistema de issues](https://github.com/Novaisolutions/Mayo_Dental_Monitor/issues)
- Incluye pasos detallados para reproducir el bug
- Adjunta capturas de pantalla si es relevante
- Especifica tu entorno (SO, navegador, versión)

### **2. Solicitar Funcionalidades**
- Crea un issue con la etiqueta `enhancement`
- Describe la funcionalidad deseada
- Explica por qué sería útil
- Incluye ejemplos de uso si es posible

### **3. Contribuir Código**
- Fork el repositorio
- Crea una rama para tu feature
- Haz commits descriptivos
- Crea un Pull Request

## 🛠️ Configuración del Entorno de Desarrollo

### **Requisitos**
```bash
Node.js >= 18
npm >= 9
Git
```

### **Configuración Local**
```bash
# Clonar tu fork
git clone https://github.com/TU_USUARIO/Mayo_Dental_Monitor.git
cd Mayo_Dental_Monitor

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar en desarrollo
npm run dev
```

## 📝 Estándares de Código

### **TypeScript**
- Usar tipos estrictos
- Evitar `any` cuando sea posible
- Documentar interfaces complejas
- Usar enums para valores constantes

### **React**
- Usar hooks funcionales
- Implementar `useCallback` para funciones
- Usar `useMemo` para cálculos costosos
- Seguir las reglas de hooks

### **Estilos**
- Usar Tailwind CSS
- Mantener consistencia en el diseño
- Usar variables CSS para colores
- Implementar diseño responsive

### **Commits**
- Usar [Conventional Commits](https://www.conventionalcommits.org/)
- Formato: `type(scope): description`
- Ejemplos:
  - `feat(kommo): add lead creation functionality`
  - `fix(ui): resolve sidebar navigation issue`
  - `docs(readme): update installation guide`

## 🔄 Flujo de Trabajo

### **1. Crear Issue**
- Describe el problema o feature
- Asigna etiquetas apropiadas
- Asigna milestone si es relevante

### **2. Fork y Clone**
```bash
# Fork en GitHub
# Luego clonar localmente
git clone https://github.com/TU_USUARIO/Mayo_Dental_Monitor.git
```

### **3. Crear Rama**
```bash
git checkout -b feature/nombre-de-la-feature
# o
git checkout -b fix/nombre-del-fix
```

### **4. Desarrollar**
- Escribe código limpio y bien documentado
- Agrega tests si es posible
- Verifica que no rompas funcionalidades existentes

### **5. Commit y Push**
```bash
git add .
git commit -m "feat(scope): description of changes"
git push origin feature/nombre-de-la-feature
```

### **6. Crear Pull Request**
- Describe los cambios realizados
- Incluye screenshots si hay cambios de UI
- Menciona issues relacionados
- Solicita review de maintainers

## 🧪 Testing

### **Tests Unitarios**
```bash
npm run test
```

### **Tests de Integración**
```bash
npm run test:integration
```

### **Linting**
```bash
npm run lint
```

### **Type Checking**
```bash
npm run type-check
```

## 📚 Documentación

### **Actualizar Documentación**
- Mantén README.md actualizado
- Documenta nuevas funcionalidades
- Incluye ejemplos de uso
- Actualiza INSTALACION.md si es necesario

### **Comentarios de Código**
- Comenta funciones complejas
- Explica lógica de negocio
- Documenta APIs y hooks
- Usa JSDoc para funciones públicas

## 🚀 Despliegue

### **Build de Producción**
```bash
npm run build
```

### **Verificar Build**
```bash
npm run preview
```

### **Variables de Entorno**
- Verificar que todas las variables estén configuradas
- Usar valores de producción apropiados
- No incluir credenciales en el código

## 🔒 Seguridad

### **Reportar Vulnerabilidades**
- **NO** crear issues públicos para vulnerabilidades
- Contactar directamente: soluciones.novai@gmail.com
- Incluir detalles del problema
- Esperar respuesta antes de hacer público

### **Buenas Prácticas**
- No hardcodear credenciales
- Validar inputs del usuario
- Implementar autenticación apropiada
- Usar HTTPS en producción

## 📞 Contacto

- **Issues**: [GitHub Issues](https://github.com/Novaisolutions/Mayo_Dental_Monitor/issues)
- **Email**: soluciones.novai@gmail.com
- **Discord**: [En desarrollo]

## 🙏 Agradecimientos

Gracias a todos los contribuidores que han ayudado a hacer este proyecto posible:

- **Novai Solutions** - Desarrollo principal
- **Mayo Dental** - Cliente y feedback
- **Comunidad Open Source** - Librerías y herramientas

---

*Juntos hacemos el software mejor* 🚀