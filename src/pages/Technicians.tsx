import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, User, Phone, Mail, Clock } from 'lucide-react';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import { technicianApi } from '../services/api';
import { Technician } from '../types';

export default function Technicians() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialties: [] as string[],
    phone: '',
    email: '',
    status: 'available' as const
  });

  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        const data = await technicianApi.getAll();
        setTechnicians(data);
        setFilteredTechnicians(data);
      } catch (error) {
        console.error('Error loading technicians:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTechnicians();
  }, []);

  useEffect(() => {
    let filtered = technicians;

    if (searchTerm) {
      filtered = filtered.filter(tech =>
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(tech => tech.status === statusFilter);
    }

    setFilteredTechnicians(filtered);
  }, [technicians, searchTerm, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTechnician = await technicianApi.create(formData);
      setTechnicians([...technicians, newTechnician]);
      setShowModal(false);
      setFormData({
        name: '',
        specialties: [],
        phone: '',
        email: '',
        status: 'available'
      });
    } catch (error) {
      console.error('Error creating technician:', error);
    }
  };

  const handleSpecialtyChange = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const availableSpecialties = [
    'motor', 'transmision', 'frenos', 'suspension', 'electricidad', 
    'electronica', 'aire_acondicionado', 'carroceria', 'neumaticos'
  ];

  const columns = [
    { key: 'name', header: 'Nombre' },
    { 
      key: 'specialties', 
      header: 'Especialidades',
      render: (specialties: string[]) => (
        <div className="flex flex-wrap gap-1">
          {specialties.map(spec => (
            <span key={spec} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {spec.replace('_', ' ')}
            </span>
          ))}
        </div>
      )
    },
    { 
      key: 'phone', 
      header: 'Teléfono',
      render: (phone: string) => (
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          {phone}
        </div>
      )
    },
    { 
      key: 'email', 
      header: 'Email',
      render: (email: string) => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-gray-400" />
          {email}
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'Estado',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'available' ? 'bg-green-100 text-green-800' :
          status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {status === 'available' ? 'Disponible' : 
           status === 'busy' ? 'Ocupado' : 'De Licencia'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (value: any, technician: Technician) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            Editar
          </button>
          <button className="text-green-600 hover:text-green-800 text-sm">
            Historial
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Técnicos</h1>
          <p className="mt-2 text-gray-600">
            Administra el personal técnico y sus especialidades
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Técnico
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o especialidad..."
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
              <option value="available">Disponible</option>
              <option value="busy">Ocupado</option>
              <option value="on_leave">De Licencia</option>
            </select>
          </div>

          <div className="flex justify-end">
            <span className="text-sm text-gray-600 flex items-center">
              Total: {filteredTechnicians.length} técnicos
            </span>
          </div>
        </div>
      </div>

      {/* Technicians Table */}
      <Table columns={columns} data={filteredTechnicians} loading={loading} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Técnicos Disponibles</h3>
          <p className="text-3xl font-bold text-green-600">
            {technicians.filter(t => t.status === 'available').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Técnicos Ocupados</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {technicians.filter(t => t.status === 'busy').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Especialidades Únicas</h3>
          <p className="text-3xl font-bold text-blue-600">
            {new Set(technicians.flatMap(t => t.specialties)).size}
          </p>
        </div>
      </div>

      {/* Add Technician Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Agregar Nuevo Técnico">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
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
              Especialidades
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableSpecialties.map(specialty => (
                <label key={specialty} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.specialties.includes(specialty)}
                    onChange={() => handleSpecialtyChange(specialty)}
                    className="mr-2"
                  />
                  <span className="text-sm">{specialty.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as any})}
            >
              <option value="available">Disponible</option>
              <option value="busy">Ocupado</option>
              <option value="on_leave">De Licencia</option>
            </select>
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
              Guardar Técnico
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}