"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                toast.error("Failed to load parts catalog.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
        <div className="container mx-auto px-4 py-24 min-h-screen bg-surface-50">
            <div className="mb-20">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-brand-600 font-black uppercase tracking-[0.3em] text-xs mb-4"
                >
                    <Target size={14} />
                    <span>Apex Performance Parts</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl md:text-8xl font-outfit font-black tracking-tighter mb-6 text-surface-950 uppercase leading-[0.85]"
                >
                    AUTO <span className="text-brand-600">CATALOG</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-surface-500 max-w-3xl text-xl font-medium leading-relaxed"
                >
                    Browse our full range of precision-calibrated components, from high-tensile brakes to high-performance filters.
                </motion.p>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-32 rounded-[3rem] border-2 border-dashed border-surface-200 bg-white/50">
                    <Box className="w-20 h-20 text-surface-200 mx-auto mb-6" />
                    <p className="text-surface-400 font-black text-2xl uppercase tracking-widest">Inventory Currently Empty</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.05 }}
                            className="apex-card group"
                        >
                            <Link href={`/products/${product.id}`} className="block relative h-80 overflow-hidden shrink-0 bg-surface-100">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute top-6 right-6 z-20 bg-surface-950 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    {product.category?.name || 'General'}
                                </div>
                            </Link>

                            <div className="p-10 flex flex-col flex-1">
                                <Link href={`/products/${product.id}`}>
                                    <h2 className="text-2xl font-black font-outfit text-surface-950 mb-4 line-clamp-2 group-hover:text-brand-600 transition-colors uppercase tracking-tight">
                                        {product.name}
                                    </h2>
                                </Link>
                                <p className="text-surface-500 font-medium text-base mb-10 flex-1 line-clamp-3 leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-8 border-t border-surface-100">
                                    <PriceDisplay amount={product.price} className="font-outfit text-4xl font-black text-surface-950" />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addItem(product);
                                            toast.success(`${product.name} added to cart!`, {
                                                description: "Check your cart to complete your order.",
                                                icon: <ShoppingCart size={16} />
                                            });
                                        }}
                                        className="w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-brand-600/20 active:scale-90"
                                    >
                                        <ShoppingCart size={24} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
