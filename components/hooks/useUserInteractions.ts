"use client";

import { useState, useEffect } from "react";

interface UserInteractions {
    viewedCategories: string[];
    viewedProducts: string[];
}

const STORAGE_KEY = "easycom_interactions";

export const useUserInteractions = () => {
    const [interactions, setInteractions] = useState<UserInteractions>({
        viewedCategories: [],
        viewedProducts: [],
    });
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setInteractions(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Failed to load user interactions:", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save to localStorage whenever interactions change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(interactions));
        }
    }, [interactions, isLoaded]);

    const trackProductView = (productId: string, categoryId?: string) => {
        setInteractions((prev) => {
            const newProducts = [productId, ...prev.viewedProducts.filter((id) => id !== productId)].slice(0, 20); // Keep last 20

            let newCategories = prev.viewedCategories;
            if (categoryId) {
                newCategories = [categoryId, ...prev.viewedCategories.filter((id) => id !== categoryId)].slice(0, 10); // Keep last 10
            }

            return {
                viewedCategories: newCategories,
                viewedProducts: newProducts,
            };
        });
    };

    const trackCategoryView = (categoryId: string) => {
        setInteractions((prev) => {
            const newCategories = [categoryId, ...prev.viewedCategories.filter((id) => id !== categoryId)].slice(0, 10);
            return { ...prev, viewedCategories: newCategories };
        });
    };

    return {
        interactions,
        trackProductView,
        trackCategoryView,
        isLoaded,
    };
};
