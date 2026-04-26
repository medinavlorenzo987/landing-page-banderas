import { useEffect } from 'react';

export default function PoliticaCookies({ onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div className="legal-overlay" role="dialog" aria-modal="true" aria-labelledby="legal-title-ck">
            <div className="legal-modal">
                {/* Header */}
                <div className="legal-modal-header">
                    <div className="legal-modal-header-icon" aria-hidden="true">🍪</div>
                    <div>
                        <h2 id="legal-title-ck" className="legal-modal-title">Política de Cookies</h2>
                        <p className="legal-modal-sub">M&amp;V Technology Textil S.A.C. · Última actualización: Abril 2025</p>
                    </div>
                    <button className="legal-modal-close" onClick={onClose} aria-label="Cerrar">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido */}
                <div className="legal-modal-body">
                    <p>La plataforma web de <strong>M&V Technology Textil S.A.C.</strong> utiliza "cookies" para mejorar la experiencia de navegación de nuestros usuarios.</p>

                    <h3>¿Qué son las cookies?</h3>
                    <p>Son pequeños archivos de texto que se almacenan en su navegador cuando visita nuestra página.</p>

                    <h3>¿Qué tipo de cookies usamos?</h3>
                    <ul>
                        <li><strong>Cookies Técnicas/Estrictamente necesarias:</strong> Permiten que la página funcione correctamente (ej. recordar los productos de su carrito de compras o mantener su sesión activa).</li>
                        <li><strong>Cookies de Preferencias:</strong> Nos ayudan a recordar si usted ya aceptó nuestro aviso de cookies para no volver a mostrárselo.</li>
                    </ul>

                    <p>Usted puede configurar su navegador para bloquear o alertar sobre estas cookies, pero algunas partes del sitio web podrían no funcionar de manera óptima. Al hacer clic en "Aceptar" en nuestro banner o continuar navegando, usted consiente el uso de estas cookies.</p>
                </div>

                {/* Footer del modal */}
                <div className="legal-modal-footer">
                    <button className="legal-modal-btn" onClick={onClose}>
                        Entendido, cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
