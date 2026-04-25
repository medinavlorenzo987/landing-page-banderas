import { useState } from 'react';

export default function HistoryLaw() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="history-law">
            <div className="history-law-container section-focus-frame">
                <button
                    type="button"
                    className="history-law-accordion-header cursor-pointer"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-expanded={isOpen}
                    aria-controls="history-law-accordion-panel"
                >
                    <div className="history-law-accordion-title-wrap">
                        <div className="history-law-icon">
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21v-8m0 0V3m0 10h9.5M4 11h8m-8 0a2 2 0 100-4 2 2 0 000 4zm16 0a2 2 0 100-4 2 2 0 000 4z"></path>
                            </svg>
                        </div>
                        <h2>Más que un Símbolo, un Deber</h2>
                    </div>

                    <svg
                        className={`history-law-chevron transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        width="22"
                        height="22"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <div
                    id="history-law-accordion-panel"
                    className={`history-law-accordion-content transition-all duration-500 ease-in-out ${isOpen ? 'history-law-accordion-content--open' : ''}`}
                >
                    <div className="history-law-accordion-inner">
                        <p>La bandera blanquirroja es el emblema máximo de nuestra historia y libertad. Durante las Fiestas Patrias, vestir nuestras casas y negocios de rojo y blanco no solo es una demostración de amor por el Perú, sino también un acto solemne respaldado por la ley.</p>

                        <div className="alert-box">
                            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span><strong>Recordatorio Legal:</strong> El izamiento de la Bandera Nacional es obligatorio en todos los inmuebles (viviendas, locales comerciales e instituciones) durante las Fiestas Patrias. El incumplimiento de esta norma municipal está sujeto a <strong>multas de hasta el 10% de una UIT</strong>. ¡No te arriesgues y luce tu bandera con orgullo!</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
