import "./globals.scss";
import Header from "@src/components/Header";
import { CartProvider } from "@src/context/CartContext";

export const metadata = {
  title: "Arts Store",
  description: "Simple E-commerce app using DummyJSON",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
