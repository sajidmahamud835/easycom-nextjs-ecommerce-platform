"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  RefreshCw,
  Edit,
  Package,
  Calendar,
  Tag,
  Star,
  Package2,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { ProductsSkeleton } from "./SkeletonLoaders";
import { Product } from "./types";
import { safeApiCall, handleApiError } from "./apiHelpers";
import { ADMIN_CATEGORIES_QUERYResult } from "@/sanity.types";
import { ProductEditForm } from "./ProductEditForm";

interface AdminProductsProps {
  initialCategories?: ADMIN_CATEGORIES_QUERYResult;
}

const AdminProducts: React.FC<AdminProductsProps> = ({
  initialCategories = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [productCategory, setProductCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true); // Default to edit mode
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [categories, setCategories] =
    useState<ADMIN_CATEGORIES_QUERYResult>(initialCategories);
  const [brands, setBrands] = useState<Array<{ _id: string; title: string }>>([]);

  const limit = 10;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when search changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setCurrentPage(0);
    }
  }, [debouncedSearchTerm, searchTerm]);

  // Utility functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Fetch products
  const fetchProducts = useCallback(
    async (page = 0) => {
      setLoading(true);
      try {
        const categoryParam = productCategory === "all" ? "" : productCategory;
        const data = await safeApiCall(
          `/api/admin/products?limit=${limit}&offset=${page * limit
          }&category=${categoryParam}&search=${debouncedSearchTerm}`
        );
        setProducts(data.products);
      } catch (error) {
        handleApiError(error, "Products fetch");
      } finally {
        setLoading(false);
      }
    },
    [productCategory, debouncedSearchTerm, limit]
  );

  // Effects
  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await safeApiCall("/api/admin/brands");
        setBrands(data.brands);
      } catch (error) {
        console.error("Failed to fetch brands", error);
      }
    };
    fetchBrands();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [productCategory, debouncedSearchTerm]);

  // Keyboard navigation for image carousel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !isProductDetailsOpen ||
        !selectedProduct?.images ||
        selectedProduct.images.length <= 1
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          goToPrevImage();
          break;
        case "ArrowRight":
          event.preventDefault();
          goToNextImage();
          break;
        case "Escape":
          event.preventDefault();
          setIsProductDetailsOpen(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isProductDetailsOpen, selectedProduct?.images]);

  // Handle product view
  const handleViewProduct = async (product: Product) => {
    try {
      // Reset image index when viewing a new product
      setCurrentImageIndex(0);
      // Fetch complete product details
      const response = await safeApiCall(
        `/api/admin/products?id=${product._id}`
      );
      setSelectedProduct(response.product);
      setIsProductDetailsOpen(true);
    } catch (error) {
      handleApiError(error, "Product details fetch");
      // Fallback to existing product data
      setCurrentImageIndex(0);
      setSelectedProduct(product);
      setIsProductDetailsOpen(true);
    }
  };

  // Carousel navigation functions
  const goToPrevImage = () => {
    if (selectedProduct?.images && selectedProduct.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProduct.images!.length - 1 : prev - 1
      );
    }
  };

  const goToNextImage = () => {
    if (selectedProduct?.images && selectedProduct.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === selectedProduct.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot":
        return "destructive";
      case "new":
        return "default";
      case "sale":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Modern Gradient Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Products Management</h1>
              <p className="text-white/70 text-sm">Manage your product catalog</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => window.open('/studio/structure/product', '_blank')}
              className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl"
            >
              <Package className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button
              onClick={() => fetchProducts(currentPage)}
              className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:w-64 rounded-xl"
          />
          <Select value={productCategory} onValueChange={setProductCategory}>
            <SelectTrigger className="sm:w-40 rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category.title || ""}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <ProductsSkeleton />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="border-separate border-spacing-0">
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 border-none">
                      <TableHead className="border-b border-gray-200/60 text-gray-600 font-semibold">Product</TableHead>
                      <TableHead className="border-b border-gray-200/60 text-gray-600 font-semibold">Category</TableHead>
                      <TableHead className="border-b border-gray-200/60 text-gray-600 font-semibold">Brand</TableHead>
                      <TableHead className="border-b border-gray-200/60 text-gray-600 font-semibold">Price</TableHead>
                      <TableHead className="border-b border-gray-200/60 text-gray-600 font-semibold">Stock</TableHead>
                      <TableHead className="border-b border-gray-200/60 text-gray-600 font-semibold">Status</TableHead>
                      <TableHead className="border-b border-gray-200/60 text-gray-600 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100">
                    {products.length === 0 ? (
                      <TableRow className="border-none">
                        <TableCell
                          colSpan={7}
                          className="text-center py-12 text-gray-400"
                        >
                          No products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product._id} className="hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-pink-50/30 transition-all duration-200 border-none group">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {/* Product Image */}
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {product.images && product.images[0] ? (
                                  <Image
                                    src={urlFor(product.images[0])
                                      .width(48)
                                      .height(48)
                                      .url()}
                                    alt={product.name || "Product"}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Package className="w-6 h-6" />
                                  </div>
                                )}
                              </div>
                              {/* Product Info */}
                              <div className="min-w-0">
                                <div className="font-medium truncate">
                                  {product.name}
                                </div>
                                {(product.featured || product.isFeatured) && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {product.category?.name ||
                              product.category?.title ||
                              "N/A"}
                          </TableCell>
                          <TableCell>
                            {product.brand?.name ||
                              product.brand?.title ||
                              "N/A"}
                          </TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.stock > 0 ? "default" : "destructive"
                              }
                            >
                              {product.stock}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">
                            {product.status}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewProduct(product)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {products.length === 0 ? (
              <Card className="border-0 shadow-lg rounded-2xl">
                <div className="p-12 text-center text-gray-400">
                  No products found.
                </div>
              </Card>
            ) : (
              products.map((product) => (
                <Card key={product._id} className="border-0 shadow-lg rounded-2xl overflow-hidden">
                  <div className="p-4 space-y-4">
                    {/* Product Header */}
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.images && product.images[0] ? (
                          <Image
                            src={urlFor(product.images[0])
                              .width(64)
                              .height(64)
                              .url()}
                            alt={product.name || "Product"}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {(product.featured || product.isFeatured) && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewProduct(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Product Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Category</div>
                        <div className="font-medium">
                          {product.category?.name ||
                            product.category?.title ||
                            "N/A"}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Brand</div>
                        <div className="font-medium">
                          {product.brand?.name || product.brand?.title || "N/A"}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Price</div>
                        <div className="font-medium text-green-600">
                          {formatCurrency(product.price)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Stock</div>
                        <Badge
                          variant={
                            product.stock > 0 ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {product.stock} units
                        </Badge>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        <Badge
                          variant={getStatusColor(product.status)}
                          className="text-xs capitalize"
                        >
                          {product.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 pt-4">
            <Button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
            <div className="hidden sm:flex items-center text-sm text-gray-500">
              Page {currentPage + 1}
            </div>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Product Details Sidebar */}
      <Sheet open={isProductDetailsOpen} onOpenChange={setIsProductDetailsOpen}>
        <SheetContent className="w-full sm:w-[480px] md:w-[640px] overflow-y-auto p-0">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-6 py-4 text-white">
            <SheetHeader>
              <SheetTitle className="text-lg font-bold text-white">
                {isEditMode ? "Edit Product" : "Product Details"}
              </SheetTitle>
              <SheetDescription className="text-white/70 text-sm">
                {isEditMode ? "Modify product information and save changes" : "View product information"}
              </SheetDescription>
            </SheetHeader>
            {selectedProduct && (
              <div className="flex items-center gap-2 mt-3">
                <Button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl text-sm"
                  size="sm"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {isEditMode ? "View Mode" : "Edit Mode"}
                </Button>
              </div>
            )}
          </div>

          {selectedProduct && (
            <div className="px-6 py-4">
              {isEditMode ? (
                <ProductEditForm
                  product={selectedProduct}
                  categories={categories}
                  brands={brands}
                  onSave={(updatedProduct) => {
                    // Update the product in the list
                    setProducts((prev) =>
                      prev.map((p) =>
                        p._id === updatedProduct._id ? updatedProduct : p
                      )
                    );
                    setSelectedProduct(updatedProduct);
                    // Optionally close the sidebar
                    // setIsProductDetailsOpen(false);
                  }}
                  onCancel={() => setIsProductDetailsOpen(false)}
                />
              ) : (
                // View-only mode - simplified display
                <div className="space-y-6">
                  {/* Product Image */}
                  {selectedProduct.images && selectedProduct.images.length > 0 && (
                    <div className="aspect-square max-w-xs mx-auto rounded-xl overflow-hidden bg-gray-100 shadow-lg">
                      <Image
                        src={urlFor(selectedProduct.images[0])
                          .width(300)
                          .height(300)
                          .url()}
                        alt={selectedProduct.name || "Product"}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Basic Info */}
                  <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-lg font-bold text-gray-900">{selectedProduct.name}</h3>
                    {selectedProduct.description && (
                      <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-emerald-600">
                        {formatCurrency(selectedProduct.price)}
                      </span>
                      <Badge variant={selectedProduct.stock > 0 ? "default" : "destructive"}>
                        {selectedProduct.stock} in stock
                      </Badge>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <span className="text-gray-500">Category</span>
                      <p className="font-medium">{selectedProduct.category?.name || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <span className="text-gray-500">Brand</span>
                      <p className="font-medium">{selectedProduct.brand?.name || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <span className="text-gray-500">Status</span>
                      <Badge variant="outline" className="mt-1 capitalize">{selectedProduct.status}</Badge>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <span className="text-gray-500">Featured</span>
                      <p className="font-medium">{selectedProduct.isFeatured || selectedProduct.featured ? "Yes" : "No"}</p>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <Button
                    onClick={() => setIsEditMode(true)}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Product
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminProducts;

