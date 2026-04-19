import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const ESTADOS = ['pendiente', 'en proceso', 'entregado', 'cancelado'];

const ESTADO_STYLE = {
    'pendiente':   { bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
    'en proceso':  { bg: '#DBEAFE', color: '#1E40AF', dot: '#3B82F6' },
    'entregado':   { bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
    'cancelado':   { bg: '#FEE2E2', color: '#991B1B', dot: '#EF4444' },
};

export default function AdminPanel({ onLogout }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('todos');
    const [updating, setUpdating] = useState(null);
    const [search, setSearch] = useState('');

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('ventas')
            .select('*')
            .order('fecha_creacion', { ascending: false });

        if (!error) setOrders(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const updateEstado = async (id, estado) => {
        setUpdating(id);
        const { error } = await supabase
            .from('ventas')
            .update({ estado })
            .eq('id', id);

        if (!error) {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, estado } : o));
        }
        setUpdating(null);
    };

    const filtered = orders.filter(o => {
        const matchFilter = filter === 'todos' || (o.estado || 'pendiente') === filter;
        const matchSearch = !search || [o.nombre, o.dni, o.producto, o.direccion]
            .some(v => v?.toLowerCase().includes(search.toLowerCase()));
        return matchFilter && matchSearch;
    });

    const totalIngresos = orders
        .filter(o => (o.estado || 'pendiente') !== 'cancelado')
        .reduce((s, o) => s + (o.total_soles || 0), 0);

    const countByEstado = (e) => orders.filter(o => (o.estado || 'pendiente') === e).length;

    return (
        <div className="admin-panel">
            {/* Header */}
            <header className="admin-header">
                <div className="admin-header-left">
                    <h1>Panel de Pedidos</h1>
                    <span className="admin-subtitle">Gestión de ventas</span>
                </div>
                <div className="admin-header-right">
                    <button className="admin-refresh-btn" onClick={fetchOrders} disabled={loading}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Actualizar
                    </button>
                    <button className="admin-logout-btn" onClick={onLogout}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Salir
                    </button>
                </div>
            </header>

            {/* Stats */}
            <div className="admin-stats">
                <div className="stat-card">
                    <span className="stat-label">Total pedidos</span>
                    <span className="stat-value">{orders.length}</span>
                </div>
                <div className="stat-card stat-green">
                    <span className="stat-label">Ingresos totales</span>
                    <span className="stat-value">S/ {totalIngresos.toFixed(2)}</span>
                </div>
                <div className="stat-card stat-yellow">
                    <span className="stat-label">Pendientes</span>
                    <span className="stat-value">{countByEstado('pendiente')}</span>
                </div>
                <div className="stat-card stat-blue">
                    <span className="stat-label">En proceso</span>
                    <span className="stat-value">{countByEstado('en proceso')}</span>
                </div>
                <div className="stat-card stat-emerald">
                    <span className="stat-label">Entregados</span>
                    <span className="stat-value">{countByEstado('entregado')}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-toolbar">
                <div className="admin-filter-tabs">
                    {['todos', ...ESTADOS].map(e => (
                        <button
                            key={e}
                            className={`filter-tab ${filter === e ? 'active' : ''}`}
                            onClick={() => setFilter(e)}
                        >
                            {e.charAt(0).toUpperCase() + e.slice(1)}
                            <span className="filter-count">
                                {e === 'todos' ? orders.length : countByEstado(e)}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="admin-search">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, DNI, producto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-wrapper">
                {loading ? (
                    <div className="admin-loading">
                        <svg width="32" height="32" fill="none" stroke="#ccc" viewBox="0 0 24 24"
                            style={{ animation: 'spin 1s linear infinite' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <p>Cargando pedidos...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="admin-empty">
                        <svg width="48" height="48" fill="none" stroke="#ccc" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p>No hay pedidos para mostrar</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>DNI</th>
                                <th>Dirección</th>
                                <th>Producto</th>
                                <th>Doc.</th>
                                <th>Total</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((order) => {
                                const estado = order.estado || 'pendiente';
                                const style = ESTADO_STYLE[estado] || ESTADO_STYLE['pendiente'];
                                const fecha = order.fecha_creacion
                                    ? new Date(order.fecha_creacion).toLocaleString('es-PE', {
                                        day: '2-digit', month: '2-digit', year: '2-digit',
                                        hour: '2-digit', minute: '2-digit'
                                      })
                                    : '—';

                                return (
                                    <tr key={order.id} className={updating === order.id ? 'row-updating' : ''}>
                                        <td className="td-fecha">{fecha}</td>
                                        <td className="td-nombre">{order.nombre || '—'}</td>
                                        <td className="td-dni">{order.dni || '—'}</td>
                                        <td className="td-dir">{order.direccion || '—'}</td>
                                        <td className="td-prod">{order.producto || '—'}</td>
                                        <td className="td-qty">{order.cantidad_docenas ?? '—'}</td>
                                        <td className="td-total">S/ {(order.total_soles || 0).toFixed(2)}</td>
                                        <td className="td-estado">
                                            <select
                                                className="estado-select"
                                                value={estado}
                                                disabled={updating === order.id}
                                                style={{ background: style.bg, color: style.color }}
                                                onChange={(e) => updateEstado(order.id, e.target.value)}
                                            >
                                                {ESTADOS.map(s => (
                                                    <option key={s} value={s}>
                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
