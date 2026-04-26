import { useEffect, useState } from 'react';

export default function Navbar({ cartCount, onCartClick, activeTab, onTabChange, user, onLoginClick, onLogout, onChangePassword }) {
    const [bump, setBump] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        if (cartCount > 0) {
            setBump(true);
            const timer = setTimeout(() => setBump(false), 400);
            return () => clearTimeout(timer);
        }
    }, [cartCount]);

    useEffect(() => {
        if (!userMenuOpen) return;
        const close = () => setUserMenuOpen(false);
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [userMenuOpen]);

    const initials = user?.user_metadata?.full_name
        ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : user?.email?.[0]?.toUpperCase() ?? '?';

    return (
        <header id="header">
            <div className="nav-container">

                {/* ── LOGO ── */}
                <a href="#" className="logo">
                    <img src="/logo.png" alt="M&V Textil Logo" style={{ maxHeight: '60px', width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                </a>

                {/* ── TABS ── */}
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

                {/* ── ACCIONES DERECHA ── */}
                <div className="nav-actions">

                    {/* Login / Usuario */}
                    {user ? (
                        <div className="nav-user" onClick={(e) => { e.stopPropagation(); setUserMenuOpen(o => !o); }}>
                            <div className="nav-user-avatar">{initials}</div>
                            <span className="nav-user-name">
                                {user.user_metadata?.full_name?.split(' ')[0] ?? user.email?.split('@')[0]}
                            </span>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" className={`nav-user-chevron ${userMenuOpen ? 'nav-user-chevron--open' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                            </svg>
                            {userMenuOpen && (
                                <div className="nav-user-menu">
                                    <div className="nav-user-menu-email">
                                        {user.user_metadata?.phone
                                            ? `+51 ${user.user_metadata.phone}`
                                            : user.email}
                                    </div>
                                    <button className="nav-user-menu-item" onClick={onChangePassword}>
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                                        </svg>
                                        Cambiar contraseña
                                    </button>
                                    <button className="nav-user-menu-logout" onClick={onLogout}>
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                        </svg>
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="nav-login-btn" onClick={onLoginClick}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            Ingresar
                        </button>
                    )}

                    {/* Carrito */}
                    <button
                        id="cart-button"
                        className={`cart-btn ${bump ? 'cart-bump' : ''}`}
                        aria-label="Ver carrito"
                        onClick={onCartClick}
                    >
                        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        Mi Pedido
                        {cartCount > 0 && (
                            <span className="cart-count" id="cart-count">{cartCount}</span>
                        )}
                    </button>

                </div>

            </div>
        </header>
    );
}
