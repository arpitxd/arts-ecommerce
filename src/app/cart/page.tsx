"use client";
import { useCart } from "@src/context/CartContext";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, totalPrice } = useCart();

  if (!cart.length) return <p>Your cart is empty.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-4">
              <Image src={item.thumbnail} alt={item.title} width={80} height={80} className="rounded" />
              <div>
                <h3>{item.title}</h3>
                <p>₹{item.price} × {item.quantity}</p>
              </div>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right font-bold text-lg">Total: ₹{totalPrice}</div>
    </div>
  );
}
