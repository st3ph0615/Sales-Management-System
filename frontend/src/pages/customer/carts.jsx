import React, { useState, useEffect } from "react";
import CustomerSidebar from "./CustomerSidebar";
import "./carts.css";

export default function MyCart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(c);
  }, []);

  const updateQuantity = (index, qty) => {
    const newCart = [...cart];
    newCart[index].quantity = Math.max(1, qty);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // ⭐ NEW: Delete an item
  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const checkout = () => {
    window.location.href = "/customer/checkout";
  };

  if (cart.length === 0)
    return (
      <div className="cd-layout">
        <CustomerSidebar />
        <main className="cd-main">
          <h2>Your cart is empty.</h2>
        </main>
      </div>
    );

  return (
    <div className="cd-layout">
      <CustomerSidebar />

      <main className="cd-main">
        <h2>My Cart</h2>

        <table className="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
              <th></th> {/* delete column */}
            </tr>
          </thead>

          <tbody>
            {cart.map((item, i) => (
              <tr key={i}>
                <td>{item.product_name}</td>

                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(i, Number(e.target.value))}
                  />
                </td>

                <td>₱{Number(item.price).toFixed(2)}</td>

                <td>₱{(item.price * item.quantity).toFixed(2)}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => removeItem(i)}
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="btn primary" onClick={checkout}>
          Proceed to Checkout
        </button>
      </main>
    </div>
  );
}
