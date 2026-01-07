"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Globe } from "lucide-react";
import { LocationData } from "@/components/hooks/useLocation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdateLocation: (location: LocationData) => void;
    currentLocation: LocationData | null;
}

const LocationModal = ({ isOpen, onOpenChange, onUpdateLocation, currentLocation }: Props) => {
    const [zipCode, setZipCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleZipCodeSubmit = async () => {
        if (!zipCode) {
            setError("Please enter a zip code");
            return;
        }
        setLoading(true);
        setError("");

        try {
            // In a real app, you would validate the zip code against an API
            // For now, we'll mock a successful response with the entered zip
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

            onUpdateLocation({
                city: `Zip: ${zipCode}`,
                country: currentLocation?.country || "Unknown",
                countryCode: currentLocation?.countryCode || "US",
            });
            onOpenChange(false);
        } catch (err) {
            console.error(err);
            setError("Invalid zip code");
        } finally {
            setLoading(false);
        }
    };

    const handleUseCurrentLocation = () => {
        setLoading(true);
        setError("");

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    // Reverse geocoding implementation would go here
                    // For now, we'll use a mocked response or fetch from an API if available
                    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
                    const data = await response.json();

                    onUpdateLocation({
                        city: data.city || data.locality || "Unknown City",
                        country: data.countryName || "Unknown Country",
                        countryCode: data.countryCode || "US"
                    });
                    onOpenChange(false);

                } catch (err) {
                    console.error(err);
                    setError("Failed to fetch location details");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.error(err);
                setError("Unable to retrieve your location");
                setLoading(false);
            }
        );
    };

    const handleCountryChange = (value: string) => {
        onUpdateLocation({
            city: "Whole Country",
            country: value,
            countryCode: value === "United States" ? "US" : (value === "Bangladesh" ? "BD" : "XX") // Simplified
        });
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-shop_dark_green">
                        <MapPin className="w-5 h-5" />
                        Choose your location
                    </DialogTitle>
                </DialogHeader>

                <p className="text-sm text-gray-500 mb-4">
                    Delivery options and delivery speeds may vary for different locations
                </p>

                <Tabs defaultValue="zip" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="zip">Postal Code</TabsTrigger>
                        <TabsTrigger value="manual">Country</TabsTrigger>
                    </TabsList>

                    <TabsContent value="zip" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="zip">Enter a US zip code</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="zip"
                                    placeholder="Zip Code"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                />
                                <Button
                                    className="bg-shop_light_green hover:bg-shop_dark_green text-white"
                                    onClick={handleZipCodeSubmit}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Or</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2 h-12"
                            onClick={handleUseCurrentLocation}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4 text-blue-500" />}
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-semibold">Use my current location</span>
                                <span className="text-xs text-gray-500">Update location via browser</span>
                            </div>
                        </Button>
                    </TabsContent>

                    <TabsContent value="manual" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Ship outside the US</Label>
                            <Select onValueChange={handleCountryChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="United States">United States</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                    <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                                    <SelectItem value="India">India</SelectItem>
                                    {/* Add more countries as needed */}
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>
                </Tabs>

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

            </DialogContent>
        </Dialog>
    );
};

export default LocationModal;
