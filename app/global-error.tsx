"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
          <p className="mb-8 text-gray-600">
            A critical error occurred. Please try refreshing the page.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => reset()}
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded bg-gray-200 px-4 py-2 font-medium text-gray-800 hover:bg-gray-300"
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
