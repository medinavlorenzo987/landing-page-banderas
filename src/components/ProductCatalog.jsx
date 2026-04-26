import ProductCard from './ProductCard';

const FlagWave = () => (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
        <path d="M4 4h16v10H4z"/><path d="M4 14s2-2 4 0 4 2 4 0 4-2 4 0"/><line x1="4" y1="4" x2="4" y2="20"/>
    </svg>
);

const FlagPole = () => (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
        <line x1="5" y1="3" x2="5" y2="21"/><path d="M5 5h12l-2 4 2 4H5"/>
    </svg>
);

const Pennant = () => (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
        <line x1="4" y1="3" x2="4" y2="21"/><path d="M4 5l16 5-16 5"/>
    </svg>
);

const DropFlag = () => (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
        <path d="M12 2C8 2 5 6 5 10c0 5 7 12 7 12s7-7 7-12c0-4-3-8-7-8z"/><circle cx="12" cy="10" r="2.5"/>
    </svg>
);

const products = [
    {
        id: 'qty-poliseda',
        name: 'Bandera Poliseda',
        title: 'Bandera de Exteriores (Poliseda)',
        category: 'Exterior',
        description: 'Material ultra ligero y resistente al viento. Ideal para techos y fachadas. Secado súper rápido. Medida oficial: 1.50m × 1.00m.',
        price: 25.00,
        badge: 'Más Vendido',
        badgeVariant: 'popular',
        gradient: 'linear-gradient(145deg, #7f1010 0%, #C62828 100%)',
        Icon: FlagWave,
    },
    {
        id: 'qty-raso',
        name: 'Bandera Raso',
        title: 'Bandera Institucional (Raso)',
        category: 'Institucional',
        description: 'Tela gruesa con acabado satinado brillante. Perfecta para interiores, oficinas y desfiles. Medida oficial: 1.50m × 1.00m.',
        price: 45.00,
        badge: 'Premium',
        badgeVariant: 'dark',
        gradient: 'linear-gradient(145deg, #111827 0%, #8B1515 100%)',
        Icon: FlagPole,
    },
    {
        id: 'qty-banderines',
        name: 'Banderines de Escritorio',
        title: 'Banderines de Escritorio',
        category: 'Decoración',
        description: 'Ideales para oficinas, mesas de recepción y eventos corporativos. Material resistente con base firme incluida.',
        price: 35.00,
        badge: 'Novedad',
        badgeVariant: 'accent',
        gradient: 'linear-gradient(145deg, #6b0f0f 0%, #D32F2F 100%)',
        Icon: Pennant,
    },
    {
        id: 'qty-gota',
        name: 'Bandera Tipo Gota',
        title: 'Bandera Tipo Gota',
        category: 'Publicidad',
        description: 'Perfectas para publicidad exterior e interior. Alto impacto visual, fáciles de armar y resistentes a la intemperie.',
        price: 90.00,
        badge: 'Destacado',
        badgeVariant: 'dark',
        gradient: 'linear-gradient(145deg, #3d0000 0%, #B71C1C 100%)',
        Icon: DropFlag,
    },
];

export default function ProductCatalog({ onAddToCart }) {
    return (
        <section className="catalog-section" id="catalogo">
            <div className="catalog-container">
                <div className="catalog-header">
                    <span className="catalog-eyebrow">Temporada 2025</span>
                    <h2 className="catalog-title">
                        Elige tu Bandera
                        <img src="https://flagcdn.com/w40/pe.png" alt="Bandera de Perú" className="catalog-flag-img" />
                    </h2>
                    <p className="catalog-subtitle">Precios por docena · Mínimo 1 docena · Despacho a todo Lima</p>
                </div>
                <div className="products-grid">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                    ))}
                </div>
            </div>
        </section>
    );
}
