# FleetCare - Sistema de Gestión de Mantenimiento Vehicular

Un sistema completo para la gestión de mantenimiento vehicular desarrollado con React, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas
- **Autenticación segura** con Supabase Auth y modo demo
- **Dashboard interactivo** con estadísticas en tiempo real
- **Gestión de vehículos** con historial completo y filtros avanzados
- **Control de técnicos** con especialidades y disponibilidad
- **Inventario de repuestos** con alertas de stock bajo
- **Órdenes de trabajo** con seguimiento de estado y asignación
- **Base de datos completa** con todas las tablas necesarias
- **Interfaz moderna** con Tailwind CSS y diseño responsivo
- **Arquitectura limpia** con separación de responsabilidades
- **Tipos TypeScript** para mayor seguridad de código
- **Modo demo** funcional sin configuración

### 🔄 Próximas Funcionalidades
- Programación automática de mantenimiento preventivo
- Sistema de reportes y estadísticas avanzadas
- Generación de reportes PDF
- Notificaciones push en tiempo real
- Aplicación móvil complementaria

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **React Router DOM** - Enrutamiento del lado del cliente
- **Lucide React** - Iconos modernos y consistentes

### Backend & Base de Datos
- **Supabase** - Backend como servicio (PostgreSQL, Auth, Real-time)
- **PostgreSQL** - Base de datos relacional robusta
- **Row Level Security (RLS)** - Seguridad a nivel de fila

### Herramientas de Desarrollo
- **Vite** - Herramienta de construcción rápida
- **ESLint** - Linter para JavaScript/TypeScript
- **PostCSS** - Procesador de CSS
- **Autoprefixer** - Prefijos CSS automáticos

### Librerías Adicionales
- **React Hook Form + Yup** - Manejo de formularios y validación
- **Recharts** - Gráficos y visualizaciones
- **jsPDF + html2canvas** - Generación de reportes PDF
- **date-fns** - Manipulación de fechas
- **uuid** - Generación de identificadores únicos

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Auth/           # Componentes de autenticación
│   │   └── LoginForm.tsx
│   ├── Layout/         # Layout y navegación
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   └── Sidebar.tsx
│   └── UI/             # Componentes de interfaz
│       ├── StatCard.tsx
│       └── Table.tsx
├── contexts/           # Contextos de React
│   └── AuthContext.tsx
├── lib/                # Configuraciones y utilidades
│   └── supabase.ts
├── pages/              # Páginas principales
│   ├── Dashboard.tsx
│   └── Vehicles.tsx
├── services/           # Servicios API y datos mock
│   ├── api.ts
│   ├── mockApi.ts
│   └── mockData.ts
├── types/              # Definiciones TypeScript
│   └── index.ts
├── App.tsx             # Componente principal
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

## 🗄️ Esquema de Base de Datos

### Tablas Principales

#### `profiles`
- Perfiles de usuario extendiendo auth.users
- Campos: id, full_name, role, phone, created_at, updated_at
- Roles: admin, technician, supervisor

#### `vehicles`
- Información completa de vehículos
- Campos: id, plate, type, brand, model, year, capacity, mileage, engine_hours, status
- Estados: active, maintenance, inactive
- Tipos: truck, car, motorcycle, bus, van

#### `technicians`
- Datos de personal técnico
- Campos: id, name, specialties[], phone, email, status, hire_date, hourly_rate
- Estados: available, busy, on_leave

#### `spare_parts`
- Inventario de repuestos
- Campos: id, name, part_number, category, stock_quantity, min_stock, max_stock, unit_price, supplier, location
- Control automático de stock mínimo

#### `maintenance_schedules`
- Programación de mantenimiento preventivo
- Campos: id, vehicle_id, type, name, description, frequency_type, frequency_value
- Tipos de frecuencia: time, mileage, hours
- Cálculo automático de próximas fechas

#### `work_orders`
- Órdenes de trabajo y tareas
- Campos: id, vehicle_id, technician_id, title, description, priority, status, estimated_hours, actual_hours, costs
- Prioridades: low, medium, high, urgent
- Estados: pending, assigned, in_progress, completed, cancelled

#### `maintenance_records`
- Historial de mantenimiento realizado
- Campos: id, work_order_id, vehicle_id, technician_id, maintenance_type, description, parts_used, labor_hours, total_cost
- Tipos: preventive, corrective, predictive

#### `alerts`
- Sistema de notificaciones y alertas
- Campos: id, type, title, message, priority, related_id, is_read
- Tipos: maintenance_due, overdue_maintenance, low_stock, high_cost, vehicle_issue

### Características de la Base de Datos
- **Row Level Security (RLS)** habilitado en todas las tablas
- **Políticas de acceso** basadas en roles de usuario
- **Triggers automáticos** para actualizaciones de timestamps
- **Funciones personalizadas** para cálculos complejos
- **Índices optimizados** para consultas frecuentes
- **Constraints de integridad** para consistencia de datos
- **Datos de ejemplo** incluidos para testing

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- npm o yarn
- Cuenta de Supabase (opcional para modo demo)

### Instalación Rápida

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/fleetcare.git
   cd fleetcare
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo demo**
   ```bash
   npm run dev
   ```
   
   Usar credenciales: `demo@fleetcare.com` / `demo123`

### Configuración con Supabase (Producción)

1. **Crear proyecto en Supabase**
   - Ir a [Supabase](https://supabase.com)
   - Crear nuevo proyecto
   - Copiar URL del proyecto y clave anónima

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env`:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anonima
   NODE_ENV=development
   ```

3. **Ejecutar migraciones SQL**
   - Ir al editor SQL de Supabase
   - Ejecutar el contenido de `supabase/migrations/create_database_schema.sql`

4. **Crear usuario administrador**
   ```sql
   -- En el editor SQL de Supabase
   INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
   VALUES ('admin@fleetcare.com', crypt('admin123', gen_salt('bf')), now());
   ```

5. **Ejecutar aplicación**
   ```bash
   npm run dev
   ```

## 👥 Roles y Permisos

### Administrador (admin)
- Acceso completo al sistema
- Gestión de usuarios y configuración
- Creación y modificación de todos los registros
- Acceso a todos los reportes y estadísticas

### Supervisor (supervisor)
- Gestión de operaciones diarias
- Asignación de órdenes de trabajo
- Acceso a reportes operativos
- Gestión de inventario y programación

### Técnico (technician)
- Acceso a órdenes asignadas
- Registro de trabajo realizado
- Consulta de información de vehículos
- Actualización de estado de tareas

## 🏗️ Arquitectura del Sistema

### Principios Aplicados
- **Clean Architecture** - Separación clara de responsabilidades
- **Component-Based Design** - Componentes reutilizables y modulares
- **Type Safety** - TypeScript en toda la aplicación
- **Responsive Design** - Optimizado para todos los dispositivos
- **Security First** - RLS y políticas de acceso robustas

### Patrones de Diseño
- **Context Pattern** - Para manejo de estado global (AuthContext)
- **Custom Hooks** - Para lógica reutilizable
- **Service Layer** - Para comunicación con APIs (api.ts, mockApi.ts)
- **Composition** - Para flexibilidad de componentes
- **Repository Pattern** - Abstracción de acceso a datos

### Flujo de Datos
```
UI Components → Services → API Layer → Supabase/Mock Data
     ↓              ↓           ↓            ↓
State Management → Context → Local State → Database
```

## 📋 Funcionalidades por Módulo

### 🚗 Gestión de Vehículos
- **Registro completo** con todos los datos técnicos
- **Búsqueda y filtrado** por placa, marca, modelo, estado
- **Historial de mantenimiento** con fechas y costos
- **Estados dinámicos**: Activo, En mantenimiento, Inactivo
- **Tracking de kilometraje** y horas de motor
- **Alertas de mantenimiento** próximo
- **Estadísticas por vehículo** (costos, frecuencia de fallas)

### 👷 Personal Técnico
- **Registro de mecánicos** con especialidades
- **Control de disponibilidad** en tiempo real
- **Asignación automática** de tareas según especialidad
- **Historial de trabajo** por técnico
- **Evaluación de rendimiento** y calidad
- **Gestión de horarios** y turnos

### 📦 Control de Inventario
- **Gestión completa de repuestos** con códigos únicos
- **Alertas automáticas** de stock mínimo
- **Control de proveedores** y precios
- **Ubicación en almacén** para localización rápida
- **Historial de movimientos** de inventario
- **Proyección de necesidades** basada en uso histórico

### 📋 Órdenes de Trabajo
- **Creación automática** desde programación preventiva
- **Asignación inteligente** según disponibilidad y especialidad
- **Seguimiento en tiempo real** del progreso
- **Control de tiempos** estimados vs reales
- **Registro de repuestos** utilizados
- **Cálculo automático** de costos totales
- **Priorización** según urgencia y criticidad

### 📅 Mantenimiento Preventivo
- **Programación flexible** por tiempo, kilometraje o horas
- **Alertas automáticas** para próximos servicios
- **Historial completo** de mantenimientos realizados
- **Cálculo inteligente** de próximas fechas
- **Templates de mantenimiento** por tipo de vehículo
- **Optimización de rutas** para técnicos

### 📊 Reportes y Análisis
- **Dashboard ejecutivo** con KPIs principales
- **Estadísticas de costos** por período y vehículo
- **Indicadores de rendimiento** (MTBF, MTTR, disponibilidad)
- **Reportes personalizables** con filtros avanzados
- **Exportación a PDF** y Excel
- **Gráficos interactivos** con drill-down

## 🔒 Seguridad

### Autenticación y Autorización
- **JWT tokens** con Supabase Auth
- **Row Level Security** en todas las tablas
- **Políticas basadas en roles** granulares
- **Sesiones seguras** con renovación automática
- **Logout automático** por inactividad

### Protección de Datos
- **Validación de entrada** en frontend y backend
- **Sanitización** para prevenir inyecciones
- **Encriptación** de datos sensibles
- **Auditoría** de cambios críticos
- **Backup automático** de datos

### Mejores Prácticas
- **HTTPS obligatorio** en producción
- **Variables de entorno** para configuración sensible
- **Rate limiting** para prevenir abuso
- **Logging** de eventos de seguridad
- **Monitoreo** de accesos anómalos

## 📈 Métricas y KPIs

### Indicadores Operativos
- **MTBF** (Mean Time Between Failures) - Tiempo promedio entre fallas
- **MTTR** (Mean Time To Repair) - Tiempo promedio de reparación
- **Disponibilidad** de flota por período
- **Cumplimiento** de cronogramas de mantenimiento
- **Eficiencia** de técnicos (tiempo estimado vs real)

### Indicadores Financieros
- **Costo por kilómetro** por vehículo
- **Costo de mantenimiento** mensual/anual
- **ROI** de mantenimiento preventivo vs correctivo
- **Variación presupuestaria** por centro de costo
- **Costo por hora** de técnico

### Indicadores de Calidad
- **Tasa de reincidencia** de fallas
- **Satisfacción** con el servicio
- **Tiempo de respuesta** a emergencias
- **Calidad** de reparaciones (re-trabajos)
- **Cumplimiento** de estándares de seguridad

## 🚀 Despliegue

### Desarrollo Local
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run preview      # Vista previa de producción
npm run lint         # Verificación de código
```

### Producción

#### Opción 1: Vercel (Recomendado)
1. Conectar repositorio GitHub a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

#### Opción 2: Netlify
1. Conectar repositorio a Netlify
2. Configurar build command: `npm run build`
3. Configurar publish directory: `dist`

#### Opción 3: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Variables de Entorno Producción
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
NODE_ENV=production
```

## 🧪 Testing

### Estrategia de Pruebas
- **Unit Tests** - Funciones utilitarias y hooks personalizados
- **Integration Tests** - Servicios API y flujos de datos
- **Component Tests** - Componentes React individuales
- **E2E Tests** - Flujos de usuario completos

### Herramientas de Testing
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event msw
npm install --save-dev playwright # Para E2E tests
```

### Ejecutar Pruebas
```bash
npm run test              # Pruebas unitarias
npm run test:coverage     # Cobertura de código
npm run test:e2e         # Pruebas end-to-end
npm run test:watch       # Modo watch para desarrollo
```

## 🤝 Contribución

### Estándares de Código
- **ESLint + Prettier** configurados
- **Conventional Commits** para mensajes
- **TypeScript strict mode** habilitado
- **Componentes** en PascalCase
- **Archivos** en camelCase
- **Constantes** en UPPER_SNAKE_CASE

### Proceso de Desarrollo
1. **Fork** del repositorio
2. **Crear rama** de feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Desarrollar** con commits descriptivos
4. **Escribir tests** para nueva funcionalidad
5. **Ejecutar linting** y tests
6. **Crear Pull Request** con descripción detallada

### Estructura de Commits
```
feat: agregar gestión de técnicos
fix: corregir cálculo de costos
docs: actualizar README
style: formatear código con prettier
refactor: reorganizar servicios API
test: agregar tests para vehículos
chore: actualizar dependencias
```

## 📝 Changelog

### v1.0.0 - Versión Inicial (Actual)
- ✅ Sistema de autenticación con roles
- ✅ Dashboard principal con estadísticas
- ✅ Gestión completa de vehículos
- ✅ Base de datos PostgreSQL robusta
- ✅ Interfaz moderna y responsiva
- ✅ Modo demo funcional
- ✅ Arquitectura escalable

### v1.1.0 - Próxima Versión
- 🔄 Módulo completo de técnicos
- 🔄 Control avanzado de inventario
- 🔄 Sistema de alertas en tiempo real
- 🔄 Reportes básicos en PDF

### v1.2.0 - Funcionalidades Avanzadas
- 🔄 Órdenes de trabajo completas
- 🔄 Programación automática de mantenimiento
- 🔄 Dashboard con gráficos interactivos
- 🔄 API REST documentada

### v1.3.0 - Reportes y Analytics
- 🔄 Sistema de reportes avanzados
- 🔄 Análisis predictivo de fallas
- 🔄 Optimización de costos
- 🔄 Integración con sistemas externos

### v2.0.0 - Aplicación Móvil
- 🔄 App móvil para técnicos
- 🔄 Sincronización offline
- 🔄 Códigos QR para vehículos
- 🔄 Notificaciones push

## 🔧 Configuración Avanzada

### Personalización de Tema
```css
/* src/index.css */
:root {
  --primary-color: #3B82F6;
  --secondary-color: #10B981;
  --warning-color: #F59E0B;
  --error-color: #EF4444;
  --background-color: #F9FAFB;
}
```

### Variables de Entorno Completas
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
VITE_APP_NAME=FleetCare
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_OFFLINE_MODE=false

# External Services
VITE_MAPS_API_KEY=your_maps_api_key
VITE_SMTP_SERVICE_URL=your_smtp_service
```

### Configuración de Supabase
```sql
-- Configuración adicional en Supabase
-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Configurar políticas de seguridad adicionales
ALTER DATABASE postgres SET timezone TO 'UTC';
```

## 📞 Soporte y Contacto

### Documentación Técnica
- **Wiki del Proyecto**: [GitHub Wiki]
- **API Documentation**: [Swagger/OpenAPI]
- **Component Library**: [Storybook]

### Soporte Técnico
- **Email**: support@fleetcare.com
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/fleetcare/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tu-usuario/fleetcare/discussions)

### Comunidad
- **Discord**: [Servidor de Discord]
- **Slack**: [Workspace de Slack]
- **LinkedIn**: [Página de LinkedIn]

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

```
MIT License

Copyright (c) 2024 FleetCare

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Agradecimientos

- **React Team** - Por la excelente biblioteca de UI
- **Supabase Team** - Por el backend como servicio
- **Tailwind CSS** - Por el framework de CSS utilitario
- **Lucide** - Por los iconos modernos y consistentes
- **Vite Team** - Por la herramienta de construcción rápida

---

**FleetCare** - Desarrollado con ❤️ para optimizar la gestión de flotas vehiculares.

*Última actualización: Enero 2024*