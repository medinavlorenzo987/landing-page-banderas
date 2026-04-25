export default function Footer({ onOpenLegal }) {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer" role="contentinfo">
            <div className="footer-inner">

                {/* Columna: Marca */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                        <span>BanderasPerú</span>
                    </div>
                    <p className="footer-tagline">
                        M&amp;V Technology Textil S.A.C.<br />
                        RUC: 20612345678
                    </p>
                    <p className="footer-address">
                        Lima, Perú · medinavlorenzo@gmail.com
                    </p>
                </div>

                {/* Columna: Legal */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Legal</h4>
                    <ul className="footer-links">
                        <li>
                            <button
                                id="link-terminos"
                                className="footer-link footer-link-btn"
                                onClick={() => onOpenLegal('terminos')}
                            >
                                Términos y Condiciones
                            </button>
                        </li>
                        <li>
                            <button
                                id="link-privacidad"
                                className="footer-link footer-link-btn"
                                onClick={() => onOpenLegal('privacidad')}
                            >
                                Política de Privacidad
                            </button>
                        </li>
                        <li>
                            <button
                                id="link-cookies"
                                className="footer-link footer-link-btn"
                                onClick={() => onOpenLegal('cookies')}
                            >
                                Política de Cookies
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Columna: INDECOPI */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Atención al Cliente</h4>
                    <a
                        href="https://www.indecopi.gob.pe/libro-reclamaciones"
                        target="_blank"
                        rel="noopener noreferrer"
                        id="link-libro-reclamaciones"
                        className="footer-reclamos-btn"
                        aria-label="Libro de Reclamaciones - INDECOPI"
                    >
                        <span className="footer-reclamos-icon" aria-hidden="true">
                            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </span>
                        <span className="footer-reclamos-text">
                            <strong>Libro de Reclamaciones</strong>
                            <small>INDECOPI · Ley N° 29571</small>
                        </span>
                    </a>
                    <p className="footer-indecopi-note">
                        Conforme al Código de Protección y Defensa del Consumidor.
                    </p>
                </div>
            </div>

            {/* Barra inferior */}
            <div className="footer-bottom">
                <p>© {year} M&amp;V Technology Textil S.A.C. — Todos los derechos reservados.</p>
                <p className="footer-bottom-legal">
                    Ley N° 29733 · Ley N° 29571 · Perú
                </p>
            </div>
        </footer>
    );
}

