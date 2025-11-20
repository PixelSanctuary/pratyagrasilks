# PratyagraSilks - Luxury Silk Saree E-commerce

A high-performance, SEO-optimized Next.js 14 e-commerce platform for luxury silk sarees.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **Hosting:** Vercel
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
pratyagrasilks/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx       # Root layout with SEO metadata
│   └── page.tsx         # Home page (Server Component)
├── components/
│   └── ui/              # Reusable UI components
│       ├── Header.tsx   # Navigation header (Client Component)
│       └── Footer.tsx   # Site footer
├── lib/
│   ├── supabase/        # Supabase client configuration
│   └── types.ts         # TypeScript type definitions
├── public/              # Static assets
└── tailwind.config.ts   # Tailwind configuration with brand colors
```

## Key Features

- **Mobile-First Design:** Responsive layouts optimized for all devices
- **SEO Optimized:** Comprehensive metadata, semantic HTML, and performance optimization
- **Server Components:** Leveraging Next.js 14 for optimal performance
- **Type Safety:** Full TypeScript implementation
- **Brand Identity:** Custom color palette (Deep Maroon #9C3A65, Gold #FFD700)

## Performance Targets

- Lighthouse Score: >90
- Mobile-first responsive design
- Optimized image loading
- Server-side rendering for critical pages

## Deployment

Deploy to Vercel with one click or use the Vercel CLI:

```bash
vercel
```

## License

© 2025 PratyagraSilks. All rights reserved.
