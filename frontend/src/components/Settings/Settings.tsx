import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Bell, Shield, Database, Mail } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    // General Settings
    companyName: 'Plaza Vea',
    timezone: 'America/Lima',
    currency: 'PEN',
    language: 'es',
    
    // Notification Settings
    emailNotifications: true,
    lowStockAlerts: true,
    stockThreshold: 10,
    dailyReports: false,
    
    // Security Settings
    sessionTimeout: 30,
    passwordExpiry: 90,
    twoFactorAuth: false,
    
    // System Settings
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: 365,
    maintenanceMode: false
  });

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Simulate saving settings
    alert('Configuración guardada exitosamente');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600">Administra la configuración general del sistema</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <Save size={20} />
          <span>Guardar Cambios</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <SettingsIcon size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Configuración General</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zona Horaria
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
              >
                <option value="America/Lima">Lima (UTC-5)</option>
                <option value="America/New_York">Nueva York (UTC-5)</option>
                <option value="Europe/Madrid">Madrid (UTC+1)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
              >
                <option value="PEN">Soles Peruanos (S/)</option>
                <option value="USD">Dólares Americanos ($)</option>
                <option value="EUR">Euros (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Bell size={20} className="text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Notificaciones por Email
                </label>
                <p className="text-xs text-gray-500">Recibir alertas por correo electrónico</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Alertas de Stock Bajo
                </label>
                <p className="text-xs text-gray-500">Notificar cuando el stock esté bajo</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.lowStockAlerts}
                  onChange={(e) => handleChange('lowStockAlerts', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Umbral de Stock Bajo (%)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={settings.stockThreshold}
                onChange={(e) => handleChange('stockThreshold', parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Reportes Diarios
                </label>
                <p className="text-xs text-gray-500">Enviar reporte diario por email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.dailyReports}
                  onChange={(e) => handleChange('dailyReports', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-red-100 p-2 rounded-lg">
              <Shield size={20} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de Sesión (minutos)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiración de Contraseña (días)
              </label>
              <input
                type="number"
                min="30"
                max="365"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={settings.passwordExpiry}
                onChange={(e) => handleChange('passwordExpiry', parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Autenticación de Dos Factores
                </label>
                <p className="text-xs text-gray-500">Requerir 2FA para todos los usuarios</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <Database size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Sistema</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Respaldo Automático
                </label>
                <p className="text-xs text-gray-500">Crear respaldos automáticos de la base de datos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.autoBackup}
                  onChange={(e) => handleChange('autoBackup', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frecuencia de Respaldo
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={settings.backupFrequency}
                onChange={(e) => handleChange('backupFrequency', e.target.value)}
                disabled={!settings.autoBackup}
              >
                <option value="hourly">Cada hora</option>
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retención de Datos (días)
              </label>
              <input
                type="number"
                min="30"
                max="2555"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={settings.dataRetention}
                onChange={(e) => handleChange('dataRetention', parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Modo Mantenimiento
                </label>
                <p className="text-xs text-gray-500">Deshabilitar acceso para mantenimiento</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-700">Versión del Sistema</p>
            <p className="text-lg font-semibold text-gray-900">v2.1.0</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Última Actualización</p>
            <p className="text-lg font-semibold text-gray-900">01 Julio 2025</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Base de Datos</p>
            <p className="text-lg font-semibold text-gray-900">MySQL Workbench 8.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;