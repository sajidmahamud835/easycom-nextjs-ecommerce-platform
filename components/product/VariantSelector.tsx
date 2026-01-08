"use client";

import { useState, useEffect } from "react";

interface VariantOption {
    label: string;
    priceModifier: number;
    isDefault: boolean;
}

interface ProductVariant {
    name: string;
    options: VariantOption[];
}

interface SelectedOptions {
    [variantName: string]: {
        label: string;
        priceModifier: number;
    };
}

interface VariantSelectorProps {
    variants: ProductVariant[];
    onSelectionChange: (selected: SelectedOptions) => void;
}

export default function VariantSelector({
    variants,
    onSelectionChange,
}: VariantSelectorProps) {
    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

    // Initialize with default options
    useEffect(() => {
        const defaults: SelectedOptions = {};
        variants.forEach((variant) => {
            const defaultOption = variant.options.find((opt) => opt.isDefault) || variant.options[0];
            if (defaultOption) {
                defaults[variant.name] = {
                    label: defaultOption.label,
                    priceModifier: defaultOption.priceModifier,
                };
            }
        });
        setSelectedOptions(defaults);
        onSelectionChange(defaults);
    }, [variants]);

    const handleSelect = (variantName: string, option: VariantOption) => {
        const newSelection = {
            ...selectedOptions,
            [variantName]: {
                label: option.label,
                priceModifier: option.priceModifier,
            },
        };
        setSelectedOptions(newSelection);
        onSelectionChange(newSelection);
    };

    if (!variants || variants.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            {variants.map((variant) => (
                <div key={variant.name} className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        {variant.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {variant.options.map((option) => {
                            const isSelected = selectedOptions[variant.name]?.label === option.label;
                            return (
                                <button
                                    key={option.label}
                                    onClick={() => handleSelect(variant.name, option)}
                                    className={`
                    px-4 py-2 rounded-lg border-2 transition-all duration-200
                    ${isSelected
                                            ? "border-shop_light_green bg-shop_light_green/10 text-shop_light_green font-semibold"
                                            : "border-gray-200 hover:border-gray-400 text-gray-700"
                                        }
                  `}
                                >
                                    <span>{option.label}</span>
                                    {option.priceModifier !== 0 && (
                                        <span className={`ml-2 text-xs ${option.priceModifier > 0 ? "text-orange-500" : "text-green-500"}`}>
                                            {option.priceModifier > 0 ? "+" : ""}${option.priceModifier}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
