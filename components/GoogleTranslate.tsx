"use client";

import { useEffect, useState } from "react";

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: any;
    }
}

const GoogleTranslate = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Define the initialization function globally
        window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false,
                    },
                    "google_translate_element"
                );
            }
        };

        // Load the Google Translate script if it doesn't exist
        const scriptId = "google-translate-script";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src =
                "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        } else if (window.google && window.google.translate) {
            // If script is already loaded, manually trigger init if needed, 
            // though usually the callback handles it. 
            // Ideally, the widget stays mounted.
        }
    }, []);

    if (!mounted) return null;

    return (
        <div className="google-translate-container">
            <div id="google_translate_element" />
            {/* CSS Override to fix Google Translate layout issues in navigation */}
            <style jsx global>{`
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          padding: 0 !important;
          font-size: 13px !important;
          display: flex !important;
          align-items: center !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value {
          color: white !important;
          font-weight: bold !important;
          display: flex !important;
          align-items: center !important;
          margin: 0 !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value span {
          color: white !important; 
          border-left: none !important;
        }
        .goog-te-gadget-icon {
            display: none !important;
        }
        /* Hide the "Powered by Google" branding if desired for cleaner look, 
           though often kept for attribution. */
        .goog-te-gadget span {
            display: none !important;
        }
        .goog-te-gadget {
            color: transparent !important;
        }
        /* Mobile friendly adjustments */
         iframe.goog-te-banner-frame {
            display: none !important;
        }
        body {
            top: 0px !important; 
        }
      `}</style>
        </div>
    );
};

export default GoogleTranslate;
