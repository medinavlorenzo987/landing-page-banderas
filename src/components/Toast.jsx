export default function Toast({ data }) {
    return (
        <div className={`toast ${data.visible ? 'show' : ''}`} id="toastAlert" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <div className="toast-content">
                <p>¡Producto agregado!</p>
                <span>{data.qty ? `${data.qty} docena(s) de ${data.product}` : 'Bandera seleccionada'}</span>
            </div>
        </div>
    );
}
