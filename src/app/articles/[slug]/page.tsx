import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { BookOpen, User, Calendar, ArrowLeft, Share2, Tag, Copy, Globe } from "lucide-react";

export const revalidate = 60; // Cache and revalidate every minute

interface Props {
    params: Promise<{ slug: string }>;
}

// 1. Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    
    const article = await prisma.article.findUnique({
        where: { slug }
    });

    if (!article || !article.published) {
        return {
            title: "Article Not Found | VibeZ",
            description: "The requested article could not be located in our archives."
        };
    }

    const title = article.metaTitle || `${article.title} | VibeZ Journal`;
    const description = article.metaDescription || article.excerpt;
    const url = `https://vibez.lk/articles/${article.slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            url,
            type: "article",
            publishedTime: article.createdAt.toISOString(),
            modifiedTime: article.updatedAt.toISOString(),
            authors: [article.authorName],
            images: [
                {
                    url: article.image || "https://vibez.lk/about-us.png",
                    width: 1200,
                    height: 630,
                    alt: article.title
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [article.image || "https://vibez.lk/about-us.png"]
        }
    };
}

export default async function ArticleReader({ params }: Props) {
    const { slug } = await params;

    const article = await prisma.article.findUnique({
        where: { slug }
    });

    if (!article || !article.published) {
        notFound();
    }

    // 2. Dynamic JSON-LD Structured Data Schema for Google Rich Snippets
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://vibez.lk/articles/${article.slug}`
        },
        "headline": article.title,
        "description": article.excerpt || article.metaDescription,
        "image": article.image || "https://vibez.lk/about-us.png",
        "datePublished": article.createdAt.toISOString(),
        "dateModified": article.updatedAt.toISOString(),
        "author": {
            "@type": "Person",
            "name": article.authorName,
            "url": "https://vibez.lk/about"
        },
        "publisher": {
            "@type": "Organization",
            "name": "VibeZ",
            "logo": {
                "@type": "ImageObject",
                "url": "https://vibez.lk/logo.png"
            }
        }
    };

    return (
        <div className="pt-32 pb-24 min-h-screen bg-surface-50 font-outfit">
            {/* Inject JSON-LD Schema directly in the HTML */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                {/* Back to Blog Button */}
                <Link 
                    href="/articles"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-surface-500 hover:text-brand-600 transition-colors mb-8 group cursor-pointer"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Articles</span>
                </Link>

                {/* Article Header block */}
                <div className="space-y-6 mb-10">
                    <div className="flex flex-wrap items-center gap-3">
                        {article.tags ? (
                            article.tags.split(",").map((t, idx) => (
                                <span key={idx} className="font-black text-[9px] uppercase tracking-widest bg-brand-50 text-brand-700 px-3 py-1 rounded-full border border-brand-100/50">
                                    {t.trim()}
                                </span>
                            ))
                        ) : null}
                        <span className="text-surface-300 font-bold">•</span>
                        <div className="flex items-center gap-1.5 text-xs font-black text-surface-400 uppercase tracking-widest">
                            <BookOpen size={13} className="text-brand-600" />
                            <span>{article.readingTime} MIN READ</span>
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-950 uppercase tracking-tight leading-tight">
                        {article.title}
                    </h1>

                    {/* Author & Info bar */}
                    <div className="pt-6 border-t border-surface-200 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-150 flex items-center justify-center font-black text-brand-600 text-sm uppercase">
                                {article.authorName.substring(0, 2)}
                            </div>
                            <div>
                                <div className="text-sm font-black text-surface-900">{article.authorName}</div>
                                <div className="text-[10px] font-black text-surface-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                    <Calendar size={10} />
                                    <span>
                                        Published on {new Date(article.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Hero Image */}
                {article.image && (
                    <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-surface-200 shadow-sm bg-surface-100 mb-12">
                        <Image 
                            src={article.image} 
                            alt={article.title} 
                            fill 
                            priority
                            sizes="(max-w-1200px) 100vw, 800px"
                            className="object-cover" 
                        />
                    </div>
                )}

                {/* Article Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Share / Tools Widget (Left Column for desktop) */}
                    <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-36 h-fit order-last lg:order-first">
                        <div className="p-5 bg-white border border-surface-200 rounded-2xl space-y-4">
                            <div className="text-[10px] font-black text-surface-400 uppercase tracking-[0.15em] border-b border-surface-100 pb-2">
                                Share Article
                            </div>
                            <div className="flex flex-row lg:flex-col gap-2.5">
                                <a 
                                    href={`https://twitter.com/intent/tweet?url=https://vibez.lk/articles/${article.slug}&text=${encodeURIComponent(article.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center lg:justify-start gap-2.5 px-4 py-2.5 bg-surface-50 hover:bg-brand-50 border border-surface-200 hover:border-brand-200 text-surface-700 hover:text-brand-600 font-bold rounded-xl transition-all text-xs cursor-pointer uppercase tracking-wider"
                                >
                                    <span>Twitter</span>
                                </a>
                                <a 
                                    href={`https://www.facebook.com/sharer/sharer.php?u=https://vibez.lk/articles/${article.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center lg:justify-start gap-2.5 px-4 py-2.5 bg-surface-50 hover:bg-brand-50 border border-surface-200 hover:border-brand-200 text-surface-700 hover:text-brand-600 font-bold rounded-xl transition-all text-xs cursor-pointer uppercase tracking-wider"
                                >
                                    <span>Facebook</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Content Area (Right Column) */}
                    <div className="lg:col-span-3">
                        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-surface-200 shadow-sm space-y-8">
                            {/* Excerpt Banner */}
                            {article.excerpt && (
                                <div className="p-5 bg-surface-50 border-l-4 border-brand-500 rounded-r-xl italic text-surface-600 text-base leading-relaxed font-medium">
                                    {article.excerpt}
                                </div>
                            )}

                            {/* Main Body Text Content */}
                            <div className="prose prose-surface max-w-none text-surface-800 text-base sm:text-lg leading-relaxed space-y-6 font-medium font-sans">
                                {article.content.split("\n\n").map((para, idx) => {
                                    const cleanPara = para.trim();
                                    if (!cleanPara) return null;

                                    // Simple markdown header formatting
                                    if (cleanPara.startsWith("# ")) {
                                        return (
                                            <h2 key={idx} className="text-2xl sm:text-3xl font-black text-surface-950 uppercase tracking-tight pt-4 pb-2 border-b border-surface-150 font-outfit">
                                                {cleanPara.replace("# ", "")}
                                            </h2>
                                        );
                                    }
                                    if (cleanPara.startsWith("## ")) {
                                        return (
                                            <h3 key={idx} className="text-xl sm:text-2xl font-black text-surface-950 uppercase tracking-tight pt-3 pb-1 font-outfit">
                                                {cleanPara.replace("## ", "")}
                                            </h3>
                                        );
                                    }
                                    if (cleanPara.startsWith("### ")) {
                                        return (
                                            <h4 key={idx} className="text-lg sm:text-xl font-black text-surface-950 uppercase tracking-tight pt-2 font-outfit">
                                                {cleanPara.replace("### ", "")}
                                            </h4>
                                        );
                                    }
                                    if (cleanPara.startsWith("- ") || cleanPara.startsWith("* ")) {
                                        return (
                                            <ul key={idx} className="list-disc pl-6 space-y-2">
                                                {cleanPara.split("\n").map((li, lIdx) => (
                                                    <li key={lIdx} className="text-surface-700 font-medium">
                                                        {li.replace(/^[-*]\s+/, "")}
                                                    </li>
                                                ))}
                                            </ul>
                                        );
                                    }

                                    return (
                                        <p key={idx} className="text-surface-700 font-medium text-base sm:text-lg whitespace-pre-line leading-relaxed">
                                            {cleanPara}
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
