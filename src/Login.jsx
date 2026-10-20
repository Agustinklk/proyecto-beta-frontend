import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [rol, setRol] = useState('Supervisor de Terreno');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(rol);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <span className="inline-block bg-sky-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded mb-2">
            FYAG
          </span>
          <h1 className="text-2xl font-bold text-white">Frío y Agroindustria SpA</h1>
          <p className="text-xs text-slate-400 mt-1">Gestión Centralizada de Obras y Presupuestos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Correo Corporativo
            </label>
            <input
              type="email"
              required
              defaultValue="admin@fyag.cl"
              placeholder="nombre@fyag.cl"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              defaultValue="123456"
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Rol de Acceso (5 Roles FYAG)
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-sky-500 transition-colors cursor-pointer"
            >
              <option value="Supervisor de Terreno">Supervisor de Terreno</option>
              <option value="Técnico de Mantenimiento">Técnico de Mantenimiento</option>
              <option value="Finanzas / Administración">Finanzas / Administración</option>
              <option value="Gerencia General">Gerencia General</option>
              <option value="Administrador del Sistema">Administrador del Sistema</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm shadow-lg shadow-sky-500/20 cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}