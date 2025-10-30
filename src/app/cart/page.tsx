"use client";
import { useCart } from "@src/context/CartContext";
import Image from "next/image";
import styles from "./style.module.scss";

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, totalPrice } =
    useCart();

  if (!cart.length)
    return (
      <div className={styles.cartPage}>
        <h1>Your cart is empty 🛒</h1>
        <p>Add some products to see them here.</p>
      </div>
    );

  return (
    <div className={styles.cartPage}>
      <span className={styles.title}>Shopping Cart</span>

      <div className={styles.cartList}>
        {cart.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.info}>
              <Image
                src={item.thumbnail}
                alt={item.title}
                width={80}
                height={80}
              />
              <div className={styles.details}>
                <h3>{item.title}</h3>
                <p>₹{item.price}</p>
                <div className={styles.quantityControl}>
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
              </div>
            </div>

            

            <div className={styles.actions}>
              <button
                onClick={() => removeFromCart(item.id)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cartSummary}>
        Total: ₹{Math.round(totalPrice)}
      </div>
    </div>
  );
}
