import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ProductCard({ product, onAddToCart }) {
    const [qty, setQty] = useState(1);
    const { Icon } = product;

    const changeQty = (delta) => {
        setQty(prev => Math.max(1, prev + delta));
    };

    const handleComprar = () => {
        onAddToCart(product.title || product.name, product.price, qty);

        supabase.from('ventas').insert([{
            producto: product.title,
            cantidad_docenas: qty,
            total_soles: product.price * qty,
        }]).then(({ error }) => {
            if (error) console.error('Error al registrar:', error);
        });
    };

    const badgeClass = `product-badge product-badge--${product.badgeVariant || 'dark'}`;

    return (
        <article className="product-card">
            {product.badge && (
                <span className={badgeClass}>{product.badge}</span>
            )}

            <div className="product-img" style={{ background: product.gradient }}>
                <div className="product-img-icon">
                    <Icon />
                </div>
            </div>

            <div className="product-body">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.title}</h3>
                <p className="product-desc">{product.description}</p>
            </div>

            <div className="product-footer">
                <div className="product-price-col">
                    <span className="product-price-label">por docena</span>
                    <span className="product-price">S/ {product.price.toFixed(2)}</span>
                </div>

                <div className="product-actions">
                    <div className="qty-control">
                        <button type="button" className="qty-control-btn" onClick={() => changeQty(-1)} aria-label="Disminuir">−</button>
                        <span className="qty-control-val">{qty}</span>
                        <button type="button" className="qty-control-btn" onClick={() => changeQty(1)} aria-label="Aumentar">+</button>
                    </div>
                    <button className="product-add-btn" onClick={handleComprar}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12"/>
                        </svg>
                        Agregar
                    </button>
                </div>
            </div>
        </article>
    );
}
