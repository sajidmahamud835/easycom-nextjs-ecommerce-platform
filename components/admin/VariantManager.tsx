import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface VariantOption {
    label: string;
    priceModifier: number;
    isDefault: boolean;
    _key?: string;
}

interface VariantType {
    name: string;
    options: VariantOption[];
    _key?: string;
}

interface VariantManagerProps {
    variants: VariantType[];
    onVariantsChange: (variants: VariantType[]) => void;
}

export const VariantManager: React.FC<VariantManagerProps> = ({
    variants = [],
    onVariantsChange,
}) => {
    const addVariantType = () => {
        const newVariant: VariantType = {
            name: "",
            options: [],
            _key: Math.random().toString(36).substring(7),
        };
        onVariantsChange([...variants, newVariant]);
    };

    const removeVariantType = (index: number) => {
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        onVariantsChange(newVariants);
    };

    const updateVariantName = (index: number, name: string) => {
        const newVariants = [...variants];
        newVariants[index].name = name;
        onVariantsChange(newVariants);
    };

    const addOption = (variantIndex: number) => {
        const newVariants = [...variants];
        newVariants[variantIndex].options.push({
            label: "",
            priceModifier: 0,
            isDefault: false,
            _key: Math.random().toString(36).substring(7),
        });
        onVariantsChange(newVariants);
    };

    const removeOption = (variantIndex: number, optionIndex: number) => {
        const newVariants = [...variants];
        newVariants[variantIndex].options.splice(optionIndex, 1);
        onVariantsChange(newVariants);
    };

    const updateOption = (
        variantIndex: number,
        optionIndex: number,
        field: keyof VariantOption,
        value: string | number | boolean
    ) => {
        const newVariants = [...variants];
        // @ts-ignore
        newVariants[variantIndex].options[optionIndex][field] = value;
        onVariantsChange(newVariants);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
                    <p className="text-sm text-gray-500">Manage options like Color, Size, etc.</p>
                </div>
                <Button onClick={addVariantType} variant="outline" className="border-dashed">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variant Type
                </Button>
            </div>

            {variants.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <Settings2 className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <h4 className="text-sm font-semibold text-gray-900">No Variants Configured</h4>
                    <p className="text-sm text-gray-500 mt-1">
                        Add variants to offer different options for this product.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {variants.map((variant, vIndex) => (
                        <div key={variant._key || vIndex} className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <Label className="text-xs text-gray-500 uppercase tracking-wider">Option Name</Label>
                                    <Input
                                        value={variant.name}
                                        onChange={(e) => updateVariantName(vIndex, e.target.value)}
                                        placeholder="e.g. Color, Size, Material"
                                        className="mt-1.5 font-medium"
                                    />
                                </div>
                                <Button variant="ghost" size="icon" className="mt-6 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeVariantType(vIndex)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-3 pl-4 border-l-2 border-gray-100">
                                {/* Options Header */}
                                <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-gray-500 px-2">
                                    <div className="col-span-5">Value</div>
                                    <div className="col-span-4">Price Modifier ($)</div>
                                    <div className="col-span-2">Default</div>
                                    <div className="col-span-1"></div>
                                </div>

                                {variant.options.map((option, oIndex) => (
                                    <div key={option._key || oIndex} className="grid grid-cols-12 gap-3 items-center">
                                        <div className="col-span-5">
                                            <Input
                                                value={option.label}
                                                onChange={(e) => updateOption(vIndex, oIndex, "label", e.target.value)}
                                                placeholder="e.g. Red, XL"
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">+</span>
                                            <Input
                                                type="number"
                                                value={option.priceModifier}
                                                onChange={(e) => updateOption(vIndex, oIndex, "priceModifier", parseFloat(e.target.value) || 0)}
                                                className="h-9 pl-6"
                                            />
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <input
                                                type="radio"
                                                name={`default-${vIndex}`}
                                                checked={option.isDefault}
                                                onChange={(e) => updateOption(vIndex, oIndex, "isDefault", e.target.checked)}
                                                className="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500"
                                            />
                                        </div>
                                        <div className="col-span-1 text-right">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => removeOption(vIndex, oIndex)}>
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <Button size="sm" variant="ghost" className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 mt-2" onClick={() => addOption(vIndex)}>
                                    <Plus className="w-3 h-3 mr-1" /> Add Option Value
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

import { X } from "lucide-react";
