import { useState } from 'react';
import Navbar from './components/Navbar';
import WatermarkVideo from './components/WatermarkVideo';
import Hero from './components/Hero';
import HistoryLaw from './components/HistoryLaw';
import ProductCatalog from './components/ProductCatalog';
import Specs from './components/Specs';
import Toast from './components/Toast';
import CartModal from './components/CartModal';
import CompanyProfile from './components/CompanyProfile'; // <-- Importamos tu nueva página

function App() {
  const [cart, setCart] = useState([]);
  const [toastData, setToastData] = useState({ visible: false, product: '', qty: 0 });
  const [modalOpen, setModalOpen] = useState(false);

  // <-- Nuevo estado para saber qué "pestaña" estamos viendo
  const [activeTab, setActiveTab] = useState('empresa');

  const addToCart = (productName, price, qty) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.name === productName);
      if (existing) {
        return prevCart.map(item =>
          item.name === productName ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prevCart, { name: productName, price, quantity: qty }];
    });

    setToastData({ visible: true, product: productName, qty });
    setTimeout(() => setToastData(prev => ({ ...prev, visible: false })), 3500);
  };

  const handleConfirm = ({ name, dni, address }) => {
    const numeroWhatsApp = "51944143492";
    let mensaje = `Hola, deseo hacer el siguiente pedido:\n\n`;
    let totalPedido = 0;

    cart.forEach(item => {
      const subtotal = item.price * item.quantity;
      totalPedido += subtotal;
      mensaje += `- ${item.quantity} docena(s) de ${item.name} (S/ ${subtotal.toFixed(2)})\n`;
    });

    mensaje += `\n*Total: S/ ${totalPedido.toFixed(2)}*`;
    mensaje += `\n\n*Datos del cliente:*`;
    mensaje += `\nNombre: ${name}`;
    mensaje += `\nDNI: ${dni}`;
    mensaje += `\nDirección: ${address}`;

    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
    setModalOpen(false);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <WatermarkVideo />
      {/* El Navbar y el carrito siempre se quedan arriba */}
      <Navbar cartCount={cartCount} onCartClick={() => setModalOpen(true)} />

      {/* --- MENÚ DE NAVEGACIÓN SECUNDARIO --- */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '20px', background: '#FAFAFA', borderBottom: '2px solid #EAEAEA' }}>
        <button
          onClick={() => setActiveTab('empresa')}
          style={{
            padding: '10px 24px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', border: 'none', transition: '0.3s',
            backgroundColor: activeTab === 'empresa' ? '#8B1515' : '#E0E0E0',
            color: activeTab === 'empresa' ? 'white' : '#555'
          }}
        >
          Nuestra Empresa
        </button>
        <button
          onClick={() => setActiveTab('banderas')}
          style={{
            padding: '10px 24px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', border: 'none', transition: '0.3s',
            backgroundColor: activeTab === 'banderas' ? '#8B1515' : '#E0E0E0',
            color: activeTab === 'banderas' ? 'white' : '#555'
          }}
        >
          Campaña Banderas
        </button>
      </div>

      {/* --- LÓGICA DE PESTAÑAS --- */}
      {activeTab === 'empresa' ? (
        // Si la pestaña es 'empresa', mostramos la historia de la familia
        <CompanyProfile />
      ) : (
        // Si la pestaña es 'banderas', mostramos todo tu catálogo original
        <>
          <Hero />
          <HistoryLaw />
          <ProductCatalog onAddToCart={addToCart} />
          <Specs />
        </>
      )}

      {/* Pop-ups globales (Toast y Modal) */}
      <Toast data={toastData} />
      {modalOpen && (
        <CartModal
          cart={cart}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}

export default App;