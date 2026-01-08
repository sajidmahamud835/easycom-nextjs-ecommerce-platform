"use client";

import { useEffect } from "react";

interface ErrorBoundaryProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorBoundaryProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("[Product Page Error]:", error);
    }, [error]);

    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Unable to load product
            </h2>
            <p className="mb-8 text-gray-600">
                We encountered an issue loading this product. Please try again.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                    Try again
                </button>
                <a
                    href="/"
                    className="rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-800 hover:bg-gray-300 transition-colors"
                >
                    Go Home
                </a>
            </div>
            {process.env.NODE_ENV === "development" && (
                <details className="mt-8 max-w-lg text-left">
                    <summary className="cursor-pointer text-sm text-gray-500">
                        Error details
                    </summary>
                    <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs text-red-600">
                        {error.message}
                        {"\n"}
                        {error.stack}
                    </pre>
                </details>
            )}
        </div>
    );
}
