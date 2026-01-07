import { Category } from "@/sanity.types";
import Container from "./Container";
import Title from "./Title";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface Props {
  categories: Category[];
}

const HomeCategories = ({ categories }: Props) => {
  return (
    <Container className="mt-16 lg:mt-24">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-shop_light_blue to-shop_dark_blue rounded-full"></div>
          <Title className="text-3xl lg:text-4xl font-bold text-dark-color">
            Popular Categories
          </Title>
          <div className="h-1 w-12 bg-gradient-to-l from-shop_light_blue to-shop_dark_blue rounded-full"></div>
        </div>
        <p className="text-light-color text-lg max-w-2xl mx-auto">
          Explore our most popular product categories and find what you need
        </p>
        <Link
          href={"/category"}
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-shop_light_pink text-shop_dark_green/80 font-semibold rounded-full hover:bg-shop_light_blue hover:text-shop_dark_green border-2 border-shop_light_blue hover:border-shop_dark_green hoverEffect"
        >
          Browse All Categories
          <svg
            className="w-4 h-4 hoverEffect group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="bg-gradient-to-br from-white via-shop_light_bg to-shop_light_pink p-8 lg:p-12 rounded-3xl shadow-xl border border-shop_light_blue/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories?.map((category, index) => (
            <Link
              key={category?._id}
              href={`/category/${category?.slug?.current}`}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-shop_light_blue hoverEffect transform hover:-translate-y-2 cursor-pointer block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="flex justify-center mb-5">
                {category?.image ? (
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-shop_light_pink to-shop_light_bg p-3 group-hover:shadow-lg hoverEffect">
                    <Image
                      src={urlFor(category?.image).url()}
                      alt={`${category?.title} category`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain group-hover:scale-110 hoverEffect"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-shop_light_blue/10 to-transparent opacity-0 group-hover:opacity-100 hoverEffect rounded-xl"></div>
                  </div>
                ) : (
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 p-3 group-hover:shadow-lg hoverEffect flex items-center justify-center text-gray-400 group-hover:text-shop_dark_blue group-hover:bg-shop_light_blue/10">
                    <svg
                      className="w-10 h-10 hoverEffect"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="text-center space-y-3">
                <h3 className="text-lg font-bold text-dark-color group-hover:text-shop_dark_blue hoverEffect line-clamp-1">
                  {category?.title}
                </h3>

                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-shop_light_blue rounded-full"></div>
                    <span className="text-sm font-semibold text-shop_dark_blue">
                      Explore
                    </span>
                  </div>
                  <span className="text-sm text-light-color">
                    this category
                  </span>
                </div>

                {/* Decorative Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                  <div
                    className="bg-gradient-to-r from-shop_light_blue to-shop_dark_blue h-2 rounded-full hoverEffect"
                    style={{ width: `${Math.random() * 60 + 40}%` }}
                  ></div>
                </div>

                {/* Shop Now Button */}
                <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-shop_light_pink to-shop_light_bg text-shop_dark_blue font-medium rounded-full group-hover:from-shop_light_blue group-hover:to-shop_dark_blue group-hover:text-white text-sm hoverEffect">
                  Shop Now
                  <svg
                    className="w-3 h-3 hoverEffect group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Categories Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-shop_light_blue/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-shop_dark_blue">
              {categories?.length}+
            </div>
            <div className="text-sm text-light-color">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-shop_dark_blue">1000+</div>
            <div className="text-sm text-light-color">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-shop_dark_blue">24/7</div>
            <div className="text-sm text-light-color">Support</div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-shop_light_pink to-shop_light_bg rounded-2xl border border-shop_light_blue/20">
            <div className="w-2 h-2 bg-shop_light_blue rounded-full animate-pulse"></div>
            <span className="text-dark-text font-medium">
              Discover amazing products in every category
            </span>
            <div className="w-2 h-2 bg-shop_light_blue rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HomeCategories;
