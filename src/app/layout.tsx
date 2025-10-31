import "./globals.scss";
import Header from "@src/components/Header";
import { CartProvider } from "@src/context/CartContext";
import { SearchProvider } from "@src/context/SearchContext";

export const metadata = {
  title: "Arts Store",
  description: "Simple E-commerce app using DummyJSON",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#fafafa] text-gray-800">
        <CartProvider>
          <SearchProvider>
            <Header />
            <main className="max-w-7xl mx-auto p-4 bg-white rounded-2xl shadow-sm mt-6 border border-gray-100">
              {children}
            </main>
          </SearchProvider>
        </CartProvider>
      </body>
    </html>
  );
}
