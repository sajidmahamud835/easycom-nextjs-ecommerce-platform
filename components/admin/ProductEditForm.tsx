"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Save,
    X,
    Loader2,
    Package,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Product } from "./types";
import { ADMIN_CATEGORIES_QUERYResult } from "@/sanity.types";

interface ProductEditFormProps {
    product: Product;
    categories: ADMIN_CATEGORIES_QUERYResult;
    brands?: Array<{ _id: string; title: string }>;
    onSave: (updatedProduct: Product) => void;
    onCancel: () => void;
}

interface FormData {
    name: string;
    description: string;
    price: number;
    discount: number;
    discountPercentage: number;
    stock: number;
    sku: string;
    barcode: string;
    weight: number;
    dimensions: string;
    status: string;
    variant: string;
    isFeatured: boolean;
    isTodaysDeal: boolean;
    categoryId: string;
    brandId: string;
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({
    product,
    categories,
    brands = [],
    onSave,
    onCancel,
}) => {
    const [saving, setSaving] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        discount: product.discount || 0,
        discountPercentage: 0,
        stock: product.stock || 0,
        sku: "",
        barcode: "",
        weight: 0,
        dimensions: "",
        status: product.status || "new",
        variant: product.variant || "others",
        isFeatured: product.isFeatured || product.featured || false,
        isTodaysDeal: false,
        categoryId: product.category?._id || "",
        brandId: product.brand?._id || "",
    });

    // Track which fields have been modified
    const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());

    const handleFieldChange = (field: keyof FormData, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setModifiedFields((prev) => new Set(prev).add(field));
    };

    const handleSave = async () => {
        if (!product._id) return;

        setSaving(true);
        try {
            // Only send modified fields
            const updates: Record<string, unknown> = {};
            modifiedFields.forEach((field) => {
                updates[field] = formData[field as keyof FormData];
            });

            if (Object.keys(updates).length === 0) {
                toast.info("No changes to save");
                setSaving(false);
                return;
            }

            const response = await fetch(`/api/admin/products/${product._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update product");
            }

            const result = await response.json();
            toast.success("Product updated successfully!");
            onSave({ ...product, ...formData });
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error(error instanceof Error ? error.message : "Failed to save product");
        } finally {
            setSaving(false);
        }
    };

    const goToPrevImage = () => {
        if (product.images && product.images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? product.images!.length - 1 : prev - 1
            );
        }
    };

    const goToNextImage = () => {
        if (product.images && product.images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === product.images!.length - 1 ? 0 : prev + 1
            );
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Product Images */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Product Images</Label>
                {product.images && product.images.length > 0 ? (
                    <div className="relative">
                        <div className="aspect-square max-w-xs mx-auto rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-lg">
                            <Image
                                src={urlFor(product.images[currentImageIndex])
                                    .width(300)
                                    .height(300)
                                    .url()}
                                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                                width={300}
                                height={300}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg h-8 w-8"
                                    onClick={goToPrevImage}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg h-8 w-8"
                                    onClick={goToNextImage}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                                <div className="text-xs text-gray-500 text-center mt-2">
                                    {currentImageIndex + 1} of {product.images.length} images
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="aspect-square max-w-xs mx-auto rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
                        <Package className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>

            <Separator />

            {/* Basic Information */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Basic Information</h4>

                <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        placeholder="Enter product name"
                        className="rounded-xl"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleFieldChange("description", e.target.value)}
                        placeholder="Enter product description"
                        rows={3}
                        className="rounded-xl"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                            id="sku"
                            value={formData.sku}
                            onChange={(e) => handleFieldChange("sku", e.target.value)}
                            placeholder="SKU123"
                            className="rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="barcode">Barcode</Label>
                        <Input
                            id="barcode"
                            value={formData.barcode}
                            onChange={(e) => handleFieldChange("barcode", e.target.value)}
                            placeholder="1234567890"
                            className="rounded-xl"
                        />
                    </div>
                </div>
            </div>

            <Separator />

            {/* Pricing & Inventory */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Pricing & Inventory</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($) *</Label>
                        <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => handleFieldChange("price", parseFloat(e.target.value) || 0)}
                            className="rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="discount">Discount ($)</Label>
                        <Input
                            id="discount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.discount}
                            onChange={(e) => handleFieldChange("discount", parseFloat(e.target.value) || 0)}
                            className="rounded-xl"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="stock">Stock *</Label>
                        <Input
                            id="stock"
                            type="number"
                            min="0"
                            value={formData.stock}
                            onChange={(e) => handleFieldChange("stock", parseInt(e.target.value) || 0)}
                            className="rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                            id="weight"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.weight}
                            onChange={(e) => handleFieldChange("weight", parseFloat(e.target.value) || 0)}
                            className="rounded-xl"
                        />
                    </div>
                </div>

                {/* Price Preview */}
                {formData.discount > 0 && (
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Final Price:</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm line-through text-gray-400">
                                    {formatCurrency(formData.price)}
                                </span>
                                <span className="text-lg font-bold text-emerald-600">
                                    {formatCurrency(formData.price - formData.discount)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Separator />

            {/* Classification */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Classification</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={formData.categoryId}
                            onValueChange={(value) => handleFieldChange("categoryId", value)}
                        >
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {categories.map((cat) => (
                                    <SelectItem key={cat._id} value={cat._id}>
                                        {cat.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Brand</Label>
                        <Select
                            value={formData.brandId}
                            onValueChange={(value) => handleFieldChange("brandId", value)}
                        >
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Select brand" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {brands.map((brand) => (
                                    <SelectItem key={brand._id} value={brand._id}>
                                        {brand.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => handleFieldChange("status", value)}
                        >
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="hot">Hot</SelectItem>
                                <SelectItem value="sale">Sale</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Product Type</Label>
                        <Select
                            value={formData.variant}
                            onValueChange={(value) => handleFieldChange("variant", value)}
                        >
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="gadget">Gadget</SelectItem>
                                <SelectItem value="appliances">Appliances</SelectItem>
                                <SelectItem value="refrigerators">Refrigerators</SelectItem>
                                <SelectItem value="others">Others</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Features</h4>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                            <Label htmlFor="isFeatured" className="font-medium">Featured Product</Label>
                            <p className="text-xs text-gray-500">Display on homepage featured section</p>
                        </div>
                        <Switch
                            id="isFeatured"
                            checked={formData.isFeatured}
                            onCheckedChange={(checked) => handleFieldChange("isFeatured", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                            <Label htmlFor="isTodaysDeal" className="font-medium">Today's Deal</Label>
                            <p className="text-xs text-gray-500">Mark as a special deal</p>
                        </div>
                        <Switch
                            id="isTodaysDeal"
                            checked={formData.isTodaysDeal}
                            onCheckedChange={(checked) => handleFieldChange("isTodaysDeal", checked)}
                        />
                    </div>
                </div>
            </div>

            <Separator />

            {/* Modified Fields Indicator */}
            {modifiedFields.size > 0 && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-amber-700">
                        {modifiedFields.size} field(s) modified
                    </span>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <Button
                    onClick={handleSave}
                    disabled={saving || modifiedFields.size === 0}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={saving}
                    className="rounded-xl"
                >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default ProductEditForm;
