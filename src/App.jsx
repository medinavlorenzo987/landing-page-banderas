import { useState } from 'react';
import Navbar from './components/Navbar';
import WatermarkVideo from './components/WatermarkVideo';
import Hero from './components/Hero';
import HistoryLaw from './components/HistoryLaw';
import ProductCatalog from './components/ProductCatalog';
import Specs from './components/Specs';
import Toast from './components/Toast';
import CartModal from './components/CartModal';
import CompanyProfile from './components/CompanyProfile';

function App() {
  const [cart, setCart] = useState([]);
  const [toastData, setToastData] = useState({ visible: false, product: '', qty: 0 });
  const [modalOpen, setModalOpen] = useState(false);
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
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setModalOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* ── CONTENIDO SEGÚN PESTAÑA ACTIVA ── */}
      <main role="tabpanel">
        {activeTab === 'empresa' && (
          <CompanyProfile />
        )}
        {activeTab === 'banderas' && (
          <>
            <Hero />
            <HistoryLaw />
            <ProductCatalog onAddToCart={addToCart} />
            <Specs />
          </>
        )}
      </main>

      {/* ── GLOBALES (fuera de pestañas) ── */}
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
