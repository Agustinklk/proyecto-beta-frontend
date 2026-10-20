import React, { useState } from 'react';
import Login from './Login';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('Supervisor de Terreno');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterComuna, setFilterComuna] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [obraDetalle, setObraDetalle] = useState(null);
  const [obraPDF, setObraPDF] = useState(null);

  // Lista de Obras
  const [obras, setObras] = useState([
    {
      id: 'OBR-2026-01',
      cliente: 'Agrícola San Carlos SpA',
      comuna: 'San Carlos',
      servicio: 'Climatización',
      monto: 3300000,
      estado: 'En proceso',
      equipos: ['Central Frigorífica 30 HP', 'Evaporador Bitzer', 'Tablero Control PLC'],
      bitacora: 'Montaje de tuberías de refrigerante completado al 80%. Pruebas de presión programadas.'
    },
    {
      id: 'OBR-2026-02',
      cliente: 'Frutícola Chillán',
      comuna: 'Chillán',
      servicio: 'Mantención',
      monto: 720000,
      estado: 'Finalizada',
      equipos: ['Cámara de Conservación #2', 'Compresor Reciprocante R-404A'],
      bitacora: 'Limpieza de condensadores y recarga de aceite sintético. Parámetros operativos OK.'
    },
    {
      id: 'OBR-2026-03',
      cliente: 'Packing Coihueco',
      comuna: 'Coihueco',
      servicio: 'Emergencia',
      monto: 2250000,
      estado: 'Suspendida',
      equipos: ['Chiller 50 TR', 'Bomba de Glicol Primary'],
      bitacora: 'Fuga detectada en serpentín principal. Esperando repuesto importado desde Santiago.'
    },
    {
      id: 'OBR-2026-04',
      cliente: 'Congelados Bulnes',
      comuna: 'Bulnes',
      servicio: 'Proyecto Eléctrico',
      monto: 3500000,
      estado: 'En proceso',
      equipos: ['Gabinete Fuerza y Control 380V', 'Variadores de Frecuencia Danfoss'],
      bitacora: 'Cableado de fuerza finalizado. Pendiente programación de sensores de temperatura.'
    },
  ]);

  // Formulario para Nueva Obra
  const [nuevaObra, setNuevaObra] = useState({
    cliente: '',
    comuna: 'Chillán',
    servicio: 'Climatización',
    monto: '',
    estado: 'En proceso',
    equipos: '',
    bitacora: ''
  });

  // Permisos por Rol
  const esAdmin = userRole === 'Administrador del Sistema';
  const esGerencia = userRole === 'Gerencia General' || esAdmin;
  const esFinanzas = userRole === 'Finanzas / Administración' || esGerencia;
  const esTerreno = userRole === 'Supervisor de Terreno' || userRole === 'Técnico de Mantenimiento' || esGerencia;

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={(selectedRole) => {
          setIsLoggedIn(true);
          setUserRole(selectedRole);
        }}
      />
    );
  }

  // KPIs
  const enTerrenoCount = obras.filter((o) => o.estado === 'En proceso').length;
  const finalizadasCount = obras.filter((o) => o.estado === 'Finalizada').length;
  const suspendidasCount = obras.filter((o) => o.estado === 'Suspendida').length;
  const totalMonto = obras.reduce((acc, curr) => acc + curr.monto, 0);

  const formatCLP = (val) => `$${val.toLocaleString('es-CL')}`;

  const chartData = [
    { servicio: 'Climatización', monto: obras.filter((o) => o.servicio === 'Climatización').reduce((a, b) => a + b.monto, 0) },
    { servicio: 'Mantención', monto: obras.filter((o) => o.servicio === 'Mantención').reduce((a, b) => a + b.monto, 0) },
    { servicio: 'Emergencia', monto: obras.filter((o) => o.servicio === 'Emergencia').reduce((a, b) => a + b.monto, 0) },
    { servicio: 'Proyecto Eléctrico', monto: obras.filter((o) => o.servicio === 'Proyecto Eléctrico').reduce((a, b) => a + b.monto, 0) },
  ];

  const handleGuardarObra = (e) => {
    e.preventDefault();
    if (!nuevaObra.cliente || !nuevaObra.monto) return;

    const item = {
      id: `OBR-2026-0${obras.length + 1}`,
      cliente: nuevaObra.cliente,
      comuna: nuevaObra.comuna,
      servicio: nuevaObra.servicio,
      monto: parseInt(nuevaObra.monto, 10),
      estado: nuevaObra.estado,
      equipos: nuevaObra.equipos ? nuevaObra.equipos.split(',').map(s => s.trim()) : ['Equipos por definir'],
      bitacora: nuevaObra.bitacora || 'Obra ingresada al sistema. Pendiente primera inspección.'
    };

    setObras([item, ...obras]);
    setNuevaObra({ cliente: '', comuna: 'Chillán', servicio: 'Climatización', monto: '', estado: 'En proceso', equipos: '', bitacora: '' });
    setIsModalOpen(false);
  };

  const obrasFiltradas = obras.filter((o) => {
    const matchStatus = filterStatus === 'Todos' || o.estado === filterStatus;
    const matchComuna = filterComuna === 'Todas' || o.comuna === filterComuna;
    const matchSearch =
      o.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchComuna && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 p-6 font-sans">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-600">
        <div className="flex items-center gap-3">
          <span className="bg-sky-400 text-slate-950 font-bold px-2.5 py-1 rounded text-sm tracking-wider">
            FYAG
          </span>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Frío y Agroindustria SpA</h1>
            <p className="text-xs text-slate-300">
              Gestión de Obras y Presupuestos — Rol: <strong className="text-sky-300">{userRole}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {esTerreno && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span className="text-base font-bold">+</span> Nueva Obra
            </button>
          )}

          <div className="h-6 w-px bg-slate-600"></div>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-3 py-1.5 bg-slate-700 hover:bg-red-900/50 hover:text-red-200 text-slate-200 border border-slate-600 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Tarjetas KPI */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-700 border border-slate-600 rounded-xl p-5 shadow-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Obras en Terreno</span>
          <p className="text-3xl font-extrabold text-white mt-2">{enTerrenoCount}</p>
          <span className="text-xs text-sky-300 mt-2 block font-medium">Activas en plantas</span>
        </div>

        <div className="bg-slate-700 border border-slate-600 rounded-xl p-5 shadow-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Obras Finalizadas</span>
          <p className="text-3xl font-extrabold text-white mt-2">{finalizadasCount}</p>
          <span className="text-xs text-emerald-300 mt-2 block font-medium">Listas para facturar</span>
        </div>

        <div className="bg-slate-700 border border-slate-600 rounded-xl p-5 shadow-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Suspendidas / Alerta</span>
          <p className="text-3xl font-extrabold text-amber-300 mt-2">{suspendidasCount}</p>
          <span className="text-xs text-amber-200 mt-2 block font-medium">Revisar observaciones</span>
        </div>

        {esFinanzas ? (
          <div className="bg-slate-700 border border-slate-600 rounded-xl p-5 shadow-md">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Monto Total Cartera</span>
            <p className="text-3xl font-extrabold text-white mt-2">{formatCLP(totalMonto)}</p>
            <span className="text-xs text-slate-300 mt-2 block">Proyectos registrados</span>
          </div>
        ) : (
          <div className="bg-slate-700/60 border border-slate-600/50 rounded-xl p-5 opacity-70">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Monto Total Cartera</span>
            <p className="text-sm font-medium text-slate-400 mt-3">[ Restringido a Finanzas ]</p>
          </div>
        )}
      </section>

      {/* Gráfico Financiero */}
      {esFinanzas && (
        <section className="bg-slate-700 border border-slate-600 rounded-xl p-6 mb-8 shadow-md">
          <div className="mb-4">
            <h2 className="text-base font-bold text-white">Presupuesto Acumulado por Tipo de Servicio</h2>
            <p className="text-xs text-slate-300">Distribución de capital comprometido según categoría</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="servicio" stroke="#cbd5e1" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#cbd5e1"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', color: '#fff' }}
                  formatter={(val) => [formatCLP(val), 'Presupuesto']}
                />
                <Bar dataKey="monto" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Tabla con Filtros */}
      <section className="bg-slate-700 border border-slate-600 rounded-xl p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Buscar cliente o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 w-full sm:w-60"
            />

            <select
              value={filterComuna}
              onChange={(e) => setFilterComuna(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-400"
            >
              <option value="Todas">Todas las Comunas (Ñuble)</option>
              <option value="Chillán">Chillán</option>
              <option value="San Carlos">San Carlos</option>
              <option value="Coihueco">Coihueco</option>
              <option value="Bulnes">Bulnes</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {['Todos', 'En proceso', 'Finalizada', 'Suspendida'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-sky-400 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-200 hover:text-white border border-slate-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla principal */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-800 text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-600">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Ubicación</th>
                <th className="py-3 px-4">Servicio</th>
                {esFinanzas && <th className="py-3 px-4">Presupuesto</th>}
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600/60">
              {obrasFiltradas.map((item) => (
                <tr key={item.id} className="hover:bg-slate-600/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-sky-300 font-semibold">{item.id}</td>
                  <td className="py-3 px-4 font-medium text-white">{item.cliente}</td>
                  <td className="py-3 px-4 text-slate-200">
                    <span className="bg-slate-800 border border-slate-600 px-2 py-0.5 rounded text-[11px]">
                      📍 {item.comuna}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-200">{item.servicio}</td>
                  {esFinanzas && <td className="py-3 px-4 font-semibold text-slate-100">{formatCLP(item.monto)}</td>}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.estado === 'En proceso'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50'
                          : item.estado === 'Finalizada'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                      }`}
                    >
                      {item.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setObraDetalle(item)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-600 text-slate-100 rounded text-[11px] transition-colors cursor-pointer border border-slate-600"
                        title="Ver Ficha Técnica"
                      >
                        🔧 Ficha
                      </button>

                      {esFinanzas && (
                        <button
                          onClick={() => setObraPDF(item)}
                          className="px-2.5 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/50 rounded text-[11px] transition-colors cursor-pointer"
                          title="Generar Presupuesto PDF"
                        >
                          📄 PDF
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL 1: Ficha Técnica */}
      {obraDetalle && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-700 border border-slate-600 rounded-xl p-6 w-full max-w-lg shadow-2xl text-slate-100">
            <div className="flex justify-between items-start mb-4 border-b border-slate-600 pb-3">
              <div>
                <span className="text-xs font-mono text-sky-300 font-bold">{obraDetalle.id}</span>
                <h3 className="text-lg font-bold text-white">{obraDetalle.cliente}</h3>
                <p className="text-xs text-slate-300">Comuna: {obraDetalle.comuna} — Servicio: {obraDetalle.servicio}</p>
              </div>
              <button
                onClick={() => setObraDetalle(null)}
                className="text-slate-300 hover:text-white font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="mb-5">
              <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">⚙️ Equipos de Refrigeración Asociados</h4>
              <ul className="bg-slate-800 border border-slate-600 rounded-lg p-3 space-y-1.5 text-xs text-slate-200">
                {obraDetalle.equipos.map((eq, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full"></span>
                    {eq}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">📋 Bitácora de Observaciones (Terreno)</h4>
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-xs text-slate-200 italic">
                "{obraDetalle.bitacora}"
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setObraDetalle(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-colors border border-slate-600"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Documento Presupuesto PDF */}
      {obraPDF && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white text-slate-900 rounded-xl p-8 w-full max-w-2xl shadow-2xl font-sans">
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
              <div>
                <span className="bg-slate-900 text-white font-bold px-3 py-1 rounded text-xs tracking-wider">
                  FYAG
                </span>
                <h2 className="text-xl font-bold mt-2">FRÍO Y AGROINDUSTRIA SpA</h2>
                <p className="text-xs text-slate-600">R.U.T: 76.890.123-K — Chillán, Región del Ñuble</p>
                <p className="text-xs text-slate-600">Servicios de Refrigeración Industrial y Climatización</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 uppercase block">Documento de Presupuesto</span>
                <span className="text-sm font-mono font-bold text-slate-900">{obraPDF.id}</span>
                <p className="text-xs text-slate-500 mt-1">Fecha: 16/10/2026</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-100 p-4 rounded-lg mb-6 text-xs">
              <div>
                <p className="text-slate-500 font-bold uppercase">Cliente:</p>
                <p className="font-bold text-sm text-slate-900">{obraPDF.cliente}</p>
                <p className="text-slate-600">Comuna: {obraPDF.comuna}, Chile</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase">Tipo de Servicio:</p>
                <p className="font-bold text-slate-900">{obraPDF.servicio}</p>
                <p className="text-slate-600">Estado: {obraPDF.estado}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs mb-6 border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-600 uppercase text-[10px]">
                  <th className="py-2">Descripción del Requerimiento</th>
                  <th className="py-2 text-right">Monto Neto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3">
                    <p className="font-bold">{obraPDF.servicio} Agroindustrial</p>
                    <p className="text-[11px] text-slate-500">Incluye mano de obra especializada e insumos técnicos.</p>
                  </td>
                  <td className="py-3 text-right font-bold font-mono">{formatCLP(obraPDF.monto)}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end border-t-2 border-slate-900 pt-4 mb-8">
              <div className="text-right text-xs space-y-1">
                <p className="text-slate-600">Subtotal: <span className="font-mono">{formatCLP(obraPDF.monto)}</span></p>
                <p className="text-slate-600">IVA (19%): <span className="font-mono">{formatCLP(Math.round(obraPDF.monto * 0.19))}</span></p>
                <p className="text-base font-bold text-slate-900 pt-2 border-t border-slate-300">
                  Total CLP: <span className="font-mono text-sky-700">{formatCLP(Math.round(obraPDF.monto * 1.19))}</span>
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setObraPDF(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Cerrar
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                🖨️ Imprimir / Guardar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: + Nueva Obra */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-700 border border-slate-600 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1">Registrar Nueva Obra</h2>
            <p className="text-xs text-slate-300 mb-5">Ingresa los detalles técnicos para iniciar el proyecto.</p>

            <form onSubmit={handleGuardarObra} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-200 font-medium mb-1">Nombre del Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Avícola Chillán"
                  value={nuevaObra.cliente}
                  onChange={(e) => setNuevaObra({ ...nuevaObra, cliente: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-200 font-medium mb-1">Comuna (Ñuble)</label>
                  <select
                    value={nuevaObra.comuna}
                    onChange={(e) => setNuevaObra({ ...nuevaObra, comuna: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-400"
                  >
                    <option>Chillán</option>
                    <option>San Carlos</option>
                    <option>Coihueco</option>
                    <option>Bulnes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-200 font-medium mb-1">Tipo Servicio</label>
                  <select
                    value={nuevaObra.servicio}
                    onChange={(e) => setNuevaObra({ ...nuevaObra, servicio: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-400"
                  >
                    <option>Climatización</option>
                    <option>Mantención</option>
                    <option>Emergencia</option>
                    <option>Proyecto Eléctrico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-200 font-medium mb-1">Presupuesto ($ CLP)</label>
                <input
                  type="number"
                  required
                  placeholder="Ej. 2500000"
                  value={nuevaObra.monto}
                  onChange={(e) => setNuevaObra({ ...nuevaObra, monto: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-medium mb-1">Equipos (separados por coma)</label>
                <input
                  type="text"
                  placeholder="Ej. Cámara #1, Compresor 20HP"
                  value={nuevaObra.equipos}
                  onChange={(e) => setNuevaObra({ ...nuevaObra, equipos: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-medium mb-1">Observación Inicial</label>
                <textarea
                  placeholder="Notas de terreno..."
                  rows="2"
                  value={nuevaObra.bitacora}
                  onChange={(e) => setNuevaObra({ ...nuevaObra, bitacora: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-600 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium transition-colors border border-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Guardar Obra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}