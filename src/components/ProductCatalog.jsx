import ProductCard from './ProductCard';

export default function ProductCatalog({ onAddToCart }) {
    const products = [
        {
            id: 'qty-poliseda',
            name: 'Bandera Poliseda',
            title: 'Bandera de Exteriores (Poliseda)',
            description: 'Material ultra ligero y resistente al viento. Ideal para techos y fachadas. Secado súper rápido. Medida oficial: 1.50m x 1.00m.',
            price: 25.00,
            badge: 'Más Vendido',
            badgeClass: 'popular'
        },
        {
            id: 'qty-raso',
            name: 'Bandera Raso',
            title: 'Bandera Institucional (Raso)',
            description: 'Tela gruesa con acabado satinado brillante. Sumamente elegante. Perfecta para interiores, oficinas y desfiles. Medida oficial: 1.50m x 1.00m.',
            price: 45.00,
            badge: 'Premium',
            badgeClass: ''
        },
        {
            id: 'qty-banderines',
            name: 'Banderines de Escritorio',
            title: 'BANDERINES DE ESCRITORIO',
            description: 'Ideales para oficinas, mesas de recepción y decoración de eventos corporativos. Material resistente con base firme.',
            price: 35.00,
            badge: 'Novedad',
            badgeClass: 'dark'
        },
        {
            id: 'qty-gota',
            name: 'Bandera Tipo Gota',
            title: 'BANDERA TIPO GOTA',
            description: 'Perfectas para publicidad exterior e interior. Alto impacto visual, fáciles de armar y resistentes a la intemperie.',
            price: 90.00,
            badge: 'Destacado',
            badgeClass: 'dark'
        }
    ];

    return (
        <main className="container" id="catalogo">
            <h2 className="section-title">Elige tu Bandera Ideal</h2>
            <div className="grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                ))}
            </div>
        </main>
    );
}
