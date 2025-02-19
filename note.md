# keep all renderings

### CSR - SSR SSG - (ISR => we have problem!)

# handle login auth

### "getStaticProps" is not supported in app/. Read more: https://nextjs.org/docs/app/building-your-application/data-fetching (yep)

### The Edge Runtime does not support Incremental Static Regeneration (ISR). => https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes

# ISR

### https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration

# export const dynamicParams = true // true | false,

### https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams

# export const runtime = "nodejs";

// 'nodejs' | 'edge'

# export const dynamic = "force-dynamic";

// 'auto' | 'force-dynamic' | 'error' | 'force-static'

"scripts": {
"dev": "next dev --turbopack",
"build": "next build",
"start": "next start",
"lint": "next lint"
},
