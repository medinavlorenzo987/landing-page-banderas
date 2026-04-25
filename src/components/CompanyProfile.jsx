import React from 'react';

export default function CompanyProfile() {
    return (
        <div className="cp-wrapper">

            {/* ── HERO CORPORATIVO ── */}
            <section className="cp-hero">
                <div className="cp-hero-content">
                    <span className="cp-eyebrow">Empresa Peruana · Tercera Generación</span>
                    <h1 className="cp-title">M&amp;V TECHNOLOGY<br />TEXTIL S.A.C.</h1>
                    <p className="cp-subtitle">
                        Tradición familiar, innovación textil y calidad que genera confianza.
                    </p>
                    <div className="cp-ruc-pill">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        RUC: 20615687872 &nbsp;|&nbsp; Ate, Lima - Perú
                    </div>
                </div>
                {/* Foto principal */}
                <div className="cp-hero-photo">
                    <img src="taller.png" alt="M&V Technology Textil - Instalaciones del taller" loading="lazy" />
                </div>
            </section>

            {/* ── MISIÓN & VISIÓN ── */}
            <section className="cp-mv-section">
                <div className="cp-container">
                    <h2 className="cp-section-title">Nuestra Esencia</h2>
                    <div className="cp-mv-grid">

                        <article className="cp-mv-card">
                            <div className="cp-mv-icon" aria-hidden="true">🎯</div>
                            <h3>Nuestra Misión</h3>
                            <p>
                                "Brindar soluciones textiles integrales y de la más alta calidad, uniendo nuestra
                                profunda tradición familiar en la confección con la eficiencia tecnológica moderna.
                                Nos comprometemos a potenciar la imagen de nuestros clientes a través de prendas
                                duraderas, entregas puntuales y un servicio basado en la confianza."
                            </p>
                        </article>

                        <article className="cp-mv-card cp-mv-card--accent">
                            <div className="cp-mv-icon" aria-hidden="true">👁️</div>
                            <h3>Nuestra Visión</h3>
                            <p>
                                "Consolidarnos como la empresa textil líder y de mayor confianza a nivel nacional.
                                Buscamos ser reconocidos por nuestra impecable capacidad de producción a gran escala,
                                la innovación en nuestros procesos y por mantener siempre vivo el legado familiar."
                            </p>
                        </article>

                    </div>

                    {/* Placeholder foto fábrica */}
                    <img src="/acto.png" alt="Planta de producción M&V Textil" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', marginTop: '20px' }} />
                </div>
            </section>

            {/* ── HISTORIA ── */}
            <section className="cp-history-section">
                <div className="cp-container cp-history-layout">

                    {/* Placeholder foto fundadores */}
                    <img 
                        src="/logo.png" 
                        alt="Logo M&V Textil" 
                        style={{ 
                            width: '100%', 
                            maxWidth: '400px', 
                            backgroundColor: '#ffffff', 
                            borderRadius: '16px', 
                            padding: '20px', 
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)', 
                            objectFit: 'contain' 
                        }} 
                    />

                    <div className="cp-history-text">
                        <span className="cp-eyebrow cp-eyebrow--dark">Tres Generaciones de Pasión</span>
                        <h2 className="cp-section-title cp-section-title--left">📖 Un Legado Tejido en Familia</h2>
                        <div className="cp-history-body">
                            <p>
                                Todo comenzó en la cálida ciudad de Ica, bajo la mirada atenta y las manos hábiles de nuestra abuela. Con el rítmico sonido de su clásica máquina de coser, ella tejía el inicio de nuestra gran pasión familiar por la confección.
                            </p>
                            <p>
                                Ese amor por el detalle y el trabajo bien hecho fue transmitido a nuestro padre, quien tomó la posta y llevó el oficio al siguiente nivel. Con visión y esfuerzo, él incursionó con éxito en el exigente mundo de la confección, destacando en grandes campañas de banderas patrias y uniformes.
                            </p>
                            <p>
                                Inspirados por esta invaluable herencia, la tercera generación —cuatro hermanos criados entre hilos y telas— decidimos unir fuerzas para llevar el negocio familiar a una escala industrial. Fundamos M&amp;V TECHNOLOGY TEXTIL S.A.C. y hoy, desde nuestra sede en Ate, Lima, combinamos la tradición artesanal con la innovación tecnológica.
                            </p>
                        </div>

                        <div className="cp-ruc-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                            RUC: 20615687872 &nbsp;·&nbsp; Ate, Lima - Perú
                        </div>
                    </div>
                </div>
            </section>

            {/* ── VALORES / PILARES ── */}
            <section className="cp-pillars-section">
                <div className="cp-container">
                    <h2 className="cp-section-title">Nuestros Pilares</h2>
                    <div className="cp-pillars-grid">
                        {[
                            { icon: '🏭', title: 'Producción a Escala', desc: 'Capacidad industrial para atender grandes volúmenes con la misma calidad artesanal.' },
                            { icon: '👨‍👩‍👧‍👦', title: 'Tradición Familiar', desc: 'Tres generaciones de conocimiento textil que garantizan un trabajo hecho con amor.' },
                            { icon: '⚙️', title: 'Innovación Tecnológica', desc: 'Maquinaria moderna y procesos eficientes para resultados impecables.' },
                            { icon: '🤝', title: 'Confianza y Puntualidad', desc: 'Cumplimos lo prometido. Tu pedido, en la fecha acordada, sin excusas.' },
                        ].map(({ icon, title, desc }) => (
                            <article key={title} className="cp-pillar-card">
                                <span className="cp-pillar-icon">{icon}</span>
                                <h4>{title}</h4>
                                <p>{desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}