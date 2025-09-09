import { Vehicle, Technician, SparePart, WorkOrder, DashboardStats } from '../types';

// Mock data for demo purposes
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    plate: 'ABC-123',
    type: 'truck',
    brand: 'Volvo',
    model: 'FH16',
    year: 2020,
    mileage: 85000,
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    plate: 'DEF-456',
    type: 'car',
    brand: 'Toyota',
    model: 'Camry',
    year: 2019,
    mileage: 45000,
    status: 'active',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    plate: 'GHI-789',
    type: 'van',
    brand: 'Ford',
    model: 'Transit',
    year: 2021,
    mileage: 32000,
    status: 'maintenance',
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z'
  },
  {
    id: '4',
    plate: 'JKL-012',
    type: 'bus',
    brand: 'Mercedes-Benz',
    model: 'Sprinter',
    year: 2018,
    mileage: 120000,
    status: 'active',
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z'
  },
  {
    id: '5',
    plate: 'MNO-345',
    type: 'motorcycle',
    brand: 'Honda',
    model: 'CBR600',
    year: 2022,
    mileage: 8000,
    status: 'active',
    created_at: '2024-01-19T10:00:00Z',
    updated_at: '2024-01-19T10:00:00Z'
  }
];

export const mockTechnicians: Technician[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    specialties: ['motor', 'transmision'],
    phone: '+1234567890',
    email: 'juan@fleetcare.com',
    status: 'available',
    created_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    name: 'María García',
    specialties: ['electricidad', 'electronica'],
    phone: '+1234567891',
    email: 'maria@fleetcare.com',
    status: 'available',
    created_at: '2024-01-11T10:00:00Z'
  },
  {
    id: '3',
    name: 'Carlos López',
    specialties: ['frenos', 'suspension'],
    phone: '+1234567892',
    email: 'carlos@fleetcare.com',
    status: 'busy',
    created_at: '2024-01-12T10:00:00Z'
  },
  {
    id: '4',
    name: 'Ana Martínez',
    specialties: ['motor', 'frenos'],
    phone: '+1234567893',
    email: 'ana@fleetcare.com',
    status: 'available',
    created_at: '2024-01-13T10:00:00Z'
  }
];

export const mockSpareParts: SparePart[] = [
  {
    id: '1',
    name: 'Filtro de Aceite',
    part_number: 'FO-001',
    category: 'motor',
    stock_quantity: 25,
    min_stock: 10,
    max_stock: 50,
    unit_price: 15.99,
    supplier: 'AutoParts Inc',
    location: 'Almacén A-1',
    created_at: '2024-01-05T10:00:00Z'
  },
  {
    id: '2',
    name: 'Pastillas de Freno',
    part_number: 'PF-002',
    category: 'frenos',
    stock_quantity: 8,
    min_stock: 10,
    max_stock: 30,
    unit_price: 45.50,
    supplier: 'Brake Masters',
    location: 'Almacén B-2',
    created_at: '2024-01-06T10:00:00Z'
  },
  {
    id: '3',
    name: 'Batería 12V',
    part_number: 'BAT-003',
    category: 'electricidad',
    stock_quantity: 12,
    min_stock: 5,
    max_stock: 20,
    unit_price: 89.99,
    supplier: 'Power Supply Co',
    location: 'Almacén C-3',
    created_at: '2024-01-07T10:00:00Z'
  },
  {
    id: '4',
    name: 'Correa de Distribución',
    part_number: 'CD-004',
    category: 'motor',
    stock_quantity: 15,
    min_stock: 8,
    max_stock: 25,
    unit_price: 78.25,
    supplier: 'AutoParts Inc',
    location: 'Almacén A-2',
    created_at: '2024-01-08T10:00:00Z'
  },
  {
    id: '5',
    name: 'Amortiguador Delantero',
    part_number: 'AD-005',
    category: 'suspension',
    stock_quantity: 6,
    min_stock: 4,
    max_stock: 15,
    unit_price: 125.00,
    supplier: 'Suspension Pro',
    location: 'Almacén D-1',
    created_at: '2024-01-09T10:00:00Z'
  }
];

export const mockWorkOrders: WorkOrder[] = [
  {
    id: '1',
    vehicle_id: '1',
    technician_id: '1',
    title: 'Mantenimiento Preventivo',
    description: 'Cambio de aceite, filtros y revisión general del vehículo',
    priority: 'medium',
    status: 'in_progress',
    estimated_hours: 3.0,
    actual_hours: 2.5,
    labor_cost: 150.00,
    parts_cost: 85.50,
    total_cost: 235.50,
    created_at: '2024-01-20T08:00:00Z'
  },
  {
    id: '2',
    vehicle_id: '3',
    technician_id: '2',
    title: 'Reparación Sistema Eléctrico',
    description: 'Diagnóstico y reparación de falla en sistema de luces',
    priority: 'high',
    status: 'pending',
    estimated_hours: 2.0,
    labor_cost: 0,
    parts_cost: 0,
    total_cost: 0,
    created_at: '2024-01-21T09:00:00Z'
  },
  {
    id: '3',
    vehicle_id: '2',
    technician_id: '4',
    title: 'Cambio de Pastillas de Freno',
    description: 'Reemplazo de pastillas de freno delanteras y traseras',
    priority: 'high',
    status: 'completed',
    estimated_hours: 1.5,
    actual_hours: 1.8,
    labor_cost: 90.00,
    parts_cost: 91.00,
    total_cost: 181.00,
    created_at: '2024-01-19T14:00:00Z'
  }
];

export const mockDashboardStats: DashboardStats = {
  total_vehicles: 5,
  active_work_orders: 2,
  overdue_maintenance: 1,
  low_stock_parts: 1,
  monthly_costs: 1250.75,
  completion_rate: 87
};

// Mock user for demo
export const mockUser = {
  id: 'demo-user',
  email: 'demo@fleetcare.com',
  full_name: 'Usuario Demo',
  role: 'admin'
}