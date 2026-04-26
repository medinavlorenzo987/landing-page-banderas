import { useState, useEffect, useCallback, useMemo } from 'react';
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

/* ─── Modal Emitir Comprobante ──────────────────────────── */
function EmitirModal({ group, onClose, onEmitir, emitting }) {
    const [tipo, setTipo]             = useState(group.ruc ? 'factura' : 'boleta');
    const [ruc, setRuc]               = useState(group.ruc || '');
    const [razonSocial, setRazonSocial] = useState(group.razon_social || group.nombre || '');
    const [error, setError]           = useState('');

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const handleEmitir = () => {
        setError('');
        if (tipo === 'factura') {
            if (!/^\d{11}$/.test(ruc.replace(/\D/g,''))) { setError('RUC debe tener 11 dígitos'); return; }
            if (!razonSocial.trim()) { setError('Ingresa la Razón Social'); return; }
        }
        onEmitir({ tipo, ruc: ruc.replace(/\D/g,''), razonSocial: razonSocial.trim() });
    };

    return (
        <div className="ap-modal-backdrop" onClick={onClose}>
            <div className="ap-modal ap-modal--sm" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="ap-modal-header">
                    <div>
                        <h2 className="ap-modal-title">Emitir Comprobante</h2>
                        <p className="ap-modal-sub">{group.nombre} · S/ {group.total.toFixed(2)}</p>
                    </div>
                    <button className="ap-modal-close" onClick={onClose} aria-label="Cerrar">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tipo selector */}
                <div className="ap-emit-tipo-row">
                    <button
                        type="button"
                        className={`ap-emit-tipo-btn ${tipo === 'boleta' ? 'active' : ''}`}
                        onClick={() => setTipo('boleta')}
                    >
                        Boleta
                    </button>
                    <button
                        type="button"
                        className={`ap-emit-tipo-btn ${tipo === 'factura' ? 'active' : ''}`}
                        onClick={() => setTipo('factura')}
                    >
                        Factura
                    </button>
                </div>

                {tipo === 'factura' && (
                    <div className="ap-modal-form" style={{ paddingTop: '1rem' }}>
                        <div className="ap-modal-field ap-modal-full">
                            <label>RUC</label>
                            <input
                                type="text"
                                maxLength={11}
                                value={ruc}
                                onChange={e => setRuc(e.target.value.replace(/\D/g,''))}
                                placeholder="20123456789"
                            />
                        </div>
                        <div className="ap-modal-field ap-modal-full">
                            <label>Razón Social</label>
                            <input
                                type="text"
                                value={razonSocial}
                                onChange={e => setRazonSocial(e.target.value)}
                                placeholder="EMPRESA S.A.C."
                            />
                        </div>
                    </div>
                )}

                {/* Resumen del pedido */}
                <div className="ap-emit-summary">
                    {group.items.map((item, i) => (
                        <div key={i} className="ap-emit-summary-row">
                            <span>{item.cantidad_docenas}× {item.producto}</span>
                            <span>S/ {(item.total_soles || 0).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                {error && <p className="ap-modal-error">{error}</p>}

                <div className="ap-modal-actions">
                    <button type="button" className="ap-modal-btn-cancel" onClick={onClose} disabled={emitting}>
                        Cancelar
                    </button>
                    <button type="button" className="ap-modal-btn-save" onClick={handleEmitir} disabled={emitting}>
                        {emitting ? 'Emitiendo...' : `Emitir ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Modal de Edición de Grupo (multi-producto) ───────── */
function GroupEditModal({ group, onClose, onSaved }) {
    const [form, setForm] = useState({
        nombre:    group.nombre    || '',
        dni:       group.dni       || '',
        direccion: group.direccion || '',
        telefono:  group.telefono  || '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState('');

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        const payload = {
            nombre:    form.nombre.trim(),
            dni:       form.dni.trim(),
            direccion: form.direccion.trim(),
            telefono:  form.telefono.trim() || null,
        };
        const { error: supaErr } = group.hasPedidoId
            ? await supabase.from('ventas').update(payload).eq('pedido_id', group.pedido_id)
            : await supabase.from('ventas').update(payload).in('id', group.ids);
        if (supaErr) {
            setError('Error al guardar: ' + supaErr.message);
            setSaving(false);
        } else {
            onSaved(payload);
        }
    };

    return (
        <div className="ap-modal-backdrop" onClick={onClose}>
            <div className="ap-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="ap-modal-header">
                    <div>
                        <h2 className="ap-modal-title">Editar Cliente</h2>
                        <p className="ap-modal-sub">{group.items.length} producto{group.items.length > 1 ? 's' : ''} en este pedido</p>
                    </div>
                    <button className="ap-modal-close" onClick={onClose} aria-label="Cerrar">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Productos (solo lectura) */}
                <div className="ap-group-edit-products">
                    {group.items.map((item, i) => (
                        <div key={i} className="ap-group-edit-item">
                            <span className="ap-prod-line-qty">{item.cantidad_docenas}×</span>
                            <span className="ap-group-edit-item-name">{item.producto}</span>
                            <span className="ap-group-edit-item-price">S/ {(item.total_soles || 0).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="ap-group-edit-total">
                        <span>Total</span>
                        <span>S/ {group.total.toFixed(2)}</span>
                    </div>
                </div>

                <form className="ap-modal-form" onSubmit={handleSubmit}>
                    <div className="ap-modal-grid">
                        <div className="ap-modal-field ap-modal-full">
                            <label>Nombre del Cliente</label>
                            <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Nombre completo" required />
                        </div>
                        <div className="ap-modal-field">
                            <label>DNI</label>
                            <input type="text" maxLength="8" value={form.dni} onChange={e => setForm({...form, dni: e.target.value})} placeholder="12345678" />
                        </div>
                        <div className="ap-modal-field">
                            <label>Celular</label>
                            <input type="text" maxLength="9" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value.replace(/\D/g,'')})} placeholder="987654321" />
                        </div>
                        <div className="ap-modal-field ap-modal-full">
                            <label>Dirección</label>
                            <input type="text" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} placeholder="Av. Ejemplo 123, Lima" />
                        </div>
                    </div>
                    {error && <p className="ap-modal-error">{error}</p>}
                    <div className="ap-modal-actions">
                        <button type="button" className="ap-modal-btn-cancel" onClick={onClose} disabled={saving}>Cancelar</button>
                        <button type="submit" className="ap-modal-btn-save" disabled={saving}>
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
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
    const [filter, setFilter]             = useState('todos');
    const [search, setSearch]             = useState('');
    const [updating, setUpdating]         = useState(null);
    const [emitting, setEmitting]         = useState(null);
    const [selected, setSelected]         = useState([]);
    const [editOrder, setEditOrder]       = useState(null);
    const [editGroup, setEditGroup]       = useState(null);
    const [emitirGroup, setEmitirGroup]   = useState(null);
    const [vistaGrafico, setVistaGrafico] = useState('dia');
    const [pendingNotif, setPendingNotif] = useState(null);

    // Agrupar filas por pedido_id → un pedido = un cliente con N productos
    const groupedOrders = useMemo(() => {
        const groups = {};
        for (const o of orders) {
            const key = o.pedido_id || `__${o.id}`;
            if (!groups[key]) {
                groups[key] = {
                    key,
                    hasPedidoId:  !!o.pedido_id,
                    pedido_id:    o.pedido_id,
                    nombre:       o.nombre,
                    dni:          o.dni,
                    ruc:          o.ruc,
                    razon_social: o.razon_social,
                    direccion:    o.direccion,
                    telefono:     o.telefono,
                    estado:       o.estado || 'pendiente',
                    fecha_creacion: o.fecha_creacion,
                    items: [],
                    ids:   [],
                    total: 0,
                };
            }
            groups[key].items.push(o);
            groups[key].ids.push(o.id);
            groups[key].total += (o.total_soles || 0);
        }
        return Object.values(groups).sort((a, b) =>
            new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
        );
    }, [orders]);

    const filtered = groupedOrders.filter(g => {
        const matchFilter = filter === 'todos' || g.estado === filter;
        const matchSearch = !search || [g.nombre, g.dni, g.direccion, ...g.items.map(i => i.producto)]
            .some(v => v?.toLowerCase().includes(search.toLowerCase()));
        return matchFilter && matchSearch;
    });

    const allChecked = filtered.length > 0 && filtered.every(g => selected.includes(g.key));
    const toggleAll  = () => setSelected(allChecked ? [] : filtered.map(g => g.key));
    const toggleOne  = (key) => setSelected(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);

    const countBy = (e) => groupedOrders.filter(g => g.estado === e).length;
    const totalIngresos = orders
        .filter(o => (o.estado || 'pendiente') !== 'cancelado')
        .reduce((s, o) => s + (o.total_soles || 0), 0);

    // Notificación WA con todos los productos del pedido
    const notificarWA = (group, estado) => {
        const phone = group.telefono;
        if (!phone) return;
        const msgs = {
            'pendiente':  'Tu pedido está registrado y en espera de confirmación.',
            'pagado':     '✅ ¡Tu pago fue confirmado! Ya estamos procesando tu pedido.',
            'en proceso': '🔧 ¡Estamos preparando tu pedido! Pronto estará listo.',
            'entregado':  '📦 ¡Tu pedido ha sido entregado! Gracias por elegirnos.',
            'cancelado':  '❌ Lamentamos informarte que tu pedido fue cancelado. Contáctanos para más información.',
        };
        const productList = group.items
            .map(i => `• ${i.cantidad_docenas} doc. de ${i.producto} — S/ ${(i.total_soles || 0).toFixed(2)}`)
            .join('\n');
        const msg = `Hola ${group.nombre || 'cliente'}, te informamos que tu pedido ha sido actualizado.\n\n📋 *Estado:* ${estado.toUpperCase()}\n${msgs[estado] || ''}\n\n🛍️ *Productos:*\n${productList}\n\n💰 *Total: S/ ${group.total.toFixed(2)}*\n\n_M&V Technology Textil S.A.C._`;
        window.open(`https://wa.me/51${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    // Actualizar estado de TODAS las filas del grupo a la vez
    const updateEstado = async (group, nuevoEstado) => {
        const prevEstado = group.estado;
        setOrders(prev => prev.map(o => group.ids.includes(o.id) ? { ...o, estado: nuevoEstado } : o));
        setUpdating(group.key);

        const { error } = group.hasPedidoId
            ? await supabase.from('ventas').update({ estado: nuevoEstado }).eq('pedido_id', group.pedido_id)
            : await supabase.from('ventas').update({ estado: nuevoEstado }).in('id', group.ids);

        if (error) {
            setOrders(prev => prev.map(o => group.ids.includes(o.id) ? { ...o, estado: prevEstado } : o));
            alert('No se pudo actualizar el estado. Intenta de nuevo.');
        } else if (group.telefono) {
            setPendingNotif({ group: { ...group, estado: nuevoEstado }, estado: nuevoEstado });
            setTimeout(() => setPendingNotif(null), 6000);
        }
        setUpdating(null);
    };

    const emitirComprobante = async ({ tipo, ruc, razonSocial }) => {
        const group = emitirGroup;
        setEmitting(group.key);
        try {
            const body = {
                ...(group.hasPedidoId ? { pedidoId: group.pedido_id } : { orderId: group.items[0].id }),
                tipoComprobante: tipo,
                ...(tipo === 'factura' ? { ruc, razonSocial } : {}),
            };
            const { data, error } = await supabase.functions.invoke('emitir-boleta', { body });
            if (error) throw error;
            if (data?.error) throw new Error(data.error);
            if (data?.comprobante_url) {
                setOrders(prev => prev.map(o =>
                    group.ids.includes(o.id)
                        ? { ...o, comprobante_url: data.comprobante_url, estado: 'pagado' }
                        : o
                ));
            }
            setEmitirGroup(null);
        } catch (err) {
            alert("Error al emitir comprobante: " + err.message);
        } finally {
            setEmitting(null);
        }
    };

    const handleExport = () => {
        const toExport = selected.length > 0 ? filtered.filter(g => selected.includes(g.key)) : filtered;
        exportToCSV(toExport.flatMap(g => g.items.map(item => ({ ...item, estado: g.estado }))));
    };

    const handleSaved = (updatedFields) => {
        setOrders(prev => prev.map(o => o.id === editOrder.id ? { ...o, ...updatedFields } : o));
        setEditOrder(null);
    };

    const handleGroupSaved = (updatedFields) => {
        setOrders(prev => prev.map(o => editGroup.ids.includes(o.id) ? { ...o, ...updatedFields } : o));
        setEditGroup(null);
    };

    const chartData = orders
        .filter(o => (o.estado || 'pendiente') !== 'cancelado' && o.fecha_creacion)
        .reduce((acc, order) => {
            const d = new Date(order.fecha_creacion);
            let dateStr, sortDate;
            if (vistaGrafico === 'dia') {
                dateStr  = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`;
                sortDate = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
            } else if (vistaGrafico === 'mes') {
                const mn = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
                dateStr  = `${mn[d.getMonth()]} ${d.getFullYear()}`;
                sortDate = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
            } else {
                dateStr  = `${d.getFullYear()}`;
                sortDate = new Date(d.getFullYear(), 0, 1).getTime();
            }
            const ex = acc.find(x => x.date === dateStr);
            if (ex) ex.total += (order.total_soles || 0);
            else acc.push({ date: dateStr, total: order.total_soles || 0, sortDate });
            return acc;
        }, [])
        .sort((a, b) => a.sortDate - b.sortDate)
        .map(({ date, total }) => ({ date, total }));

    return (
        <>
            {editOrder && (
                <EditModal order={editOrder} onClose={() => setEditOrder(null)} onSaved={handleSaved} />
            )}
            {editGroup && (
                <GroupEditModal group={editGroup} onClose={() => setEditGroup(null)} onSaved={handleGroupSaved} />
            )}
            {emitirGroup && (
                <EmitirModal
                    group={emitirGroup}
                    onClose={() => setEmitirGroup(null)}
                    onEmitir={emitirComprobante}
                    emitting={emitting === emitirGroup.key}
                />
            )}

            {/* WA Toast */}
            {pendingNotif && (
                <div className="ap-wa-toast">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.848L0 24l6.335-1.508A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.655-.498-5.187-1.367l-.372-.22-3.762.896.952-3.658-.242-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                    <span>Estado actualizado — <strong>{pendingNotif.group.nombre}</strong> tiene celular registrado</span>
                    <button className="ap-wa-toast-btn" onClick={() => { notificarWA(pendingNotif.group, pendingNotif.estado); setPendingNotif(null); }}>
                        Notificar
                    </button>
                    <button className="ap-wa-toast-close" onClick={() => setPendingNotif(null)}>✕</button>
                </div>
            )}

            {/* Stats */}
            <div className="ap-stats">
                <StatCard label="Total Pedidos" value={groupedOrders.length}              growth="+12%" positive icon="orders" />
                <StatCard label="Ingresos"       value={`S/ ${totalIngresos.toFixed(2)}`} growth="+8.5%" positive icon="revenue" />
                <StatCard label="Pendientes"     value={countBy('pendiente')}              growth="-5%"  positive={false} icon="pending" />
                <StatCard label="En Proceso"     value={countBy('en proceso')}             growth="+3%"  positive icon="process" />
                <StatCard label="Entregados"     value={countBy('entregado')}              growth="+22%" positive icon="done" />
            </div>

            {/* Gráfico */}
            <div className="ap-chart-placeholder">
                <div className="ap-chart-header" style={{ alignItems: 'center' }}>
                    <div>
                        <h3>Resumen de Ventas</h3>
                        <p>Evolución de ingresos</p>
                    </div>
                    <select className="ap-estado-select" value={vistaGrafico} onChange={e => setVistaGrafico(e.target.value)}
                        style={{ background: '#F1F5F9', color: '#475569', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                        <option value="dia">Por Día</option>
                        <option value="mes">Por Mes</option>
                        <option value="año">Por Año</option>
                    </select>
                </div>
                {chartData.length > 0 ? (
                    <div style={{ width: '100%', height: 250, marginTop: '1rem' }}>
                        <ResponsiveContainer width="99%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }}
                                    tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={v => [`S/ ${v.toFixed(2)}`, 'Ingresos']} />
                                <Area type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
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
                        <button key={e} className={`ap-filter-tab ${filter === e ? 'active' : ''}`}
                            onClick={() => { setFilter(e); setSelected([]); }}>
                            {e.charAt(0).toUpperCase() + e.slice(1)}
                            <span className="ap-filter-count">
                                {e === 'todos' ? groupedOrders.length : countBy(e)}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="ap-toolbar-right">
                    <div className="ap-search">
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input type="text" placeholder="Buscar por nombre, DNI, producto..."
                            value={search} onChange={e => setSearch(e.target.value)} />
                        {search && <button className="ap-search-clear" onClick={() => setSearch('')}>✕</button>}
                    </div>
                    <button className="ap-btn-export" onClick={handleExport}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {selected.length > 0 ? `Exportar (${selected.length})` : 'Exportar CSV'}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="ap-table-card">
                {loading ? (
                    <div className="ap-state-box"><div className="ap-spinner" /><p>Cargando pedidos...</p></div>
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
                                <th><input type="checkbox" className="ap-checkbox" checked={allChecked} onChange={toggleAll} /></th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Doc.</th>
                                <th>Dirección</th>
                                <th>Productos</th>
                                <th>Total</th>
                                <th>Comprobante</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(group => {
                                const estado     = group.estado;
                                const style      = ESTADO_META[estado] || ESTADO_META['pendiente'];
                                const isSelected = selected.includes(group.key);
                                const isSingle   = group.items.length === 1;
                                const compUrl    = group.items.find(i => i.comprobante_url)?.comprobante_url;
                                const fecha      = group.fecha_creacion
                                    ? new Date(group.fecha_creacion).toLocaleString('es-PE', {
                                        day: '2-digit', month: '2-digit', year: '2-digit',
                                        hour: '2-digit', minute: '2-digit'
                                      })
                                    : '—';

                                return (
                                    <tr key={group.key}
                                        className={`${isSelected ? 'row-selected' : ''} ${updating === group.key ? 'row-updating' : ''}`}>
                                        <td>
                                            <input type="checkbox" className="ap-checkbox"
                                                checked={isSelected} onChange={() => toggleOne(group.key)} />
                                        </td>
                                        <td className="td-fecha"  data-label="Fecha">{fecha}</td>
                                        <td className="td-nombre" data-label="Cliente">{group.nombre || '—'}</td>
                                        <td className="td-dni" data-label="Doc.">
                                            {group.ruc
                                                ? <span className="ap-doc-ruc">RUC {group.ruc}</span>
                                                : (group.dni || '—')}
                                        </td>
                                        <td className="td-dir"    data-label="Dirección">{group.direccion || '—'}</td>
                                        <td data-label="Productos">
                                            {group.items.map((item, i) => (
                                                <div key={i} className="ap-prod-line">
                                                    <span className="ap-prod-line-qty">{item.cantidad_docenas}×</span>
                                                    <span className="ap-prod-line-name">{item.producto}</span>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="td-total" data-label="Total">S/ {group.total.toFixed(2)}</td>
                                        <td data-label="Comprobante">
                                            {compUrl ? (
                                                <a href={compUrl} target="_blank" rel="noopener noreferrer" className="ap-btn-success">
                                                    Ver PDF
                                                </a>
                                            ) : (
                                                <button
                                                    className="ap-btn-danger"
                                                    onClick={() => setEmitirGroup(group)}
                                                    disabled={emitting === group.key}
                                                >
                                                    {emitting === group.key ? 'Emitiendo...' : (group.ruc ? 'Emitir Factura' : 'Emitir Boleta')}
                                                </button>
                                            )}
                                        </td>
                                        <td data-label="Estado">
                                            <select className="ap-estado-select" value={estado}
                                                disabled={updating === group.key}
                                                style={{ background: style.bg, color: style.color }}
                                                onChange={e => updateEstado(group, e.target.value)}>
                                                {ESTADOS.map(s => (
                                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td data-label="Acciones">
                                            <div className="ap-row-actions">
                                                {group.telefono && (
                                                    <button className="ap-wa-btn" title="Notificar por WhatsApp"
                                                        onClick={() => notificarWA(group, estado)}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.848L0 24l6.335-1.508A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.655-.498-5.187-1.367l-.372-.22-3.762.896.952-3.658-.242-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                                                        </svg>
                                                    </button>
                                                )}
                                                {compUrl ? (
                                                    <span className="ap-edit-locked" title="No editable: boleta emitida">
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                    </span>
                                                ) : (
                                                    <button className="ap-edit-btn" title="Editar pedido"
                                                        onClick={() => isSingle ? setEditOrder(group.items[0]) : setEditGroup(group)}>
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
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
const DATE_OPTIONS = [
    { id: '7d',  label: '7 días' },
    { id: '30d', label: '30 días' },
    { id: '3m',  label: '3 meses' },
    { id: 'all', label: 'Todo' },
];

function MetricasSection({ orders }) {
    const [dateRange, setDateRange] = useState('30d');

    const filtered = useMemo(() => {
        const base = orders.filter(o => (o.estado || 'pendiente') !== 'cancelado');
        if (dateRange === 'all') return base;
        const cutoff = new Date();
        if (dateRange === '7d')  cutoff.setDate(cutoff.getDate() - 7);
        if (dateRange === '30d') cutoff.setDate(cutoff.getDate() - 30);
        if (dateRange === '3m')  cutoff.setMonth(cutoff.getMonth() - 3);
        return base.filter(o => o.fecha_creacion && new Date(o.fecha_creacion) >= cutoff);
    }, [orders, dateRange]);

    const totalRevenue = filtered.reduce((s, o) => s + (o.total_soles || 0), 0);
    const avgPerOrder  = filtered.length ? totalRevenue / filtered.length : 0;

    const byProduct  = filtered.reduce((acc, o) => {
        if (o.producto) acc[o.producto] = (acc[o.producto] || 0) + (o.total_soles || 0);
        return acc;
    }, {});
    const topProducts = Object.entries(byProduct).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxVal      = topProducts[0]?.[1] || 1;
    const bestProduct = topProducts[0]?.[0] ?? '—';

    const chartData = filtered
        .filter(o => o.fecha_creacion)
        .reduce((acc, order) => {
            const d = new Date(order.fecha_creacion);
            let label, sortKey;
            if (dateRange === '7d' || dateRange === '30d') {
                label   = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`;
                sortKey = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
            } else {
                const mn = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
                label   = `${mn[d.getMonth()]} ${d.getFullYear()}`;
                sortKey = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
            }
            const ex = acc.find(x => x._k === sortKey);
            if (ex) ex.total += (order.total_soles || 0);
            else acc.push({ date: label, total: order.total_soles || 0, _k: sortKey });
            return acc;
        }, [])
        .sort((a, b) => a._k - b._k)
        .map(({ date, total }) => ({ date, total }));

    // Product alerts: all unique products whose last sale is > 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const alertProducts = [...new Set(orders.map(o => o.producto).filter(Boolean))]
        .map(prod => {
            const dates = orders
                .filter(o => o.producto === prod && o.fecha_creacion)
                .map(o => new Date(o.fecha_creacion));
            const lastSale = dates.length ? new Date(Math.max(...dates)) : null;
            return { prod, lastSale };
        })
        .filter(({ lastSale }) => !lastSale || lastSale < thirtyDaysAgo);

    return (
        <div className="ap-metricas">
            {/* Header + date filter */}
            <div className="ap-m-header">
                <h2 className="ap-section-heading" style={{ marginBottom: 0 }}>Métricas de Ventas</h2>
                <div className="ap-date-filters">
                    {DATE_OPTIONS.map(o => (
                        <button
                            key={o.id}
                            className={`ap-date-btn ${dateRange === o.id ? 'active' : ''}`}
                            onClick={() => setDateRange(o.id)}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI row */}
            <div className="ap-m-kpi-row">
                <div className="ap-m-kpi">
                    <span className="ap-m-kpi-label">Ingresos del período</span>
                    <span className="ap-m-kpi-value">S/ {totalRevenue.toFixed(2)}</span>
                </div>
                <div className="ap-m-kpi">
                    <span className="ap-m-kpi-label">Ticket promedio</span>
                    <span className="ap-m-kpi-value">S/ {avgPerOrder.toFixed(2)}</span>
                </div>
                <div className="ap-m-kpi">
                    <span className="ap-m-kpi-label">Pedidos</span>
                    <span className="ap-m-kpi-value">{filtered.length}</span>
                </div>
                <div className="ap-m-kpi">
                    <span className="ap-m-kpi-label">Top producto</span>
                    <span className="ap-m-kpi-value ap-m-kpi-value--sm">{bestProduct}</span>
                </div>
            </div>

            {/* Revenue chart */}
            <div className="ap-chart-placeholder">
                <div className="ap-chart-header">
                    <div>
                        <h3>Ingresos por período</h3>
                        <p>Ventas no canceladas · {DATE_OPTIONS.find(o => o.id === dateRange)?.label}</p>
                    </div>
                </div>
                {chartData.length > 0 ? (
                    <div style={{ width: '100%', height: 220, marginTop: '.5rem' }}>
                        <ResponsiveContainer width="99%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="mColorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#10B981" stopOpacity={0.35}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }}
                                    tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(v) => [`S/ ${v.toFixed(2)}`, 'Ingresos']}
                                />
                                <Area type="monotone" dataKey="total" stroke="#10B981" strokeWidth={3}
                                    fillOpacity={1} fill="url(#mColorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 220 }}>
                        <p style={{ color: '#94A3B8', fontSize: '.85rem' }}>Sin ventas en este período</p>
                    </div>
                )}
            </div>

            {/* Top productos + Estado */}
            <div className="ap-metricas-grid">
                <div className="ap-metrics-card">
                    <h3>Top Productos por Ingreso</h3>
                    <div className="ap-product-bars">
                        {topProducts.length === 0 ? (
                            <p className="ap-no-data">Sin datos en este período</p>
                        ) : topProducts.map(([name, total]) => (
                            <div key={name} className="ap-prod-row">
                                <span className="ap-prod-name">{name}</span>
                                <div className="ap-prod-bar-track">
                                    <div className="ap-prod-bar-fill" style={{ width: `${(total / maxVal) * 100}%` }} />
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

            {/* Product alerts */}
            {alertProducts.length > 0 && (
                <div className="ap-alert-section">
                    <div className="ap-alert-header">
                        <svg width="16" height="16" fill="none" stroke="#D97706" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Productos sin ventas en los últimos 30 días</span>
                        <span className="ap-alert-count">{alertProducts.length}</span>
                    </div>
                    <div className="ap-alert-list">
                        {alertProducts.map(({ prod, lastSale }) => (
                            <div key={prod} className="ap-alert-item">
                                <span className="ap-alert-dot" />
                                <span className="ap-alert-name">{prod}</span>
                                <span className="ap-alert-last">
                                    {lastSale
                                        ? `Última venta: ${lastSale.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: '2-digit' })}`
                                        : 'Sin ventas registradas'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
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
