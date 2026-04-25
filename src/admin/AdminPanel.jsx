import { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../supabaseClient';

const ESTADOS = ['pendiente', 'pagado', 'en proceso', 'entregado', 'cancelado'];

const ESTADO_META = {
    'pendiente':  { bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
    'pagado':     { bg: '#E0E7FF', color: '#3730A3', dot: '#4F46E5' },
    'en proceso': { bg: '#DBEAFE', color: '#1E40AF', dot: '#3B82F6' },
    'entregado':  { bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
    'cancelado':  { bg: '#FEE2E2', color: '#991B1B', dot: '#EF4444' },
};

const NAV_ITEMS = [
    {
        id: 'pedidos', label: 'Pedidos',
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
    },
    {
        id: 'metricas', label: 'Métricas',
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        id: 'logistica', label: 'Logística',
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
        ),
    },
];

function exportToCSV(rows) {
    const headers = ['Fecha', 'Nombre', 'DNI', 'Dirección', 'Producto', 'Docenas', 'Total (S/)', 'Estado'];
    const csv = [
        headers.join(','),
        ...rows.map(o => [
            o.fecha_creacion ? new Date(o.fecha_creacion).toLocaleString('es-PE') : '',
            o.nombre, o.dni, o.direccion, o.producto,
            o.cantidad_docenas, o.total_soles, o.estado || 'pendiente'
        ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedidos_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/* ─── Modal de Edición ──────────────────────────────────── */
function EditModal({ order, onClose, onSaved }) {
    const PRODUCTOS = [
        'BANDERAS 60x90', 'BANDERAS 90x150', 'BANDERINES DE ESCRITORIO',
        'BANDERAS BORDADAS', 'BANDERAS PERSONALIZADAS', 'ROLLOS DE TELA',
    ];

    const [form, setForm] = useState({
        nombre:          order.nombre         || '',
        dni:             order.dni            || '',
        direccion:       order.direccion      || '',
        producto:        order.producto       || '',
        cantidad_docenas: order.cantidad_docenas ?? '',
        total_soles:     order.total_soles    ?? '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        const payload = {
            nombre:           form.nombre.trim(),
            dni:              form.dni.trim(),
            direccion:        form.direccion.trim(),
            producto:         form.producto,
            cantidad_docenas: parseFloat(form.cantidad_docenas) || 0,
            total_soles:      parseFloat(form.total_soles)      || 0,
        };
        const { error: supaErr } = await supabase
            .from('ventas')
            .update(payload)
            .eq('id', order.id);
        if (supaErr) {
            setError('Error al guardar: ' + supaErr.message);
            setSaving(false);
        } else {
            // Pasamos el payload al padre para actualizar el estado local sin refetch
            onSaved(payload);
        }
    };

    // Cerrar con Escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div className="ap-modal-backdrop" onClick={onClose}>
            <div className="ap-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
                {/* Header */}
                <div className="ap-modal-header">
                    <div>
                        <h2 className="ap-modal-title">Editar Pedido</h2>
                        <p className="ap-modal-sub">ID: {order.id}</p>
                    </div>
                    <button className="ap-modal-close" onClick={onClose} aria-label="Cerrar">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form className="ap-modal-form" onSubmit={handleSubmit}>
                    <div className="ap-modal-grid">
                        <div className="ap-modal-field">
                            <label htmlFor="edit-nombre">Nombre del Cliente</label>
                            <input id="edit-nombre" name="nombre" type="text" value={form.nombre}
                                onChange={handleChange} placeholder="Nombre completo" required />
                        </div>
                        <div className="ap-modal-field">
                            <label htmlFor="edit-dni">DNI</label>
                            <input id="edit-dni" name="dni" type="text" maxLength="8" value={form.dni}
                                onChange={handleChange} placeholder="12345678" />
                        </div>
                        <div className="ap-modal-field ap-modal-full">
                            <label htmlFor="edit-direccion">Dirección</label>
                            <input id="edit-direccion" name="direccion" type="text" value={form.direccion}
                                onChange={handleChange} placeholder="Av. Ejemplo 123, Lima" />
                        </div>
                        <div className="ap-modal-field ap-modal-full">
                            <label htmlFor="edit-producto">Producto</label>
                            <select id="edit-producto" name="producto" value={form.producto} onChange={handleChange} required>
                                <option value="" disabled>Selecciona un producto</option>
                                {PRODUCTOS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="ap-modal-field">
                            <label htmlFor="edit-docenas">Docenas</label>
                            <input id="edit-docenas" name="cantidad_docenas" type="number" min="0" step="0.5"
                                value={form.cantidad_docenas} onChange={handleChange} required />
                        </div>
                        <div className="ap-modal-field">
                            <label htmlFor="edit-total">Total (S/)</label>
                            <input id="edit-total" name="total_soles" type="number" min="0" step="0.01"
                                value={form.total_soles} onChange={handleChange} required />
                        </div>
                    </div>

                    {error && <p className="ap-modal-error">{error}</p>}

                    <div className="ap-modal-actions">
                        <button type="button" className="ap-modal-btn-cancel" onClick={onClose} disabled={saving}>
                            Cancelar
                        </button>
                        <button type="submit" className="ap-modal-btn-save" disabled={saving}>
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── Sección: Pedidos ─────────────────────────────────────────── */
function PedidosSection({ orders, setOrders, loading, onRefresh, onLogout }) {
    const [filter, setFilter]       = useState('todos');
    const [search, setSearch]       = useState('');
    const [updating, setUpdating]   = useState(null);
    const [emitting, setEmitting]   = useState(null);
    const [selected, setSelected]   = useState([]);
    const [editOrder, setEditOrder] = useState(null);
    const [vistaGrafico, setVistaGrafico] = useState('dia');

    const filtered = orders.filter(o => {
        const estado = o.estado || 'pendiente';
        const matchFilter = filter === 'todos' || estado === filter;
        const matchSearch = !search || [o.nombre, o.dni, o.producto, o.direccion]
            .some(v => v?.toLowerCase().includes(search.toLowerCase()));
        return matchFilter && matchSearch;
    });

    const allChecked = filtered.length > 0 && filtered.every(o => selected.includes(o.id));

    const toggleAll = () =>
        setSelected(allChecked ? [] : filtered.map(o => o.id));

    const toggleOne = (id) =>
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const updateEstado = async (id, nuevoEstado) => {
        // 1. Guardar el valor previo por si hay que revertir
        const prevEstado = orders.find(o => o.id === id)?.estado || 'pendiente';

        // 2. Actualización optimista: el color cambia INSTANTÁNEAMENTE
        setOrders(prev => prev.map(o => o.id === id ? { ...o, estado: nuevoEstado } : o));
        setUpdating(id);

        // 3. Persistir en Supabase
        const { error } = await supabase.from('ventas').update({ estado: nuevoEstado }).eq('id', id);

        if (error) {
            // 4. Si falla, revertir al estado anterior
            setOrders(prev => prev.map(o => o.id === id ? { ...o, estado: prevEstado } : o));
            alert('No se pudo actualizar el estado. Intenta de nuevo.');
        }
        setUpdating(null);
    };

    const emitirBoleta = async (id) => {
        if (!window.confirm("¿Seguro que deseas emitir una boleta electrónica para este pedido? Esta acción es irreversible en Nubefact.")) return;
        setEmitting(id);
        try {
            const { data, error } = await supabase.functions.invoke('emitir-boleta', {
                body: { orderId: id }
            });
            if (error) throw error;
            if (data?.error) throw new Error(data.error);
            // Actualiza solo la URL del comprobante y el estado en el estado local
            if (data?.comprobante_url) {
                setOrders(prev => prev.map(o =>
                    o.id === id ? { ...o, comprobante_url: data.comprobante_url, estado: 'pagado' } : o
                ));
            }
        } catch (err) {
            console.error("Error emitiendo boleta:", err);
            alert("Error al emitir boleta: " + err.message);
        } finally {
            setEmitting(null);
        }
    };

    const handleExport = () => {
        const rows = selected.length > 0
            ? filtered.filter(o => selected.includes(o.id))
            : filtered;
        exportToCSV(rows);
    };

    const countBy = (e) => orders.filter(o => (o.estado || 'pendiente') === e).length;
    const totalIngresos = orders
        .filter(o => (o.estado || 'pendiente') !== 'cancelado')
        .reduce((s, o) => s + (o.total_soles || 0), 0);

    const handleSaved = (updatedFields) => {
        // Fusiona los campos editados en el estado local sin refetch
        setOrders(prev => prev.map(o =>
            o.id === editOrder.id ? { ...o, ...updatedFields } : o
        ));
        setEditOrder(null);
    };

    // Procesar datos para el gráfico: agrupar total dinámicamente
    const chartData = orders
        .filter(o => (o.estado || 'pendiente') !== 'cancelado' && o.fecha_creacion)
        .reduce((acc, order) => {
            const dateObj = new Date(order.fecha_creacion);
            let dateStr = '';
            let sortDate = 0;

            if (vistaGrafico === 'dia') {
                const day = dateObj.getDate().toString().padStart(2, '0');
                const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                dateStr = `${day}/${month}`;
                sortDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
            } else if (vistaGrafico === 'mes') {
                const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                const month = monthNames[dateObj.getMonth()];
                const year = dateObj.getFullYear();
                dateStr = `${month} ${year}`;
                sortDate = new Date(year, dateObj.getMonth(), 1).getTime();
            } else if (vistaGrafico === 'año') {
                const year = dateObj.getFullYear();
                dateStr = `${year}`;
                sortDate = new Date(year, 0, 1).getTime();
            }
            
            const existing = acc.find(item => item.date === dateStr);
            if (existing) {
                existing.total += (order.total_soles || 0);
            } else {
                acc.push({ date: dateStr, total: (order.total_soles || 0), sortDate });
            }
            return acc;
        }, [])
        .sort((a, b) => a.sortDate - b.sortDate)
        .map(item => ({ date: item.date, total: item.total })); // limpiar campo sortDate

    return (
        <>
            {editOrder && (
                <EditModal
                    order={editOrder}
                    onClose={() => setEditOrder(null)}
                    onSaved={handleSaved}
                />
            )}
            {/* Stats cards */}
            <div className="ap-stats">
                <StatCard label="Total Pedidos"  value={orders.length}           growth="+12%" positive icon="orders" />
                <StatCard label="Ingresos"       value={`S/ ${totalIngresos.toFixed(2)}`} growth="+8.5%" positive icon="revenue" />
                <StatCard label="Pendientes"     value={countBy('pendiente')}    growth="-5%"  positive={false} icon="pending" />
                <StatCard label="En Proceso"     value={countBy('en proceso')}   growth="+3%"  positive icon="process" />
                <StatCard label="Entregados"     value={countBy('entregado')}    growth="+22%" positive icon="done" />
            </div>

            {/* Gráfico de Ventas */}
            <div className="ap-chart-placeholder">
                <div className="ap-chart-header" style={{ alignItems: 'center' }}>
                    <div>
                        <h3>Resumen de Ventas</h3>
                        <p>Evolución de ingresos</p>
                    </div>
                    <select 
                        className="ap-estado-select" 
                        value={vistaGrafico} 
                        onChange={(e) => setVistaGrafico(e.target.value)}
                        style={{ background: '#F1F5F9', color: '#475569', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                    >
                        <option value="dia">Por Día</option>
                        <option value="mes">Por Mes</option>
                        <option value="año">Por Año</option>
                    </select>
                </div>
                {chartData.length > 0 ? (
                    <div style={{ width: '100%', height: 250, marginTop: '1rem' }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94A3B8', fontSize: 11 }} 
                                    dy={10} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94A3B8', fontSize: 11 }} 
                                    tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`S/ ${value.toFixed(2)}`, 'Ingresos']}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="total" 
                                    stroke="#3B82F6" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorTotal)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="ap-chart-bars" style={{ justifyContent: 'center', alignItems: 'center', height: 250 }}>
                        <p style={{ color: '#94A3B8' }}>No hay datos suficientes para graficar.</p>
                    </div>
                )}
            </div>

            {/* Toolbar */}
            <div className="ap-toolbar">
                <div className="ap-filter-tabs">
                    {['todos', ...ESTADOS].map(e => (
                        <button
                            key={e}
                            className={`ap-filter-tab ${filter === e ? 'active' : ''}`}
                            onClick={() => { setFilter(e); setSelected([]); }}
                        >
                            {e.charAt(0).toUpperCase() + e.slice(1)}
                            <span className="ap-filter-count">
                                {e === 'todos' ? orders.length : countBy(e)}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="ap-toolbar-right">
                    <div className="ap-search">
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, DNI, producto..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button className="ap-search-clear" onClick={() => setSearch('')}>✕</button>
                        )}
                    </div>
                    <button className="ap-btn-export" onClick={handleExport}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {selected.length > 0 ? `Exportar (${selected.length})` : 'Exportar CSV'}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="ap-table-card">
                {loading ? (
                    <div className="ap-state-box">
                        <div className="ap-spinner" />
                        <p>Cargando pedidos...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="ap-state-box">
                        <svg width="48" height="48" fill="none" stroke="#CBD5E1" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p>No hay pedidos para mostrar</p>
                    </div>
                ) : (
                    <table className="ap-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        className="ap-checkbox"
                                        checked={allChecked}
                                        onChange={toggleAll}
                                    />
                                </th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>DNI</th>
                                <th>Dirección</th>
                                <th>Producto</th>
                                <th>Doc.</th>
                                <th>Total</th>
                                <th>Comprobante</th>
                                <th>Estado</th>
                                <th>Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => {
                                const estado = order.estado || 'pendiente';
                                const style  = ESTADO_META[estado] || ESTADO_META['pendiente'];
                                const isSelected = selected.includes(order.id);
                                const fecha = order.fecha_creacion
                                    ? new Date(order.fecha_creacion).toLocaleString('es-PE', {
                                        day: '2-digit', month: '2-digit', year: '2-digit',
                                        hour: '2-digit', minute: '2-digit'
                                      })
                                    : '—';

                                return (
                                    <tr key={order.id}
                                        className={`${isSelected ? 'row-selected' : ''} ${updating === order.id ? 'row-updating' : ''}`}
                                    >
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="ap-checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleOne(order.id)}
                                            />
                                        </td>
                                        <td className="td-fecha" data-label="Fecha">{fecha}</td>
                                        <td className="td-nombre" data-label="Cliente">{order.nombre || '—'}</td>
                                        <td className="td-dni" data-label="DNI">{order.dni || '—'}</td>
                                        <td className="td-dir" data-label="Dirección">{order.direccion || '—'}</td>
                                        <td className="td-prod" data-label="Producto">{order.producto || '—'}</td>
                                        <td className="td-qty" data-label="Docenas">{order.cantidad_docenas ?? '—'}</td>
                                        <td className="td-total" data-label="Total">S/ {(order.total_soles || 0).toFixed(2)}</td>
                                        <td data-label="Comprobante">
                                            {order.comprobante_url ? (
                                                <a href={order.comprobante_url} target="_blank" rel="noopener noreferrer" className="ap-btn-success">
                                                    Ver PDF
                                                </a>
                                            ) : (
                                                <button 
                                                    className="ap-btn-danger" 
                                                    onClick={() => emitirBoleta(order.id)}
                                                    disabled={emitting === order.id}
                                                >
                                                    {emitting === order.id ? 'Emitiendo...' : 'Emitir Boleta'}
                                                </button>
                                            )}
                                        </td>
                                        <td data-label="Estado">
                                            <select
                                                className="ap-estado-select"
                                                value={estado}
                                                disabled={updating === order.id}
                                                style={{ background: style.bg, color: style.color }}
                                                onChange={e => updateEstado(order.id, e.target.value)}
                                            >
                                                {ESTADOS.map(s => (
                                                    <option key={s} value={s}>
                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td data-label="Editar">
                                            {order.comprobante_url ? (
                                                <span className="ap-edit-locked" title="No editable: boleta emitida">
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </span>
                                            ) : (
                                                <button
                                                    className="ap-edit-btn"
                                                    onClick={() => setEditOrder(order)}
                                                    title="Editar pedido"
                                                >
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                {selected.length > 0 && (
                    <div className="ap-selection-bar">
                        <span>{selected.length} pedido{selected.length > 1 ? 's' : ''} seleccionado{selected.length > 1 ? 's' : ''}</span>
                        <button onClick={() => setSelected([])}>Deseleccionar todo</button>
                    </div>
                )}
            </div>
        </>
    );
}

/* ─── Sección: Métricas ────────────────────────────────────────── */
function MetricasSection({ orders }) {
    const byProduct = orders.reduce((acc, o) => {
        acc[o.producto] = (acc[o.producto] || 0) + (o.total_soles || 0);
        return acc;
    }, {});
    const topProducts = Object.entries(byProduct)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
    const maxVal = topProducts[0]?.[1] || 1;

    return (
        <div className="ap-metricas">
            <h2 className="ap-section-heading">Métricas de Ventas</h2>
            <div className="ap-metricas-grid">
                <div className="ap-metrics-card">
                    <h3>Top Productos por Ingreso</h3>
                    <div className="ap-product-bars">
                        {topProducts.length === 0 ? (
                            <p className="ap-no-data">Sin datos aún</p>
                        ) : topProducts.map(([name, total]) => (
                            <div key={name} className="ap-prod-row">
                                <span className="ap-prod-name">{name}</span>
                                <div className="ap-prod-bar-track">
                                    <div
                                        className="ap-prod-bar-fill"
                                        style={{ width: `${(total / maxVal) * 100}%` }}
                                    />
                                </div>
                                <span className="ap-prod-val">S/ {total.toFixed(0)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="ap-metrics-card">
                    <h3>Distribución por Estado</h3>
                    <div className="ap-donut-placeholder">
                        {ESTADOS.map(e => {
                            const count = orders.filter(o => (o.estado || 'pendiente') === e).length;
                            const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
                            const s = ESTADO_META[e];
                            return (
                                <div key={e} className="ap-donut-row">
                                    <span className="ap-donut-dot" style={{ background: s.dot }} />
                                    <span className="ap-donut-label">{e.charAt(0).toUpperCase() + e.slice(1)}</span>
                                    <div className="ap-donut-track">
                                        <div className="ap-donut-fill" style={{ width: `${pct}%`, background: s.dot }} />
                                    </div>
                                    <span className="ap-donut-pct">{pct}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Sección: Logística ───────────────────────────────────────── */
function LogisticaSection() {
    return (
        <div className="ap-logistica">
            <h2 className="ap-section-heading">Logística</h2>
            <div className="ap-coming-card">
                <svg width="56" height="56" fill="none" stroke="#94A3B8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <h3>Módulo de Logística</h3>
                <p>Seguimiento de envíos, rutas de entrega y gestión de transportistas. Próximamente disponible.</p>
                <span className="ap-badge-coming">En desarrollo</span>
            </div>
        </div>
    );
}

/* ─── Stat Card ────────────────────────────────────────────────── */
const STAT_ICONS = {
    orders:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    revenue: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    pending: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    process: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
    done:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
};

const STAT_COLORS = {
    orders:  { bg: '#EFF6FF', icon: '#3B82F6' },
    revenue: { bg: '#ECFDF5', icon: '#10B981' },
    pending: { bg: '#FEF3C7', icon: '#F59E0B' },
    process: { bg: '#EFF6FF', icon: '#6366F1' },
    done:    { bg: '#ECFDF5', icon: '#059669' },
};

function StatCard({ label, value, growth, positive, icon }) {
    const c = STAT_COLORS[icon];
    return (
        <div className="ap-stat-card">
            <div className="ap-stat-top">
                <div className="ap-stat-icon" style={{ background: c.bg }}>
                    <svg width="20" height="20" fill="none" stroke={c.icon} viewBox="0 0 24 24">
                        {STAT_ICONS[icon]}
                    </svg>
                </div>
                <span className={`ap-growth ${positive ? 'positive' : 'negative'}`}>
                    {positive ? '▲' : '▼'} {growth}
                </span>
            </div>
            <div className="ap-stat-value">{value}</div>
            <div className="ap-stat-label">{label}</div>
        </div>
    );
}

/* ─── Root Component ───────────────────────────────────────────── */
export default function AdminPanel({ onLogout }) {
    const [orders, setOrders]       = useState([]);
    const [loading, setLoading]     = useState(true);
    const [activeSection, setActive] = useState('pedidos');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('ventas')
            .select('*')
            .order('fecha_creacion', { ascending: false });
        if (!error) setOrders(data || []);
        setLoading(false);
    }, []);

    // Refresco silencioso: actualiza los datos sin activar el spinner de loading
    // (evita el desmonte de la tabla y el salto de scroll)
    const silentRefresh = useCallback(async () => {
        const { data, error } = await supabase
            .from('ventas')
            .select('*')
            .order('fecha_creacion', { ascending: false });
        if (!error) setOrders(data || []);
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleNavClick = (id) => {
        setActive(id);
        setSidebarOpen(false);
    };

    return (
        <div className="ap-layout">
            {/* Mobile backdrop */}
            <div
                className={`ap-sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar */}
            <aside className={`ap-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="ap-sidebar-logo">
                    <div className="ap-logo-icon">
                        <svg width="22" height="22" fill="none" stroke="#fff" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                    </div>
                    <div>
                        <span className="ap-logo-name">BanderasPerú</span>
                        <span className="ap-logo-sub">Panel Admin</span>
                    </div>
                </div>

                <nav className="ap-nav">
                    <span className="ap-nav-section-label">MENÚ</span>
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            className={`ap-nav-btn ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => handleNavClick(item.id)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            {activeSection === item.id && <span className="ap-nav-dot" />}
                        </button>
                    ))}
                </nav>

                <div className="ap-sidebar-footer">
                    <div className="ap-user-info">
                        <div className="ap-avatar">A</div>
                        <div>
                            <span className="ap-user-name">Administrador</span>
                            <span className="ap-user-role">Admin</span>
                        </div>
                    </div>
                    <button className="ap-logout-btn" onClick={onLogout} title="Cerrar sesión">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="ap-main">
                <header className="ap-topbar">
                    <button
                        className="ap-mobile-toggle"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Abrir menú"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="ap-topbar-title">
                            {NAV_ITEMS.find(n => n.id === activeSection)?.label}
                        </h1>
                        <p className="ap-topbar-sub">
                            {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <button className="ap-refresh-btn" onClick={fetchOrders} disabled={loading}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Actualizar
                    </button>
                </header>

                <div className="ap-content">
                    {activeSection === 'pedidos'   && <PedidosSection  orders={orders} setOrders={setOrders} loading={loading} onRefresh={silentRefresh} onLogout={onLogout} />}
                    {activeSection === 'metricas'  && <MetricasSection  orders={orders} />}
                    {activeSection === 'logistica' && <LogisticaSection />}
                </div>
            </main>
        </div>
    );
}
