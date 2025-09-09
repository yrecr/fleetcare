import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Users, 
  Package, 
  ClipboardList, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';
import StatCard from '../components/UI/StatCard';
import Table from '../components/UI/Table';
import { dashboardApi, vehicleApi, workOrderApi } from '../services/api';
import { DashboardStats, Vehicle, WorkOrder } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentVehicles, setRecentVehicles] = useState<Vehicle[]>([]);
  const [activeWorkOrders, setActiveWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, vehiclesData, workOrdersData] = await Promise.all([
          dashboardApi.getStats(),
          vehicleApi.getAll(),
          workOrderApi.getAll()
        ]);

        setStats(statsData);
        setRecentVehicles(vehiclesData.slice(0, 5));
        setActiveWorkOrders(workOrdersData.filter(wo => wo.status === 'in_progress').slice(0, 5));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const vehicleColumns = [
    { key: 'plate', header: 'Placa' },
    { key: 'brand', header: 'Marca' },
    { key: 'model', header: 'Modelo' },
    { 
      key: 'status', 
      header: 'Estado',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'active' ? 'bg-green-100 text-green-800' :
          status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {status === 'active' ? 'Activo' : 
           status === 'maintenance' ? 'Mantenimiento' : 'Inactivo'}
        </span>
      )
    }
  ];

  const workOrderColumns = [
    { key: 'title', header: 'Título' },
    { key: 'vehicle_plate', header: 'Vehículo', render: (value: any, row: WorkOrder) => `${row.vehicle_id}` },
    { 
      key: 'priority', 
      header: 'Prioridad',
      render: (priority: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          priority === 'urgent' ? 'bg-red-100 text-red-800' :
          priority === 'high' ? 'bg-orange-100 text-orange-800' :
          priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {priority === 'urgent' ? 'Urgente' :
           priority === 'high' ? 'Alta' :
           priority === 'medium' ? 'Media' : 'Baja'}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Estado',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'completed' ? 'bg-green-100 text-green-800' :
          status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {status === 'completed' ? 'Completado' :
           status === 'in_progress' ? 'En Progreso' :
           status === 'pending' ? 'Pendiente' : 'Cancelado'}
        </span>
      )
    }
  ];

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Resumen general del sistema de gestión de mantenimiento vehicular
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Vehículos"
          value={stats.total_vehicles}
          icon={Truck}
          color="blue"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Órdenes Activas"
          value={stats.active_work_orders}
          icon={ClipboardList}
          color="yellow"
          trend={{ value: 12, isPositive: false }}
        />
        <StatCard
          title="Stock Bajo"
          value={stats.low_stock_parts}
          icon={AlertTriangle}
          color="red"
          trend={{ value: 8, isPositive: false }}
        />
        <StatCard
          title="Eficiencia"
          value={`${stats.completion_rate}%`}
          icon={TrendingUp}
          color="green"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehículos Recientes</h2>
          <Table columns={vehicleColumns} data={recentVehicles} loading={false} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Órdenes en Progreso</h2>
          <Table columns={workOrderColumns} data={activeWorkOrders} loading={false} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <Truck className="h-5 w-5 mr-2" />
            Nuevo Vehículo
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <ClipboardList className="h-5 w-5 mr-2" />
            Nueva Orden
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <Users className="h-5 w-5 mr-2" />
            Asignar Técnico
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
            <Package className="h-5 w-5 mr-2" />
            Solicitar Repuesto
          </button>
        </div>
      </div>
    </div>
  );
}