import { useEffect } from 'react';

export default function PoliticaPrivacidad({ onClose }) {
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
        <div className="legal-overlay" role="dialog" aria-modal="true" aria-labelledby="legal-title-pp">
            <div className="legal-modal">
                {/* Header */}
                <div className="legal-modal-header">
                    <div className="legal-modal-header-icon" aria-hidden="true">🔒</div>
                    <div>
                        <h2 id="legal-title-pp" className="legal-modal-title">Política de Privacidad</h2>
                        <p className="legal-modal-sub">M&amp;V Technology Textil S.A.C. · Ley N° 29733 · Última actualización: Abril 2025</p>
                    </div>
                    <button className="legal-modal-close" onClick={onClose} aria-label="Cerrar">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido — pega aquí tu texto legal */}
                <div className="legal-modal-body">
                    <p>En <strong>M&V Technology Textil S.A.C.</strong>, valoramos y respetamos la privacidad de nuestros clientes. El presente documento explica cómo recopilamos, utilizamos y protegemos su información personal, en estricto cumplimiento con la Ley N° 29733, Ley de Protección de Datos Personales del Perú, y su Reglamento.</p>

                    <h3>1. Información que recopilamos</h3>
                    <p>Para procesar sus pedidos, solicitamos datos personales como: Nombre completo o Razón Social, DNI/CE/RUC, dirección de entrega, correo electrónico y número de teléfono.</p>

                    <h3>2. Finalidad del tratamiento de datos</h3>
                    <p>Sus datos serán utilizados exclusivamente para:</p>
                    <ul>
                        <li>Procesar sus compras y coordinar la entrega de nuestros productos textiles y banderas.</li>
                        <li>Emitir los comprobantes de pago electrónicos (Boletas o Facturas) correspondientes ante la SUNAT.</li>
                        <li>Comunicarnos con usted sobre el estado de su pedido.</li>
                    </ul>

                    <h3>3. Almacenamiento y Seguridad</h3>
                    <p>Su información es almacenada en bases de datos seguras y no será compartida, vendida ni alquilada a terceros, salvo requerimiento legal o fiscal (ej. SUNAT).</p>

                    <h3>4. Derechos ARCO</h3>
                    <p>Usted tiene el derecho de Acceso, Rectificación, Cancelación y Oposición (Derechos ARCO) sobre sus datos personales. Para ejercerlos, puede enviar un correo a <strong>medinavlorenzo@gmail.com</strong> adjuntando una copia de su documento de identidad.</p>
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
