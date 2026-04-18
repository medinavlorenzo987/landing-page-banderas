export default function Specs() {
    return (
        <section className="specs-wrapper">
            <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
                <h2 className="section-title">¿Por qué elegir nuestras banderas?</h2>
                <div className="specs-grid">
                    <div className="spec-card">
                        <div className="spec-icon">
                            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                        </div>
                        <h4>Colores Oficiales</h4>
                        <p>Rojo y blanco estandarizados según la normativa peruana. No se destiñen ni se amarillentan con el sol o la lluvia.</p>
                    </div>

                    <div className="spec-card">
                        <div className="spec-icon">
                            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path>
                            </svg>
                        </div>
                        <h4>Costura Reforzada</h4>
                        <p>Doble costura en todos los bordes para evitar deshilachados por el viento fuerte, asegurando años de duración.</p>
                    </div>

                    <div className="spec-card">
                        <div className="spec-icon">
                            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h4>Acabado Listo</h4>
                        <p>Incluyen pasador lateral resistente (ojaletes o jareta) para instalar en el asta en menos de un minuto.</p>
                    </div>

                    <div className="guarantee-banner">
                        <div className="guarantee-icon">
                            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                            </svg>
                        </div>
                        <div className="guarantee-content">
                            <h4>Garantía de Satisfacción 100%</h4>
                            <p>Fabricantes directos. Si tu bandera presenta algún defecto de fábrica, te la cambiamos de inmediato.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
