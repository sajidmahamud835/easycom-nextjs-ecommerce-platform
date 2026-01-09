import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "videos",
      title: "Product Videos",
      type: "array",
      of: [{ type: "file", options: { accept: "video/*" } }],
      description: "Upload product videos (MP4, WebM, etc.)",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "isTodaysDeal",
      title: "Today's Deal",
      type: "boolean",
      description: "Mark this product as one of Today's Deals",
      initialValue: false,
    }),
    defineField({
      name: "dealEndTime",
      title: "Deal End Time",
      type: "datetime",
      hidden: ({ document }) => !document?.isTodaysDeal,
    }),
    defineField({
      name: "discountPercentage",
      title: "Discount Percentage",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
      description: "Percentage off (e.g. 50 for 50% off)",
    }),
    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: { type: "brand" },
    }),

    // Inventory & Shipping
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      description: "Stock Keeping Unit",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "barcode",
      title: "Barcode (EAN/UPC)",
      type: "string",
    }),
    defineField({
      name: "weight",
      title: "Weight (kg)",
      type: "number",
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions (cm)",
      type: "string",
      description: "L x W x H",
    }),

    // SEO & Organization
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "Keywords for search and filtering",
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
        defineField({ name: "metaDescription", title: "Meta Description", type: "text", rows: 3 }),
        defineField({ name: "keywords", title: "Keywords", type: "array", of: [{ type: "string" }] }),
      ],
    }),

    // Existing fields...
    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Sale", value: "sale" },
        ],
      },
    }),
    defineField({
      name: "variant",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Gadget", value: "gadget" },
          { title: "Appliances", value: "appliances" },
          { title: "Refrigerators", value: "refrigerators" },
          { title: "Others", value: "others" },
        ],
      },
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle to Featured on or off",
      initialValue: false,
    }),
    // Legacy rating field (kept for backward compatibility with existing data)
    defineField({
      name: "rating",
      title: "Rating (Legacy)",
      type: "number",
      readOnly: true,
      hidden: true,
      description: "Legacy rating field - use averageRating instead",
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: "averageRating",
      title: "Average Rating",
      type: "number",
      readOnly: true,
      description: "Calculated average rating from approved reviews",
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: "totalReviews",
      title: "Total Reviews",
      type: "number",
      readOnly: true,
      initialValue: 0,
      description: "Total number of approved reviews",
    }),
    defineField({
      name: "ratingDistribution",
      title: "Rating Distribution",
      type: "object",
      readOnly: true,
      description: "Distribution of ratings (1-5 stars)",
      fields: [
        defineField({
          name: "fiveStars",
          title: "5 Stars",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "fourStars",
          title: "4 Stars",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "threeStars",
          title: "3 Stars",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "twoStars",
          title: "2 Stars",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "oneStar",
          title: "1 Star",
          type: "number",
          initialValue: 0,
        }),
      ],
    }),
    // Product Variants (Inspired by shopping-cost-calculator-js)
    defineField({
      name: "variants",
      title: "Product Variants (Configurable Options)",
      type: "array",
      description: "Add configurable options like Memory, Storage, Color, etc.",
      of: [
        {
          type: "object",
          name: "productVariant",
          title: "Variant",
          fields: [
            defineField({
              name: "name",
              type: "string",
              title: "Option Name",
              description: "e.g., Memory, Storage, Color",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "options",
              type: "array",
              title: "Available Options",
              of: [
                {
                  type: "object",
                  name: "variantOption",
                  title: "Option",
                  fields: [
                    defineField({
                      name: "label",
                      type: "string",
                      title: "Label",
                      description: "e.g., 8GB, 256GB, Red",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "priceModifier",
                      type: "number",
                      title: "Price Change (+/-)",
                      description: "How much this option adds/subtracts from base price",
                      initialValue: 0,
                    }),
                    defineField({
                      name: "isDefault",
                      type: "boolean",
                      title: "Default Option",
                      initialValue: false,
                    }),
                  ],
                  preview: {
                    select: {
                      title: "label",
                      subtitle: "priceModifier",
                    },
                    prepare({ title, subtitle }) {
                      return {
                        title,
                        subtitle: subtitle ? `+$${subtitle}` : "No extra cost",
                      };
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "name",
              options: "options",
            },
            prepare({ title, options }) {
              return {
                title,
                subtitle: `${options?.length || 0} options`,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images",
      subtitle: "price",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      const image = media && media[0];
      return {
        title: title,
        subtitle: `$${subtitle}`,
        media: image,
      };
    },
  },
});
