import { useState } from 'react';

export default function ProductCard({ product, onAddToCart }) {
    const [qty, setQty] = useState(1);
    const [imgIndex, setImgIndex] = useState(0);
    const { Icon } = product;

    const changeQty = (delta) => {
        setQty(prev => Math.max(1, prev + delta));
    };

    const handleComprar = () => {
        onAddToCart(product.title || product.name, product.price, qty);
    };

    const badgeClass = `product-badge product-badge--${product.badgeVariant || 'dark'}`;

    return (
        <article className="product-card">
            {product.badge && (
                <span className={badgeClass}>{product.badge}</span>
            )}

            <div className="product-img" style={{ background: product.gradient, position: 'relative', overflow: 'hidden' }}>
                {product.images && product.images.length > 0 ? (
                    <>
                        <img src={product.images[imgIndex]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                        {product.images.length > 1 && (
                            <>
                                <button onClick={() => setImgIndex(prev => (prev - 1 + product.images.length) % product.images.length)} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', paddingBottom: '2px', backdropFilter: 'blur(4px)' }}>‹</button>
                                <button onClick={() => setImgIndex(prev => (prev + 1) % product.images.length)} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', paddingBottom: '2px', backdropFilter: 'blur(4px)' }}>›</button>
                                <div style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                    {product.images.map((_, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setImgIndex(i)}
                                            style={{ width: '8px', height: '8px', borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer', background: i === imgIndex ? '#fff' : 'rgba(255,255,255,0.4)', boxShadow: '0 1px 3px rgba(0,0,0,0.5)', transition: 'background 0.2s' }} 
                                            aria-label={`Ver imagen ${i+1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="product-img-icon">
                        <Icon />
                    </div>
                )}
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
