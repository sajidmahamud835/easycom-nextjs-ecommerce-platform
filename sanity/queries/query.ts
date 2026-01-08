import { defineQuery } from "next-sanity";

const BANNER_QUERY = defineQuery(
  `*[_type == 'banner'] | order(publishedAt desc)`
);
const FEATURED_CATEGORY_QUERY = defineQuery(
  `*[_type == 'category' && featured == true] | order(name desc)`
);
const ALL_PRODUCTS_QUERY = defineQuery(`*[_type=="product"] | order(name asc)`);
const DEAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == 'hot'] | order(name asc){
  ...,"categories": categories[]->title
}`
);
const FEATURE_PRODUCTS = defineQuery(
  `*[_type == 'product' && isFeatured == true] | order(name asc){
  ...,"categories": categories[]->title
}`
);
const BRANDS_QUERY = defineQuery(`*[_type=='brand'] | order(name asc) `);

const LATEST_BLOG_QUERY = defineQuery(
  ` *[_type == 'blog' && isLatest == true]|order(name asc){
    ...,
    blogcategories[]->{
    title
  }
  }`
);

const GET_ALL_BLOG = defineQuery(
  `*[_type == 'blog'] | order(publishedAt desc)[0...$quantity]{
  ...,  
     blogcategories[]->{
    title
}
    }
  `
);

const SINGLE_BLOG_QUERY =
  defineQuery(`*[_type == "blog" && slug.current == $slug][0]{
  ..., 
    author->{
    name,
    image,
  },
  blogcategories[]->{
    title,
    "slug": slug.current,
  },
}`);

const BLOG_CATEGORIES = defineQuery(
  `*[_type == "blog"]{
     blogcategories[]->{
    ...
    }
  }`
);

const OTHERS_BLOG_QUERY = defineQuery(`*[
  _type == "blog"
  && defined(slug.current)
  && slug.current != $slug
]|order(publishedAt desc)[0...$quantity]{
...
  publishedAt,
  title,
  mainImage,
  slug,
  author->{
    name,
    image,
  },
  categories[]->{
    title,
    "slug": slug.current,
  }
}`);

// Address Query
const ADDRESS_QUERY = defineQuery(
  `*[_type=="address"] | order(publishedAt desc)`
);

const ALLCATEGORIES_QUERY = defineQuery(
  `*[_type == 'category'] | order(name asc) [0...$quantity]`
);

const ADMIN_CATEGORIES_QUERY = defineQuery(
  `*[_type == 'category'] | order(title asc) {
    _id,
    title,
    slug,
    description,
    featured
  }`
);

const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug][0]{
    ...,
    "brand": brand->{_id, title, slug, logo},
    "categories": categories[]->{_id, title, slug},
    "averageRating": math::avg(*[_type == "review" && product._ref == ^._id && status == "approved"].rating),
    "totalReviews": count(*[_type == "review" && product._ref == ^._id && status == "approved"]),
    variants
  }`
);

const RELATED_PRODUCTS_QUERY = defineQuery(
  `*[_type == "product" && count((categories[]._ref)[@ in $categoryIds]) > 0 && slug.current != $currentSlug] | order(name asc) [0...$limit]{
    _id,
    name,
    slug,
    price,
    discount,
    stock,
    images,
    categories[]->{
      _id,
      title,
      slug
    }
  }`
);

const BRAND_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug][0]{
"brandName": brand->title
}`);

export {
  BANNER_QUERY,
  FEATURED_CATEGORY_QUERY,
  ALL_PRODUCTS_QUERY,
  DEAL_PRODUCTS,
  FEATURE_PRODUCTS,
  BRANDS_QUERY,
  LATEST_BLOG_QUERY,
  SINGLE_BLOG_QUERY,
  GET_ALL_BLOG,
  BLOG_CATEGORIES,
  OTHERS_BLOG_QUERY,
  ADDRESS_QUERY,
  ALLCATEGORIES_QUERY,
  ADMIN_CATEGORIES_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  RELATED_PRODUCTS_QUERY,
  BRAND_QUERY,
};
