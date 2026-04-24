import { useEffect, useState } from 'react';

export default function Navbar({ cartCount, onCartClick, activeTab, onTabChange }) {
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

                {/* ── LOGO ── */}
                <a href="#" className="logo">
                    M&V <span>Textil</span>
                </a>

                {/* ── TABS (centro) ── */}
                <nav className="nav-tabs" aria-label="Navegación principal" role="tablist">
                    <button
                        id="tab-empresa"
                        className={`nav-tab-btn ${activeTab === 'empresa' ? 'nav-tab-btn--active' : ''}`}
                        onClick={() => onTabChange('empresa')}
                        aria-selected={activeTab === 'empresa'}
                        role="tab"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        Nuestra Empresa
                    </button>
                    <button
                        id="tab-banderas"
                        className={`nav-tab-btn ${activeTab === 'banderas' ? 'nav-tab-btn--active' : ''}`}
                        onClick={() => onTabChange('banderas')}
                        aria-selected={activeTab === 'banderas'}
                        role="tab"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                        Campaña Banderas
                    </button>
                </nav>

                {/* ── CARRITO ── */}
                <div className="cart-wrapper">
                    <button
                        id="cart-button"
                        className={`cart-btn ${bump ? 'cart-bump' : ''}`}
                        aria-label="Ver carrito"
                        onClick={onCartClick}
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
