export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'technician' | 'supervisor';
  created_at: string;
}

export interface Vehicle {
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

export interface Technician {
  id: string;
  name: string;
  specialties: string[];
  phone: string;
  email: string;
  status: 'available' | 'busy' | 'on_leave';
  created_at: string;
}

export interface SparePart {
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

export interface MaintenanceSchedule {
  id: string;
  vehicle_id: string;
  type: 'preventive' | 'predictive';
  name: string;
  description: string;
  frequency_type: 'time' | 'mileage' | 'hours';
  frequency_value: number;
  last_performed?: string;
  next_due: string;
  is_active: boolean;
  created_at: string;
}

export interface WorkOrder {
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

export interface MaintenanceRecord {
  id: string;
  vehicle_id: string;
  work_order_id: string;
  technician_id: string;
  maintenance_type: 'preventive' | 'corrective' | 'predictive';
  description: string;
  parts_used: { part_id: string; quantity: number; cost: number }[];
  labor_hours: number;
  total_cost: number;
  performed_at: string;
  next_service_mileage?: number;
  next_service_date?: string;
}

export interface Alert {
  id: string;
  type: 'maintenance_due' | 'low_stock' | 'overdue' | 'high_cost';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_vehicles: number;
  active_work_orders: number;
  overdue_maintenance: number;
  low_stock_parts: number;
  monthly_costs: number;
  completion_rate: number;
}