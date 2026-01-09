"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    AlertCircle,
    Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { Product } from "./types";
import { ADMIN_CATEGORIES_QUERYResult } from "@/sanity.types";
import { MediaManager } from "./MediaManager";
import { VariantManager } from "./VariantManager";

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
    variants: any[];
    images: any[];
    videos: any[];
    seo: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
    };
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({
    product,
    categories,
    brands = [],
    onSave,
    onCancel,
}) => {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        discount: product.discount || 0,
        discountPercentage: 0,
        stock: product.stock || 0,
        sku: product.sku || "",
        barcode: product.barcode || "",
        weight: product.weight || 0,
        dimensions: product.dimensions || "",
        status: product.status || "new",
        variant: product.variant || "others",
        isFeatured: product.isFeatured || product.featured || false,
        isTodaysDeal: product.isTodaysDeal || false,
        categoryId: product.category?._id || "",
        brandId: product.brand?._id || "",
        variants: product.variants || [],
        images: product.images || [],
        videos: product.videos || [],
        seo: {
            metaTitle: product.seo?.metaTitle || "",
            metaDescription: product.seo?.metaDescription || "",
            keywords: product.seo?.keywords || [],
        },
    });

    const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFieldChange = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setModifiedFields((prev) => new Set(prev).add(field));
    };

    const handleSeoChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            seo: { ...prev.seo, [field]: value }
        }));
        setModifiedFields((prev) => new Set(prev).add("seo"));
    };

    const generateSku = () => {
        const prefix = formData.name.substring(0, 3).toUpperCase();
        const rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
        const sku = `${prefix}-${rand}`;
        handleFieldChange("sku", sku);
    };

    const generateBarcode = () => {
        const barcode = Math.floor(Math.random() * 1000000000000).toString().padStart(13, "0");
        handleFieldChange("barcode", barcode);
    };

    const handleSave = async () => {
        if (!product._id) return;

        setSaving(true);
        try {
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

            toast.success("Product updated successfully!");
            onSave({ ...product, ...formData });
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error(error instanceof Error ? error.message : "Failed to save product");
        } finally {
            setSaving(false);
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Edit Product</h2>
                <p className="text-sm text-muted-foreground">Manage details for {formData.name}</p>
            </div>

            {modifiedFields.size > 0 && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-amber-700">
                        {modifiedFields.size} field(s) modified
                    </span>
                </div>
            )}

            {/* Media Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Media</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Images & Videos</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <MediaManager
                        images={formData.images}
                        videos={formData.videos}
                        onImagesChange={(imgs) => handleFieldChange("images", imgs)}
                        onVideosChange={(vids) => handleFieldChange("videos", vids)}
                    />
                </div>
            </section>

            <Separator />

            {/* Basic Information */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                <div className="grid gap-6 bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleFieldChange("name", e.target.value)}
                            className="rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Markdown Supported)</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleFieldChange("description", e.target.value)}
                            rows={6}
                            className="rounded-xl min-h-[120px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
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

                    <div className="grid grid-cols-2 gap-6">
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

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <Label htmlFor="isFeatured" className="font-medium text-base">Featured Product</Label>
                                <p className="text-xs text-gray-500">Show on homepage featured section</p>
                            </div>
                            <Switch
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onCheckedChange={(checked) => handleFieldChange("isFeatured", checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <Label htmlFor="isTodaysDeal" className="font-medium text-base">Today's Deal</Label>
                                <p className="text-xs text-gray-500">Mark as special daily deal</p>
                            </div>
                            <Switch
                                id="isTodaysDeal"
                                checked={formData.isTodaysDeal}
                                onCheckedChange={(checked) => handleFieldChange("isTodaysDeal", checked)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Separator />

            {/* Pricing & Inventory */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h3>
                <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($) *</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => handleFieldChange("price", parseFloat(e.target.value) || 0)}
                                className="rounded-xl font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discount">Discount Amount ($)</Label>
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

                    {formData.discount > 0 && (
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
                            <span className="text-sm text-emerald-800 font-medium">Customer Price</span>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-400 line-through">{formatCurrency(formData.price)}</span>
                                <span className="text-xl font-bold text-emerald-600">{formatCurrency(formData.price - formData.discount)}</span>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock Quantity *</Label>
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

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="sku">SKU</Label>
                                <Button variant="ghost" size="sm" className="h-6 text-xs text-violet-600" onClick={generateSku}>
                                    <Wand2 className="w-3 h-3 mr-1" /> Generate
                                </Button>
                            </div>
                            <Input
                                id="sku"
                                value={formData.sku}
                                onChange={(e) => handleFieldChange("sku", e.target.value)}
                                placeholder="SKU-123"
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="barcode">Barcode (EAN/UPC)</Label>
                                <Button variant="ghost" size="sm" className="h-6 text-xs text-violet-600" onClick={generateBarcode}>
                                    <Wand2 className="w-3 h-3 mr-1" /> Generate
                                </Button>
                            </div>
                            <Input
                                id="barcode"
                                value={formData.barcode}
                                onChange={(e) => handleFieldChange("barcode", e.target.value)}
                                placeholder="123456789"
                                className="rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Separator />

            {/* Variants */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Variants</h3>
                    <span className="text-xs text-gray-500">Colors, Sizes, etc.</span>
                </div>
                <VariantManager
                    variants={formData.variants}
                    onVariantsChange={(vars) => handleFieldChange("variants", vars)}
                />
            </section>

            <Separator />

            {/* SEO */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Search Engine Optimization (SEO)</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <Input
                            id="metaTitle"
                            value={formData.seo.metaTitle}
                            onChange={(e) => handleSeoChange("metaTitle", e.target.value)}
                            placeholder="SEO Title (defaults to product name if empty)"
                            className="rounded-xl"
                        />
                        <p className="text-xs text-gray-500 text-right">{formData.seo.metaTitle.length} / 60 characters</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <Textarea
                            id="metaDescription"
                            value={formData.seo.metaDescription}
                            onChange={(e) => handleSeoChange("metaDescription", e.target.value)}
                            placeholder="Brief summary for search results..."
                            rows={3}
                            className="rounded-xl"
                        />
                        <p className="text-xs text-gray-500 text-right">{formData.seo.metaDescription.length} / 160 characters</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Keywords</Label>
                        <Input
                            placeholder="Enter keywords separated by commas (e.g. phone, cheap, 5g)"
                            value={formData.seo.keywords?.join(", ") || ""}
                            onChange={(e) => handleSeoChange("keywords", e.target.value.split(",").map(k => k.trim()))}
                            className="rounded-xl"
                        />
                    </div>
                </div>
            </section>

            {/* Bottom Actions Bar */}
            <div className="sticky bottom-4 z-10 mt-8 rounded-2xl p-[1px] bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 shadow-2xl">
                <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl flex items-center justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        disabled={saving}
                        className="rounded-xl hover:bg-gray-100"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving || modifiedFields.size === 0}
                        className="bg-black hover:bg-gray-800 text-white rounded-xl px-6 min-w-[150px] shadow-lg shadow-gray-200"
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
                </div>
            </div>
        </div>
    );
};

export default ProductEditForm;
