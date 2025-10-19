"use client";

import { useState } from "react";
import { ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { Cart } from "commerce-kit";

interface CheckoutFormProps {
  cart: Cart;
  userId?: string;
}

export function CheckoutForm({ cart, userId }: CheckoutFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      // Create checkout session with Stripe
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.items.map(item => ({
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          customerInfo: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json() as { url: string };

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout", {
        description: "Please try again later",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-[#D4AF37]/20">
      <CardHeader>
        <CardTitle className="text-xl font-light uppercase tracking-wide flex items-center gap-2">
          {userId ? <User className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
          {userId ? "Express Checkout" : "Guest Checkout"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-[#212529]">Shipping Information</h3>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="e.g., United States"
                className="border-[#D4AF37]/20 focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4">
            <p className="text-sm text-[#212529]">
              You will be redirected to Stripe's secure checkout page to complete your payment.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full vero-button py-4 text-base"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              <>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Proceed to Payment - €{cart.total.toFixed(2)}
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-[#6C757D]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Secure checkout powered by Stripe</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}