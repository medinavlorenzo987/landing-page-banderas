import React from 'react';

const IconTarget = () => (
    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
);

const IconEye = () => (
    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);

const IconFactory = () => (
    <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20M4 20V10l6-4v4l6-4v4l4-2v12"/><path d="M9 20v-4h6v4"/>
    </svg>
);

const IconHeart = () => (
    <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
);

const IconGear = () => (
    <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
);

const IconShield = () => (
    <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
);

const IconPin = () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
);

const IconBriefcase = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
);

const PILLARS = [
    { Icon: IconFactory, title: 'Producción a Escala',     desc: 'Capacidad industrial para atender grandes volúmenes con la misma calidad artesanal.' },
    { Icon: IconHeart,   title: 'Tradición Familiar',      desc: 'Tres generaciones de conocimiento textil garantizan un trabajo hecho con pasión.' },
    { Icon: IconGear,    title: 'Innovación Tecnológica',  desc: 'Maquinaria moderna y procesos eficientes para resultados impecables.' },
    { Icon: IconShield,  title: 'Confianza y Puntualidad', desc: 'Cumplimos lo prometido. Tu pedido, en la fecha acordada, sin excusas.' },
];

export default function CompanyProfile() {
    return (
        <div className="cp-wrapper">

            {/* ── HERO ── */}
            <section className="cp-hero">
                <div className="cp-hero-content">
                    <span className="cp-eyebrow">Empresa Peruana · Tercera Generación</span>
                    <h1 className="cp-title">M&amp;V Technology<br />Textil S.A.C.</h1>
                    <p className="cp-subtitle">
                        Tradición familiar, innovación textil y calidad que genera confianza.
                    </p>

                    <div className="cp-hero-stats">
                        <div className="cp-stat">
                            <span className="cp-stat-num">3</span>
                            <span className="cp-stat-label">Generaciones</span>
                        </div>
                        <div className="cp-stat-divider" />
                        <div className="cp-stat">
                            <span className="cp-stat-num">+20</span>
                            <span className="cp-stat-label">Años de experiencia</span>
                        </div>
                        <div className="cp-stat-divider" />
                        <div className="cp-stat">
                            <span className="cp-stat-num">100%</span>
                            <span className="cp-stat-label">Peruano</span>
                        </div>
                    </div>

                    <div className="cp-ruc-pill">
                        <IconPin />
                        RUC: 20615687872 &nbsp;·&nbsp; Ate, Lima – Perú
                    </div>
                </div>

                <div className="cp-hero-photo">
                    <img src="taller.png" alt="Instalaciones M&V Technology Textil" loading="lazy" />
                    <div className="cp-hero-photo-badge">
                        <IconFactory />
                        <span>Nuestra planta en Ate</span>
                    </div>
                </div>
            </section>

            {/* ── MISIÓN & VISIÓN ── */}
            <section className="cp-mv-section">
                <div className="cp-container">
                    <span className="cp-section-eyebrow">Lo que nos mueve</span>
                    <h2 className="cp-section-title">Nuestra Esencia</h2>
                    <div className="cp-mv-grid">

                        <article className="cp-mv-card">
                            <div className="cp-mv-icon-wrap">
                                <IconTarget />
                            </div>
                            <h3>Misión</h3>
                            <p>
                                Brindar soluciones textiles integrales y de alta calidad, uniendo la tradición
                                familiar con la eficiencia tecnológica. Potenciamos la imagen de nuestros clientes
                                con prendas duraderas, entregas puntuales y un servicio basado en la confianza.
                            </p>
                        </article>

                        <article className="cp-mv-card cp-mv-card--vision">
                            <div className="cp-mv-icon-wrap">
                                <IconEye />
                            </div>
                            <h3>Visión</h3>
                            <p>
                                Consolidarnos como la empresa textil líder y de mayor confianza a nivel nacional,
                                reconocidos por nuestra capacidad de producción a gran escala, la innovación en
                                nuestros procesos y el legado familiar que nos define.
                            </p>
                        </article>

                    </div>

                    <div className="cp-factory-img-wrap">
                        <img src="/acto.png" alt="Planta de producción M&V Textil" className="cp-factory-img" />
                        <div className="cp-factory-overlay" />
                    </div>
                </div>
            </section>

            {/* ── HISTORIA ── */}
            <section className="cp-history-section">
                <div className="cp-container cp-history-layout">

                    <div className="cp-history-logo-col">
                        <img src="/logo.png" alt="Logo M&V Technology Textil" className="cp-history-logo" />
                    </div>

                    <div className="cp-history-text">
                        <span className="cp-eyebrow cp-eyebrow--light">Tres Generaciones de Pasión</span>
                        <h2 className="cp-section-title cp-section-title--left">Un Legado Tejido en Familia</h2>
                        <div className="cp-timeline">
                            <div className="cp-timeline-item">
                                <div className="cp-timeline-dot" />
                                <p>Todo comenzó en Ica, bajo las manos hábiles de nuestra abuela. Con su máquina de coser tejió el inicio de nuestra pasión familiar por la confección.</p>
                            </div>
                            <div className="cp-timeline-item">
                                <div className="cp-timeline-dot" />
                                <p>Nuestro padre tomó la posta y llevó el oficio al siguiente nivel, destacando en grandes campañas de banderas patrias y uniformes escolares.</p>
                            </div>
                            <div className="cp-timeline-item">
                                <div className="cp-timeline-dot" />
                                <p>Cuatro hermanos de la tercera generación unieron fuerzas para llevar el negocio a escala industrial. Hoy, desde Ate, Lima, combinamos tradición con tecnología.</p>
                            </div>
                        </div>
                        <div className="cp-ruc-badge">
                            <IconBriefcase />
                            RUC: 20615687872 &nbsp;·&nbsp; Ate, Lima - Perú
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PILARES ── */}
            <section className="cp-pillars-section">
                <div className="cp-container">
                    <span className="cp-section-eyebrow">Por qué elegirnos</span>
                    <h2 className="cp-section-title">Nuestros Pilares</h2>
                    <div className="cp-pillars-grid">
                        {PILLARS.map(({ Icon, title, desc }) => (
                            <article key={title} className="cp-pillar-card">
                                <div className="cp-pillar-icon-wrap">
                                    <Icon />
                                </div>
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
