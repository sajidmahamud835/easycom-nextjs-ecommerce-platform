"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, UserCircle, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const SideMenu = () => {
    const [open, setOpen] = useState(false);

    const menuSections = [
        {
            title: "Trending",
            items: ["Best Sellers", "New Releases", "Movers & Shakers"]
        },
        {
            title: "Digital Content & Devices",
            items: ["Prime Video", "Amazon Music", "Echo & Alexa", "Fire Tablets"]
        },
        {
            title: "Shop By Department",
            items: ["Electronics", "Computers", "Smart Home", "Arts & Crafts"]
        },
        {
            title: "Programs & Features",
            items: ["Gift Cards", "Shop By Interest", "Amazon Live", "International Shopping"]
        },
        {
            title: "Help & Settings",
            items: ["Your Account", "Customer Service", "Sign In"]
        }
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <div className="flex items-center font-bold hover:ring-1 hover:ring-white p-1 rounded-sm cursor-pointer transition-all relative group text-white">
                    <Menu className="w-6 h-6 mr-1" />
                    <span className="text-sm">All</span>
                </div>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[365px] p-0 overflow-y-auto bg-white text-black border-r-0">
                <SheetHeader className="bg-[#232f3e] text-white p-4 py-3 flex flex-row items-center gap-2 space-y-0">
                    <UserCircle className="w-8 h-8" />
                    <SheetTitle className="text-white text-lg font-bold">Hello, Sign in</SheetTitle>
                </SheetHeader>

                <div className="py-4">
                    {menuSections.map((section, index) => (
                        <div key={index}>
                            <div className="px-6 py-3">
                                <h3 className="font-bold text-lg mb-2 text-gray-900">{section.title}</h3>
                                <ul className="space-y-0">
                                    {section.items.map((item) => (
                                        <li key={item}>
                                            <Link
                                                href="#"
                                                className="flex items-center justify-between py-3 text-sm text-gray-600 hover:bg-gray-100 -mx-6 px-6 transition-colors"
                                                onClick={() => setOpen(false)}
                                            >
                                                {item}
                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {index < menuSections.length - 1 && <Separator className="my-2" />}
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default SideMenu;
