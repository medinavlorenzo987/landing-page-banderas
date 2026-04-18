import { useState } from 'react';

export default function ProductCard({ product, onAddToCart }) {
    const [qty, setQty] = useState(1);

    const changeQty = (delta) => {
        const newQty = qty + delta;
        if (newQty >= 1) {
            setQty(newQty);
        }
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
                    <button className="btn-add" onClick={() => onAddToCart(product.name, product.price, qty)}>
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
