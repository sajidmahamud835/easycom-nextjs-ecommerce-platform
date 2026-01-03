"use client";
import { Category, Product } from "@/sanity.types";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { motion } from "motion/react";
import { Grid3X3 } from "lucide-react";
import ProductCard from "../ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import { useRouter } from "next/navigation";

interface Props {
  categories: Category[];
  slug: string;
  initialProducts: Product[];
}

const CategoryProducts = ({ categories, slug, initialProducts }: Props) => {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only fetch if slug changed from initial
    if (currentSlug === slug) {
      setProducts(initialProducts);
      return;
    }

    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const query = `
      *[_type == "product" && references(*[_type == "category" && slug.current == $slug]._id)] {
        ...,
        brand->{
          _id,
          title
        }
      }
    `;
        const products = await client.fetch(query, { slug: currentSlug });
        setProducts(products);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentSlug) {
      fetchCategoryProducts();
    }
  }, [currentSlug, slug, initialProducts]);

  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    router.push(`/category/${newSlug}`);
  };

  return (
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      <div className="flex flex-col md:min-w-40 border rounded-lg overflow-hidden bg-white shadow-sm">
        {categories?.map((item) => (
          <Button
            key={item?._id}
            onClick={() => handleCategoryChange(item?.slug?.current as string)}
            className={`bg-transparent border-0 p-0 rounded-none text-dark-color shadow-none hover:bg-shop_light_green hover:text-white font-semibold transition-all duration-200 border-b last:border-b-0 capitalize ${
              item?.slug?.current === currentSlug &&
              "bg-shop_light_green text-white border-shop_light_green"
            }`}
          >
            <p className="w-full text-left px-4 py-3">{item?.title}</p>
          </Button>
        ))}
      </div>

      <motion.div
        className="w-full"
        key={currentSlug} // This will trigger re-animation when slug changes
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {loading ? (
          <div className="w-full">
            {/* Loading skeleton with same layout as actual content */}
            <div className="mb-6">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-48 mb-2"></div>
              <div className="h-3 bg-gray-200 animate-pulse rounded w-32"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : products?.length > 0 ? (
          <div className="w-full">
            {/* Products Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-shop_dark_green">
                    Products in{" "}
                    {currentSlug
                      ? currentSlug.replace(/-/g, " ")
                      : "this category"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {products.length} product{products.length !== 1 ? "s" : ""}{" "}
                    found
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Grid3X3 className="w-4 h-4" />
                  <span>Grid View</span>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {products?.map((product: Product, index: number) => (
                <motion.div
                  key={product?._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05, // Stagger the animation
                  }}
                >
                  <ProductCard product={product} priority={index < 4} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="w-full">
            {/* Empty State Header */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-shop_dark_green">
                Products in{" "}
                {currentSlug ? currentSlug.replace(/-/g, " ") : "this category"}
              </h3>
              <p className="text-sm text-gray-600">0 products found</p>
            </div>

            {/* Enhanced No Products Component */}
            <NoProductAvailable
              selectedTab={currentSlug}
              className="mt-0 w-full border-2 border-dashed border-gray-200 bg-white"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CategoryProducts;
