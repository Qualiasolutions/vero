"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/ui/shadcn/button";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface CartDisplayProps {
  initialCart?: any;
}

export function CartDisplay({ initialCart }: CartDisplayProps) {
  const { cart, updateQuantity, removeFromCart, isPending } = useCart();
  const router = useRouter();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const displayCart = cart || initialCart;

  if (!displayCart || displayCart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">
          Add some premium die-cast models to get started
        </p>
        <Button onClick={() => router.push("/")} variant="default">
          Continue Shopping
        </Button>
      </div>
    );
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await handleRemoveItem(itemId);
      return;
    }

    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      await updateQuantity(itemId, newQuantity);
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      await removeFromCart(itemId);
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const totalAmount = displayCart.items.reduce(
    (sum: number, item: any) => sum + (item.unit_amount * item.quantity) / 100,
    0
  );

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="space-y-4">
          {displayCart.items.map((item: any) => (
            <div
              key={item.id}
              className="vero-card rounded-lg p-6 flex items-center gap-4"
            >
              {/* Product Image */}
              <div className="relative w-24 h-24 flex-shrink-0">
                {item.product?.images?.[0] && (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                )}
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{item.product?.name}</h3>
                <p className="text-gray-600 text-sm">
                  {formatPrice(item.unit_amount / 100)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={updatingItems.has(item.id) || item.quantity <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={updatingItems.has(item.id)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Item Total */}
              <div className="text-right min-w-[80px]">
                <p className="font-semibold">
                  {formatPrice((item.unit_amount * item.quantity) / 100)}
                </p>
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveItem(item.id)}
                disabled={updatingItems.has(item.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="vero-card rounded-lg p-6 sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>

            <Button
              onClick={() => router.push("/checkout")}
              disabled={isPending}
              className="w-full vero-button"
              size="lg"
            >
              {isPending ? "Processing..." : "Proceed to Checkout"}
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full mt-3"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}