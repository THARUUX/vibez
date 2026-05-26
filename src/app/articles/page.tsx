import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { BookOpen, User, Calendar, ArrowRight, FileText } from "lucide-react";

export const revalidate = 60; // Revalidate every minute for highly dynamic caching

export const metadata: Metadata = {
    title: "VibeZ Articles | Anime & K-pop Prints Collector Guides",
    description: "Read official VibeZ guides, premium printing tutorials, anime wall decor ideas, and K-pop collector trends to level up your setup.",
    keywords: ["anime blog", "k-pop updates", "collector guides", "room aesthetic", "wall prints tips", "vibez blog"],
    openGraph: {
        title: "VibeZ Articles | Anime & K-pop Prints Collector Guides",
        description: "Official guides, premium printing tutorials, anime wall decor ideas, and K-pop collector trends from VibeZ.",
        type: "website",
        url: "https://vibez.lk/articles",
    }
};

export default async function ArticlesCatalog() {
    // SSR directly from Prisma for indexing
    const articles = await prisma.article.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="pt-32 pb-24 min-h-screen bg-surface-50 font-outfit">
            {/* Header section */}
            <div className="relative overflow-hidden mb-16 bg-white border-b border-surface-200 py-16">
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-5"
                    style={{
                        background: "radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 70%)",
                        transform: "translate(20%, -30%)",
                        filter: "blur(60px)"
                    }}
                />
                
                <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-3xl">
                    <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.25em] bg-brand-50 px-4 py-1.5 rounded-full border border-brand-100/50 inline-block mb-4">
                        Insights & Inspiration
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-surface-950 uppercase tracking-tight mb-4">
                        THE VIBEZ <span className="text-brand-600">JOURNAL</span>
                    </h1>
                    <p className="text-surface-500 font-medium text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                        Explore styling guides, wall art inspiration, anime recommendations, and exclusive behind-the-scenes content from our team.
                    </p>
                </div>
            </div>

            {/* Articles Grid */}
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                {articles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <FileText className="w-16 h-16 text-surface-300 mb-4" />
                        <h3 className="text-xl font-black text-surface-900 uppercase tracking-tight mb-2">No Articles Yet</h3>
                        <p className="text-surface-500 max-w-sm">We are actively preparing curated guides and styling recommendations. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <Link 
                                key={article.id} 
                                href={`/articles/${article.slug}`}
                                className="group bg-white rounded-3xl border border-surface-200 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-brand-600/5 hover:-translate-y-1.5"
                            >
                                {/* Hero Image */}
                                <div className="relative aspect-[16/10] overflow-hidden bg-surface-100">
                                    {article.image ? (
                                        <Image 
                                            src={article.image} 
                                            alt={article.title} 
                                            fill 
                                            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-surface-100">
                                            <FileText size={24} className="text-surface-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                                        {article.tags ? (
                                            article.tags.split(",").slice(0, 2).map((t, idx) => (
                                                <span key={idx} className="font-black text-[8px] uppercase tracking-widest bg-white/95 backdrop-blur-sm text-surface-950 px-2.5 py-1 rounded-full border border-surface-100 shadow-sm">
                                                    {t.trim()}
                                                </span>
                                            ))
                                        ) : null}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-3">
                                        {/* Meta row */}
                                        <div className="flex items-center gap-3 text-[10px] font-black text-surface-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={11} />
                                                {new Date(article.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </span>
                                            <span className="text-surface-300">•</span>
                                            <span className="flex items-center gap-1.5">
                                                <BookOpen size={11} />
                                                {article.readingTime} MIN READ
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-xl font-black text-surface-950 uppercase tracking-tight leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
                                            {article.title}
                                        </h2>

                                        {/* Excerpt */}
                                        <p className="text-surface-500 font-medium text-sm leading-relaxed line-clamp-3">
                                            {article.excerpt}
                                        </p>
                                    </div>

                                    {/* Action link */}
                                    <div className="pt-2 border-t border-surface-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold text-surface-600">
                                            <User size={12} className="text-surface-400" />
                                            <span>{article.authorName}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-brand-600 group-hover:gap-2 transition-all">
                                            <span>Read Article</span>
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
