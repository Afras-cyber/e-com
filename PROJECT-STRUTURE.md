# 👟 StepKicks — Shoe & Bag E-Commerce Platform
### Complete Project Documentation & System Design

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [Folder Structure](#4-folder-structure)
5. [Database Design (MongoDB)](#5-database-design-mongodb)
6. [Authentication & Role System](#6-authentication--role-system)
7. [Feature Specifications](#7-feature-specifications)
8. [Pages & Routes](#8-pages--routes)
9. [API Routes Design](#9-api-routes-design)
10. [State Management (Zustand)](#10-state-management-zustand)
11. [WhatsApp Integration](#11-whatsapp-integration)
12. [Email Service (Resend)](#12-email-service-resend)
13. [Admin Panel](#13-admin-panel)
14. [SEO Strategy](#14-seo-strategy)
15. [UI/UX Design System](#15-uiux-design-system)
16. [Environment Variables](#16-environment-variables)
17. [Deployment Strategy](#17-deployment-strategy)
18. [Development Phases](#18-development-phases)

---

## 1. Project Overview

**Project Name:** StepKicks  
**Type:** E-Commerce Web Application (Shoe & Bag Shop)  
**Business Model:** WhatsApp-based order negotiation + admin-managed order workflow  
**Target Users:** End customers browsing & buying shoes/bags; Admin & Staff managing products/orders

### Core Business Flow
```
Customer browses → Selects product (size + color) → Clicks Buy
→ Redirected to WhatsApp with pre-filled message (product link + details)
→ Negotiates with seller on WhatsApp
→ Purchase confirmed → Email sent to customer
→ Admin/Staff updates order status in admin panel
```

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | SSR, SSG, API routes, SEO |
| Language | TypeScript | Type safety across codebase |
| Database | MongoDB + Mongoose | Data persistence |
| Data Fetching | TanStack Query v5 | Server state, caching, sync |
| UI Components | shadcn/ui + Radix UI | Accessible, styled components |
| Styling | Tailwind CSS | Utility-first responsive design |
| Global State | Zustand | Cart, auth state, UI state |
| Email | Resend | Transactional emails |
| Auth | NextAuth.js v5 | Session management, role-based auth |
| Messaging | WhatsApp API (wa.me) | Order communication |
| Image Upload | AWS S3 + CloudFront | Product image storage & CDN delivery |
| Theme | next-themes | Dark/light mode |
| Forms | React Hook Form + Zod | Form handling & validation |
| Animations | Framer Motion | Page transitions, micro-interactions |
| SEO | Next.js Metadata API | Meta tags, OG, structured data |

---

## 3. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    NEXT.JS APP (Vercel)                  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Public Pages │  │  Admin Panel │  │   API Routes  │  │
│  │  (SSR/SSG)   │  │  (Protected) │  │  /api/*      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│           │                │                 │           │
│  ┌─────────────────────────────────────────────────┐    │
│  │              TanStack Query + Zustand            │    │
│  └─────────────────────────────────────────────────┘    │
│           │                │                 │           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   MongoDB    │  │   Resend     │  │  WhatsApp    │  │
│  │  (Database)  │  │   (Email)    │  │  (wa.me)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│           │                                             │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  AWS S3   │  │  NextAuth    │                    │
│  │  (Images)    │  │  (Sessions)  │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### Rendering Strategy

| Page | Strategy | Reason |
|------|----------|--------|
| Home | ISR (60s revalidate) | SEO + fresh promotions |
| Product Listing | SSR | Filters & pagination |
| Product Detail | SSR + generateStaticParams | SEO critical |
| Admin Panel | CSR (client only) | Private, no SEO needed |
| About / Contact | SSG | Static, rarely changes |

---

## 4. Folder Structure

```
stepkicks/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public layout group
│   │   ├── layout.tsx            # Public layout (navbar, footer)
│   │   ├── page.tsx              # Home page
│   │   ├── shop/
│   │   │   ├── page.tsx          # Product listing + filters
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Product detail page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── (admin)/                  # Admin layout group
│   │   ├── layout.tsx            # Admin sidebar layout
│   │   ├── admin/
│   │   │   ├── page.tsx          # Dashboard overview
│   │   │   ├── products/
│   │   │   │   ├── page.tsx      # Product list
│   │   │   │   ├── new/page.tsx  # Add product
│   │   │   │   └── [id]/page.tsx # Edit product
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx      # Order list
│   │   │   │   └── [id]/page.tsx # Order detail
│   │   │   ├── banners/
│   │   │   │   └── page.tsx      # Manage promo banners
│   │   │   ├── staff/
│   │   │   │   └── page.tsx      # Staff management
│   │   │   └── testimonials/
│   │   │       └── page.tsx      # Manage reviews
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts
│   │   ├── products/
│   │   │   ├── route.ts          # GET (list), POST (create)
│   │   │   └── [id]/route.ts     # GET, PUT, DELETE
│   │   ├── orders/
│   │   │   ├── route.ts          # GET (list), POST (create)
│   │   │   └── [id]/route.ts     # GET, PATCH (status update)
│   │   ├── banners/
│   │   │   └── route.ts
│   │   ├── testimonials/
│   │   │   └── route.ts
│   │   ├── upload/
│   │   │   └── route.ts          # Image upload
│   │   └── send-email/
│   │       └── route.ts          # Email trigger
│   ├── globals.css
│   └── layout.tsx                # Root layout
│
├── components/
│   ├── ui/                       # shadcn/ui components (auto-generated)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── MobileNav.tsx
│   ├── home/
│   │   ├── HeroBanner.tsx
│   │   ├── PromoBannerSection.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── CategorySection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── NewsletterSignup.tsx
│   ├── shop/
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── SizeSelector.tsx
│   │   ├── ColorSelector.tsx
│   │   ├── BuyButton.tsx         # WhatsApp redirect logic
│   │   └── Pagination.tsx
│   ├── admin/
│   │   ├── DashboardStats.tsx
│   │   ├── ProductForm.tsx
│   │   ├── OrderTable.tsx
│   │   ├── OrderStatusBadge.tsx
│   │   ├── BannerForm.tsx
│   │   ├── StaffTable.tsx
│   │   └── ImageUploader.tsx     # S3 upload with presigned URLs
│   └── shared/
│       ├── ThemeToggle.tsx
│       ├── WhatsAppButton.tsx
│       └── LoadingSpinner.tsx
│
├── lib/
│   ├── db/
│   │   ├── mongoose.ts           # MongoDB connection
│   │   └── models/               # Mongoose models
│   │       ├── Product.ts
│   │       ├── Order.ts
│   │       ├── User.ts
│   │       ├── Banner.ts
│   │       └── Testimonial.ts
│   ├── auth.ts                   # NextAuth config
│   ├── resend.ts                 # Email service
│   ├── whatsapp.ts               # WhatsApp URL builder
│   ├── validations/              # Zod schemas
│   │   ├── product.schema.ts
│   │   ├── order.schema.ts
│   │   └── user.schema.ts
│   └── utils/
│       ├── formatPrice.ts
│       ├── slugify.ts
│       └── cn.ts                 # className utility
│
├── hooks/
│   ├── useProducts.ts            # TanStack Query hooks
│   ├── useOrders.ts
│   ├── useBanners.ts
│   └── useUpload.ts
│
├── store/
│   ├── useCartStore.ts           # Cart state (Zustand)
│   ├── useAuthStore.ts           # Auth state
│   └── useUIStore.ts             # Modal/drawer state
│
├── types/
│   ├── product.ts
│   ├── order.ts
│   ├── user.ts
│   └── banner.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. Database Design (MongoDB)

### Product Collection

```typescript
interface IProduct {
  _id: ObjectId;
  name: string;
  slug: string;              // URL-friendly unique name
  description: string;
  shortDescription: string;
  category: 'shoes' | 'bags' | 'accessories';
  subcategory: string;       // e.g., "sneakers", "heels", "tote bags"
  brand: string;
  price: number;
  discountPrice?: number;    // If on sale
  discountPercent?: number;  // Calculated field
  images: string[];          // AWS S3/CloudFront URLs
  sizes: string[];           // e.g., ["38", "39", "40", "41", "42"]
  colors: {
    name: string;            // e.g., "Black"
    hex: string;             // e.g., "#000000"
    imageIndex?: number;     // Which image shows this color
  }[];
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  tags: string[];            // For search/SEO
  seoTitle?: string;
  seoDescription?: string;
  rating: number;            // Average rating
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order Collection

```typescript
interface IOrder {
  _id: ObjectId;
  orderNumber: string;       // e.g., "SK-2024-00123"
  customer: {
    name: string;
    phone: string;           // WhatsApp number
    email?: string;
  };
  product: {
    productId: ObjectId;
    productName: string;
    productSlug: string;
    selectedSize: string;
    selectedColor: string;
    price: number;
    negotiatedPrice?: number; // Final agreed price
    image: string;
  };
  status: OrderStatus;       // See enum below
  statusHistory: {
    status: OrderStatus;
    updatedBy: ObjectId;     // Staff/Admin user ID
    note?: string;
    timestamp: Date;
  }[];
  whatsappSent: boolean;
  emailSent: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

enum OrderStatus {
  INQUIRY    = 'inquiry',       // Clicked buy on website
  CONTACTED  = 'contacted',     // WhatsApp opened
  NEGOTIATING= 'negotiating',   // In discussion
  CONFIRMED  = 'confirmed',     // Sale agreed
  PROCESSING = 'processing',    // Being prepared
  SHIPPED    = 'shipped',       // Dispatched
  DELIVERED  = 'delivered',     // Customer received
  CANCELLED  = 'cancelled',     // Order cancelled
}
```

### User Collection

```typescript
interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;          // Hashed (bcrypt)
  role: 'admin' | 'staff';
  isActive: boolean;
  phone?: string;
  avatar?: string;
  addedBy?: ObjectId;         // Admin who created the staff
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Banner Collection

```typescript
interface IBanner {
  _id: ObjectId;
  title: string;
  subtitle?: string;
  image: string;             // AWS S3/CloudFront URL
  mobileImage?: string;      // Optimized for mobile (S3/CloudFront URL)
  link?: string;             // Link to product/category
  buttonText?: string;
  type: 'hero' | 'promo' | 'sale' | 'seasonal';
  position: number;          // Display order
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  backgroundColor?: string;
  textColor?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Testimonial Collection

```typescript
interface ITestimonial {
  _id: ObjectId;
  customerName: string;
  customerAvatar?: string;
  rating: number;            // 1–5
  review: string;
  productId?: ObjectId;
  productName?: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
}
```

---

## 6. Authentication & Role System

### Roles & Permissions

| Permission | Admin | Staff | Customer (guest) |
|-----------|-------|-------|-----------------|
| Browse products | ✅ | ✅ | ✅ |
| Buy via WhatsApp | ✅ | ✅ | ✅ |
| View all orders | ✅ | ✅ | ❌ |
| Update order status | ✅ | ✅ | ❌ |
| Add/Edit products | ✅ | ✅ | ❌ |
| Delete products | ✅ | ❌ | ❌ |
| Manage banners | ✅ | ❌ | ❌ |
| Manage staff | ✅ | ❌ | ❌ |
| Manage testimonials | ✅ | ✅ | ❌ |
| View dashboard stats | ✅ | ✅ | ❌ |

### Auth Flow

```
Admin creates Staff account (email + temp password)
  → Staff receives email with login link (Resend)
  → Staff logs in via /admin/login
  → NextAuth creates session with role
  → Middleware protects /admin/* routes
  → Role stored in JWT token
```

### Middleware Protection

```typescript
// middleware.ts
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};

// Check: authenticated + correct role
// Redirect unauthorized to /admin/login
```

---

## 7. Feature Specifications

### 7.1 Home Page Sections

1. **Hero Banner** — Full-width animated slider (managed by admin)
2. **Category Quick Links** — Shoes, Bags, Sale, New Arrivals (icons)
3. **Special Offers / Promo Banners** — Admin-managed discount banners with countdown timer
4. **Featured Products Grid** — Curated best-sellers
5. **New Arrivals** — Latest added products
6. **Brand Showcase** — Partner/brand logos strip
7. **Testimonials Carousel** — Customer reviews (star rating + comment)
8. **Newsletter Signup** — Email capture via Resend
9. **WhatsApp Floating Button** — Always-visible, bottom-right

### 7.2 Shop/Product Listing Page

**Filters Panel (left sidebar / drawer on mobile):**
- Category (Shoes / Bags / Accessories)
- Subcategory (Sneakers, Heels, Loafers, Tote, Backpack…)
- Price range slider (min / max)
- Brand multi-select
- Size multi-select
- Color swatches
- Rating filter (4★+, 3★+…)
- On Sale / In Stock toggles
- Sort: Price Low-High, High-Low, Newest, Best Rated

**Product Grid:**
- 3 columns (desktop) / 2 columns (tablet) / 1 column (mobile)
- Product card: image, name, brand, price (with discount badge), colors, sizes preview
- Hover: quick view overlay, add-to-compare
- Pagination: 12 products per page, URL-based (?page=2)
- URL-based filters (shareable filter URLs)

### 7.3 Product Detail Page

- Image gallery with zoom (main + thumbnails)
- Product name, brand, price (original + discounted)
- Description (rich text)
- **Size Selector** — Visual size grid, out-of-stock sizes greyed
- **Color Selector** — Color swatches, image changes on color select
- Stock availability badge
- **BUY NOW Button** → Triggers WhatsApp redirect
- Product share button (copies link with selected size + color)
- Related products section
- Customer reviews section

### 7.4 WhatsApp Buy Flow

```
User selects: Size=42, Color=Black, Product="Nike Air Max 90"
                    ↓
URL params preserved: /shop/nike-air-max-90?size=42&color=black
                    ↓
Click "Buy on WhatsApp" button
                    ↓
WhatsApp URL generated:
https://wa.me/+94XXXXXXXXX?text=
  Hi, I'm interested in:
  👟 Nike Air Max 90
  📏 Size: 42
  🎨 Color: Black
  💰 Price: LKR 18,500
  🔗 Link: https://stepkicks.lk/shop/nike-air-max-90?size=42&color=black
  
  Please let me know availability.
                    ↓
WhatsApp opens (web/app)
                    ↓
Order record created in DB (status: "inquiry")
                    ↓
Confirmation email sent to customer (if email provided)
```

### 7.5 Special Offers / Promo Banner Management

- Admin can add/edit/delete promo banners
- Set: image, title, subtitle, linked product/category, date range
- Countdown timer widget if end date set
- Position/ordering control (drag to reorder)
- Instant preview before publishing
- Mobile and desktop image variants

### 7.6 Testimonials

- Admin can approve/reject customer-submitted reviews
- Admin can manually add testimonials
- Mark as "Featured" to show on homepage
- Star rating (1–5) + text + optional photo
- Homepage carousel shows featured ones

### 7.7 Dark / Light Mode

- Persisted to localStorage via next-themes
- Toggle button in navbar
- All components respect CSS variables (--background, --foreground, etc.)
- Smooth transition animation

---

## 8. Pages & Routes

### Public Routes

| Route | Page | Strategy |
|-------|------|----------|
| `/` | Home page | ISR |
| `/shop` | Product listing + filters | SSR |
| `/shop/[slug]` | Product detail | SSR |
| `/about` | About us | SSG |
| `/contact` | Contact us | SSG |

### Admin Routes (Protected)

| Route | Page |
|-------|------|
| `/admin` | Dashboard overview |
| `/admin/products` | Product list |
| `/admin/products/new` | Add product form |
| `/admin/products/[id]` | Edit product form |
| `/admin/orders` | Order list + status management |
| `/admin/orders/[id]` | Order detail + status history |
| `/admin/banners` | Promo banner management |
| `/admin/staff` | Staff management |
| `/admin/testimonials` | Testimonial management |
| `/admin/login` | Admin login page |

---

## 9. API Routes Design

### Products

```
GET    /api/products              # List (with filters, pagination)
POST   /api/products              # Create [Admin/Staff]
GET    /api/products/[id]         # Single product
PUT    /api/products/[id]         # Update [Admin/Staff]
DELETE /api/products/[id]         # Delete [Admin only]
GET    /api/products/featured     # Featured products
GET    /api/products/sale         # On-sale products
```

### Orders

```
GET    /api/orders                # List all orders [Admin/Staff]
POST   /api/orders                # Create order (public — on WhatsApp click)
GET    /api/orders/[id]           # Order detail [Admin/Staff]
PATCH  /api/orders/[id]/status    # Update status [Admin/Staff]
```

### Banners

```
GET    /api/banners               # Active banners (public)
GET    /api/admin/banners         # All banners [Admin]
POST   /api/admin/banners         # Create [Admin]
PUT    /api/admin/banners/[id]    # Update [Admin]
DELETE /api/admin/banners/[id]    # Delete [Admin]
```

### Auth / Users / Staff

```
POST   /api/auth/[...nextauth]    # NextAuth handlers
GET    /api/admin/staff           # List staff [Admin]
POST   /api/admin/staff           # Add staff [Admin]
PATCH  /api/admin/staff/[id]      # Update role/status [Admin]
DELETE /api/admin/staff/[id]      # Remove staff [Admin]
```

### Misc

```
POST   /api/upload                # Generate S3 presigned URL → upload from client
POST   /api/send-email            # Send transactional email
GET    /api/testimonials          # Approved testimonials (public)
POST   /api/testimonials          # Submit review (public)
```

---

## 10. State Management (Zustand)

### Cart Store

```typescript
// store/useCartStore.ts
interface CartStore {
  // State
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product, size, color) => void;
  removeItem: (id) => void;
  clearCart: () => void;
  toggleCart: () => void;
  
  // Computed
  total: number;
  itemCount: number;
}
```

### UI Store

```typescript
// store/useUIStore.ts
interface UIStore {
  isMobileMenuOpen: boolean;
  isFilterDrawerOpen: boolean;
  activeModal: string | null;
  
  toggleMobileMenu: () => void;
  toggleFilterDrawer: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}
```

### TanStack Query Hooks Pattern

```typescript
// hooks/useProducts.ts
export const useProducts = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 5,     // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
```

---

## 11. WhatsApp Integration

### URL Builder Utility

```typescript
// lib/whatsapp.ts
interface WhatsAppMessageConfig {
  productName: string;
  size: string;
  color: string;
  price: number;
  productSlug: string;
  siteUrl: string;
  sellerPhone: string;        // From env variable
}

export function buildWhatsAppURL(config: WhatsAppMessageConfig): string {
  const productLink = `${config.siteUrl}/shop/${config.productSlug}?size=${config.size}&color=${config.color}`;
  
  const message = `
Hi! I'm interested in purchasing:

👟 *${config.productName}*
📏 Size: ${config.size}
🎨 Color: ${config.color}
💰 Price: LKR ${config.price.toLocaleString()}
🔗 Product Link: ${productLink}

Please let me know about availability and payment details. Thank you!
  `.trim();

  return `https://wa.me/${config.sellerPhone}?text=${encodeURIComponent(message)}`;
}
```

### Order Creation on WhatsApp Click

```typescript
// When BuyButton is clicked:
// 1. Collect: productId, size, color, customer info (optional modal)
// 2. POST /api/orders → creates order with status "inquiry"
// 3. Build WhatsApp URL
// 4. Send confirmation email if customer email provided
// 5. window.open(whatsappURL, '_blank')
```

---

## 12. Email Service (Resend)

### Email Templates

**1. Order Inquiry Confirmation (to Customer)**
```
Subject: Your Order Inquiry — StepKicks #SK-XXXXX
Content: Product details, WhatsApp chat link, shop contact info
```

**2. New Order Notification (to Admin)**
```
Subject: 🛍️ New Order Inquiry — Nike Air Max 90 (Size 42)
Content: Customer details, product, link to admin order page
```

**3. Staff Welcome Email**
```
Subject: Welcome to StepKicks Staff Portal
Content: Login credentials, portal link, instructions
```

**4. Order Status Update (to Customer, if email on file)**
```
Subject: Your Order #SK-XXXXX has been [Confirmed/Shipped]
Content: Order summary, status, expected delivery
```

### Resend Setup

```typescript
// lib/resend.ts
import { Resend } from 'resend';
export const resend = new Resend(process.env.RESEND_API_KEY);

// Usage:
await resend.emails.send({
  from: 'orders@stepkicks.lk',
  to: customer.email,
  subject: `Order Inquiry Confirmed — StepKicks`,
  react: OrderConfirmationEmail({ order }),
});
```

---

## 13. Admin Panel

### Dashboard Overview

- **Stats Cards:** Total orders, Today's orders, Pending orders, Revenue (this month)
- **Recent Orders Table:** Last 10 orders with quick status update
- **Low Stock Alert:** Products with stock < 5
- **Quick Links:** Add Product, View Orders, Manage Banners

### Product Management

- Table view with image, name, price, category, stock, status
- Quick toggle: Available / Unavailable, Featured
- Search by name
- Bulk actions: delete, feature, mark on-sale
- **Product Form Fields:**
  - Basic: Name, Slug (auto-generated), Brand, Category, Subcategory
  - Pricing: Price, Discount Price, Discount %
  - Images: Multi-image upload (drag & drop), reorder
  - Variants: Add sizes (chips), add colors (color picker + name)
  - Inventory: Stock count, availability toggle
  - SEO: Title, meta description
  - Content: Short description, full description (rich text editor)
  - Settings: Featured, On Sale, Tags

### Order Management

- Filterable order table: by status, date range, search
- **Status Pipeline:** Inquiry → Contacted → Negotiating → Confirmed → Processing → Shipped → Delivered
- One-click status update with optional note
- WhatsApp quick link to re-open chat with customer
- Order detail view with full status history timeline
- Export orders as CSV

### Banner Management

- Visual card grid of banners
- Toggle active/inactive instantly
- Form: image upload (desktop + mobile), title, subtitle, link, button text, dates
- Drag-to-reorder

### Staff Management

- Table: name, email, role, status, date added
- Add staff form: name, email, role → sends welcome email
- Toggle active/inactive (disable without deleting)
- Remove staff account

---

## 14. SEO Strategy

### Implementation

```typescript
// app/(public)/shop/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: `${product.name} | StepKicks`,
    description: product.seoDescription || product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.images[0], width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: `https://stepkicks.lk/shop/${product.slug}` },
  };
}
```

### Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nike Air Max 90",
  "image": ["https://..."],
  "description": "...",
  "brand": { "@type": "Brand", "name": "Nike" },
  "offers": {
    "@type": "Offer",
    "price": "18500",
    "priceCurrency": "LKR",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "23"
  }
}
```

### SEO Checklist

- [x] `next/image` for all product images (WebP, lazy loading, proper sizes)
- [x] Dynamic sitemap: `app/sitemap.ts`
- [x] robots.txt: `app/robots.ts`
- [x] Canonical URLs on all pages
- [x] Structured data (Product, BreadcrumbList, Organization)
- [x] Open Graph + Twitter Card meta
- [x] Fast Core Web Vitals (ISR + image optimization)
- [x] URL-based filters (shareable, crawlable)
- [x] Product slugs (human-readable URLs)

---

## 15. UI/UX Design System

### Color Palette (Tailwind CSS Variables)

```css
/* Light Mode */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 222.2 47.4% 11.2%;      /* Deep navy — trust & premium */
--accent: 24 100% 50%;              /* Orange — energy & action */
--muted: 210 40% 96.1%;
--border: 214.3 31.8% 91.4%;

/* Dark Mode */
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
--primary: 217.2 91.2% 59.8%;
```

### Typography Scale

- **Display (Hero):** `text-5xl md:text-7xl font-black tracking-tight`
- **H1:** `text-4xl font-bold`
- **H2 (Section title):** `text-3xl font-semibold`
- **H3 (Product name):** `text-xl font-medium`
- **Body:** `text-base` (16px)
- **Caption:** `text-sm text-muted-foreground`

### Key Components

| Component | Notes |
|-----------|-------|
| `<ProductCard>` | Image hover zoom, color dots, price badge |
| `<SizeSelector>` | Grid of size chips, greyed if OOS |
| `<ColorSelector>` | Circle swatches, border on selected |
| `<BuyButton>` | Green WhatsApp brand color, icon |
| `<PriceBadge>` | Shows original + discounted + % off |
| `<OrderStatusBadge>` | Coloured badge per status |
| `<StarRating>` | Half-star support |
| `<ImageGallery>` | Thumbnails + zoom on main |

### Responsive Breakpoints

- Mobile: `< 640px` — single column, drawer filters
- Tablet: `640px–1024px` — 2 columns
- Desktop: `> 1024px` — 3 columns, sidebar filters

---

## 16. Environment Variables

```bash
# .env.local

# App
NEXT_PUBLIC_SITE_URL=https://stepkicks.lk
NEXT_PUBLIC_SITE_NAME=StepKicks

# MongoDB
MONGODB_URI=mongodb+srv://...

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://stepkicks.lk

# Resend Email
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=orders@stepkicks.lk

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=+94XXXXXXXXX   # Seller WhatsApp

# AWS S3 (Image Upload)
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=stepkicks-images
NEXT_PUBLIC_CLOUDFRONT_URL=https://dXXXXXXXXXXX.cloudfront.net

# Admin (seed initial admin)
ADMIN_EMAIL=admin@stepkicks.lk
ADMIN_PASSWORD=...
```

---

## 17. Deployment Strategy

### Recommended Stack

| Service | Usage | Cost |
|---------|-------|------|
| Vercel | Next.js hosting | Free tier / Pro |
| MongoDB Atlas | Database (M0 free cluster) | Free |
| AWS S3 + CloudFront | Image storage & global CDN | Pay-per-use (~free at low traffic) |
| Resend | Email service | Free 3k/month |
| Custom domain | stepkicks.lk | Paid |

### CI/CD Flow

```
GitHub (main branch) → Vercel Auto-Deploy → Production
GitHub (dev branch)  → Vercel Preview Deploy → Staging URL
```

### Performance Optimizations

- `next/image` for all images (automatic WebP, srcset)
- MongoDB connection pooling (singleton pattern)
- TanStack Query caching reduces redundant API calls
- ISR for homepage — rebuilt every 60s, not on every request
- Bundle analysis: `@next/bundle-analyzer`
- Font: `next/font` (no layout shift)

---

## 18. Development Phases

### Phase 1 — Foundation (Week 1-2)
- [ ] Project setup: Next.js + TypeScript + Tailwind + shadcn/ui
- [ ] MongoDB models (Product, Order, User, Banner, Testimonial)
- [ ] NextAuth with role-based access
- [ ] Basic API routes (products CRUD, auth)
- [ ] Middleware for admin protection

### Phase 2 — Public Store (Week 3-4)
- [ ] Home page (hero, featured, promo sections)
- [ ] Product listing page with filters + pagination
- [ ] Product detail page (gallery, size/color selector)
- [ ] WhatsApp buy flow + order creation
- [ ] About & Contact pages
- [ ] Dark/light mode toggle
- [ ] Mobile responsiveness

### Phase 3 — Admin Panel (Week 5-6)
- [ ] Admin dashboard (stats, recent orders)
- [ ] Product management (add/edit/delete, image upload)
- [ ] Order list + status management
- [ ] Banner management
- [ ] Staff management
- [ ] Testimonial management

### Phase 4 — Integrations (Week 7)
- [ ] Resend email integration (all templates)
- [ ] WhatsApp message builder polish
- [ ] Image upload (AWS S3 presigned URLs + drag-drop UI)
- [ ] SEO implementation (metadata, sitemap, structured data)
- [ ] Newsletter signup

### Phase 5 — Polish & Launch (Week 8)
- [ ] Animations (Framer Motion) on hero, cards, transitions
- [ ] Performance audit (Lighthouse 90+)
- [ ] Mobile testing (real devices)
- [ ] Cross-browser testing
- [ ] Security review (API auth, rate limiting)
- [ ] Final deployment to Vercel + custom domain

---

## Quick Start Commands

```bash
# Clone & install
git clone https://github.com/your-org/stepkicks.git
cd stepkicks
npm install

# Setup shadcn/ui
npx shadcn@latest init

# Install key dependencies
npm install @tanstack/react-query zustand next-themes
npm install mongoose @auth/mongoose-adapter next-auth@beta
npm install resend react-hook-form @hookform/resolvers zod
npm install framer-motion @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm install @tanstack/react-query-devtoolsa

# Run dev server
npm run dev

# Seed initial admin user
npm run seed:admin
```

---

*Document Version: 1.0 | Last Updated: 2026 | Project: StepKicks E-Commerce*