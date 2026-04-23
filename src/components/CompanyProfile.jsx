import React from 'react';

export default function CompanyProfile() {
    return (
        <div className="company-profile">
            {/* Sección 1: Encabezado (Hero) */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1>M&V TECHNOLOGY TEXTIL S.A.C.</h1>
                    <p className="subtitle">Tradición familiar, innovación textil y calidad que genera confianza.</p>
                </div>
            </header>

            {/* Sección 2: Misión y Visión con Foto de la Fábrica */}
            <section className="mission-vision-section">
                <div className="text-content">
                    <div className="card-info">
                        <h2>🎯 Nuestra Misión</h2>
                        <p>
                            Brindar soluciones textiles integrales y de la más alta calidad, uniendo nuestra
                            profunda tradición familiar en la confección con la eficiencia tecnológica moderna.
                            Nos comprometemos a potenciar la imagen de nuestros clientes a través de prendas
                            duraderas, entregas puntuales y un servicio basado en la confianza.
                        </p>
                    </div>
                    <div className="card-info">
                        <h2>👁️ Nuestra Visión</h2>
                        <p>
                            Consolidarnos como la empresa textil líder y de mayor confianza a nivel nacional.
                            Buscamos ser reconocidos por nuestra impecable capacidad de producción a gran escala,
                            la innovación en nuestros procesos y por mantener siempre vivo el legado familiar.
                        </p>
                    </div>
                </div>

                {/* Espacio para la foto de la fábrica */}
                <div className="image-placeholder factory-img">
                    <span>[FOTO 1: Vista de la fábrica, máquinas y producción]</span>
                </div>
            </section>

            {/* Sección 3: La Historia con Foto de los Hermanos */}
            <section className="history-section">
                {/* Espacio para la foto de los fundadores */}
                <div className="image-placeholder founders-img">
                    <span>[FOTO 2: Los 4 hermanos Medina Vega en la fábrica]</span>
                </div>

                <div className="text-content">
                    <h2>📖 Un Legado Tejido en Familia</h2>
                    <p>
                        Todo comenzó en la cálida ciudad de Ica, bajo la mirada atenta y las manos hábiles de nuestra abuela,
                        <strong> María Luisa Chumpitaz</strong>. Con el rítmico sonido de su clásica máquina de coser, ella
                        no solo entrelazaba hilos, sino que tejía el inicio de nuestra gran pasión familiar por la confección.
                    </p>
                    <p>
                        Ese amor por el detalle y el trabajo bien hecho fue transmitido a nuestro padre, quien tomó la posta
                        y llevó el oficio al siguiente nivel. Con visión y esfuerzo, él incursionó con éxito en el exigente
                        mundo de la confección, destacando en grandes campañas de banderas patrias y uniformes, ganándose la
                        confianza de innumerables clientes.
                    </p>
                    <p>
                        Inspirados por esta invaluable herencia, la tercera generación —sus cuatro hijos: Lorenzo Luis,
                        Luis Alejandro, Betty Alondra y Selene Stefany Medina Vega— decidimos unir fuerzas. Fundamos
                        <strong> M&V TECHNOLOGY TEXTIL S.A.C.</strong> para llevar el negocio a una escala industrial.
                        Hoy, desde nuestra sede en Ate, Lima, combinamos la tradición artesanal con la innovación tecnológica.
                    </p>
                    <div className="ruc-badge">
                        RUC: 20615687872 | Ate, Lima - Perú
                    </div>
                </div>
            </section>
        </div>
    );
}