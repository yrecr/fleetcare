import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Clock, User, Wrench, AlertCircle } from 'lucide-react';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import { workOrderApi, vehicleApi, technicianApi } from '../services/api';
import { WorkOrder, Vehicle, Technician } from '../types';

export default function WorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<WorkOrder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<WorkOrder | null>(null);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    technician_id: '',
    title: '',
    description: '',
    priority: 'medium' as const,
    estimated_hours: 1
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, vehiclesData, techniciansData] = await Promise.all([
          workOrderApi.getAll(),
          vehicleApi.getAll(),
          technicianApi.getAll()
        ]);
        
        setWorkOrders(ordersData);
        setFilteredOrders(ordersData);
        setVehicles(vehiclesData);
        setTechnicians(techniciansData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = workOrders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(order => order.priority === priorityFilter);
    }

    setFilteredOrders(filtered);
  }, [workOrders, searchTerm, statusFilter, priorityFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newOrder = await workOrderApi.create(formData);
      setWorkOrders([...workOrders, newOrder]);
      setShowModal(false);
      setFormData({
        vehicle_id: '',
        technician_id: '',
        title: '',
        description: '',
        priority: 'medium',
        estimated_hours: 1
      });
    } catch (error) {
      console.error('Error creating work order:', error);
    }
  };

  const handleEdit = (order: WorkOrder) => {
    setEditingOrder(order);
    setFormData({
      vehicle_id: order.vehicle_id,
      technician_id: order.technician_id,
      title: order.title,
      description: order.description,
      priority: order.priority,
      estimated_hours: order.estimated_hours
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    
    try {
      // Simular actualización de orden
      const updatedOrder = { ...editingOrder, ...formData };
      setWorkOrders(orders => 
        orders.map(order => order.id === editingOrder.id ? updatedOrder : order)
      );
      setShowEditModal(false);
      setEditingOrder(null);
      setFormData({
        vehicle_id: '',
        technician_id: '',
        title: '',
        description: '',
        priority: 'medium',
        estimated_hours: 1
      });
    } catch (error) {
      console.error('Error updating work order:', error);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: WorkOrder['status']) => {
    try {
      const updatedOrder = await workOrderApi.updateStatus(orderId, newStatus);
      setWorkOrders(orders => 
        orders.map(order => order.id === orderId ? updatedOrder : order)
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getVehiclePlate = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.plate : 'N/A';
  };

  const getTechnicianName = (technicianId: string) => {
    const technician = technicians.find(t => t.id === technicianId);
    return technician ? technician.name : 'Sin asignar';
  };

  const columns = [
    { key: 'title', header: 'Título' },
    { 
      key: 'vehicle_id', 
      header: 'Vehículo',
      render: (vehicleId: string) => (
        <span className="font-medium">{getVehiclePlate(vehicleId)}</span>
      )
    },
    { 
      key: 'technician_id', 
      header: 'Técnico',
      render: (technicianId: string) => (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-gray-400" />
          {getTechnicianName(technicianId)}
        </div>
      )
    },
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
      render: (status: string, order: WorkOrder) => (
        <select
          value={status}
          onChange={(e) => handleStatusChange(order.id, e.target.value as WorkOrder['status'])}
          className={`px-2 py-1 rounded text-xs font-medium border-0 ${
            status === 'completed' ? 'bg-green-100 text-green-800' :
            status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}
        >
          <option value="pending">Pendiente</option>
          <option value="in_progress">En Progreso</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      )
    },
    { 
      key: 'estimated_hours', 
      header: 'Horas Est.',
      render: (hours: number) => (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-gray-400" />
          {hours}h
        </div>
      )
    },
    { 
      key: 'total_cost', 
      header: 'Costo Total',
      render: (cost: number) => cost ? `$${cost.toFixed(2)}` : '-'
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (value: any, order: WorkOrder) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            Ver
          </button>
          <button 
            onClick={() => handleEdit(order)}
            className="text-green-600 hover:text-green-800 text-sm"
          >
            Editar
          </button>
        </div>
      )
    }
  ];

  const pendingOrders = workOrders.filter(order => order.status === 'pending').length;
  const inProgressOrders = workOrders.filter(order => order.status === 'in_progress').length;
  const completedOrders = workOrders.filter(order => order.status === 'completed').length;
  const urgentOrders = workOrders.filter(order => order.priority === 'urgent').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Órdenes de Trabajo</h1>
          <p className="mt-2 text-gray-600">
            Gestiona las tareas de mantenimiento y reparación
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Orden
        </button>
      </div>

      {/* Urgent Orders Alert */}
      {urgentOrders > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-red-800 font-medium">
              Órdenes Urgentes
            </h3>
          </div>
          <p className="text-red-700 mt-1">
            Hay {urgentOrders} orden(es) marcada(s) como urgente(s) que requieren atención inmediata.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar órdenes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div className="relative">
            <AlertCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Todas las prioridades</option>
              <option value="urgent">Urgente</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>

          <div className="flex justify-end">
            <span className="text-sm text-gray-600 flex items-center">
              Total: {filteredOrders.length} órdenes
            </span>
          </div>
        </div>
      </div>

      {/* Work Orders Table */}
      <Table columns={columns} data={filteredOrders} loading={loading} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pendientes</h3>
              <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <Wrench className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">En Progreso</h3>
              <p className="text-2xl font-bold text-blue-600">{inProgressOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Completadas</h3>
              <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Urgentes</h3>
              <p className="text-2xl font-bold text-red-600">{urgentOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Work Order Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Crear Nueva Orden de Trabajo">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título de la Orden
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                Técnico Asignado
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.technician_id}
                onChange={(e) => setFormData({...formData, technician_id: e.target.value})}
              >
                <option value="">Seleccionar técnico</option>
                {technicians.filter(t => t.status === 'available').map(technician => (
                  <option key={technician.id} value={technician.id}>
                    {technician.name} - {technician.specialties.join(', ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horas Estimadas
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.estimated_hours}
                onChange={(e) => setFormData({...formData, estimated_hours: parseFloat(e.target.value)})}
              />
            </div>
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
              Crear Orden
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Work Order Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Orden de Trabajo">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título de la Orden
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                Técnico Asignado
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.technician_id}
                onChange={(e) => setFormData({...formData, technician_id: e.target.value})}
              >
                <option value="">Seleccionar técnico</option>
                {technicians.map(technician => (
                  <option key={technician.id} value={technician.id}>
                    {technician.name} - {technician.specialties.join(', ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horas Estimadas
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.estimated_hours}
                onChange={(e) => setFormData({...formData, estimated_hours: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Actualizar Orden
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}