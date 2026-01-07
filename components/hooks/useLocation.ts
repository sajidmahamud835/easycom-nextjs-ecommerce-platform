import { useState, useEffect } from "react";

interface LocationData {
    city: string;
    country: string;
    countryCode: string;
}

const useLocation = () => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                // Check local storage first
                const savedLocation = localStorage.getItem("userLocation");
                if (savedLocation) {
                    setLocation(JSON.parse(savedLocation));
                    setLoading(false);
                    return;
                }

                // Fetch from API if not found
                // Using ipapi.co (free tier, no key required for limited usage)
                const response = await fetch("https://ipapi.co/json/");
                if (!response.ok) {
                    throw new Error("Failed to fetch location");
                }
                const data = await response.json();

                const newLocation: LocationData = {
                    city: data.city || "Unknown",
                    country: data.country_name || "Unknown",
                    countryCode: data.country_code || "US", // Fallback
                };

                setLocation(newLocation);
                localStorage.setItem("userLocation", JSON.stringify(newLocation));
            } catch (err) {
                console.error("Location detection error:", err);
                setError("Could not detect location");
                // Fallback to default
                setLocation({
                    city: "Select Location",
                    country: "Select Location",
                    countryCode: "US",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchLocation();
    }, []);

    return { location, loading, error };
};

export default useLocation;
