import { useEffect, useState } from 'react';

export default function Navbar({ cartCount, onCheckout }) {
    const [bump, setBump] = useState(false);

    useEffect(() => {
        if (cartCount > 0) {
            setBump(true);
            const timer = setTimeout(() => setBump(false), 400);
            return () => clearTimeout(timer);
        }
    }, [cartCount]);

    return (
        <header id="header">
            <div className="nav-container">
                <a href="#" className="logo">
                    🇵🇪 Banderas<span>Perú</span>
                </a>
                <div className="cart-wrapper">
                    <button 
                        id="cart-button" 
                        className={`cart-btn ${bump ? 'cart-bump' : ''}`} 
                        aria-label="Ver carrito"
                        onClick={onCheckout}
                    >
                        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        Mi Pedido
                        <span className="cart-count" id="cart-count">{cartCount}</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
