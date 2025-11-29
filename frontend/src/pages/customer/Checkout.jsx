import React, { useEffect, useState } from "react";
import CustomerSidebar from "./CustomerSidebar";
import "./Checkout.css";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart")) || [];
    const u = JSON.parse(localStorage.getItem("user")) || null;

    setCart(c);
    setUser(u);

    if (u?.address) setAddress(u.address);
  }, []);

  if (!user) {
    return (
      <div className="cd-layout">
        <CustomerSidebar />
        <main className="cd-main">
          <h2>Please log in to checkout.</h2>
        </main>
      </div>
    );
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    const token = localStorage.getItem("token");

    if (!address || address.trim() === "") {
      alert("Please enter a shipping address.");
      return;
    }

    setProcessing(true);

    const payload = {
      customer_id: user.customer_id,
      shipping_address: address,
      billing_address: address,
      total_amount: totalAmount,
      notes: null,
      items: cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      payment: {
        payment_method: paymentMethod,
        amount_paid: totalAmount,
        transaction_id: null,
        payment_status: "Paid",
      },
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      // Clear cart
      localStorage.removeItem("cart");

      // Redirect
      window.location.href = "/customer/orders";
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Failed to place order.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="cd-layout">
      <CustomerSidebar />
      <main className="cd-main checkout-container">
        <h2>Checkout</h2>

        {/* Cart Summary */}
        <div className="checkout-card">
          <h3>Order Summary</h3>

          <table className="checkout-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, i) => (
                <tr key={i}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="total-row">
            <h3>Total: ₱{totalAmount.toFixed(2)}</h3>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="checkout-card">
          <h3>Shipping Address</h3>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
          />
        </div>

        {/* Payment */}
        <div className="checkout-card">
          <h3>Payment Method</h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option>Cash on Delivery</option>
            <option>GCash</option>
            <option>PayMaya</option>
            <option>Bank Transfer</option>
            <option>Debit/Credit Card</option>
          </select>
        </div>

        <button
          className="btn primary"
          onClick={placeOrder}
          disabled={processing}
        >
          {processing ? "Placing Order..." : "Place Order"}
        </button>
      </main>
    </div>
  );
}
