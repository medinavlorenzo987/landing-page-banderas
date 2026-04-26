export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">
                <span className="hero-eyebrow">Campaña Fiestas Patrias 2025</span>
                <h1>El Orgullo de <span>ser Peruano</span></h1>
                <p>Banderas premium de la más alta calidad, medidas oficiales normadas y listas para lucir con orgullo en todo el Perú.</p>
                <a href="#catalogo" className="btn-primary">
                    Ver Catálogo
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                    </svg>
                </a>
                <div className="hero-trust">
                    <div className="hero-trust-item">
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Medidas oficiales normadas
                    </div>
                    <span className="hero-trust-sep">·</span>
                    <div className="hero-trust-item">
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        100% fabricación peruana
                    </div>
                    <span className="hero-trust-sep">·</span>
                    <div className="hero-trust-item">
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Despacho a todo Lima
                    </div>
                </div>
            </div>
        </section>
    );
}
