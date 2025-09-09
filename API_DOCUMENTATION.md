# Documentación de API - FleetCare

## Visión General

FleetCare utiliza una arquitectura de servicios que abstrae el acceso a datos, permitiendo funcionar tanto con Supabase (producción) como con datos simulados (demo). Esta documentación describe todos los endpoints y servicios disponibles.

## Configuración de API

### Modo Producción (Supabase)
```typescript
// Configuración con Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);
```

### Modo Demo (Mock Data)
```typescript
// Configuración con datos simulados
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
// Si no está configurado, usa mockApi automáticamente
```

## Autenticación

### Endpoints de Autenticación

#### POST /auth/signin
Iniciar sesión con email y contraseña.

**Request:**
```typescript
interface SignInRequest {
  email: string;
  password: string;
}
```

**Response:**
```typescript
interface SignInResponse {
  user: User;
  session: Session;
}
```

**Ejemplo:**
```typescript
const { user, session } = await authService.signIn(
  'admin@fleetcare.com',
  'admin123'
);
```

#### POST /auth/signup
Registrar nuevo usuario (solo administradores).

**Request:**
```typescript
interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'supervisor' | 'technician';
}
```

#### POST /auth/signout
Cerrar sesión del usuario actual.

**Response:**
```typescript
interface SignOutResponse {
  success: boolean;
}
```

## Servicios de API

### Vehicle API

#### GET /vehicles
Obtener todos los vehículos.

**Response:**
```typescript
interface Vehicle {
  id: string;
  plate: string;
  type: 'truck' | 'car' | 'motorcycle' | 'bus' | 'van';
  brand: string;
  model: string;
  year: number;
  capacity?: string;
  mileage: number;
  engine_hours?: number;
  status: 'active' | 'maintenance' | 'inactive';
  created_at: string;
  updated_at: string;
}
```

**Ejemplo:**
```typescript
const vehicles = await vehicleApi.getAll();
```

#### GET /vehicles/:id
Obtener vehículo por ID.

**Parameters:**
- `id` (string): ID del vehículo

**Response:**
```typescript
Vehicle | null
```

**Ejemplo:**
```typescript
const vehicle = await vehicleApi.getById('vehicle-id');
```

#### POST /vehicles
Crear nuevo vehículo.

**Request:**
```typescript
interface CreateVehicleRequest {
  plate: string;
  type: 'truck' | 'car' | 'motorcycle' | 'bus' | 'van';
  brand: string;
  model: string;
  year: number;
  capacity?: string;
  mileage: number;
  engine_hours?: number;
  status?: 'active' | 'maintenance' | 'inactive';
}
```

**Response:**
```typescript
Vehicle
```

**Ejemplo:**
```typescript
const newVehicle = await vehicleApi.create({
  plate: 'ABC-123',
  type: 'truck',
  brand: 'Volvo',
  model: 'FH16',
  year: 2020,
  mileage: 85000,
  status: 'active'
});
```

#### PUT /vehicles/:id
Actualizar vehículo existente.

**Parameters:**
- `id` (string): ID del vehículo

**Request:**
```typescript
interface UpdateVehicleRequest {
  plate?: string;
  type?: 'truck' | 'car' | 'motorcycle' | 'bus' | 'van';
  brand?: string;
  model?: string;
  year?: number;
  capacity?: string;
  mileage?: number;
  engine_hours?: number;
  status?: 'active' | 'maintenance' | 'inactive';
}
```

**Response:**
```typescript
Vehicle
```

#### DELETE /vehicles/:id
Eliminar vehículo.

**Parameters:**
- `id` (string): ID del vehículo

**Response:**
```typescript
void
```

### Technician API

#### GET /technicians
Obtener todos los técnicos.

**Response:**
```typescript
interface Technician {
  id: string;
  name: string;
  specialties: string[];
  phone: string;
  email: string;
  status: 'available' | 'busy' | 'on_leave';
  created_at: string;
}
```

**Ejemplo:**
```typescript
const technicians = await technicianApi.getAll();
```

#### POST /technicians
Crear nuevo técnico.

**Request:**
```typescript
interface CreateTechnicianRequest {
  name: string;
  specialties: string[];
  phone: string;
  email: string;
  status?: 'available' | 'busy' | 'on_leave';
}
```

**Response:**
```typescript
Technician
```

#### PUT /technicians/:id
Actualizar técnico existente.

**Parameters:**
- `id` (string): ID del técnico

**Request:**
```typescript
interface UpdateTechnicianRequest {
  name?: string;
  specialties?: string[];
  phone?: string;
  email?: string;
  status?: 'available' | 'busy' | 'on_leave';
}
```

### Spare Parts API

#### GET /spare-parts
Obtener todos los repuestos.

**Response:**
```typescript
interface SparePart {
  id: string;
  name: string;
  part_number: string;
  category: string;
  stock_quantity: number;
  min_stock: number;
  max_stock: number;
  unit_price: number;
  supplier: string;
  location: string;
  created_at: string;
}
```

#### GET /spare-parts/low-stock
Obtener repuestos con stock bajo.

**Response:**
```typescript
SparePart[]
```

**Ejemplo:**
```typescript
const lowStockParts = await sparePartsApi.getLowStock();
```

#### POST /spare-parts
Crear nuevo repuesto.

**Request:**
```typescript
interface CreateSparePartRequest {
  name: string;
  part_number: string;
  category: string;
  stock_quantity: number;
  min_stock: number;
  max_stock: number;
  unit_price: number;
  supplier: string;
  location: string;
}
```

#### PUT /spare-parts/:id/stock
Actualizar stock de repuesto.

**Parameters:**
- `id` (string): ID del repuesto

**Request:**
```typescript
interface UpdateStockRequest {
  quantity: number;
}
```

### Work Order API

#### GET /work-orders
Obtener todas las órdenes de trabajo.

**Response:**
```typescript
interface WorkOrder {
  id: string;
  vehicle_id: string;
  technician_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_hours: number;
  actual_hours?: number;
  labor_cost?: number;
  parts_cost?: number;
  total_cost?: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}
```

#### POST /work-orders
Crear nueva orden de trabajo.

**Request:**
```typescript
interface CreateWorkOrderRequest {
  vehicle_id: string;
  technician_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimated_hours: number;
}
```

#### PUT /work-orders/:id/status
Actualizar estado de orden de trabajo.

**Parameters:**
- `id` (string): ID de la orden

**Request:**
```typescript
interface UpdateWorkOrderStatusRequest {
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}
```

### Dashboard API

#### GET /dashboard/stats
Obtener estadísticas del dashboard.

**Response:**
```typescript
interface DashboardStats {
  total_vehicles: number;
  active_work_orders: number;
  overdue_maintenance: number;
  low_stock_parts: number;
  monthly_costs: number;
  completion_rate: number;
}
```

**Ejemplo:**
```typescript
const stats = await dashboardApi.getStats();
```

## Manejo de Errores

### Códigos de Error Estándar

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}
```

### Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| `UNAUTHORIZED` | Usuario no autenticado |
| `FORBIDDEN` | Sin permisos para la operación |
| `NOT_FOUND` | Recurso no encontrado |
| `VALIDATION_ERROR` | Error de validación de datos |
| `DUPLICATE_ENTRY` | Entrada duplicada (ej: placa existente) |
| `INSUFFICIENT_STOCK` | Stock insuficiente de repuesto |
| `VEHICLE_IN_USE` | Vehículo en uso, no se puede eliminar |

### Ejemplo de Manejo de Errores

```typescript
try {
  const vehicle = await vehicleApi.create(vehicleData);
} catch (error) {
  if (error.code === 'DUPLICATE_ENTRY') {
    showError('Ya existe un vehículo con esa placa');
  } else if (error.code === 'VALIDATION_ERROR') {
    showError('Datos inválidos: ' + error.message);
  } else {
    showError('Error inesperado');
  }
}
```

## Paginación

### Parámetros de Paginación

```typescript
interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

### Respuesta Paginada

```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### Ejemplo de Uso

```typescript
const result = await vehicleApi.getAll({
  page: 1,
  limit: 10,
  sortBy: 'created_at',
  sortOrder: 'desc'
});
```

## Filtros y Búsqueda

### Parámetros de Filtro

```typescript
interface FilterParams {
  search?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}
```

### Ejemplo de Filtros

```typescript
// Buscar vehículos activos de tipo camión
const trucks = await vehicleApi.getAll({
  status: 'active',
  type: 'truck',
  search: 'volvo'
});
```

## Validación de Datos

### Esquemas de Validación

```typescript
// Validación de vehículo
const vehicleSchema = {
  plate: {
    required: true,
    pattern: /^[A-Z]{3}-\d{3}$/,
    message: 'Formato de placa inválido (ABC-123)'
  },
  year: {
    required: true,
    min: 1950,
    max: 2030,
    message: 'Año debe estar entre 1950 y 2030'
  },
  mileage: {
    required: true,
    min: 0,
    message: 'Kilometraje no puede ser negativo'
  }
};
```

## Rate Limiting

### Límites por Endpoint

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| `/auth/signin` | 5 intentos | 15 minutos |
| `/vehicles` | 100 requests | 1 minuto |
| `/work-orders` | 50 requests | 1 minuto |
| `/dashboard/stats` | 20 requests | 1 minuto |

### Headers de Rate Limiting

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks (Futuro)

### Eventos Disponibles

```typescript
interface WebhookEvent {
  id: string;
  type: 'vehicle.created' | 'work_order.completed' | 'maintenance.due';
  data: any;
  timestamp: string;
}
```

### Configuración de Webhook

```typescript
interface WebhookConfig {
  url: string;
  events: string[];
  secret: string;
  active: boolean;
}
```

## SDK y Librerías Cliente

### JavaScript/TypeScript SDK

```bash
npm install @fleetcare/sdk
```

```typescript
import { FleetCareClient } from '@fleetcare/sdk';

const client = new FleetCareClient({
  apiUrl: 'https://api.fleetcare.com',
  apiKey: 'your-api-key'
});

const vehicles = await client.vehicles.getAll();
```

### Python SDK (Futuro)

```bash
pip install fleetcare-python
```

```python
from fleetcare import FleetCareClient

client = FleetCareClient(api_key='your-api-key')
vehicles = client.vehicles.get_all()
```

## Testing de API

### Datos de Prueba

```typescript
// Datos de prueba disponibles en modo demo
const testData = {
  vehicles: [
    { plate: 'ABC-123', brand: 'Volvo', model: 'FH16' },
    { plate: 'DEF-456', brand: 'Toyota', model: 'Camry' }
  ],
  technicians: [
    { name: 'Juan Pérez', specialties: ['motor', 'transmision'] }
  ]
};
```

### Postman Collection

```json
{
  "info": {
    "name": "FleetCare API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Sign In",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"demo@fleetcare.com\",\n  \"password\": \"demo123\"\n}"
            },
            "url": "{{baseUrl}}/auth/signin"
          }
        }
      ]
    }
  ]
}
```

## Monitoreo y Observabilidad

### Métricas de API

- Request rate (requests/second)
- Response time (p50, p95, p99)
- Error rate (%)
- Throughput (MB/s)

### Logging

```typescript
// Estructura de logs
interface ApiLog {
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  userId?: string;
  userAgent: string;
  ip: string;
}
```

### Health Check

#### GET /health
Verificar estado de la API.

**Response:**
```typescript
interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: 'up' | 'down';
    auth: 'up' | 'down';
    storage: 'up' | 'down';
  };
}
```

## Versionado de API

### Estrategia de Versionado

- **URL Versioning**: `/api/v1/vehicles`
- **Header Versioning**: `Accept: application/vnd.fleetcare.v1+json`

### Compatibilidad

- **v1.0**: Versión actual
- **v1.1**: Próxima versión (backward compatible)
- **v2.0**: Breaking changes (futuro)

### Deprecación

```typescript
// Header de deprecación
'Deprecation': 'true'
'Sunset': '2024-12-31T23:59:59Z'
'Link': '<https://api.fleetcare.com/v2/vehicles>; rel="successor-version"'
```

## Conclusión

Esta documentación de API proporciona una guía completa para integrar con FleetCare. La API está diseñada para ser:

- **RESTful**: Siguiendo convenciones REST estándar
- **Consistente**: Patrones uniformes en todos los endpoints
- **Documentada**: Especificaciones claras y ejemplos
- **Versionada**: Evolución controlada de la API
- **Monitoreada**: Observabilidad completa
- **Segura**: Autenticación y autorización robustas

Para más información o soporte, contacta al equipo de desarrollo en `api-support@fleetcare.com`.