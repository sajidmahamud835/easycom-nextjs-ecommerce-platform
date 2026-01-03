"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import HomeTabbar from "./HomeTabbar";
import { productType } from "@/constants";
import NoProductAvailable from "./product/NoProductAvailable";
import { Grid3X3, LayoutGrid, List, Filter, SortAsc, Eye } from "lucide-react";
import Container from "./Container";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductGridSkeleton } from "./ProductSkeletons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

type ViewMode = "grid-2" | "grid-3" | "grid-4" | "grid-5" | "list";
type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest";

const ProductGrid = () => {
  const [products, setProducts] = useState<ALL_PRODUCTS_QUERYResult>([]);
  const [filteredProducts, setFilteredProducts] =
    useState<ALL_PRODUCTS_QUERYResult>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");
  const [viewMode, setViewMode] = useState<ViewMode>("grid-5");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [showFilters, setShowFilters] = useState(false);
  const [productsPerPage] = useState(20);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [stockStatus, setStockStatus] = useState<string>("all");
  const [rating, setRating] = useState<string>("all");

  const query = `*[_type == "product" && variant == $variant] | order(${getSortQuery(
    sortBy
  )}){
  ...,"categories": categories[]->title
}`;
  const params = { variant: selectedTab.toLowerCase() };

  function getSortQuery(sort: SortOption): string {
    switch (sort) {
      case "name-asc":
        return "name asc";
      case "name-desc":
        return "name desc";
      case "price-asc":
        return "price asc";
      case "price-desc":
        return "price desc";
      case "newest":
        return "_createdAt desc";
      default:
        return "name asc";
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, params);
        setProducts(await response);
        setFilteredProducts(await response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab, sortBy]);

  // Apply filters to products
  const applyFilters = () => {
    let filtered = [...products];

    // Filter by price range
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      filtered = filtered.filter((product) => {
        const price = product.price || 0;
        const finalPrice = product.discount
          ? price - price * (product.discount / 100)
          : price;
        return finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
      });
    }

    // Filter by stock status
    if (stockStatus !== "all") {
      filtered = filtered.filter((product) => {
        if (stockStatus === "in-stock") {
          return (product.stock || 0) > 0;
        } else if (stockStatus === "out-of-stock") {
          return (product.stock || 0) === 0;
        }
        return true;
      });
    }

    // Filter by status (using status as a proxy for "rating/quality")
    if (rating !== "all") {
      filtered = filtered.filter((product) => {
        if (rating === "5") {
          return product.status === "hot"; // Hot products = 5 stars
        } else if (rating === "4") {
          return product.status === "hot" || product.status === "new"; // Hot or New = 4+ stars
        } else if (rating === "3") {
          return (
            product.status === "hot" ||
            product.status === "new" ||
            product.status === "sale"
          ); // All products = 3+ stars
        }
        return true;
      });
    }

    setFilteredProducts(filtered);
  };

  // Auto-apply filters when filter values change
  useEffect(() => {
    applyFilters();
  }, [products, priceRange, stockStatus, rating]);

  const getGridClasses = () => {
    switch (viewMode) {
      case "grid-2":
        return "grid-cols-1 sm:grid-cols-2 gap-6";
      case "grid-3":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5";
      case "grid-4":
        return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "grid-5":
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3";
      case "list":
        return "grid-cols-1 gap-4";
      default:
        return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
    }
  };

  const ViewModeButton = ({
    mode,
    icon,
    label,
  }: {
    mode: ViewMode;
    icon: React.ReactNode;
    label: string;
  }) => (
    <Button
      variant={viewMode === mode ? "default" : "outline"}
      size="sm"
      onClick={() => setViewMode(mode)}
      className={`p-2 hoverEffect ${
        viewMode === mode
          ? "bg-shop_light_green hover:bg-shop_dark_green border-shop_light_green"
          : "hover:border-shop_light_green hover:text-shop_light_green"
      }`}
      title={label}
    >
      {icon}
    </Button>
  );

  return (
    <Container className="flex flex-col lg:px-0 mt-16 lg:mt-24">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-shop_light_green to-shop_dark_green rounded-full"></div>
          <h2 className="text-3xl lg:text-4xl font-bold text-dark-color">
            Featured Products
          </h2>
          <div className="h-1 w-12 bg-gradient-to-l from-shop_light_green to-shop_dark_green rounded-full"></div>
        </div>
        <p className="text-light-color text-lg max-w-2xl mx-auto">
          Discover our carefully curated selection of premium products
        </p>
      </div>

      {/* Enhanced Controls Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-shop_light_green/10 p-6 mb-8">
        {/* Tab Bar */}
        <HomeTabbar selectedTab={selectedTab} onTabSelect={setSelectedTab} />

        {/* Advanced Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6 pt-6 border-t border-gray-100">
          {/* Left Side - View Options */}
          <div className="flex items-center gap-4">
            {/* View Mode Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-dark-color hidden sm:block">
                View:
              </span>
              <div className="flex items-center gap-1">
                <ViewModeButton
                  mode="grid-2"
                  icon={<Grid3X3 size={16} />}
                  label="2 Columns"
                />
                <ViewModeButton
                  mode="grid-3"
                  icon={<LayoutGrid size={16} />}
                  label="3 Columns"
                />
                <ViewModeButton
                  mode="grid-4"
                  icon={<LayoutGrid size={16} />}
                  label="4 Columns"
                />
                <ViewModeButton
                  mode="grid-5"
                  icon={<LayoutGrid size={16} />}
                  label="5 Columns"
                />
                <ViewModeButton
                  mode="list"
                  icon={<List size={16} />}
                  label="List View"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 hoverEffect ${
                showFilters
                  ? "bg-shop_light_green hover:bg-shop_dark_green border-shop_light_green"
                  : "hover:border-shop_light_green hover:text-shop_light_green"
              }`}
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>

          {/* Right Side - Sort and Info */}
          <div className="flex items-center gap-4">
            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <SortAsc size={16} className="text-light-color" />
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-48 border-gray-200 focus:border-shop_light_green">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">
                    Price (High to Low)
                  </SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Count */}
            <div className="flex items-center gap-2 text-sm text-light-color">
              <Eye size={16} />
              <Badge
                variant="secondary"
                className="bg-shop_light_pink text-shop_dark_green"
              >
                {filteredProducts.length} products
              </Badge>
            </div>
          </div>
        </div>

        {/* Expandable Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Separator className="my-6" />
              <Card className="border-shop_light_green/20 bg-gradient-to-br from-white via-shop_light_bg/30 to-shop_light_pink/20">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-dark-color flex items-center gap-2 mb-2">
                      🎯 Advanced Filters
                    </h3>
                    <p className="text-sm text-light-color">
                      Fine-tune your search to find exactly what you&apos;re
                      looking for
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Price Range Filter */}
                    <div className="space-y-4 p-4 bg-white rounded-xl border border-shop_light_green/10 shadow-sm">
                      <Label className="text-sm font-bold text-dark-color flex items-center gap-2">
                        💰 Price Range
                      </Label>
                      <div className="space-y-4">
                        <div className="px-2">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={1000}
                            min={0}
                            step={10}
                            className="w-full"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Label className="text-xs text-light-color">
                              Min Price
                            </Label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={priceRange[0]}
                              onChange={(e) =>
                                setPriceRange([
                                  parseInt(e.target.value) || 0,
                                  priceRange[1],
                                ])
                              }
                              className="h-9 border-gray-200 focus:border-shop_light_green"
                            />
                          </div>
                          <div className="text-light-color font-bold pt-5">
                            -
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs text-light-color">
                              Max Price
                            </Label>
                            <Input
                              type="number"
                              placeholder="1000"
                              value={priceRange[1]}
                              onChange={(e) =>
                                setPriceRange([
                                  priceRange[0],
                                  parseInt(e.target.value) || 1000,
                                ])
                              }
                              className="h-9 border-gray-200 focus:border-shop_light_green"
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <Badge className="bg-shop_light_green/20 text-shop_dark_green border-shop_light_green/30">
                            ${priceRange[0]} - ${priceRange[1]}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Stock Status Filter */}
                    <div className="space-y-4 p-4 bg-white rounded-xl border border-shop_light_green/10 shadow-sm">
                      <Label className="text-sm font-bold text-dark-color flex items-center gap-2">
                        📦 Stock Status
                      </Label>
                      <Select
                        value={stockStatus}
                        onValueChange={setStockStatus}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-shop_light_green h-10">
                          <SelectValue placeholder="Select status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              All Products
                            </span>
                          </SelectItem>
                          <SelectItem value="in-stock">
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              In Stock
                            </span>
                          </SelectItem>
                          <SelectItem value="out-of-stock">
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              Out of Stock
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {stockStatus && stockStatus !== "all" && (
                        <div className="text-center">
                          <Badge
                            variant="outline"
                            className="w-fit border-shop_light_green/30"
                          >
                            {stockStatus === "in-stock"
                              ? "✅ In Stock Only"
                              : "❌ Out of Stock Only"}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Quality Filter */}
                    <div className="space-y-4 p-4 bg-white rounded-xl border border-shop_light_green/10 shadow-sm">
                      <Label className="text-sm font-bold text-dark-color flex items-center gap-2">
                        🏆 Product Quality
                      </Label>
                      <Select value={rating} onValueChange={setRating}>
                        <SelectTrigger className="border-gray-200 focus:border-shop_light_green h-10">
                          <SelectValue placeholder="Select quality..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            <span className="flex items-center gap-2">
                              🛍️ All Products
                            </span>
                          </SelectItem>
                          <SelectItem value="5">
                            <span className="flex items-center gap-2">
                              🔥 Hot Products (Premium)
                            </span>
                          </SelectItem>
                          <SelectItem value="4">
                            <span className="flex items-center gap-2">
                              ✨ New & Hot (High Quality)
                            </span>
                          </SelectItem>
                          <SelectItem value="3">
                            <span className="flex items-center gap-2">
                              🛍️ All Available (Standard+)
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {rating && rating !== "all" && (
                        <div className="text-center">
                          <Badge
                            variant="outline"
                            className="w-fit border-shop_orange/30 text-shop_orange"
                          >
                            {rating === "5"
                              ? "🔥 Premium Only"
                              : rating === "4"
                              ? "✨ High Quality+"
                              : "🛍️ Standard+"}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 justify-end p-4 bg-gradient-to-br from-shop_light_pink/20 to-shop_light_bg/30 rounded-xl border border-shop_light_green/10">
                      <div className="text-center mb-2">
                        <Label className="text-sm font-bold text-dark-color">
                          Quick Actions
                        </Label>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-shop_light_green to-shop_dark_green hover:from-shop_dark_green hover:to-shop_light_green text-white font-semibold shadow-lg hover:shadow-xl hoverEffect transform hover:-translate-y-0.5"
                        onClick={() => {
                          applyFilters();
                        }}
                      >
                        ✨ Apply Filters ({filteredProducts.length})
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-shop_light_green/30 hover:border-shop_light_green hover:bg-shop_light_green/10 text-shop_dark_green hoverEffect"
                        onClick={() => {
                          setPriceRange([0, 1000]);
                          setStockStatus("all");
                          setRating("all");
                        }}
                      >
                        🗑️ Clear Filters
                      </Button>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(priceRange[0] > 0 ||
                    priceRange[1] < 1000 ||
                    (stockStatus && stockStatus !== "all") ||
                    (rating && rating !== "all")) && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-dark-color">
                          Active Filters:
                        </span>
                        {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                          <Badge
                            variant="secondary"
                            className="bg-shop_light_pink text-shop_dark_green"
                          >
                            Price: ${priceRange[0]} - ${priceRange[1]}
                          </Badge>
                        )}
                        {stockStatus && stockStatus !== "all" && (
                          <Badge
                            variant="secondary"
                            className="bg-shop_light_pink text-shop_dark_green"
                          >
                            Stock:{" "}
                            {stockStatus === "in-stock"
                              ? "In Stock"
                              : "Out of Stock"}
                          </Badge>
                        )}
                        {rating && rating !== "all" && (
                          <Badge
                            variant="secondary"
                            className="bg-shop_light_pink text-shop_dark_green"
                          >
                            Quality:{" "}
                            {rating === "5"
                              ? "🔥 Premium"
                              : rating === "4"
                              ? "✨ High Quality"
                              : "🛍️ Standard+"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Products Grid */}
      {loading ? (
        <ProductGridSkeleton />
      ) : filteredProducts?.length ? (
        <div className={`grid ${getGridClasses()}`}>
          <AnimatePresence mode="popLayout">
            {filteredProducts
              ?.slice(0, productsPerPage)
              .map((product, index) => (
                <motion.div
                  key={product?._id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    layout: { duration: 0.3 },
                  }}
                  className="group"
                >
                  <ProductCard product={product} priority={index < 4} />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}

      {/* Load More Section */}
      {filteredProducts?.length > productsPerPage && (
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="px-8 py-3 bg-gradient-to-r from-shop_light_green to-shop_dark_green text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 hoverEffect"
          >
            Load More Products
          </Button>
        </div>
      )}
    </Container>
  );
};

export default ProductGrid;
