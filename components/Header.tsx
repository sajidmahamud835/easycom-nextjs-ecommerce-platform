"use client";

import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Menu,
  MapPin,
  User,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

import useLocation from "./hooks/useLocation";
import { Category } from "@/sanity.types";

interface Props {
  categories: Category[];
}

const Header = ({ categories }: Props) => {
  const [category, setCategory] = useState("All");
  const { location, loading } = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* Top Bar - Dark Blue */}
      <div className="bg-[#131921] text-white flex items-center gap-2 md:gap-4 px-2 md:px-4 py-2 text-sm h-[60px]">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:ring-1 hover:ring-white p-1 rounded-sm transition-all">
          <span className="text-xl md:text-2xl font-bold tracking-tighter">Easy<span className="text-[#febd69]">Com</span></span>
        </Link>

        {/* Delivery Location - Hidden on small mobile */}
        <div className="hidden lg:flex flex-col items-start hover:ring-1 hover:ring-white p-1 rounded-md cursor-pointer leading-tight transition-all min-w-[100px]">
          <span className="text-gray-300 text-xs ml-4">Deliver to</span>
          <div className="flex items-center font-bold">
            <MapPin className="w-4 h-4 mr-1" />
            <span>
              {loading ? "Loading..." : location?.country || "Select Location"}
            </span>
          </div>
        </div>

        {/* Search Bar - Flex grow */}
        <div className="flex-1 flex h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#febd69]">
          <div className="bg-gray-100 text-gray-700 hidden md:flex items-center px-3 border-r border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors group relative">
            <span className="text-xs w-auto max-w-[100px] truncate">{category}</span>
            <ChevronDown className="w-3 h-3 ml-1" />

            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 w-48 bg-white border border-gray-200 shadow-lg rounded-b-md hidden group-hover:block z-50 max-h-64 overflow-y-auto">
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs"
                onClick={() => setCategory("All")}
              >
                All Departments
              </div>
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs"
                  onClick={() => setCategory(cat.title || "Unknown")}
                >
                  {cat.title}
                </div>
              ))}
            </div>
          </div>
          <input
            type="text"
            placeholder="Search for products"
            className="flex-1 px-3 text-black outline-none placeholder:text-gray-500 h-full"
          />
          <button className="bg-[#febd69] hover:bg-[#f3a847] px-4 flex items-center justify-center transition-colors">
            <Search className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        {/* Language */}
        <div className="hidden xl:flex items-center font-bold hover:ring-1 hover:ring-white p-2 rounded-sm cursor-pointer transition-all">
          <span className="mr-1">EN</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </div>

        {/* Account */}
        <div className="hidden md:flex flex-col leading-tight hover:ring-1 hover:ring-white p-2 rounded-sm cursor-pointer text-xs transition-all">
          <span className="text-white">Hello, sign in</span>
          <span className="font-bold text-sm flex items-center">
            Account & Lists <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
          </span>
        </div>

        {/* Orders */}
        <div className="hidden md:flex flex-col leading-tight hover:ring-1 hover:ring-white p-2 rounded-sm cursor-pointer text-xs transition-all">
          <span className="text-white">Returns</span>
          <span className="font-bold text-sm">& Orders</span>
        </div>

        {/* Cart */}
        <Link href="/cart" className="flex items-end font-bold hover:ring-1 hover:ring-white p-2 rounded-sm relative transition-all">
          <div className="relative">
            <ShoppingCart className="w-8 h-8" />
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[#f08804] text-lg font-bold">0</span>
          </div>
          <span className="hidden xl:inline mb-1 ml-1 text-sm">Cart</span>
        </Link>
      </div>

      {/* Bottom Bar - Darker Gray/Blue */}
      <div className="bg-[#232f3e] text-white flex items-center gap-4 px-4 py-1.5 text-sm h-[40px] overflow-x-auto no-scrollbar">
        <div className="flex items-center font-bold hover:ring-1 hover:ring-white p-1 rounded-sm cursor-pointer transition-all relative group">
          <Menu className="w-5 h-5 mr-1" />
          অল (All)
          {/* Mobile Side Menu Trigger (Visualize only for now) */}
        </div>
        {["Today's Deals", "Customer Service", "Track My Product", "Gift Cards", "Sell"].map((item) => (
          <Link key={item} href="#" className="whitespace-nowrap hover:ring-1 hover:ring-white px-2 py-1 rounded-sm transition-all">
            {item}
          </Link>
        ))}
      </div>
    </header>
  );
};
export default Header;
