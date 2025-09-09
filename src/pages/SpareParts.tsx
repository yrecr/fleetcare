import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Package, AlertTriangle, TrendingDown } from 'lucide-react';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import { sparePartsApi } from '../services/api';
import { SparePart } from '../types';

export default function SpareParts() {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [filteredParts, setFilteredParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    part_number: '',
    category: '',
    stock_quantity: 0,
    min_stock: 5,
    max_stock: 50,
    unit_price: 0,
    supplier: '',
    location: ''
  });

  useEffect(() => {
    const loadSpareParts = async () => {
      try {
        const data = await sparePartsApi.getAll();
        setSpareParts(data);
        setFilteredParts(data);
      } catch (error) {
        console.error('Error loading spare parts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSpareParts();
  }, []);

  useEffect(() => {
    let filtered = spareParts;

    if (searchTerm) {
      filtered = filtered.filter(part =>
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(part => part.category === categoryFilter);
    }

    if (stockFilter === 'low') {
      filtered = filtered.filter(part => part.stock_quantity <= part.min_stock);
    } else if (stockFilter === 'high') {
      filtered = filtered.filter(part => part.stock_quantity >= part.max_stock);
    }

    setFilteredParts(filtered);
  }, [spareParts, searchTerm, categoryFilter, stockFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPart = await sparePartsApi.create(formData);
      setSpareParts([...spareParts, newPart]);
      setShowModal(false);
      setFormData({
        name: '',
        part_number: '',
        category: '',
        stock_quantity: 0,
        min_stock: 5,
        max_stock: 50,
        unit_price: 0,
        supplier: '',
        location: ''
      });
    } catch (error) {
      console.error('Error creating spare part:', error);
    }
  };

  const categories = [...new Set(spareParts.map(part => part.category))];

  const columns = [
    { key: 'name', header: 'Nombre' },
    { key: 'part_number', header: 'Código' },
    { 
      key: 'category', 
      header: 'Categoría',
      render: (category: string) => (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full capitalize">
          {category}
        </span>
      )
    },
    { 
      key: 'stock_quantity', 
      header: 'Stock',
      render: (stock: number, part: SparePart) => (
        <div className="flex items-center">
          <span className={`font-medium ${
            stock <= part.min_stock ? 'text-red-600' :
            stock >= part.max_stock ? 'text-green-600' : 'text-gray-900'
          }`}>
            {stock}
          </span>
          {stock <= part.min_stock && (
            <AlertTriangle className="h-4 w-4 ml-1 text-red-500" />
          )}
        </div>
      )
    },
    { 
      key: 'min_stock', 
      header: 'Stock Mín.',
      render: (value: number) => <span className="text-gray-600">{value}</span>
    },
    { 
      key: 'unit_price', 
      header: 'Precio Unit.',
      render: (price: number) => `$${price.toFixed(2)}`
    },
    { key: 'supplier', header: 'Proveedor' },
    { key: 'location', header: 'Ubicación' },
    {
      key: 'actions',
      header: 'Acciones',
      render: (value: any, part: SparePart) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            Editar
          </button>
          <button className="text-green-600 hover:text-green-800 text-sm">
            Ajustar Stock
          </button>
        </div>
      )
    }
  ];

  const lowStockParts = spareParts.filter(part => part.stock_quantity <= part.min_stock);
  const totalValue = spareParts.reduce((sum, part) => sum + (part.stock_quantity * part.unit_price), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Control de Inventario</h1>
          <p className="mt-2 text-gray-600">
            Gestiona el inventario de repuestos y suministros
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Repuesto
        </button>
      </div>

      {/* Alerts */}
      {lowStockParts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-red-800 font-medium">
              Alerta de Stock Bajo
            </h3>
          </div>
          <p className="text-red-700 mt-1">
            {lowStockParts.length} repuesto(s) tienen stock por debajo del mínimo requerido.
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
              placeholder="Buscar repuestos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Package className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">Todos los stocks</option>
              <option value="low">Stock bajo</option>
              <option value="high">Stock alto</option>
            </select>
          </div>

          <div className="flex justify-end">
            <span className="text-sm text-gray-600 flex items-center">
              Total: {filteredParts.length} repuestos
            </span>
          </div>
        </div>
      </div>

      {/* Spare Parts Table */}
      <Table columns={columns} data={filteredParts} loading={loading} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Repuestos</h3>
              <p className="text-2xl font-bold text-blue-600">{spareParts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Stock Bajo</h3>
              <p className="text-2xl font-bold text-red-600">{lowStockParts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Valor Total</h3>
              <p className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center">
            <Filter className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Categorías</h3>
              <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Spare Part Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Agregar Nuevo Repuesto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Repuesto
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
                Código/Número de Parte
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.part_number}
                onChange={(e) => setFormData({...formData, part_number: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Seleccionar categoría</option>
                <option value="motor">Motor</option>
                <option value="frenos">Frenos</option>
                <option value="suspension">Suspensión</option>
                <option value="electricidad">Electricidad</option>
                <option value="carroceria">Carrocería</option>
                <option value="neumaticos">Neumáticos</option>
                <option value="filtros">Filtros</option>
                <option value="lubricantes">Lubricantes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proveedor
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Actual
              </label>
              <input
                type="number"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Mínimo
              </label>
              <input
                type="number"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.min_stock}
                onChange={(e) => setFormData({...formData, min_stock: parseInt(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Máximo
              </label>
              <input
                type="number"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.max_stock}
                onChange={(e) => setFormData({...formData, max_stock: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Unitario ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.unit_price}
                onChange={(e) => setFormData({...formData, unit_price: parseFloat(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación en Almacén
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
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
              Guardar Repuesto
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}