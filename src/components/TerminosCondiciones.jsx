import { useEffect } from 'react';

export default function TerminosCondiciones({ onClose }) {
    // Bloquear scroll del body mientras está abierto
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Cerrar con Escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div className="legal-overlay" role="dialog" aria-modal="true" aria-labelledby="legal-title-tc">
            <div className="legal-modal">
                {/* Header */}
                <div className="legal-modal-header">
                    <div className="legal-modal-header-icon" aria-hidden="true">📋</div>
                    <div>
                        <h2 id="legal-title-tc" className="legal-modal-title">Términos y Condiciones</h2>
                        <p className="legal-modal-sub">M&amp;V Technology Textil S.A.C. · Última actualización: Abril 2025</p>
                    </div>
                    <button className="legal-modal-close" onClick={onClose} aria-label="Cerrar">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido — pega aquí tu texto legal */}
                <div className="legal-modal-body">
                    <p>Bienvenida/o a la tienda virtual de <strong>M&V Technology Textil S.A.C.</strong>. Al realizar una compra en nuestra web, usted acepta los siguientes términos y condiciones:</p>

                    <h3>1. Productos y Pedidos</h3>
                    <p>Nos especializamos en la confección de productos textiles, banderas institucionales, publicitarias y de escritorio. Al ser muchos de nuestros productos fabricados a medida o bajo demanda, los colores y dimensiones finales pueden tener ligeras variaciones propias del proceso textil.</p>

                    <h3>2. Tiempos de Producción y Entrega</h3>
                    <ul>
                        <li><strong>Pedidos en stock:</strong> Se procesarán y despacharán en un plazo de 1 a 3 días hábiles.</li>
                        <li><strong>Pedidos personalizados:</strong> El tiempo de producción se informará al momento de la cotización.</li>
                        <li><strong>Envíos:</strong> Realizamos entregas en Lima Metropolitana y envíos a nivel nacional. Los tiempos de tránsito dependen de la agencia de transportes seleccionada.</li>
                    </ul>

                    <h3>3. Facturación Electrónica</h3>
                    <p>Todo pedido será facturado (Boleta o Factura) según los datos proporcionados por el cliente en el proceso de compra (Checkout). Es responsabilidad del cliente ingresar correctamente su DNI o RUC. Una vez emitido el comprobante ante la SUNAT, no se podrán realizar modificaciones de datos.</p>

                    <h3>4. Cambios y Devoluciones</h3>
                    <p>De acuerdo con las normas de protección al consumidor, los cambios o devoluciones se evaluarán previa conversación y coordinación directa con el cliente. No se aceptarán devoluciones de banderas o productos textiles personalizados que hayan sido confeccionados bajo las especificaciones exactas del cliente, salvo error en la producción o confección por parte de M&V Technology Textil S.A.C.</p>
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
