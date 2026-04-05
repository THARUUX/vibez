"use client";

import { motion } from "framer-motion";
import { alerts } from "@/lib/alerts";
import { ShoppingCart, Loader2, Target, Box, Search, X, LayoutGrid, Grid3X3, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/common/PriceDisplay";

const m = motion as any;

function ProductsContent() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    // View Option & Pagination State
    const [viewMode, setViewMode] = useState<'grid' | 'small'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const categorySlug = searchParams.get('category');
    
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/categories')
                ]);
                
                const [prodData, catData] = await Promise.all([
                    prodRes.json(),
                    catRes.json()
                ]);

                if (Array.isArray(prodData)) setProducts(prodData);
                if (Array.isArray(catData)) setCategories(catData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                alerts.error("Failed to load catalog data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categorySlug]);

    const activeCategory = useMemo(() => {
        if (!categorySlug) return null;
        return categories.find(c => c.slug === categorySlug || c.id === categorySlug);
    }, [categories, categorySlug]);

    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Filter by Category (using slug or ID for fallback)
        if (categorySlug) {
            filtered = filtered.filter(p => 
                p.category?.slug === categorySlug || p.categoryId === categorySlug
            );
        }

        // Filter by Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query) ||
                p.category?.name?.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [products, searchQuery, categorySlug]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const clearFilters = () => {
        setSearchQuery("");
        router.push('/products');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-16 h-16 text-brand-600 animate-spin" />
                    <span className="font-black uppercase tracking-[0.3em] text-surface-400">Loading Catalog</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen bg-surface-50 font-outfit">
            <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                <div className="max-w-3xl">
                    <m.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-brand-600 font-black uppercase tracking-[0.3em] text-xs mb-4"
                    >
                        <Target size={14} />
                        <span>VibeZ Collections</span>
                    </m.div>
                    <m.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-surface-950 uppercase leading-[0.85]"
                    >
                        {activeCategory ? (
                            <>
                                {activeCategory.name.split(' ')[0]} <span className="text-brand-600">{activeCategory.name.split(' ').slice(1).join(' ') || 'COLLECTIONS'}</span>
                            </>
                        ) : (
                            <>OUR <span className="text-brand-600">COLLECTIONS</span></>
                        )}
                    </m.h1>
                    
                    <div className="flex flex-wrap gap-4 items-center">
                        <m.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-surface-500 max-w-xl text-xl font-medium leading-relaxed"
                        >
                            {activeCategory 
                                ? activeCategory.description 
                                : "Browse our full range of premium anime prints, K-pop merchandise, and exclusive collectors' editions."
                            }
                        </m.p>
                        
                        {activeCategory && (
                            <m.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-4 py-2 bg-surface-200 hover:bg-surface-300 text-surface-700 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                            >
                                <X size={14} />
                                <span>Clear Category</span>
                            </m.button>
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-96">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-brand-600 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search prints, collections or items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-surface-200 rounded-2xl pl-16 pr-8 py-5 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-600/5 transition-all font-bold text-surface-950 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-8 border-b border-surface-200 pb-4">
                <span className="text-surface-500 font-medium tracking-tight">
                    Showing <span className="font-black text-surface-950">{paginatedProducts.length}</span> of <span className="font-black text-surface-950">{filteredProducts.length}</span> items
                </span>
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-surface-200 uppercase text-[10px] font-black tracking-widest text-surface-300">
                    <span className="ml-2 mr-1">View</span>
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : 'text-surface-400 hover:text-surface-950'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button 
                        onClick={() => setViewMode('small')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'small' ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : 'text-surface-400 hover:text-surface-950'}`}
                    >
                        <Grid3X3 size={18} />
                    </button>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <m.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-32 rounded-[2.5rem] border-2 border-dashed border-surface-200 bg-white/50"
                >
                    <Box className="w-20 h-20 text-surface-200 mx-auto mb-6" />
                    <p className="text-surface-400 font-black text-2xl uppercase tracking-widest">No matching items found</p>
                    <button onClick={clearFilters} className="mt-6 text-brand-600 font-black uppercase tracking-widest text-sm hover:underline">Clear All Filters</button>
                </m.div>
            ) : (
                <>
                    <div className={viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" 
                        : "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
                    }>
                        {paginatedProducts.map((product, idx) => (
                            viewMode === 'grid' ? (
                                <m.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                                    className="vibez-card group shadow-brand-600/5 hover:shadow-brand-600/10"
                                >
                                    <Link href={`/products/${product.slug}`} className="relative h-96 overflow-hidden bg-surface-50 block">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-8 scale-100 group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-2xl"
                                        />
                                    </Link>

                                    <div className="p-10 relative bg-white flex flex-col flex-1">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="bg-brand-600 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">
                                                {product.category?.name || "Exclusive Pick"}
                                            </span>
                                            {product.tags && product.tags.split(',').map((tag: string) => (
                                                <span key={tag} className="bg-surface-50 text-surface-400 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-surface-100 italic transition-colors group-hover:border-brand-200">
                                                    #{tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                        <Link href={`/products/${product.slug}`}>
                                            <h2 className="text-3xl font-black text-surface-950 mb-3 leading-none group-hover:text-brand-600 transition-colors uppercase tracking-tighter line-clamp-2">
                                                {product.name}
                                            </h2>
                                        </Link>
                                        <p className="text-surface-400 text-sm mb-10 flex-1 line-clamp-2 font-medium leading-relaxed">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-8 border-t border-surface-50">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-surface-300 uppercase tracking-widest mb-1">Price</span>
                                                <PriceDisplay amount={product.price} className="text-3xl font-black text-surface-950" />
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addItem(product);
                                                    alerts.toast(`${product.name} added to cart!`);
                                                }}
                                                className="w-16 h-16 bg-surface-950 hover:bg-brand-600 text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl active:scale-90"
                                            >
                                                <ShoppingCart size={28} />
                                            </button>
                                        </div>
                                    </div>
                                </m.div>
                            ) : (
                                <m.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: idx * 0.02 }}
                                    className="vibez-card group shadow-sm hover:shadow-brand-600/10 p-2 flex flex-col"
                                >
                                    <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-surface-50 rounded-2xl block mb-3">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4 scale-100 group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </Link>
                                    <div className="px-2 pb-2 flex-1 flex flex-col">
                                        <Link href={`/products/${product.slug}`}>
                                            <h3 className="text-xs font-black text-surface-950 mb-1 line-clamp-2 uppercase tracking-tight group-hover:text-brand-600 transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <div className="mt-auto flex justify-between items-end pt-2">
                                            <PriceDisplay amount={product.price} className="text-sm font-black text-surface-950" />
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addItem(product);
                                                    alerts.toast(`${product.name} added!`);
                                                }}
                                                className="w-8 h-8 bg-surface-100 hover:bg-brand-600 text-surface-950 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                                            >
                                                <ShoppingCart size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </m.div>
                            )
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-20">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-12 h-12 bg-white border border-surface-200 rounded-xl flex items-center justify-center text-surface-600 hover:border-brand-600 hover:text-brand-600 disabled:opacity-50 disabled:hover:border-surface-200 disabled:hover:text-surface-600 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            
                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-12 h-12 rounded-xl font-bold transition-all ${
                                            currentPage === i + 1 
                                            ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' 
                                            : 'bg-white border border-surface-200 text-surface-600 hover:border-brand-600 hover:text-brand-600'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="w-12 h-12 bg-white border border-surface-200 rounded-xl flex items-center justify-center text-surface-600 hover:border-brand-600 hover:text-brand-600 disabled:opacity-50 disabled:hover:border-surface-200 disabled:hover:text-surface-600 transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <Loader2 className="w-16 h-16 text-brand-600 animate-spin" />
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
