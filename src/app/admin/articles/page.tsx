/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Trash2,
    Search,
    Loader2,
    FileText,
    Edit,
    BookOpen,
    User,
    Calendar,
    Globe,
    AlertCircle,
    CheckCircle2,
    Tag,
    X,
    Eye
} from "lucide-react";
import Image from "next/image";
import { alerts } from "@/lib/alerts";

const m = motion as any;

interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image: string;
    published: boolean;
    readingTime: number;
    authorName: string;
    metaTitle: string | null;
    metaDescription: string | null;
    tags: string | null;
    createdAt: string;
    updatedAt: string;
}

export default function AdminArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
    const [isIdling, setIsIdling] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);

    // Form Fields
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [image, setImage] = useState("");
    const [published, setPublished] = useState(false);
    const [readingTime, setReadingTime] = useState(5);
    const [authorName, setAuthorName] = useState("VibeZ Team");
    const [tags, setTags] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    
    // Helper to edit slug directly
    const [isCustomSlug, setIsCustomSlug] = useState(false);

    // Sync slug automatically with title when not customization locked
    useEffect(() => {
        if (!isCustomSlug && !editingArticle) {
            const formatted = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            setSlug(formatted);
        }
    }, [title, isCustomSlug, editingArticle]);

    // Set SEO defaults based on title/excerpt if empty
    useEffect(() => {
        if (!metaTitle && title) {
            setMetaTitle(`${title} | VibeZ`);
        }
    }, [title, metaTitle]);

    useEffect(() => {
        if (!metaDescription && excerpt) {
            setMetaDescription(excerpt.substring(0, 160));
        }
    }, [excerpt, metaDescription]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/articles");
            if (res.ok) {
                const data = await res.json();
                setArticles(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Failed to load articles:", error);
            alerts.error("Data Fetch Error", "Could not synchronize with articles database.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Safety resets
    useEffect(() => {
        setCurrentPage(1);
        setSelectedArticleIds([]);
    }, [searchTerm]);

    const handleOpenModal = (article: Article | null = null) => {
        if (article) {
            setEditingArticle(article);
            setTitle(article.title);
            setSlug(article.slug);
            setContent(article.content);
            setExcerpt(article.excerpt);
            setImage(article.image);
            setPublished(article.published);
            setReadingTime(article.readingTime);
            setAuthorName(article.authorName);
            setTags(article.tags || "");
            setMetaTitle(article.metaTitle || "");
            setMetaDescription(article.metaDescription || "");
            setIsCustomSlug(true);
        } else {
            setEditingArticle(null);
            setTitle("");
            setSlug("");
            setContent("");
            setExcerpt("");
            setImage("");
            setPublished(false);
            setReadingTime(5);
            setAuthorName("VibeZ Team");
            setTags("");
            setMetaTitle("");
            setMetaDescription("");
            setIsCustomSlug(false);
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            alerts.error("Form Validation", "Article title is required.");
            return;
        }
        if (!content.trim()) {
            alerts.error("Form Validation", "Article content is required.");
            return;
        }

        setIsIdling(true);
        const payload = {
            title,
            slug,
            content,
            excerpt,
            image,
            published,
            readingTime,
            authorName,
            tags,
            metaTitle,
            metaDescription
        };

        try {
            const url = editingArticle ? `/api/articles/${editingArticle.id}` : "/api/articles";
            const method = editingArticle ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alerts.success(
                    editingArticle ? "Article Updated" : "Article Created",
                    editingArticle ? "Changes have been successfully saved." : "Your new article is ready."
                );
                setIsModalOpen(false);
                fetchData();
            } else {
                const data = await res.json();
                alerts.error("Operation Failed", data.error || "Could not publish the article.");
            }
        } catch (error) {
            console.error("Save error:", error);
            alerts.error("Server Link Failed", "Lost communication with inventory servers.");
        } finally {
            setIsIdling(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = await alerts.confirm(
            "Purge Article?",
            "This will permanently delete this article, its text contents, and remove it from search listings."
        );
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
            if (res.ok) {
                setArticles(prev => prev.filter(a => a.id !== id));
                alerts.success("Article Deleted", "The article was permanently deleted.");
            } else {
                alerts.error("Purge Failed", "Could not remove the article.");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            alerts.error("Decommission Failed", "The server rejected the delete command.");
        }
    };

    const handleBulkDelete = async () => {
        if (selectedArticleIds.length === 0) return;

        const confirmed = await alerts.confirm(
            `Delete ${selectedArticleIds.length} Articles?`,
            `This will permanently erase the ${selectedArticleIds.length} selected articles from the public website and administrative records.`
        );
        if (!confirmed) return;

        setIsIdling(true);
        try {
            const res = await fetch("/api/articles/bulk", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedArticleIds })
            });

            if (res.ok) {
                const data = await res.json();
                alerts.success(
                    "Bulk Purge Completed",
                    `Successfully deleted ${data.count || selectedArticleIds.length} articles from search listings.`
                );
                setSelectedArticleIds([]);
                fetchData();
            } else {
                const data = await res.json();
                alerts.error("Bulk Delete Failed", data.error || "The bulk operation could not be completed.");
            }
        } catch (error) {
            console.error("Bulk delete failed:", error);
            alerts.error("Decommission Failed", "The server did not respond correctly to the bulk request.");
        } finally {
            setIsIdling(false);
        }
    };

    // Filter and Paginate
    const filteredArticles = articles.filter(a => {
        const query = searchTerm.toLowerCase();
        return (
            a.title.toLowerCase().includes(query) ||
            a.excerpt.toLowerCase().includes(query) ||
            (a.authorName && a.authorName.toLowerCase().includes(query)) ||
            (a.tags && a.tags.toLowerCase().includes(query))
        );
    });

    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Dynamic SEO Progress bars logic
    const getMetaTitleStatus = (len: number) => {
        if (len === 0) return { label: "Empty", color: "text-surface-400", bar: "bg-surface-200", pct: 0 };
        if (len < 40) return { label: "Too Short", color: "text-amber-500", bar: "bg-amber-400", pct: Math.min((len / 50) * 100, 80) };
        if (len <= 60) return { label: "Perfect Length", color: "text-emerald-500", bar: "bg-emerald-500", pct: 100 };
        return { label: "Too Long", color: "text-red-500", bar: "bg-red-500", pct: 100 };
    };

    const getMetaDescStatus = (len: number) => {
        if (len === 0) return { label: "Empty", color: "text-surface-400", bar: "bg-surface-200", pct: 0 };
        if (len < 120) return { label: "Too Short", color: "text-amber-500", bar: "bg-amber-400", pct: Math.min((len / 150) * 100, 80) };
        if (len <= 160) return { label: "Perfect Length", color: "text-emerald-500", bar: "bg-emerald-500", pct: 100 };
        return { label: "Too Long", color: "text-red-500", bar: "bg-red-500", pct: 100 };
    };

    const titleSEO = getMetaTitleStatus(metaTitle.length);
    const descSEO = getMetaDescStatus(metaDescription.length);

    return (
        <div className="max-w-7xl mx-auto space-y-8 font-outfit">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-surface-950 mb-2 uppercase">
                        SEO <span className="text-brand-600">ARTICLES</span>
                    </h1>
                    <p className="text-surface-500 font-medium">Manage blogs, announcements, collectibles guides, and Google SEO listings.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {selectedArticleIds.length > 0 && (
                        <m.button
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={handleBulkDelete}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-95 uppercase tracking-widest text-sm cursor-pointer border border-transparent"
                        >
                            <Trash2 size={20} />
                            <span>DELETE SELECTED ({selectedArticleIds.length})</span>
                        </m.button>
                    )}
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-brand-600/20 active:scale-95 uppercase tracking-widest text-sm cursor-pointer"
                    >
                        <Plus size={20} />
                        <span>WRITE ARTICLE</span>
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-surface-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Search articles, excerpts, tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-surface-50 border border-surface-200 focus:border-brand-500 text-surface-950 font-bold rounded-2xl outline-none transition-all placeholder:text-surface-400 font-outfit"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center text-xs font-black text-surface-400 uppercase tracking-wider">
                    <span>{filteredArticles.length} matching articles</span>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-[2.5rem] border border-surface-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                            <FileText className="w-16 h-16 text-surface-300 mb-4" />
                            <h3 className="text-xl font-black text-surface-950 uppercase tracking-tight mb-2">No Articles Written</h3>
                            <p className="text-surface-500 max-w-sm mb-6">Create high-quality, keyword-rich articles to build domain authority and engage customers.</p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl transition-all shadow-md uppercase tracking-wider text-xs active:scale-95 cursor-pointer"
                            >
                                Write Your First Article
                            </button>
                        </div>
                    ) : filteredArticles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                            <AlertCircle className="w-12 h-12 text-surface-300 mb-4" />
                            <h3 className="text-lg font-black text-surface-950 uppercase tracking-tight mb-2">No Search Matches</h3>
                            <p className="text-surface-500 max-w-sm">No articles matched your criteria. Try adjusting your spelling or searching for tags.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-50/50 border-b border-surface-200 text-surface-500 font-black text-[10px] uppercase tracking-[0.2em]">
                                    <th className="py-6 px-8 w-12">
                                        <input
                                            type="checkbox"
                                            checked={filteredArticles.length > 0 && filteredArticles.every(a => selectedArticleIds.includes(a.id))}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedArticleIds(filteredArticles.map(a => a.id));
                                                } else {
                                                    setSelectedArticleIds([]);
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500 cursor-pointer accent-brand-600"
                                        />
                                    </th>
                                    <th className="py-6 px-8">Article Title</th>
                                    <th className="py-6 px-8">Author</th>
                                    <th className="py-6 px-8">Reading Time</th>
                                    <th className="py-6 px-8">Tags</th>
                                    <th className="py-6 px-8">Status</th>
                                    <th className="py-6 px-8 text-right font-black">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {paginatedArticles.map((article, i) => (
                                    <m.tr
                                        key={article.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-surface-50/50 transition-colors group"
                                    >
                                        <td className="py-5 px-8 w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectedArticleIds.includes(article.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedArticleIds([...selectedArticleIds, article.id]);
                                                    } else {
                                                        setSelectedArticleIds(selectedArticleIds.filter(id => id !== article.id));
                                                    }
                                                }}
                                                className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500 cursor-pointer accent-brand-600"
                                            />
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-16 h-12 rounded-xl overflow-hidden border border-surface-200 bg-surface-50">
                                                    {article.image ? (
                                                        <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-surface-100">
                                                            <FileText size={18} className="text-surface-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="max-w-md">
                                                    <div className="font-black text-surface-950 group-hover:text-brand-600 transition-colors uppercase tracking-tight line-clamp-1">{article.title}</div>
                                                    <div className="text-[10px] font-black text-surface-400 uppercase tracking-widest flex items-center gap-2 mt-0.5">
                                                        <Calendar size={10} />
                                                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                                                        <span className="text-surface-300">•</span>
                                                        <Globe size={10} />
                                                        <span className="line-clamp-1">/{article.slug}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 font-bold text-surface-700 text-sm">
                                            <div className="flex items-center gap-1.5">
                                                <User size={14} className="text-surface-400" />
                                                <span>{article.authorName}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 font-black text-surface-950 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <BookOpen size={14} className="text-brand-600" />
                                                <span>{article.readingTime} MINS</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {article.tags ? (
                                                    article.tags.split(",").map((tag, idx) => (
                                                        <span key={idx} className="font-black text-[9px] uppercase tracking-widest bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-100">
                                                            {tag.trim()}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-surface-400 font-bold italic">No tags</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                                                article.published
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                                {article.published ? 'PUBLISHED' : 'DRAFT'}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(article)}
                                                    className="p-3 bg-surface-50 border border-surface-200 hover:border-brand-500 hover:text-brand-600 rounded-xl transition-all active:scale-90 cursor-pointer text-surface-600"
                                                    title="Edit Article"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <a
                                                    href={`/articles/${article.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 bg-surface-50 border border-surface-200 hover:border-emerald-500 hover:text-emerald-600 rounded-xl transition-all active:scale-90 cursor-pointer text-surface-600"
                                                    title="Public Preview"
                                                >
                                                    <Eye size={16} />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    className="p-3 bg-surface-50 border border-surface-200 hover:border-red-500 hover:text-red-600 rounded-xl transition-all active:scale-90 cursor-pointer text-surface-600"
                                                    title="Delete Article"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </m.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="p-6 bg-surface-50/50 border-t border-surface-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs font-black text-surface-400 uppercase tracking-widest">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-surface-200 font-bold rounded-xl text-xs hover:bg-white transition-all disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-surface-200 font-bold rounded-xl text-xs hover:bg-white transition-all disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Slide-over Form Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        {/* Overlay */}
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black"
                        />

                        {/* Modal Container */}
                        <m.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 180 }}
                            className="relative w-full max-w-4xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col font-outfit"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-surface-200 flex items-center justify-between sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-surface-950 uppercase tracking-tight">
                                        {editingArticle ? "Edit Article" : "Write Article"}
                                    </h2>
                                    <p className="text-xs text-surface-500 font-medium">Compose high SEO impact pages to target strategic customer keywords.</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 hover:bg-surface-100 rounded-xl text-surface-500 hover:text-surface-950 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleSave} className="flex-1 p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Primary Info column */}
                                    <div className="space-y-5">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 pb-2 border-b border-surface-100">Article Outline</h3>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-wider text-surface-500">Article Title</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. 10 Anime Posters You Need For Your Dorm Room"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 focus:border-brand-500 text-surface-950 font-bold rounded-xl outline-none transition-all placeholder:text-surface-400 text-sm"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-black uppercase tracking-wider text-surface-500">URL Slug</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCustomSlug(!isCustomSlug)}
                                                    className="text-[10px] font-black uppercase tracking-widest text-brand-600 hover:underline"
                                                >
                                                    {isCustomSlug ? "Auto sync slug" : "Customize URL"}
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-xs font-bold font-mono">/articles/</span>
                                                <input
                                                    type="text"
                                                    required
                                                    disabled={!isCustomSlug}
                                                    value={slug}
                                                    onChange={(e) => setSlug(e.target.value)}
                                                    className="w-full pl-24 pr-4 py-3 bg-surface-50 border border-surface-200 focus:border-brand-500 disabled:opacity-75 text-surface-950 font-bold rounded-xl outline-none transition-all text-sm font-mono"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-wider text-surface-500">Main Hero Image URL</label>
                                            <input
                                                type="text"
                                                placeholder="https://images.unsplash.com/photo..."
                                                value={image}
                                                onChange={(e) => setImage(e.target.value)}
                                                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 focus:border-brand-500 text-surface-950 font-bold rounded-xl outline-none transition-all placeholder:text-surface-400 text-sm"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-wider text-surface-500">Author Name</label>
                                                <input
                                                    type="text"
                                                    value={authorName}
                                                    onChange={(e) => setAuthorName(e.target.value)}
                                                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 focus:border-brand-500 text-surface-950 font-bold rounded-xl outline-none transition-all placeholder:text-surface-400 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-wider text-surface-500">Read Time (Mins)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={readingTime}
                                                    onChange={(e) => setReadingTime(parseInt(e.target.value) || 5)}
                                                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 focus:border-brand-500 text-surface-950 font-bold rounded-xl outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-wider text-surface-500 font-outfit flex items-center gap-1">
                                                <Tag size={12} />
                                                <span>Tags (comma-separated)</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Anime, Prints, Collectibles, Guide"
                                                value={tags}
                                                onChange={(e) => setTags(e.target.value)}
                                                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 focus:border-brand-500 text-surface-950 font-bold rounded-xl outline-none transition-all placeholder:text-surface-400 text-sm"
                                            />
                                        </div>

                                        <div className="p-4 bg-surface-50 border border-surface-200 rounded-xl flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-black uppercase tracking-tight text-surface-900">Publish Article</div>
                                                <p className="text-[10px] text-surface-500 font-bold uppercase tracking-wider">Make it publicly accessible on the blog listings</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={published}
                                                    onChange={(e) => setPublished(e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Content & SEO preview column */}
                                    <div className="space-y-5">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-600 pb-2 border-b border-surface-100">SEO & Snippet Performance</h3>

                                        {/* Google Search Snippet Preview Box */}
                                        <div className="p-5 bg-white border border-surface-200 shadow-sm rounded-2xl space-y-3">
                                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-surface-400">
                                                <span>Google Search Snippet Preview</span>
                                                <span className="text-emerald-500 font-bold flex items-center gap-1">
                                                    <CheckCircle2 size={10} /> SEO Live
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[11px] text-surface-400 font-medium font-mono truncate">
                                                    https://vibez.lk/articles/<span className="font-bold text-surface-600">{slug || "slug"}</span>
                                                </div>
                                                <div className="text-lg text-[#1a0dab] font-medium leading-tight line-clamp-1 hover:underline cursor-pointer">
                                                    {metaTitle || (title ? `${title} | VibeZ` : "VibeZ Article Title - Premium Prints & Anime Guides")}
                                                </div>
                                                <div className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                                                    {metaDescription || "Provide an SEO meta description snippet below to outline what visitors discover upon opening this article."}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-black uppercase tracking-wider text-surface-500">Meta Title</label>
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${titleSEO.color}`}>
                                                    {metaTitle.length} / 60 CHARS ({titleSEO.label})
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="e.g. Top 10 Best Anime Poster Themes For Your Bedroom | VibeZ"
                                                value={metaTitle}
                                                onChange={(e) => setMetaTitle(e.target.value)}
                                                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 focus:border-brand-500 text-surface-950 font-bold rounded-xl outline-none transition-all placeholder:text-surface-400 text-sm"
                                            />
                                            <div className="w-full h-1.5 bg-surface-150 rounded-full overflow-hidden mt-1">
                                                <div className={`h-full ${titleSEO.bar} transition-all duration-300`} style={{ width: `${titleSEO.pct}%` }} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-black uppercase tracking-wider text-surface-500">Meta Description</label>
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${descSEO.color}`}>
                                                    {metaDescription.length} / 160 CHARS ({descSEO.label})
                                                </span>
                                            </div>
                                            <textarea
                                                placeholder="e.g. Check out our curated list of the top 10 best premium high-gloss anime print posters perfect for bedroom decoration. Secure next-day delivery."
                                                value={metaDescription}
                                                onChange={(e) => setMetaDescription(e.target.value)}
                                                rows={2}
                                                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 focus:border-brand-500 text-surface-950 font-medium rounded-xl outline-none transition-all placeholder:text-surface-400 text-sm leading-relaxed resize-none"
                                            />
                                            <div className="w-full h-1.5 bg-surface-150 rounded-full overflow-hidden mt-1">
                                                <div className={`h-full ${descSEO.bar} transition-all duration-300`} style={{ width: `${descSEO.pct}%` }} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-wider text-surface-500">Excerpt / Snippet (Short Summary)</label>
                                            <textarea
                                                required
                                                placeholder="A brief high-level outline shown on card lists and summaries..."
                                                value={excerpt}
                                                onChange={(e) => setExcerpt(e.target.value)}
                                                rows={2}
                                                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 focus:border-brand-500 text-surface-950 font-medium rounded-xl outline-none transition-all placeholder:text-surface-400 text-sm leading-relaxed resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-surface-500">Article Content (Markdown or HTML Ready)</label>
                                    <textarea
                                        required
                                        placeholder="# The Core Content goes here..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={12}
                                        className="w-full px-4 py-4 bg-surface-50 border border-surface-200 focus:border-brand-500 text-surface-950 font-medium rounded-xl outline-none transition-all placeholder:text-surface-400 text-sm leading-relaxed"
                                    />
                                </div>

                                {/* Modal Actions */}
                                <div className="pt-6 border-t border-surface-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white z-10 pb-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 border border-surface-200 text-surface-700 font-black rounded-xl hover:bg-surface-50 transition-colors uppercase tracking-wider text-xs active:scale-95 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isIdling}
                                        className="px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-black rounded-xl transition-all shadow-md uppercase tracking-wider text-xs active:scale-95 cursor-pointer flex items-center gap-2"
                                    >
                                        {isIdling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                        <span>{editingArticle ? "Save Changes" : "Publish Article"}</span>
                                    </button>
                                </div>
                            </form>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
