export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>El Orgullo de <span>ser Peruano</span></h1>
                <p>Celebra estas Fiestas Patrias con banderas premium de la más alta calidad, medidas oficiales normadas y listas para lucir con orgullo en todo el Perú.</p>
                <a href="#catalogo" className="btn-primary">
                    Ver Catálogo
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginLeft: '8px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </a>
            </div>
        </section>
    );
}
