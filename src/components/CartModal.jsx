import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // 1. Importamos tu mensajero de Supabase

export default function CartModal({ cart, onClose, onConfirm }) {
    const [form, setForm] = useState({ name: '', dni: '', address: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Ingresa tu nombre';
        if (!/^\d{8}$/.test(form.dni)) e.dni = 'DNI debe tener 8 dígitos';
        if (!form.address.trim()) e.address = 'Ingresa tu dirección';
        return e;
    };

    // 2. Convertimos esta función en "async" para que pueda esperar a la base de datos
    const handleSubmit = async (e) => {
        e.preventDefault();
        const e2 = validate();
        if (Object.keys(e2).length > 0) { setErrors(e2); return; }

        // 3. Preparamos los datos tal cual los pide tu nueva tabla de Supabase
        const ventasParaRegistrar = cart.map(item => ({
            producto: item.name,
            cantidad_docenas: item.quantity,
            total_soles: item.price * item.quantity,
            nombre: form.name,         // El nombre que escribió el cliente
            dni: form.dni,             // El DNI que escribió el cliente
            direccion: form.address    // La dirección que escribió el cliente
        }));

        // 4. Enviamos el registro silencioso a la nube
        const { error } = await supabase
            .from('ventas')
            .insert(ventasParaRegistrar);

        if (error) {
            console.error("Hubo un error en el registro:", error);
        } else {
            console.log("¡Pedido con datos del cliente registrado con éxito!");
        }

        // 5. Finalmente, ejecutamos tu función original para abrir el WhatsApp
        onConfirm(form);
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-box" role="dialog" aria-modal="true">
                <button className="modal-close" onClick={onClose} aria-label="Cerrar">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="modal-title">
                    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Tu Pedido
                </h2>

                {cart.length === 0 ? (
                    <div className="modal-empty">
                        <svg width="48" height="48" fill="none" stroke="#ccc" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p>Tu carrito está vacío</p>
                    </div>
                ) : (
                    <>
                        <div className="modal-items">
                            {cart.map((item) => (
                                <div key={item.name} className="modal-item">
                                    <span className="modal-item-name">{item.name}</span>
                                    <span className="modal-item-qty">{item.quantity} doc.</span>
                                    <span className="modal-item-price">S/ {(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="modal-total">
                                <span>Total</span>
                                <span>S/ {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <form className="modal-form" onSubmit={handleSubmit} noValidate>
                            <h3 className="modal-form-title">Datos de entrega</h3>

                            <div className="modal-field">
                                <label htmlFor="modal-name">Nombre completo</label>
                                <input
                                    id="modal-name"
                                    type="text"
                                    placeholder="Ej: Juan Pérez García"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={errors.name ? 'input-error' : ''}
                                />
                                {errors.name && <span className="field-error">{errors.name}</span>}
                            </div>

                            <div className="modal-field">
                                <label htmlFor="modal-dni">DNI</label>
                                <input
                                    id="modal-dni"
                                    type="text"
                                    placeholder="12345678"
                                    maxLength={8}
                                    value={form.dni}
                                    onChange={(e) => setForm({ ...form, dni: e.target.value.replace(/\D/g, '') })}
                                    className={errors.dni ? 'input-error' : ''}
                                />
                                {errors.dni && <span className="field-error">{errors.dni}</span>}
                            </div>

                            <div className="modal-field">
                                <label htmlFor="modal-address">Dirección de entrega</label>
                                <input
                                    id="modal-address"
                                    type="text"
                                    placeholder="Ej: Av. Arequipa 1234, Lima"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    className={errors.address ? 'input-error' : ''}
                                />
                                {errors.address && <span className="field-error">{errors.address}</span>}
                            </div>

                            <button type="submit" className="modal-submit">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.848L0 24l6.335-1.508A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.655-.498-5.187-1.367l-.372-.22-3.762.896.952-3.658-.242-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                                </svg>
                                Confirmar por WhatsApp
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}