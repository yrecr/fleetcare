import { 
  mockVehicles, 
  mockTechnicians, 
  mockSpareParts, 
  mockWorkOrders, 
  mockDashboardStats 
} from './mockData';
import { Vehicle, Technician, SparePart, WorkOrder, DashboardStats } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Vehicles API
export const mockVehicleApi = {
  getAll: async (): Promise<Vehicle[]> => {
    await delay(500);
    return [...mockVehicles];
  },

  getById: async (id: string): Promise<Vehicle | null> => {
    await delay(300);
    return mockVehicles.find(v => v.id === id) || null;
  },

  create: async (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<Vehicle> => {
    await delay(800);
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockVehicles.push(newVehicle);
    return newVehicle;
  },

  update: async (id: string, updates: Partial<Vehicle>): Promise<Vehicle> => {
    await delay(600);
    const index = mockVehicles.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vehicle not found');
    
    mockVehicles[index] = {
      ...mockVehicles[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return mockVehicles[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(400);
    const index = mockVehicles.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vehicle not found');
    mockVehicles.splice(index, 1);
  }
};

// Mock Technicians API
export const mockTechnicianApi = {
  getAll: async (): Promise<Technician[]> => {
    await delay(400);
    return [...mockTechnicians];
  },

  create: async (technician: Omit<Technician, 'id' | 'created_at'>): Promise<Technician> => {
    await delay(700);
    const newTechnician: Technician = {
      ...technician,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    mockTechnicians.push(newTechnician);
    return newTechnician;
  },

  update: async (id: string, updates: Partial<Technician>): Promise<Technician> => {
    await delay(500);
    const index = mockTechnicians.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Technician not found');
    
    mockTechnicians[index] = { ...mockTechnicians[index], ...updates };
    return mockTechnicians[index];
  }
};

// Mock Spare Parts API
export const mockSparePartsApi = {
  getAll: async (): Promise<SparePart[]> => {
    await delay(450);
    return [...mockSpareParts];
  },

  getLowStock: async (): Promise<SparePart[]> => {
    await delay(300);
    return mockSpareParts.filter(part => part.stock_quantity <= part.min_stock);
  },

  create: async (part: Omit<SparePart, 'id' | 'created_at'>): Promise<SparePart> => {
    await delay(600);
    const newPart: SparePart = {
      ...part,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    mockSpareParts.push(newPart);
    return newPart;
  },

  updateStock: async (id: string, quantity: number): Promise<SparePart> => {
    await delay(400);
    const index = mockSpareParts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Part not found');
    
    mockSpareParts[index].stock_quantity = quantity;
    return mockSpareParts[index];
  }
};

// Mock Work Orders API
export const mockWorkOrderApi = {
  getAll: async (): Promise<WorkOrder[]> => {
    await delay(500);
    return [...mockWorkOrders];
  },

  create: async (workOrder: Omit<WorkOrder, 'id' | 'created_at'>): Promise<WorkOrder> => {
    await delay(700);
    const newWorkOrder: WorkOrder = {
      ...workOrder,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    mockWorkOrders.push(newWorkOrder);
    return newWorkOrder;
  },

  updateStatus: async (id: string, status: WorkOrder['status']): Promise<WorkOrder> => {
    await delay(500);
    const index = mockWorkOrders.findIndex(wo => wo.id === id);
    if (index === -1) throw new Error('Work order not found');
    
    const updates: any = { status };
    
    if (status === 'in_progress') {
      updates.started_at = new Date().toISOString();
    } else if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    mockWorkOrders[index] = { ...mockWorkOrders[index], ...updates };
    return mockWorkOrders[index];
  }
};

// Mock Dashboard API
export const mockDashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    await delay(600);
    return { ...mockDashboardStats };
  }
}