import { useState, useEffect } from 'react';

export default function CookieBanner({ onOpenLegal }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Solo mostrar si el usuario no ha aceptado aún
        const accepted = localStorage.getItem('cookies_accepted');
        if (!accepted) {
            // Pequeño delay para que la página cargue primero
            const t = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(t);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookies_accepted', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="cookie-banner" role="region" aria-label="Aviso de cookies">
            <div className="cookie-banner-inner">
                <div className="cookie-banner-icon" aria-hidden="true">🍪</div>
                <div className="cookie-banner-text">
                    <p className="cookie-banner-title">Usamos cookies</p>
                    <p className="cookie-banner-body">
                        Utilizamos cookies propias para mejorar tu experiencia y garantizar el funcionamiento del sitio,
                        conforme a la{' '}
                        <button className="cookie-link cookie-link-btn" onClick={() => onOpenLegal('cookies')}>Política de Cookies</button>{' '}
                        y la{' '}
                        <button className="cookie-link cookie-link-btn" onClick={() => onOpenLegal('privacidad')}>Política de Privacidad</button>{' '}
                        (Ley N° 29733 — Protección de Datos Personales).
                    </p>
                </div>
                <div className="cookie-banner-actions">
                    <button
                        id="cookie-accept-btn"
                        className="cookie-btn-accept"
                        onClick={handleAccept}
                        aria-label="Aceptar cookies"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}
