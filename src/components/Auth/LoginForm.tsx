import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Truck, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured) {
      setError('La base de datos no está configurada. Por favor, haz clic en "Connect to Supabase" en la esquina superior derecha.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Truck className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">FleetCare</h2>
            <p className="mt-2 text-gray-600">Sistema de Gestión de Mantenimiento Vehicular</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mt-6 bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg">
              <p className="text-sm">
                <strong>Modo Demo:</strong> Usa las credenciales demo para explorar el sistema sin configurar base de datos.
              </p>
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="admin@fleetcare.com"
                  placeholder="demo@fleetcare.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <button className="font-medium text-blue-600 hover:text-blue-500">
                Contacta al administrador
              </button>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
          <h3 className="font-medium mb-2">
            {isSupabaseConfigured ? 'Credenciales de Producción:' : 'Credenciales Demo:'}
          </h3>
          <p>Email: {isSupabaseConfigured ? 'admin@fleetcare.com' : 'demo@fleetcare.com'}</p>
          <p>Contraseña: {isSupabaseConfigured ? 'admin123' : 'demo123'}</p>
          {!isSupabaseConfigured && (
            <p className="mt-2 text-xs opacity-80">
              * Modo demo con datos simulados - No requiere configuración
            </p>
          )}
        </div>
      </div>
    </div>
  );
}