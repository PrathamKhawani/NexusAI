import { Helmet } from "react-helmet-async";

/**
 * SEOHead — Comprehensive SEO + AI SEO component for NovaAI
 * Injects: title, meta description, keywords, OG, Twitter Cards,
 * JSON-LD structured data (WebApplication / Article / BreadcrumbList)
 */
const SEOHead = ({
    title,
    description,
    keywords = [],
    ogImage = "/og-cover.png",
    canonicalPath = "",
    pageType = "website",        // "website" | "article" | "software"
    articleData = null,          // { author, publishedTime, modifiedTime, section, tags }
    breadcrumbs = [],            // [{ name, url }]
    noIndex = false,
}) => {
    const SITE_NAME = "NovaAI";
    const SITE_URL = "https://novaai.app";
    const FULL_TITLE = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — The Neural Intelligence Hub`;
    const CANONICAL = `${SITE_URL}${canonicalPath}`;
    const OG_IMAGE = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;

    const DEFAULT_KEYWORDS = [
        "AI tools", "artificial intelligence", "machine learning", "LLM",
        "GPT", "AI news", "AI directory", "neural networks", "deep learning",
        "AI platform", "tech intelligence", "NovaAI"
    ];
    const allKeywords = [...DEFAULT_KEYWORDS, ...keywords].join(", ");

    // JSON-LD: WebApplication schema
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": SITE_NAME,
        "url": SITE_URL,
        "description": "NovaAI is an AI-native intelligence platform for discovering cutting-edge AI tools, reading the latest tech news, and tracking your AI learning journey.",
        "applicationCategory": "TechnologyApplication",
        "operatingSystem": "Web Browser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "url": SITE_URL,
            "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo192.png` }
        }
    };

    // JSON-LD: Article schema (for news pages)
    const articleSchema = articleData ? {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": OG_IMAGE,
        "author": { "@type": "Person", "name": articleData.author || SITE_NAME },
        "publisher": {
            "@type": "Organization", "name": SITE_NAME,
            "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo192.png` }
        },
        "datePublished": articleData.publishedTime,
        "dateModified": articleData.modifiedTime || articleData.publishedTime,
        "articleSection": articleData.section || "AI News",
        "keywords": (articleData.tags || []).join(", "),
        "url": CANONICAL,
        "mainEntityOfPage": { "@type": "WebPage", "@id": CANONICAL }
    } : null;

    // JSON-LD: BreadcrumbList
    const breadcrumbSchema = breadcrumbs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": crumb.name,
            "item": `${SITE_URL}${crumb.url}`
        }))
    } : null;

    // JSON-LD: FAQ schema for landing page
    const faqSchema = pageType === "faq" ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is NovaAI?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "NovaAI is an AI-native intelligence platform for discovering the latest AI tools, reading curated AI and tech news, and tracking your learning journey with XP and streaks."
                }
            },
            {
                "@type": "Question",
                "name": "Is NovaAI free to use?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, NovaAI is completely free to sign up and use. You can browse AI tools, read tech news, and save bookmarks without any cost."
                }
            },
            {
                "@type": "Question",
                "name": "How does the AI tools directory work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our AI tools directory curates the best AI tools across categories like LLMs, image generation, coding assistants, voice AI, and productivity tools. Users can upvote, rate, and review tools."
                }
            }
        ]
    } : null;

    return (
        <Helmet>
            {/* Core */}
            <html lang="en" />
            <title>{FULL_TITLE}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={allKeywords} />
            <link rel="canonical" href={CANONICAL} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            {!noIndex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}

            {/* Open Graph */}
            <meta property="og:type" content={pageType} />
            <meta property="og:title" content={FULL_TITLE} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={CANONICAL} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:image" content={OG_IMAGE} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={`${SITE_NAME} — ${title}`} />
            <meta property="og:locale" content="en_US" />

            {/* Article OG tags */}
            {articleData && <meta property="article:author" content={articleData.author || SITE_NAME} />}
            {articleData?.publishedTime && <meta property="article:published_time" content={articleData.publishedTime} />}
            {articleData?.section && <meta property="article:section" content={articleData.section} />}
            {articleData?.tags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={FULL_TITLE} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={OG_IMAGE} />
            <meta name="twitter:image:alt" content={`${SITE_NAME} — ${title}`} />

            {/* AI SEO / LLM-friendly meta */}
            <meta name="application-name" content={SITE_NAME} />
            <meta name="generator" content="NovaAI v2.0" />
            <meta name="theme-color" content="#00f5ff" />
            <meta name="color-scheme" content="dark" />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
            {articleSchema && <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>}
            {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
            {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
        </Helmet>
    );
};

export default SEOHead;
