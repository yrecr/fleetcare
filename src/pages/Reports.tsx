import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Calendar, TrendingUp, DollarSign, Wrench, AlertTriangle } from 'lucide-react';
import { vehicleApi, workOrderApi, sparePartsApi } from '../services/api';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Reports() {
  const [vehicles, setVehicles] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vehiclesData, workOrdersData, sparePartsData] = await Promise.all([
          vehicleApi.getAll(),
          workOrderApi.getAll(),
          sparePartsApi.getAll()
        ]);
        
        setVehicles(vehiclesData);
        setWorkOrders(workOrdersData);
        setSpareParts(sparePartsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Mock data for charts
  const monthlyMaintenanceCosts = [
    { month: 'Ene', cost: 2500, orders: 8 },
    { month: 'Feb', cost: 3200, orders: 12 },
    { month: 'Mar', cost: 2800, orders: 10 },
    { month: 'Abr', cost: 3500, orders: 15 },
    { month: 'May', cost: 2900, orders: 11 },
    { month: 'Jun', cost: 4100, orders: 18 }
  ];

  const vehicleStatusData = [
    { name: 'Activos', value: vehicles.filter(v => v.status === 'active').length, color: '#10B981' },
    { name: 'Mantenimiento', value: vehicles.filter(v => v.status === 'maintenance').length, color: '#F59E0B' },
    { name: 'Inactivos', value: vehicles.filter(v => v.status === 'inactive').length, color: '#EF4444' }
  ];

  const workOrdersByPriority = [
    { name: 'Baja', value: workOrders.filter(wo => wo.priority === 'low').length },
    { name: 'Media', value: workOrders.filter(wo => wo.priority === 'medium').length },
    { name: 'Alta', value: workOrders.filter(wo => wo.priority === 'high').length },
    { name: 'Urgente', value: workOrders.filter(wo => wo.priority === 'urgent').length }
  ];

  const maintenanceEfficiency = [
    { month: 'Ene', planned: 85, completed: 78 },
    { month: 'Feb', planned: 92, completed: 88 },
    { month: 'Mar', planned: 88, completed: 85 },
    { month: 'Abr', planned: 95, completed: 90 },
    { month: 'May', planned: 90, completed: 87 },
    { month: 'Jun', planned: 93, completed: 91 }
  ];

  const generatePDFReport = () => {
    // Mock PDF generation
    alert('Generando reporte PDF... (Funcionalidad demo)');
  };

  const exportToExcel = () => {
    // Mock Excel export
    alert('Exportando a Excel... (Funcionalidad demo)');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p className="mt-2 text-gray-600">
            Análisis detallado del rendimiento y costos de mantenimiento
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Año</option>
          </select>
          <button
            onClick={generatePDFReport}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Costo Total Mensual</h3>
              <p className="text-2xl font-bold text-green-600">$4,100</p>
              <p className="text-sm text-gray-500">+12% vs mes anterior</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <Wrench className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">MTBF Promedio</h3>
              <p className="text-2xl font-bold text-blue-600">45 días</p>
              <p className="text-sm text-gray-500">+5% vs mes anterior</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">MTTR Promedio</h3>
              <p className="text-2xl font-bold text-purple-600">2.5 horas</p>
              <p className="text-sm text-gray-500">-8% vs mes anterior</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Disponibilidad</h3>
              <p className="text-2xl font-bold text-yellow-600">91%</p>
              <p className="text-sm text-gray-500">+3% vs mes anterior</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Costs Chart */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Costos de Mantenimiento Mensual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyMaintenanceCosts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'cost' ? `$${value}` : value,
                name === 'cost' ? 'Costo' : 'Órdenes'
              ]} />
              <Bar dataKey="cost" fill="#3B82F6" name="cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Status Pie Chart */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Vehículos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {vehicleStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Orders by Priority */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Órdenes de Trabajo por Prioridad</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workOrdersByPriority} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Efficiency */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eficiencia de Mantenimiento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={maintenanceEfficiency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, '']} />
              <Line type="monotone" dataKey="planned" stroke="#3B82F6" name="Planificado" />
              <Line type="monotone" dataKey="completed" stroke="#10B981" name="Completado" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Maintenance Costs by Vehicle */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehículos con Mayor Costo</h3>
          <div className="space-y-3">
            {vehicles.slice(0, 5).map((vehicle, index) => (
              <div key={vehicle.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{vehicle.plate}</span>
                  <span className="text-gray-500 ml-2">{vehicle.brand} {vehicle.model}</span>
                </div>
                <span className="font-bold text-red-600">
                  ${(Math.random() * 2000 + 500).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Used Spare Parts */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Repuestos Más Utilizados</h3>
          <div className="space-y-3">
            {spareParts.slice(0, 5).map((part, index) => (
              <div key={part.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{part.name}</span>
                  <span className="text-gray-500 ml-2">{part.part_number}</span>
                </div>
                <span className="font-bold text-blue-600">
                  {Math.floor(Math.random() * 20 + 5)} usos
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Report */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Ejecutivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="font-medium text-gray-900 mb-2">Rendimiento General</h4>
            <div className="text-3xl font-bold text-green-600 mb-1">Excelente</div>
            <p className="text-sm text-gray-500">
              Los indicadores muestran una mejora del 8% en eficiencia operativa
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-medium text-gray-900 mb-2">Áreas de Mejora</h4>
            <div className="text-3xl font-bold text-yellow-600 mb-1">2</div>
            <p className="text-sm text-gray-500">
              Tiempo de respuesta y gestión de inventario requieren atención
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-medium text-gray-900 mb-2">Ahorro Proyectado</h4>
            <div className="text-3xl font-bold text-blue-600 mb-1">$12,500</div>
            <p className="text-sm text-gray-500">
              Ahorro estimado con optimización de mantenimiento preventivo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}