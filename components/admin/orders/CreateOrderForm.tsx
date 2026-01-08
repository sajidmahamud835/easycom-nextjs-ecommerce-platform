"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAdminOrder } from "@/actions/admin/order-creation";
import CustomerSearch, { CustomerData } from "./CustomerSearch";
import ProductPicker, { SelectedProduct } from "./ProductPicker";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, Save, CheckCircle2, User, ShoppingBag, CreditCard, Truck } from "lucide-react";

const STEPS = [
    { id: 1, title: "Customer", icon: User },
    { id: 2, title: "Products", icon: ShoppingBag },
    { id: 3, title: "Details", icon: Truck },
    { id: 4, title: "Review", icon: CheckCircle2 },
];

export default function CreateOrderForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Data
    const [customer, setCustomer] = useState<CustomerData | null>(null);
    const [products, setProducts] = useState<SelectedProduct[]>([]);
    const [shippingAddress, setShippingAddress] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
    const [notes, setNotes] = useState("");

    // Sync customer name to shipping address initiall
    const selectCustomer = (cust: CustomerData | null) => {
        setCustomer(cust);
        if (cust) {
            setShippingAddress(prev => ({
                ...prev,
                name: cust.name,
                // If customer has address object, prefill it here (assuming format)
            }));
        }
    };

    const handleCreateOrder = async () => {
        if (!customer || products.length === 0) return;

        setIsSubmitting(true);
        try {
            const subtotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
            const tax = 0; // Basic tax logic can be added later
            const shipping = 0; // Shipping logic can be added later

            const orderData = {
                customerName: customer.name,
                email: customer.email,
                clerkUserId: customer.clerkId || "admin-created",
                paymentMethod,
                currency: "USD", // Should be configurable
                address: shippingAddress,
                products,
                subtotal,
                tax,
                shipping,
                totalPrice: subtotal + tax + shipping,
                notes
            };

            const result = await createAdminOrder(orderData);

            if (result.success) {
                toast.success(`Order #${result.orderNumber} created successfully!`);
                router.push("/admin/orders");
            } else {
                toast.error("Failed to create order: " + result.error);
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    // Render Steps
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                            Select an existing customer or create a new one to begin the order.
                        </div>
                        <CustomerSearch onSelectCustomer={selectCustomer} selectedCustomer={customer} />
                    </div>
                );
            case 2:
                return (
                    <ProductPicker onProductsChange={setProducts} selectedProducts={products} />
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium border-b pb-2">Shipping Address</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label>Recipient Name</Label>
                                    <Input
                                        value={shippingAddress.name}
                                        onChange={e => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label>Street Address</Label>
                                    <Input
                                        value={shippingAddress.address}
                                        onChange={e => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input
                                        value={shippingAddress.city}
                                        onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>State / Province</Label>
                                    <Input
                                        value={shippingAddress.state}
                                        onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Zip / Postal Code</Label>
                                    <Input
                                        value={shippingAddress.zip}
                                        onChange={e => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium border-b pb-2">Payment & Notes</h3>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Payment Method</Label>
                                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                                            <SelectItem value="card">Credit Card (Stripe)</SelectItem>
                                            <SelectItem value="bank_transfer">Bank Transfer (Manual)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Internal Notes</Label>
                                    <Textarea
                                        placeholder="Special instructions or internal notes..."
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                const subtotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
                return (
                    <div className="space-y-6">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-emerald-900">Ready to Create Order</h4>
                                <p className="text-sm text-emerald-700">Please review all details before submitting.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm">Customer</CardTitle></CardHeader>
                                <CardContent className="text-sm">
                                    <p className="font-medium">{customer?.name}</p>
                                    <p className="text-gray-500">{customer?.email}</p>
                                    <p className="text-gray-500">{customer?.phone || "No phone"}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm">Shipping To</CardTitle></CardHeader>
                                <CardContent className="text-sm">
                                    <p className="font-medium">{shippingAddress.name}</p>
                                    <p className="text-gray-500">{shippingAddress.address}</p>
                                    <p className="text-gray-500">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm">Order Summary</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-2 mb-4">
                                    {products.map(p => (
                                        <div key={p._id} className="flex justify-between text-sm">
                                            <span>{p.quantity}x {p.name}</span>
                                            <span>${(p.price * p.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t pt-2 space-y-1">
                                    <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-sm"><span>Tax</span><span>$0.00</span></div>
                                    <div className="flex justify-between text-sm"><span>Shipping</span><span>$0.00</span></div>
                                    <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t">
                                        <span>Total</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
                <p className="text-gray-500">Manually create an order for a customer.</p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-8 px-4 relative">
                {/* Connector Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10" />

                {STEPS.map((s, idx) => {
                    const Icon = s.icon;
                    const isActive = step >= s.id;
                    const isCurrent = step === s.id;
                    return (
                        <div key={s.id} className="flex flex-col items-center bg-white px-2">
                            <div className={`
                 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                 ${isActive ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-gray-300 text-gray-400'}
                 ${isCurrent ? 'ring-4 ring-emerald-100' : ''}
               `}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-medium mt-2 ${isActive ? 'text-emerald-700' : 'text-gray-500'}`}>{s.title}</span>
                        </div>
                    );
                })}
            </div>

            {/* Main Form Content */}
            <Card className="mb-6 shadow-md border-0 bg-white">
                <CardContent className="p-6">
                    {renderStepContent()}
                </CardContent>
            </Card>

            {/* Navigation Actions */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1 || isSubmitting}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                {step < 4 ? (
                    <Button
                        onClick={nextStep}
                        className="bg-emerald-600 hover:bg-emerald-700"
                        disabled={
                            (step === 1 && !customer) ||
                            (step === 2 && products.length === 0)
                        }
                    >
                        Next Step <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleCreateOrder}
                        className="bg-emerald-600 hover:bg-emerald-700 min-w-[150px]"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>Processing...</>
                        ) : (
                            <><Save className="w-4 h-4 mr-2" /> Create Order</>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
