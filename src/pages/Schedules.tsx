import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import { vehicleApi } from '../services/api';
import { Vehicle, MaintenanceSchedule } from '../types';

// Mock data for maintenance schedules
const mockSchedules: MaintenanceSchedule[] = [
  {
    id: '1',
    vehicle_id: '1',
    type: 'preventive',
    name: 'Mantenimiento 5,000 km',
    description: 'Cambio de aceite, filtros y revisión general',
    frequency_type: 'mileage',
    frequency_value: 5000,
    last_performed: '2024-01-15',
    next_due: '2024-03-15',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    vehicle_id: '2',
    type: 'preventive',
    name: 'Revisión Trimestral',
    description: 'Inspección completa de sistemas',
    frequency_type: 'time',
    frequency_value: 90,
    last_performed: '2024-01-01',
    next_due: '2024-04-01',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    vehicle_id: '4',
    type: 'predictive',
    name: 'Análisis de Vibraciones',
    description: 'Monitoreo predictivo del motor',
    frequency_type: 'hours',
    frequency_value: 500,
    next_due: '2024-02-20',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
];

export default function Schedules() {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>(mockSchedules);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    type: 'preventive' as const,
    name: '',
    description: '',
    frequency_type: 'time' as const,
    frequency_value: 30,
    is_active: true
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const vehiclesData = await vehicleApi.getAll();
        setVehicles(vehiclesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSchedule: MaintenanceSchedule = {
        id: Date.now().toString(),
        ...formData,
        next_due: calculateNextDue(formData.frequency_type, formData.frequency_value),
        created_at: new Date().toISOString()
      };
      
      setSchedules([...schedules, newSchedule]);
      setShowModal(false);
      setFormData({
        vehicle_id: '',
        type: 'preventive',
        name: '',
        description: '',
        frequency_type: 'time',
        frequency_value: 30,
        is_active: true
      });
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const calculateNextDue = (frequencyType: string, frequencyValue: number): string => {
    const now = new Date();
    if (frequencyType === 'time') {
      now.setDate(now.getDate() + frequencyValue);
    } else {
      // For mileage and hours, we'll use a default of 30 days
      now.setDate(now.getDate() + 30);
    }
    return now.toISOString().split('T')[0];
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.plate} - ${vehicle.brand} ${vehicle.model}` : 'N/A';
  };

  const isOverdue = (nextDue: string) => {
    return new Date(nextDue) < new Date();
  };

  const isDueSoon = (nextDue: string) => {
    const dueDate = new Date(nextDue);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const columns = [
    { key: 'name', header: 'Nombre del Mantenimiento' },
    { 
      key: 'vehicle_id', 
      header: 'Vehículo',
      render: (vehicleId: string) => (
        <span className="font-medium">{getVehicleInfo(vehicleId)}</span>
      )
    },
    { 
      key: 'type', 
      header: 'Tipo',
      render: (type: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          type === 'preventive' ? 'bg-blue-100 text-blue-800' :
          type === 'predictive' ? 'bg-purple-100 text-purple-800' :
          'bg-green-100 text-green-800'
        }`}>
          {type === 'preventive' ? 'Preventivo' :
           type === 'predictive' ? 'Predictivo' : 'Correctivo'}
        </span>
      )
    },
    { 
      key: 'frequency_type', 
      header: 'Frecuencia',
      render: (frequencyType: string, schedule: MaintenanceSchedule) => (
        <span>
          Cada {schedule.frequency_value} {
            frequencyType === 'time' ? 'días' :
            frequencyType === 'mileage' ? 'km' : 'horas'
          }
        </span>
      )
    },
    { 
      key: 'last_performed', 
      header: 'Último Realizado',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : 'Nunca'
    },
    { 
      key: 'next_due', 
      header: 'Próximo Vencimiento',
      render: (date: string) => (
        <div className="flex items-center">
          {isOverdue(date) ? (
            <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
          ) : isDueSoon(date) ? (
            <Clock className="h-4 w-4 text-yellow-500 mr-1" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
          )}
          <span className={
            isOverdue(date) ? 'text-red-600 font-medium' :
            isDueSoon(date) ? 'text-yellow-600 font-medium' :
            'text-gray-900'
          }>
            {new Date(date).toLocaleDateString()}
          </span>
        </div>
      )
    },
    { 
      key: 'is_active', 
      header: 'Estado',
      render: (isActive: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (value: any, schedule: MaintenanceSchedule) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            Editar
          </button>
          <button className="text-green-600 hover:text-green-800 text-sm">
            Ejecutar
          </button>
        </div>
      )
    }
  ];

  const overdueSchedules = schedules.filter(s => isOverdue(s.next_due)).length;
  const dueSoonSchedules = schedules.filter(s => isDueSoon(s.next_due)).length;
  const activeSchedules = schedules.filter(s => s.is_active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programación de Mantenimiento</h1>
          <p className="mt-2 text-gray-600">
            Gestiona los cronogramas de mantenimiento preventivo y predictivo
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Programación
        </button>
      </div>

      {/* Alerts */}
      {overdueSchedules > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-red-800 font-medium">
              Mantenimientos Vencidos
            </h3>
          </div>
          <p className="text-red-700 mt-1">
            {overdueSchedules} mantenimiento(s) están vencidos y requieren atención inmediata.
          </p>
        </div>
      )}

      {dueSoonSchedules > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-yellow-800 font-medium">
              Próximos Vencimientos
            </h3>
          </div>
          <p className="text-yellow-700 mt-1">
            {dueSoonSchedules} mantenimiento(s) vencen en los próximos 7 días.
          </p>
        </div>
      )}

      {/* Schedules Table */}
      <Table columns={columns} data={schedules} loading={loading} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Programaciones Activas</h3>
              <p className="text-2xl font-bold text-blue-600">{activeSchedules}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Vencidos</h3>
              <p className="text-2xl font-bold text-red-600">{overdueSchedules}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Próximos (7 días)</h3>
              <p className="text-2xl font-bold text-yellow-600">{dueSoonSchedules}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Al Día</h3>
              <p className="text-2xl font-bold text-green-600">
                {schedules.length - overdueSchedules - dueSoonSchedules}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Schedule Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Crear Nueva Programación">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Mantenimiento
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehículo
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.vehicle_id}
                onChange={(e) => setFormData({...formData, vehicle_id: e.target.value})}
              >
                <option value="">Seleccionar vehículo</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate} - {vehicle.brand} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Mantenimiento
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="preventive">Preventivo</option>
                <option value="predictive">Predictivo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Frecuencia
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.frequency_type}
                onChange={(e) => setFormData({...formData, frequency_type: e.target.value as any})}
              >
                <option value="time">Por Tiempo (días)</option>
                <option value="mileage">Por Kilometraje</option>
                <option value="hours">Por Horas de Motor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor de Frecuencia
              </label>
              <input
                type="number"
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.frequency_value}
                onChange={(e) => setFormData({...formData, frequency_value: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Programación activa
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Crear Programación
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}