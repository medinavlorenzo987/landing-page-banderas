import { useState } from 'react';
import { supabase } from '../supabaseClient'; // 1. Importamos a tu "mensajero" logístico

export default function ProductCard({ product, onAddToCart }) {
    const [qty, setQty] = useState(1);

    const changeQty = (delta) => {
        const newQty = qty + delta;
        if (newQty >= 1) {
            setQty(newQty);
        }
    };

    // 2. Creamos esta nueva función que hace el doble trabajo
    const handleComprar = async () => {
        // Calculamos el total de la venta en soles
        const totalPagado = product.price * qty;

        // Le pedimos al mensajero que registre la operación en la tabla 'ventas'
        const { error } = await supabase
            .from('ventas')
            .insert([
                {
                    producto: product.title, // Registramos el nombre de la bandera
                    cantidad_docenas: qty,   // Las docenas que se están llevando
                    total_soles: totalPagado // El monto calculado
                }
            ]);

        if (error) {
            console.error("Hubo un error en el registro:", error);
        } else {
            console.log("¡Operación registrada con éxito en la nube!");
        }

        // 3. Finalmente, ejecutamos tu código original para seguir con la venta
        // Usamos product.title (o product.name) para que no falle tu WhatsApp
        onAddToCart(product.title || product.name, product.price, qty);
    };

    return (
        <article className="card">
            {product.badge && (
                <span
                    className={`badge ${product.badgeClass === 'popular' ? 'popular' : ''}`}
                    style={product.badgeClass === 'dark' ? { background: 'var(--text-dark)' } : {}}
                >
                    {product.badge}
                </span>
            )}
            <div className="card-img-wrapper">
                <div className="image-placeholder">Espacio para foto local</div>
            </div>
            <h3>{product.title}</h3>
            <p>{product.description}</p>

            <div className="card-footer">
                <div className="price-wrapper">
                    <span className="price-label">PRECIO POR DOCENA</span>
                    <span className="price">S/ {product.price.toFixed(2)}</span>
                </div>
                <div className="action-wrapper">
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-dark)' }}>Docenas:</span>
                    <div className="qty-selector">
                        <button type="button" className="qty-btn" onClick={() => changeQty(-1)} aria-label="Disminuir">-</button>
                        <input
                            type="number"
                            id={product.id}
                            className="quantity-input"
                            min="1"
                            value={qty}
                            readOnly
                            aria-label="Cantidad"
                        />
                        <button type="button" className="qty-btn" onClick={() => changeQty(1)} aria-label="Aumentar">+</button>
                    </div>
                    {/* Reemplazamos el onClick viejo por nuestra nueva función handleComprar */}
                    <button className="btn-add" onClick={handleComprar}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Agregar
                    </button>
                </div>
            </div>
        </article>
    );
}