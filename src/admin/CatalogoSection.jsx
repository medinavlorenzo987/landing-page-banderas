import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function CatalogoSection() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('catalogo_productos').select('*').order('created_at', { ascending: true });
        if (error) {
            if (error.code === 'PGRST205') {
                setError('TABLA_NO_EXISTE');
            } else {
                setError(error.message);
            }
        } else {
            setProducts(data || []);
            setError(null);
        }
        setLoading(false);
    };

    if (loading) return <div className="ap-loading"><div className="ap-spinner"></div> Cargando catálogo...</div>;

    if (error === 'TABLA_NO_EXISTE') {
        return (
            <div className="ap-section">
                <div className="ap-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h3>Configuración Requerida</h3>
                    <p style={{ color: '#64748B', marginTop: '1rem' }}>
                        Para editar los productos de la página principal, necesitas crear la tabla <strong>catalogo_productos</strong> en tu base de datos y el bucket de imágenes.
                        Por favor, sigue las instrucciones en el chat para ejecutar el código SQL.
                    </p>
                    <button className="ap-btn" onClick={fetchProducts} style={{ marginTop: '1.5rem', padding: '0.5rem 1rem', background: '#3B82F6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Ya ejecuté el código, recargar</button>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="ap-section">Error: {error}</div>;
    }

    return (
        <div className="ap-section" style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div className="ap-card" style={{ border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
                <div className="ap-card-header" style={{ padding: '2rem', borderBottom: '1px solid #F1F5F9' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Catálogo de la Página Principal</h2>
                    <p style={{ color: '#64748B', marginTop: '0.5rem', fontSize: '0.95rem' }}>Gestiona las tarjetas de producto, precios y fotos que ven tus clientes en la tienda.</p>
                </div>
                <div className="ap-products-grid" style={{ padding: '2rem', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', background: '#F8FAFC' }}>
                    {products.map(p => (
                        <div key={p.id} style={{ 
                            background: '#fff', 
                            borderRadius: '16px', 
                            overflow: 'hidden', 
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'default',
                            display: 'flex',
                            flexDirection: 'column'
                        }} 
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}
                        >
                            <div style={{ height: '160px', background: p.gradient || '#E2E8F0', position: 'relative' }}>
                                {p.images && p.images.length > 0 ? (
                                    <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.8)' }}>
                                        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    </div>
                                )}
                                {p.badge && (
                                    <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '999px', backdropFilter: 'blur(4px)', fontWeight: 600 }}>{p.badge}</span>
                                )}
                            </div>

                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.8rem', color: '#6366F1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{p.category || 'Categoría'}</div>
                                <h3 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#0F172A', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>{p.title}</h3>
                                <div style={{ color: '#059669', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem' }}>S/ {Number(p.price).toFixed(2)}</div>
                                <p style={{ fontSize: '0.9rem', color: '#475569', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1, margin: 0, lineHeight: 1.5 }}>{p.description}</p>
                                
                                <button onClick={() => setEditingProduct(p)} style={{ 
                                    marginTop: '1.5rem', width: '100%', padding: '0.75rem', background: '#0F172A', color: '#fff', 
                                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#1E293B'}
                                onMouseLeave={e => e.currentTarget.style.background = '#0F172A'}
                                >
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                    Editar Detalles
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {editingProduct && <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSaved={fetchProducts} />}
        </div>
    );
}

function EditProductModal({ product, onClose, onSaved }) {
    const [form, setForm] = useState({
        name: product.name || '',
        title: product.title || '',
        price: product.price || 0,
        description: product.description || '',
    });
    const [images, setImages] = useState(product.images || []);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleImageUpload = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        if (images.length >= 3) {
            alert("Máximo 3 imágenes por producto.");
            return;
        }

        const file = e.target.files[0];
        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${product.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('productos').upload(filePath, file);

        if (uploadError) {
            alert('Error subiendo imagen: ' + uploadError.message);
            setUploading(false);
            return;
        }

        const { data } = supabase.storage.from('productos').getPublicUrl(filePath);
        setImages([...images, data.publicUrl]);
        setUploading(false);
    };

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const { error } = await supabase.from('catalogo_productos').update({
            name: form.name,
            title: form.title,
            price: form.price,
            description: form.description,
            images: images
        }).eq('id', product.id);

        setSaving(false);
        if (error) alert("Error: " + error.message);
        else {
            onSaved();
            onClose();
        }
    };

    return (
        <div className="ap-modal-backdrop" onClick={onClose} style={{ backdropFilter: 'blur(4px)' }}>
            <div className="ap-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
                <div className="ap-modal-header" style={{ padding: '1.5rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#E0E7FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </div>
                        <div>
                            <h2 className="ap-modal-title" style={{ margin: 0, fontSize: '1.25rem' }}>Editar {product.name}</h2>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>Modifica los detalles que verán los clientes.</p>
                        </div>
                    </div>
                    <button className="ap-modal-close" onClick={onClose} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>✕</button>
                </div>

                <form className="ap-modal-form" onSubmit={handleSave} style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="ap-modal-field" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem', display: 'block' }}>Título (Público)</label>
                            <input name="title" value={form.title} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' }} onFocus={e => e.target.style.borderColor = '#3B82F6'} onBlur={e => e.target.style.borderColor = '#CBD5E1'} />
                        </div>
                        <div className="ap-modal-field" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem', display: 'block' }}>Precio (S/ por docena)</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontWeight: 600 }}>S/</span>
                                <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.2rem', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem', fontWeight: 600, color: '#0F172A' }} onFocus={e => e.target.style.borderColor = '#3B82F6'} onBlur={e => e.target.style.borderColor = '#CBD5E1'} />
                            </div>
                        </div>
                    </div>

                    <div className="ap-modal-field" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem', display: 'block' }}>Descripción del producto</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={4} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#3B82F6'} onBlur={e => e.target.style.borderColor = '#CBD5E1'} />
                    </div>
                    
                    <div className="ap-modal-field" style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block' }}>Galería de Imágenes</label>
                            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{images.length}/3 imágenes</span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px dashed #E2E8F0' }}>
                            {images.map((img, i) => (
                                <div key={i} style={{ position: 'relative', group: 'true' }}>
                                    <img src={img} alt="Prod" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
                                    <button type="button" onClick={() => handleRemoveImage(i)} style={{ position: 'absolute', top: -8, right: -8, background: '#EF4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)', transition: 'transform 0.1s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                                    </button>
                                </div>
                            ))}
                            {images.length < 3 && (
                                <label style={{ width: '100px', height: '100px', border: '2px dashed #CBD5E1', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff', transition: 'border-color 0.2s, background 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.background = '#EFF6FF'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = '#fff'; }}>
                                    <svg width="24" height="24" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" style={{ marginBottom: '4px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                    <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>Subir Foto</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                                </label>
                            )}
                        </div>
                        {uploading && <div style={{ fontSize: '0.8rem', color: '#3B82F6', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg className="ap-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ animation: 'spin 1s linear infinite' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                            Subiendo imagen...
                        </div>}
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
                        <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', background: '#fff', border: '1px solid #CBD5E1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#475569', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>Cancelar</button>
                        <button type="submit" disabled={saving || uploading} style={{ padding: '0.75rem 2rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s', opacity: (saving || uploading) ? 0.7 : 1 }} onMouseEnter={e => e.currentTarget.style.background = '#2563EB'} onMouseLeave={e => e.currentTarget.style.background = '#3B82F6'}>
                            {saving ? (
                                <>
                                    <svg className="ap-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ animation: 'spin 1s linear infinite' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                                    Guardando...
                                </>
                            ) : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
