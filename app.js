// app.js

// 1. Memoria: Guardar los productos en un array
let carrito = [];

// 2. Captura de Datos y Lógica de Agregar al Carrito
// Esta función es llamada desde el index.html en el onclick del botón "Agregar"
function addToCart(productName, qtyInputId) {
    // Leer la cantidad seleccionada
    const qtyInput = document.getElementById(qtyInputId);
    const qty = parseInt(qtyInput.value) || 1;

    // Leer el precio dinámicamente desde el HTML (navegando por el DOM hacia arriba y luego buscando .price)
    const card = qtyInput.closest('.card');
    const priceText = card.querySelector('.price').innerText;
    // Convertir el texto "S/ 25.00" a un número 25.00
    const price = parseFloat(priceText.replace(/[^\d.]/g, ''));

    // Comprobar si el producto ya existe en el array del carrito
    const productoExistente = carrito.find(item => item.name === productName);

    if (productoExistente) {
        // Si existe, simplemente le sumamos la nueva cantidad
        productoExistente.quantity += qty;
    } else {
        // Si no existe, lo guardamos como un nuevo objeto
        carrito.push({
            name: productName,
            price: price,
            quantity: qty
        });
    }

    // Actualizamos la vista
    updateCartUI();
    showToast(productName, qty);
}

// 3. Actualización de UI: Modificar el ícono de la cabecera
function updateCartUI() {
    // Sumar todas las cantidades de los productos en el carrito
    const totalItems = carrito.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = totalItems;

    // Animación visual del botón en la cabecera usando clase CSS
    const cartBtn = document.getElementById('cart-button');
    
    // Reiniciar animación en clics rápidos
    cartBtn.classList.remove('cart-bump');
    void cartBtn.offsetWidth; // Forzar reflow
    cartBtn.classList.add('cart-bump');

    // Limpiar clase después de la animación
    setTimeout(() => {
        cartBtn.classList.remove('cart-bump');
    }, 400);
}

// Lógica de Notificación Emergente (Toast)
let toastTimeout;
function showToast(productName, qty) {
    const toast = document.getElementById('toastAlert');
    const toastProduct = document.getElementById('toast-product-name');

    toastProduct.innerText = `${qty}x ${productName}`;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// 4. Checkout por WhatsApp: Enviar pedido
document.addEventListener('DOMContentLoaded', () => {
    // Escuchamos el clic en el botón del carrito de la cabecera
    const cartButton = document.getElementById('cart-button');

    cartButton.addEventListener('click', () => {
        // Validamos si el carrito está vacío
        if (carrito.length === 0) {
            alert("Tu carrito está vacío. ¡Agrega algunas banderas para celebrar las Fiestas Patrias!");
            return;
        }

        // TU NÚMERO DE WHATSAPP (Código de país + número, sin signos +)
        const numeroWhatsApp = "51944143492";

        let mensaje = "Hola, deseo hacer el siguiente pedido:\n\n";
        let totalPedido = 0;

        // Recorremos el carrito para estructurar el mensaje
        carrito.forEach(item => {
            const subtotal = item.price * item.quantity;
            totalPedido += subtotal;
            mensaje += `- ${item.quantity}x ${item.name} (S/ ${subtotal.toFixed(2)})\n`;
        });

        mensaje += `\n*Total: S/ ${totalPedido.toFixed(2)}*`;

        // Generamos la URL y abrimos WhatsApp Web o App
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, '_blank');
    });
});

// --- Lógica del Selector de Cantidad UI ---
function changeQty(inputId, delta) {
    const input = document.getElementById(inputId);
    let currentValue = parseInt(input.value) || 1;
    let minValue = parseInt(input.min) || 1;
    
    let newValue = currentValue + delta;
    if (newValue >= minValue) {
        input.value = newValue;
    }
}
