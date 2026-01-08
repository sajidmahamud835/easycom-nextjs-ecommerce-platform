"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchProducts } from "@/actions/admin/order-creation";
import { Search, Plus, Minus, X, Package } from "lucide-react";
import Image from "next/image";

export interface SelectedProduct {
    _id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    stock: number;
}

interface ProductPickerProps {
    onProductsChange: (products: SelectedProduct[]) => void;
    selectedProducts: SelectedProduct[];
}

export default function ProductPicker({ onProductsChange, selectedProducts }: ProductPickerProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchTerm.length >= 2) {
                setLoading(true);
                const data = await searchProducts(searchTerm);
                setResults(data);
                setLoading(false);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const addProduct = (product: any) => {
        const existing = selectedProducts.find(p => p._id === product._id);
        if (existing) {
            updateQuantity(existing._id, existing.quantity + 1);
        } else {
            onProductsChange([...selectedProducts, { ...product, quantity: 1 }]);
        }
    };

    const removeProduct = (productId: string) => {
        onProductsChange(selectedProducts.filter(p => p._id !== productId));
    };

    const updateQuantity = (productId: string, newQty: number) => {
        if (newQty < 1) return;
        onProductsChange(selectedProducts.map(p =>
            p._id === productId ? { ...p, quantity: newQty } : p
        ));
    };

    return (
        <div className="space-y-6">
            {/* Search Section */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Search & Add Products</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Type product name, SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Search Results */}
                {results.length > 0 && (
                    <div className="max-h-60 overflow-y-auto border rounded-xl shadow-lg bg-white absolute z-50 w-full left-0 mt-1">
                        {results.map(product => (
                            <div
                                key={product._id}
                                onClick={() => {
                                    addProduct(product);
                                    setSearchTerm("");
                                    setResults([]);
                                }}
                                className="p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                            >
                                <div className="w-10 h-10 relative bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    {product.image ? (
                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                    ) : (
                                        <Package className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium truncate">{product.name}</p>
                                    <p className="text-xs text-gray-500">${product.price} • Stock: {product.stock}</p>
                                </div>
                                <Button size="sm" variant="ghost" className="text-emerald-600">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Products List */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Order Items ({selectedProducts.length})</label>

                {selectedProducts.length === 0 ? (
                    <div className="p-8 border-2 border-dashed rounded-xl flex flex-col items-center text-center text-gray-400 bg-gray-50/50">
                        <Package className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm text-center">No products added yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {selectedProducts.map(item => (
                            <div key={item._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-xl bg-white shadow-sm">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-12 h-12 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <Package className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">${item.price} each</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 justify-between sm:justify-end">
                                    <div className="flex items-center border rounded-lg">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 rounded-r-none"
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 rounded-l-none"
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            disabled={item.stock !== undefined && item.quantity >= item.stock}
                                        >
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                    </div>

                                    <p className="font-bold text-sm w-20 text-right">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => removeProduct(item._id)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end pt-4 border-t">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Subtotal</p>
                                <p className="text-xl font-bold text-emerald-600">
                                    ${selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
