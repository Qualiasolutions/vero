import { CartDisplay } from "@/components/cart/cart-display";
import { getCartAction } from "@/actions/cart-actions";
import { redirect } from "next/navigation";

// Force dynamic rendering to allow cookie access
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Shopping Cart | Veromodels",
  description: "Review your selected premium die-cast model cars",
};

export default async function CartPage() {
  try {
    const cart = await getCartAction();

    if (!cart || cart.items.length === 0) {
      return (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Discover our premium collection of 1:18 scale die-cast model cars
            </p>
            <a
              href="/"
              className="vero-button inline-block"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <CartDisplay initialCart={cart} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Cart page error:", error);
    redirect("/");
  }
}