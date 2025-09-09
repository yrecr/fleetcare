import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/supabase';
import { 
  mockVehicleApi, 
  mockTechnicianApi, 
  mockSparePartsApi, 
  mockWorkOrderApi, 
  mockDashboardApi 
} from './mockApi';
import { Vehicle, Technician, SparePart, WorkOrder, MaintenanceSchedule, DashboardStats } from '../types';

// Vehicles API
export const vehicleApi = {
  getAll: async (): Promise<Vehicle[]> => {
    if (!isSupabaseConfigured) {
      return mockVehicleApi.getAll();
    }
    
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<Vehicle | null> => {
    if (!isSupabaseConfigured) {
      return mockVehicleApi.getById(id);
    }
    
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  create: async (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<Vehicle> => {
    if (!isSupabaseConfigured) {
      return mockVehicleApi.create(vehicle);
    }
    
    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicle])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<Vehicle>): Promise<Vehicle> => {
    if (!isSupabaseConfigured) {
      return mockVehicleApi.update(id, updates);
    }
    
    const { data, error } = await supabase
      .from('vehicles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    if (!isSupabaseConfigured) {
      return mockVehicleApi.delete(id);
    }
    
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Technicians API
export const technicianApi = {
  getAll: async (): Promise<Technician[]> => {
    if (!isSupabaseConfigured) {
      return mockTechnicianApi.getAll();
    }
    
    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  create: async (technician: Omit<Technician, 'id' | 'created_at'>): Promise<Technician> => {
    if (!isSupabaseConfigured) {
      return mockTechnicianApi.create(technician);
    }
    
    const { data, error } = await supabase
      .from('technicians')
      .insert([technician])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<Technician>): Promise<Technician> => {
    if (!isSupabaseConfigured) {
      return mockTechnicianApi.update(id, updates);
    }
    
    const { data, error } = await supabase
      .from('technicians')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Spare Parts API
export const sparePartsApi = {
  getAll: async (): Promise<SparePart[]> => {
    if (!isSupabaseConfigured) {
      return mockSparePartsApi.getAll();
    }
    
    const { data, error } = await supabase
      .from('spare_parts')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  getLowStock: async (): Promise<SparePart[]> => {
    if (!isSupabaseConfigured) {
      return mockSparePartsApi.getLowStock();
    }
    
    const { data, error } = await supabase
      .from('spare_parts')
      .select('*')
      .lt('stock_quantity', supabase.rpc('min_stock'))
      .order('stock_quantity');
    
    if (error) throw error;
    return data || [];
  },

  create: async (part: Omit<SparePart, 'id' | 'created_at'>): Promise<SparePart> => {
    if (!isSupabaseConfigured) {
      return mockSparePartsApi.create(part);
    }
    
    const { data, error } = await supabase
      .from('spare_parts')
      .insert([part])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateStock: async (id: string, quantity: number): Promise<SparePart> => {
    if (!isSupabaseConfigured) {
      return mockSparePartsApi.updateStock(id, quantity);
    }
    
    const { data, error } = await supabase
      .from('spare_parts')
      .update({ stock_quantity: quantity })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Work Orders API
export const workOrderApi = {
  getAll: async (): Promise<WorkOrder[]> => {
    if (!isSupabaseConfigured) {
      return mockWorkOrderApi.getAll();
    }
    
    const { data, error } = await supabase
      .from('work_orders')
      .select(`
        *,
        vehicles(plate, brand, model),
        technicians(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  create: async (workOrder: Omit<WorkOrder, 'id' | 'created_at'>): Promise<WorkOrder> => {
    if (!isSupabaseConfigured) {
      return mockWorkOrderApi.create(workOrder);
    }
    
    const { data, error } = await supabase
      .from('work_orders')
      .insert([workOrder])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateStatus: async (id: string, status: WorkOrder['status']): Promise<WorkOrder> => {
    if (!isSupabaseConfigured) {
      return mockWorkOrderApi.updateStatus(id, status);
    }
    
    const updates: any = { status };
    
    if (status === 'in_progress') {
      updates.started_at = new Date().toISOString();
    } else if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('work_orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    if (!isSupabaseConfigured) {
      return mockDashboardApi.getStats();
    }
    
    const [vehiclesCount, activeWorkOrders, lowStockParts] = await Promise.all([
      supabase.from('vehicles').select('id', { count: 'exact' }),
      supabase.from('work_orders').select('id', { count: 'exact' }).in('status', ['pending', 'in_progress']),
      supabase.from('spare_parts').select('id', { count: 'exact' }).lt('stock_quantity', 10)
    ]);

    return {
      total_vehicles: vehiclesCount.count || 0,
      active_work_orders: activeWorkOrders.count || 0,
      overdue_maintenance: 0, // This would need more complex logic
      low_stock_parts: lowStockParts.count || 0,
      monthly_costs: 0, // This would need to be calculated from maintenance records
      completion_rate: 85 // This would be calculated from work orders
    };
  }
};