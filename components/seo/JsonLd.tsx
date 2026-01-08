import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";

interface ProductJsonLdProps {
    product: Product;
    baseUrl: string;
}

/**
 * Generates Schema.org Product structured data for SEO.
 * https://schema.org/Product
 */
export function ProductJsonLd({ product, baseUrl }: ProductJsonLdProps) {
    const productUrl = `${baseUrl}/product/${product.slug?.current}`;
    const imageUrl = product.images?.[0] ? urlFor(product.images[0]).url() : undefined;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: imageUrl,
        url: productUrl,
        sku: product._id,
        offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "USD",
            availability: product.stock && product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            url: productUrl,
        },
        ...(product.discount && product.discount > 0 && {
            offers: {
                "@type": "Offer",
                price: product.price,
                priceCurrency: "USD",
                availability: product.stock && product.stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                url: productUrl,
                priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            },
        }),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

interface FAQJsonLdProps {
    faqs: Array<{ question: string; answer: string }>;
}

/**
 * Generates Schema.org FAQPage structured data for SEO.
 * https://schema.org/FAQPage
 */
export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

interface OrganizationJsonLdProps {
    name: string;
    url: string;
    logo?: string;
    description?: string;
}

/**
 * Generates Schema.org Organization structured data for SEO.
 * https://schema.org/Organization
 */
export function OrganizationJsonLd({ name, url, logo, description }: OrganizationJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name,
        url,
        logo,
        description,
        sameAs: [
            "https://twitter.com/easycom",
            "https://facebook.com/easycom",
            "https://instagram.com/easycom",
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

interface WebSiteJsonLdProps {
    name: string;
    url: string;
    description?: string;
}

/**
 * Generates Schema.org WebSite structured data with search action.
 * https://schema.org/WebSite
 */
export function WebSiteJsonLd({ name, url, description }: WebSiteJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name,
        url,
        description,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${url}/shop?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

interface BreadcrumbJsonLdProps {
    items: Array<{ name: string; url: string }>;
}

/**
 * Generates Schema.org BreadcrumbList structured data.
 * https://schema.org/BreadcrumbList
 */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
