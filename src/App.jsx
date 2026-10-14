import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

export default function App() {
  const [obras, setObras] = useState([
    {
      id: 'OB-101',
      cliente: 'Agrícola San Pedro',
      servicio: 'Climatización',
      tecnico: 'Carlos Muñoz',
      presupuesto: 1450000,
      estado: 'En proceso',
    },
    {
      id: 'OB-102',
      cliente: 'Viña Montes',
      servicio: 'Mantención',
      tecnico: 'Rodrigo Araya',
      presupuesto: 820000,
      estado: 'Finalizada',
    },
    {
      id: 'OB-103',
      cliente: 'Packing Frutícola Sur',
      servicio: 'Emergencia',
      tecnico: 'Sin asignar',
      presupuesto: 2100000,
      estado: 'Suspendida',
    },
    {
      id: 'OB-104',
      cliente: 'Centro Distribución Ñuble',
      servicio: 'Proyecto eléctrico',
      tecnico: 'Esteban Morales',
      presupuesto: 3500000,
      estado: 'En proceso',
    },
    {
      id: 'OB-105',
      cliente: 'Viña Concha y Toro',
      servicio: 'Climatización',
      tecnico: 'Carlos Muñoz',
      presupuesto: 1900000,
      estado: 'En proceso',
    },
  ])

  // Filtros
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')

  // Modal
  const [modalAbierto, setModalAbierto] = useState(false)
  const [formulario, setFormulario] = useState({
    cliente: '',
    servicio: 'Climatización',
    tecnico: '',
    presupuesto: '',
  })

  const serviciosFYAG = [
    'Proyecto',
    'Mantención',
    'Climatización',
    'Proyecto eléctrico',
    'Emergencia',
    'Garantía',
    'Venta de repuestos',
    'Mejoras',
  ]

  const handleCrearObra = (e) => {
    e.preventDefault()
    if (!formulario.cliente.trim() || !formulario.presupuesto) return

    const nuevoId = `OB-${101 + obras.length}`
    const nuevaObra = {
      id: nuevoId,
      cliente: formulario.cliente,
      servicio: formulario.servicio,
      tecnico: formulario.tecnico.trim() ? formulario.tecnico : 'Sin asignar',
      presupuesto: Number(formulario.presupuesto),
      estado: 'En proceso',
    }

    setObras([nuevaObra, ...obras])
    setFormulario({ cliente: '', servicio: 'Climatización', tecnico: '', presupuesto: '' })
    setModalAbierto(false)
  }

  // Filtrado de la tabla
  const obrasFiltradas = useMemo(() => {
    return obras.filter((obra) => {
      const coincideTexto =
        obra.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
        obra.id.toLowerCase().includes(busqueda.toLowerCase()) ||
        obra.tecnico.toLowerCase().includes(busqueda.toLowerCase())
      const coincideEstado = filtroEstado === 'Todos' || obra.estado === filtroEstado
      return coincideTexto && coincideEstado
    })
  }, [obras, busqueda, filtroEstado])

  // Procesamiento de datos para el gráfico de barras gerencial
  const datosGrafico = useMemo(() => {
    const mapa = {}
    obras.forEach((o) => {
      if (!mapa[o.servicio]) {
        mapa[o.servicio] = 0
      }
      mapa[o.servicio] += o.presupuesto
    })

    return Object.keys(mapa).map((servicio) => ({
      servicio,
      monto: mapa[servicio],
    }))
  }, [obras])

  const transiciones = {
    'En proceso': 'Finalizada',
    'Finalizada': 'Suspendida',
    'Suspendida': 'Cancelada',
    'Cancelada': 'En proceso',
  }

  const cambiarEstado = (id) => {
    setObras(obras.map((o) => (o.id === id ? { ...o, estado: transiciones[o.estado] } : o)))
  }

  const getBadgeStyle = (estado) => {
    switch (estado) {
      case 'Finalizada': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'En proceso': return 'bg-sky-500/10 text-sky-400 border-sky-500/20'
      case 'Suspendida': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'Cancelada': return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      default: return 'bg-slate-700 text-slate-300 border-slate-600'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Encabezado */}
        <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-sky-600 text-white font-black text-sm px-2.5 py-1 rounded">FYAG</span>
              <h1 className="text-2xl font-bold text-white tracking-tight">Frío y Agroindustria SpA</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Sistema Centralizado de Gestión de Obras y Presupuestos — Proyecto 2 [Beta]
            </p>
          </div>

          <button
            onClick={() => setModalAbierto(true)}
            className="self-start md:self-auto bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow transition flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Nueva Obra
          </button>
        </header>

        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-sm">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Obras en Terreno</p>
            <p className="text-3xl font-extrabold text-white mt-1">
              {obras.filter((o) => o.estado === 'En proceso').length}
            </p>
            <span className="text-xs text-sky-400 font-medium mt-2 inline-block">● Activas</span>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-sm">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Obras Finalizadas</p>
            <p className="text-3xl font-extrabold text-white mt-1">
              {obras.filter((o) => o.estado === 'Finalizada').length}
            </p>
            <span className="text-xs text-emerald-400 font-medium mt-2 inline-block">Listas para facturar</span>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-sm">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Suspendidas / Alerta</p>
            <p className="text-3xl font-extrabold text-amber-400 mt-1">
              {obras.filter((o) => o.estado === 'Suspendida').length}
            </p>
            <span className="text-xs text-amber-400/80 font-medium mt-2 inline-block">Revisar causas</span>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-sm">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Monto Total Cartera</p>
            <p className="text-3xl font-extrabold text-white mt-1">
              ${obras.reduce((acc, o) => acc + o.presupuesto, 0).toLocaleString('es-CL')}
            </p>
            <span className="text-xs text-slate-400 font-medium mt-2 inline-block">Proyectos registrados</span>
          </div>
        </section>

        {/* Gráfico Gerencial de Recharts */}
        <section className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-white">Presupuesto Acumulado por Tipo de Servicio</h2>
            <p className="text-xs text-slate-400">Distribución de capital comprometido según categoría</p>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosGrafico} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="servicio" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  formatter={(value) => [`$${value.toLocaleString('es-CL')}`, 'Presupuesto']}
                />
                <Bar dataKey="monto" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Filtros */}
        <section className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Buscar por cliente, técnico o código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['Todos', 'En proceso', 'Finalizada', 'Suspendida', 'Cancelada'].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap border ${
                  filtroEstado === estado
                    ? 'bg-sky-600 text-white border-sky-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {estado}
              </button>
            ))}
          </div>
        </section>

        {/* Tabla */}
        <section className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Servicio</th>
                  <th className="px-6 py-4">Técnico Resp.</th>
                  <th className="px-6 py-4">Presupuesto</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {obrasFiltradas.length > 0 ? (
                  obrasFiltradas.map((obra) => (
                    <tr key={obra.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-sky-400">{obra.id}</td>
                      <td className="px-6 py-4 font-medium text-white">{obra.cliente}</td>
                      <td className="px-6 py-4 text-slate-300">{obra.servicio}</td>
                      <td className="px-6 py-4 text-slate-300">{obra.tecnico}</td>
                      <td className="px-6 py-4 font-medium text-slate-200">
                        ${obra.presupuesto.toLocaleString('es-CL')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(obra.estado)}`}>
                          {obra.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => cambiarEstado(obra.id)}
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                        >
                          Siguiente Estado
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-slate-500 text-sm">
                      No se encontraron obras coincidentes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-5">
              <h3 className="text-lg font-bold text-white">Registrar Nueva Obra</h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearObra} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nombre del Cliente / Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Viña Concha y Toro"
                  value={formulario.cliente}
                  onChange={(e) => setFormulario({ ...formulario, cliente: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tipo de Servicio</label>
                <select
                  value={formulario.servicio}
                  onChange={(e) => setFormulario({ ...formulario, servicio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                >
                  {serviciosFYAG.map((serv) => (
                    <option key={serv} value={serv}>{serv}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Técnico Responsable</label>
                <input
                  type="text"
                  placeholder="Ej. Carlos Muñoz (opcional)"
                  value={formulario.tecnico}
                  onChange={(e) => setFormulario({ ...formulario, tecnico: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Presupuesto ($ CLP)</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="Ej. 1200000"
                  value={formulario.presupuesto}
                  onChange={(e) => setFormulario({ ...formulario, presupuesto: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow"
                >
                  Guardar Obra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}