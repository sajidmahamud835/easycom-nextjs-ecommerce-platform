"use client";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight, ChevronLeft, ShoppingBag, Building2, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  "Electronics", "Computers", "Smart Home", "Arts & Crafts",
  "Automotive", "Baby", "Beauty and Personal Care", "Women's Fashion",
  "Men's Fashion", "Girls' Fashion", "Boys' Fashion", "Health and Household",
  "Home and Kitchen", "Industrial and Scientific", "Luggage", "Movies & Television",
  "Pet Supplies", "Software", "Sports and Outdoors", "Tools & Home Improvement"
];

const banners = [
  {
    id: 1,
    title: "Shop for Everyone",
    subtitle: "B2C Marketplace",
    description: "Discover millions of products from trusted sellers. Fast delivery, secure payments, and amazing deals for individual shoppers.",
    buttonText: "Start Shopping",
    buttonLink: "/shop",
    image: "/slider-b2c.png",
    icon: ShoppingBag,
    gradient: "from-purple-900/90 via-purple-800/80 to-teal-900/70"
  },
  {
    id: 2,
    title: "Business Solutions",
    subtitle: "B2B Wholesale Platform",
    description: "Streamline your procurement with bulk ordering, competitive pricing, and dedicated account management for enterprises.",
    buttonText: "Get Business Account",
    buttonLink: "/business",
    image: "/slider-b2b.png",
    icon: Building2,
    gradient: "from-slate-900/90 via-blue-900/80 to-indigo-900/70"
  },
  {
    id: 3,
    title: "Mega Deals Week",
    subtitle: "Up to 70% Off",
    description: "Don't miss out on our biggest sale of the season. Limited time offers on electronics, fashion, home & more!",
    buttonText: "Shop Deals",
    buttonLink: "/deals",
    image: "/slider-deals.png",
    icon: Sparkles,
    gradient: "from-orange-900/90 via-pink-900/80 to-red-900/70"
  },
];

const HomeBanner = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <div className="max-w-[1500px] mx-auto px-4 mt-4 flex gap-4 h-[350px] md:h-[450px]">
      {/* Sidebar / Departments - Hidden on mobile */}
      <div className="hidden lg:flex flex-col w-[250px] bg-white shadow-lg rounded-2xl overflow-hidden flex-shrink-0 z-20 border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 font-bold text-sm text-white">Shop by Department</div>
        <div className="overflow-y-auto flex-1 py-2 custom-scrollbar">
          {categories.map((cat, i) => (
            <Link href={"/category/" + cat.toLowerCase().replace(/ /g, '-')} key={i} className="flex justify-between items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 group transition-all border-l-2 border-transparent hover:border-indigo-500">
              {cat}
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="flex-1 rounded-2xl overflow-hidden shadow-xl relative group" ref={emblaRef}>
        <div className="flex h-full">
          {banners.map((banner) => {
            const IconComponent = banner.icon;
            return (
              <div key={banner.id} className="flex-shrink-0 w-full h-full relative">
                {/* Background Image */}
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />

                {/* Content */}
                <div className="absolute inset-0 flex items-center z-10">
                  <div className="px-8 md:px-12 max-w-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <IconComponent className="w-5 h-5 text-teal-400" />
                      <span className="text-teal-400 font-semibold text-sm uppercase tracking-wider">{banner.subtitle}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                      {banner.title}
                    </h2>
                    <p className="text-gray-200 text-sm md:text-base mb-6 leading-relaxed max-w-lg">
                      {banner.description}
                    </p>
                    <Link
                      href={banner.buttonLink}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#febd69] to-[#f3a847] text-black font-bold py-3 px-8 rounded-full hover:from-[#f3a847] hover:to-[#febd69] transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {banner.buttonText}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110"
        >
          <ChevronRight className="w-5 h-5 text-gray-800" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${selectedIndex === index
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;

