/**
 * SITEMAP GENERATION FOR PRATYAGRASILKS
 * 
 * This file documents the sitemap strategy and can be used to generate
 * dynamic sitemaps if needed. For Next.js, you can implement this as
 * an API route at /app/sitemap.xml/route.ts
 */

// STATIC PAGES (Already in sitemap.xml)
export const STATIC_PAGES = {
  home: {
    path: '/',
    priority: 1.0,
    changefreq: 'weekly',
    description: 'Homepage - Main landing page',
  },
  about: {
    path: '/about',
    priority: 0.9,
    changefreq: 'monthly',
    description: 'About PratyagraSilks - Company story and values',
  },
  collection: {
    path: '/collection',
    priority: 0.95,
    changefreq: 'weekly',
    description: 'Browse our collection of silk sarees',
  },
  contact: {
    path: '/contact',
    priority: 0.85,
    changefreq: 'monthly',
    description: 'Contact us form and information',
  },
  cart: {
    path: '/cart',
    priority: 0.8,
    changefreq: 'weekly',
    description: 'Shopping cart page',
  },
  checkout: {
    path: '/checkout',
    priority: 0.8,
    changefreq: 'weekly',
    description: 'Checkout page',
  },
  orders: {
    path: '/orders',
    priority: 0.7,
    changefreq: 'weekly',
    description: 'Orders history page',
  },
  returns: {
    path: '/returns',
    priority: 0.8,
    changefreq: 'monthly',
    description: 'Returns and exchange policy',
  },
  shipping: {
    path: '/shipping',
    priority: 0.8,
    changefreq: 'monthly',
    description: 'Shipping and delivery information',
  },
  privacy: {
    path: '/privacy',
    priority: 0.7,
    changefreq: 'yearly',
    description: 'Privacy policy',
  },
  terms: {
    path: '/terms',
    priority: 0.7,
    changefreq: 'yearly',
    description: 'Terms and conditions',
  },
};

// DYNAMIC PAGES (Should be generated from database)
export const DYNAMIC_PAGES = {
  product: {
    path: '/product/[id]',
    priority: 0.85,
    changefreq: 'weekly',
    description: 'Individual product pages - varies by product',
    note: 'Generate dynamically from product database',
  },
  orderConfirmation: {
    path: '/orders/[id]/confirmation',
    priority: 0.6,
    changefreq: 'never',
    description: 'Order confirmation pages - user-specific',
    note: 'Should NOT be indexed (user-specific content)',
  },
  orderDetails: {
    path: '/orders/[id]',
    priority: 0.6,
    changefreq: 'never',
    description: 'Order details pages - user-specific',
    note: 'Should NOT be indexed (user-specific content)',
  },
};

// SEO CONFIGURATION
export const SEO_CONFIG = {
  domain: 'https://pratyagrasilks.com',
  sitemapLocation: '/sitemap.xml',
  robotsLocation: '/robots.txt',
  lastUpdated: new Date('2025-11-29').toISOString(),
};

// PAGES TO EXCLUDE FROM ROBOTS.TXT (User-specific/Private)
export const EXCLUDED_PAGES = [
  '/orders/*',           // User order pages
  '/cart',              // Shopping cart (session-specific)
  '/checkout',          // Checkout (sensitive data)
];

// RECOMMENDED NEXT.js IMPLEMENTATION
/*
// Add to next.config.mjs if using generateStaticParams

export async function generateStaticParams() {
  // Fetch all product IDs from your database
  const products = await fetch('https://api.pratyagrasilks.com/products')
    .then(res => res.json());
  
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

// For dynamic sitemap generation at /app/sitemap.ts (Next.js 13.3+)
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://pratyagrasilks.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://pratyagrasilks.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // ... add all static pages
  ]
}
*/

// ANALYTICS INTEGRATION RECOMMENDATIONS
export const ANALYTICS_SETUP = {
  googleSearch: {
    action: 'Submit sitemap via Google Search Console',
    url: 'https://search.google.com/search-console',
    steps: [
      'Add property for https://pratyagrasilks.com',
      'Go to Sitemaps section',
      'Submit /sitemap.xml',
    ],
  },
  bingWebmaster: {
    action: 'Submit sitemap via Bing Webmaster Tools',
    url: 'https://www.bing.com/webmaster',
    steps: [
      'Add or verify your site',
      'Go to Sitemaps',
      'Submit /sitemap.xml',
    ],
  },
};

// PERFORMANCE RECOMMENDATIONS
export const RECOMMENDATIONS = [
  {
    priority: 'HIGH',
    action: 'Implement dynamic sitemap generation',
    reason: 'Automatically update sitemap when products are added/updated',
    implementation: 'Create /app/sitemap.ts for Next.js 13.3+',
  },
  {
    priority: 'HIGH',
    action: 'Submit sitemap to search engines',
    reason: 'Ensure all pages are crawled and indexed',
    implementation: 'Use Google Search Console and Bing Webmaster Tools',
  },
  {
    priority: 'MEDIUM',
    action: 'Create robots.txt rules for user-specific pages',
    reason: 'Prevent indexing of order pages and cart',
    implementation: 'Add Disallow rules for /orders/* and /cart',
  },
  {
    priority: 'MEDIUM',
    action: 'Monitor Core Web Vitals',
    reason: 'Page speed affects crawlability and ranking',
    implementation: 'Use PageSpeed Insights and Web Vitals',
  },
  {
    priority: 'LOW',
    action: 'Create image sitemap',
    reason: 'Improve visibility of product images in search',
    implementation: 'Add image elements to sitemap for product pages',
  },
];

export default STATIC_PAGES;
