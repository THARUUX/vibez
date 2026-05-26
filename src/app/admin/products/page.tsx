/* eslint-disable */
"use client"

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Search, X, Save, Loader2, Globe, Box, Tag, DollarSign, Image as ImageIcon, Copy, ChevronLeft, ChevronRight, FileSpreadsheet, UploadCloud, AlertTriangle, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { alerts } from "@/lib/alerts";
import { CustomSelect, SelectOption } from "@/components/common/CustomSelect";

const m = motion as any;

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    
    const [isIdling, setIsIdling] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Bulk Importer States
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [parsedProducts, setParsedProducts] = useState<any[]>([]);
    const [importLoading, setImportLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price: 0,
        image: "",
        stock: 0,
        weight: 0,
        sku: "",
        categoryId: "",
        metaTitle: "",
        metaDescription: "",
        warranty: "",
        hasWarranty: true,
        delivery: "",
        hasDelivery: true,
        returns: "",
        hasReturns: true,
        terms: "",
        tags: ""
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/categories')
            ]);
            const [prodData, catData] = await Promise.all([prodRes.json(), catRes.json()]);
            if (Array.isArray(prodData)) setProducts(prodData);
            if (Array.isArray(catData)) setCategories(catData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            alerts.error("Sync Failure", "Could not retrieve the latest inventory records.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        setSelectedProductIds([]);
    }, [searchTerm, filterCategory]);

    const handleOpenModal = (product: any = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                slug: product.slug,
                description: product.description,
                price: parseFloat(product.price),
                image: product.image,
                stock: product.stock,
                weight: product.weight || 0,
                sku: product.sku || "",
                categoryId: product.categoryId,
                metaTitle: product.metaTitle || "",
                metaDescription: product.metaDescription || "",
                warranty: product.warranty || "",
                hasWarranty: product.hasWarranty ?? true,
                delivery: product.delivery || "",
                hasDelivery: product.hasDelivery ?? true,
                returns: product.returns || "",
                hasReturns: product.hasReturns ?? true,
                terms: product.terms || "",
                tags: product.tags || ""
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: "",
                slug: "",
                description: "",
                price: 0,
                image: "",
                stock: 0,
                weight: 0,
                sku: "",
                categoryId: Array.isArray(categories) && categories.length > 0 ? categories[0].id : "",
                metaTitle: "",
                metaDescription: "",
                warranty: "",
                hasWarranty: true,
                delivery: "",
                hasDelivery: true,
                returns: "",
                hasReturns: true,
                terms: "",
                tags: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleCopyProduct = (product: any) => {
        setEditingProduct(null);
        setFormData({
            name: `${product.name} (Copy)`,
            slug: "", // Will be auto-generated
            description: product.description,
            price: parseFloat(product.price),
            image: product.image,
            stock: product.stock,
            weight: product.weight || 0,
            sku: "", // Reset SKU
            categoryId: product.categoryId,
            metaTitle: product.metaTitle || "",
            metaDescription: product.metaDescription || "",
            warranty: product.warranty || "",
            hasWarranty: product.hasWarranty ?? true,
            delivery: product.delivery || "",
            hasDelivery: product.hasDelivery ?? true,
            returns: product.returns || "",
            hasReturns: product.hasReturns ?? true,
            terms: product.terms || "",
            tags: product.tags || ""
        });
        setIsModalOpen(true);
    };

    // Bulk Importer Client-Side CSV Parsing Logic
    const handleCSVParse = (text: string) => {
        const lines: string[] = [];
        let currentLine = "";
        let inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === '\n' && !inQuotes) {
                lines.push(currentLine.trim());
                currentLine = "";
                continue;
            }
            currentLine += char;
        }
        if (currentLine.trim()) lines.push(currentLine.trim());

        if (lines.length === 0) {
            alerts.error("Empty File", "The uploaded CSV file contains no readable content.");
            return;
        }

        const parseRow = (rowText: string) => {
            const result = [];
            let cell = "";
            let insideQuotes = false;
            for (let i = 0; i < rowText.length; i++) {
                const char = rowText[i];
                if (char === '"') {
                    insideQuotes = !insideQuotes;
                } else if (char === ',' && !insideQuotes) {
                    result.push(cell.trim());
                    cell = "";
                    continue;
                } else {
                    cell += char;
                }
            }
            result.push(cell.trim());
            return result;
        };

        const rawHeaders = parseRow(lines[0]);
        const headers = rawHeaders.map(h => 
            h.toLowerCase()
             .trim()
             .replace(/[^a-z0-9]/g, '')
        );

        const expectedHeaders = ['name', 'price', 'stock', 'image', 'description', 'category'];
        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));

        if (missingHeaders.length > 0) {
            alerts.error(
                "Header Mismatch",
                `Missing required columns: ${missingHeaders.map(h => `"${h.toUpperCase()}"`).join(', ')}. Please use the downloadable template.`
            );
            return;
        }

        const items: any[] = [];
        for (let idx = 1; idx < lines.length; idx++) {
            const rowText = lines[idx];
            if (!rowText || rowText.trim() === '') continue;
            
            const row = parseRow(rowText);
            if (row.length === 0 || (row.length === 1 && row[0] === '')) continue;
            
            const obj: any = {};
            headers.forEach((header, colIdx) => {
                if (colIdx < row.length) {
                    obj[header] = row[colIdx];
                } else {
                    obj[header] = '';
                }
            });

            const name = obj.name || '';
            const rawPrice = obj.price || '0';
            const price = parseFloat(rawPrice);
            const rawStock = obj.stock || '0';
            const stock = parseInt(rawStock);
            const image = obj.image || obj.imageurl || '';
            const description = obj.description || '';
            const sku = obj.sku || '';
            const categoryInput = obj.category || obj.categoryslug || obj.categoryname || '';
            const weight = parseFloat(obj.weight || '0');
            
            const tags = obj.tags || '';
            const warranty = obj.warranty || '';
            const delivery = obj.delivery || '';
            const returns = obj.returns || '';
            const terms = obj.terms || '';

            let matchedCategory = null;
            if (categoryInput) {
                const cleanedInput = categoryInput.toLowerCase().trim();
                matchedCategory = categories.find(c => 
                    c.slug.toLowerCase() === cleanedInput || 
                    c.name.toLowerCase() === cleanedInput
                );
            }

            const warnings: string[] = [];
            if (!name.trim()) warnings.push("Missing product name.");
            if (isNaN(price) || price < 0) warnings.push("Invalid or negative price.");
            if (isNaN(stock) || stock < 0) warnings.push("Invalid or negative stock level.");
            if (!image.trim()) warnings.push("Missing image reference URL.");
            if (!description.trim()) warnings.push("Missing product description.");
            if (!matchedCategory) warnings.push(`Category "${categoryInput || 'None'}" not found.`);

            items.push({
                name,
                sku,
                price: isNaN(price) ? 0 : price,
                stock: isNaN(stock) ? 0 : stock,
                weight: isNaN(weight) ? 0 : weight,
                image,
                description,
                categoryId: matchedCategory ? matchedCategory.id : '',
                categoryName: matchedCategory ? matchedCategory.name : (categoryInput || 'Unmapped'),
                tags,
                warranty,
                hasWarranty: warranty.trim() !== '',
                delivery,
                hasDelivery: delivery.trim() !== '',
                returns,
                hasReturns: returns.trim() !== '',
                terms,
                warnings,
                isValid: warnings.length === 0
            });
        }

        setParsedProducts(items);
        alerts.success("Parse Successful", `Loaded ${items.length} products from the file. Review the status below before database deployment.`);
    };

    // CSV Importer Template Generator
    const handleDownloadTemplate = () => {
        const headers = ["Name", "SKU", "Category", "Price", "Stock", "Image", "Description", "Weight", "Tags", "Warranty", "Delivery", "Returns", "Terms"];
        const row = [
            "Demon Slayer Tanjiro Action Figure",
            "VIBEZ-DS-T01",
            Array.isArray(categories) && categories.length > 0 ? categories[0].name : "Anime Series",
            "3450.00",
            "25",
            "/products/tanjiro.jpg",
            "High quality 15cm PVC action figure featuring Tanjiro Kamado in signature water breathing pose.",
            "0.35",
            "demon slayer, action figure, anime, collectable",
            "6 Months Manufacturer Warranty",
            "Islandwide standard delivery within 3 days",
            "7 Days checking warranty return policy",
            "Official licensed products only. Keep original box for warranty."
        ];
        
        const formatCSVCell = (val: string) => {
            const escaped = val.replace(/"/g, '""');
            return `"${escaped}"`;
        };

        const csvContent = [
            headers.map(formatCSVCell).join(','),
            row.map(formatCSVCell).join(',')
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "vibez_bulk_product_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Bulk Importer Submission
    const handleBulkImportSubmit = async () => {
        const validItems = parsedProducts.filter(item => item.isValid);
        if (validItems.length === 0) {
            alerts.error("Import Blocked", "There are no valid product records to import. Please resolve the warnings first.");
            return;
        }

        const confirmed = await alerts.confirm(
            `Deploy ${validItems.length} Products?`,
            `Are you sure you want to write these ${validItems.length} valid product records to the database inventory?`
        );
        if (!confirmed) return;

        setImportLoading(true);
        try {
            const res = await fetch('/api/products/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products: validItems })
            });

            const data = await res.json();
            if (res.ok) {
                const warningMsg = data.errors ? `\n\nSkipped / Warnings:\n${data.errors.join('\n')}` : '';
                alerts.success(
                    "Database Deployment Success",
                    `${data.message}${warningMsg}`
                );
                setIsImportModalOpen(false);
                setParsedProducts([]);
                fetchData();
            } else {
                alerts.error("Import Aborted", data.error || "Failed to commit changes to the database.");
            }
        } catch (error) {
            console.error("Bulk upload failure:", error);
            alerts.error("Network Failure", "Lost uplink connection to the deployment API.");
        } finally {
            setImportLoading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.name.endsWith('.csv')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target && typeof event.target.result === 'string') {
                        handleCSVParse(event.target.result);
                    }
                };
                reader.readAsText(file);
            } else {
                alerts.error("Unsupported File Format", "Please drag and drop a valid Comma Separated Values (.csv) file.");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    handleCSVParse(event.target.result);
                }
            };
            reader.readAsText(file);
        }
    };

    useEffect(() => {
        // Auto-generate slug from name if it's a new product or slug is empty
        if (!editingProduct && formData.name) {
            const generatedSlug = formData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.name, editingProduct]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsIdling(true);
        
        // Final SEO Sanity Check
        const finalData = {
            ...formData,
            metaTitle: formData.metaTitle || `${formData.name} | VibeZ`,
            metaDescription: (formData.metaDescription || formData.description || "")
                .replace(/\r?\n|\r/g, " ")
                .substring(0, 155)
                .trim()
        };

        const method = editingProduct ? 'PUT' : 'POST';
        const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });
            
            if (res.ok) {
                alerts.success(
                    editingProduct ? "Product Updated" : "Product Deployed",
                    `The component "${formData.name}" has been successfully updated in the inventory.`
                );
                setIsModalOpen(false);
                fetchData();
            } else {
                const data = await res.json();
                alerts.error("Deployment Failed", data.error || "Could not save the product record.");
            }
        } catch (error) {
            console.error("Failed to save product:", error);
            alerts.error("Terminal Error", "The connection to the inventory server was lost.");
        } finally {
            setIsIdling(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = await alerts.confirm(
            "Decommission Part?",
            "This will permanently erase all engineering data and stock records for this component."
        );
        
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id));
                alerts.success("Part Decommissioned", "The record has been purged from the global inventory.");
            } else {
                alerts.error("Purge Failed", "Could not execute the decommissioning sequence.");
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
            alerts.error("System Failure", "The deletion sequence was interrupted.");
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProductIds.length === 0) return;

        const confirmed = await alerts.confirm(
            `Decommission ${selectedProductIds.length} Parts?`,
            `This will permanently erase all engineering data and stock records for the ${selectedProductIds.length} selected components.`
        );
        
        if (!confirmed) return;

        setIsIdling(true);
        try {
            const res = await fetch('/api/products/bulk', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedProductIds }),
            });
            
            if (res.ok) {
                const data = await res.json();
                alerts.success(
                    "Bulk Decommission Complete",
                    `Successfully purged ${data.count || selectedProductIds.length} records from the global inventory.`
                );
                setSelectedProductIds([]);
                fetchData();
            } else {
                const data = await res.json();
                alerts.error("Purge Failed", data.error || "Could not execute the bulk decommissioning sequence.");
            }
        } catch (error) {
            console.error("Failed to delete products in bulk:", error);
            alerts.error("System Failure", "The bulk deletion sequence was interrupted.");
        } finally {
            setIsIdling(false);
        }
    };

    const filteredProducts = (Array.isArray(products) ? products : []).filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || p.categoryId === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const categoryOptions: SelectOption[] = [
        { value: "all", label: "All Categories" },
        ...(Array.isArray(categories) ? categories.map(c => ({ value: c.id, label: c.name })) : [])
    ];

    const categoryFormOptions: SelectOption[] = Array.isArray(categories) 
        ? categories.map(c => ({ value: c.id, label: c.name })) 
        : [];

    return (
        <div className="max-w-7xl mx-auto space-y-8 font-outfit">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-surface-950 mb-2 uppercase">
                        PRODUCT <span className="text-brand-600">INVENTORY</span>
                    </h1>
                    <p className="text-surface-500 font-medium">Manage your automotive spare parts, stock levels, and SEO.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {selectedProductIds.length > 0 && (
                        <m.button
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={handleBulkDelete}
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-95 uppercase tracking-widest text-sm cursor-pointer"
                        >
                            <Trash2 size={20} />
                            <span>DELETE SELECTED ({selectedProductIds.length})</span>
                        </m.button>
                    )}
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-surface-200 text-surface-700 hover:text-brand-600 hover:border-brand-500 font-black rounded-2xl transition-all shadow-sm active:scale-95 uppercase tracking-widest text-sm cursor-pointer"
                    >
                        <FileSpreadsheet size={20} className="text-surface-400" />
                        <span>IMPORT CSV</span>
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-brand-600/20 active:scale-95 uppercase tracking-widest text-sm cursor-pointer"
                    >
                        <Plus size={20} />
                        <span>ADD PRODUCT</span>
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-surface-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Search parts, IDs, or categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-12 pr-6 text-surface-900 focus:outline-none focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
                    />
                </div>

                <div className="flex gap-3">
                    <CustomSelect
                        options={categoryOptions}
                        value={filterCategory}
                        onChange={setFilterCategory}
                        triggerClassName="bg-surface-50 border border-surface-200 rounded-2xl py-3 px-5 text-surface-600 font-bold hover:border-surface-400 min-w-[180px]"
                        listClassName="top-full"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-surface-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-50/50 border-b border-surface-200 text-surface-500 font-black text-[10px] uppercase tracking-[0.2em]">
                                    <th className="py-6 px-8 w-12">
                                        <input
                                            type="checkbox"
                                            checked={filteredProducts.length > 0 && filteredProducts.every(p => selectedProductIds.includes(p.id))}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedProductIds(filteredProducts.map(p => p.id));
                                                } else {
                                                    setSelectedProductIds([]);
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500 cursor-pointer accent-brand-600"
                                        />
                                    </th>
                                    <th className="py-6 px-8">Product / Model</th>
                                    <th className="py-6 px-8">Category</th>
                                    <th className="py-6 px-8">Base Price</th>
                                    <th className="py-6 px-8">Stock Status</th>
                                    <th className="py-6 px-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {paginatedProducts.map((product, i) => (
                                    <m.tr
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-surface-50/50 transition-colors group"
                                    >
                                        <td className="py-5 px-8 w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectedProductIds.includes(product.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedProductIds([...selectedProductIds, product.id]);
                                                    } else {
                                                        setSelectedProductIds(selectedProductIds.filter(id => id !== product.id));
                                                    }
                                                }}
                                                className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500 cursor-pointer accent-brand-600"
                                            />
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-surface-200 bg-surface-50">
                                                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div>
                                                    <div className="font-black text-surface-950 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{product.name}</div>
                                                    <div className="text-[10px] font-black text-surface-400 uppercase tracking-widest">SKU: {product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className="font-black text-surface-500 text-[10px] uppercase tracking-widest bg-surface-50 px-3 py-1 rounded-full border border-surface-100">
                                                {product.category?.name || 'General'}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className="font-black text-surface-950">LKR {parseFloat(product.price).toFixed(2)}</span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="w-24 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${product.stock > 20 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                        style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{product.stock} Units In Stock</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleCopyProduct(product)}
                                                    className="p-2.5 text-surface-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                                                    title="Duplicate Product"
                                                >
                                                    <Copy size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    className="p-2.5 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all border border-transparent hover:border-brand-100"
                                                    title="Edit Product"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2.5 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={18} />
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
                        <div className="text-[10px] font-black uppercase tracking-widest text-surface-400">
                            Showing <span className="text-surface-950 font-black">{paginatedProducts.length}</span> of <span className="text-surface-950 font-black">{filteredProducts.length}</span> recorded parts
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 bg-white border border-surface-200 rounded-xl text-surface-400 hover:text-brand-600 hover:border-brand-600 disabled:opacity-50 disabled:hover:text-surface-400 disabled:hover:border-surface-200 transition-all shadow-sm"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            
                            <div className="flex items-center gap-1.5 focus-within:outline-none">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${
                                            currentPage === page
                                                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20"
                                                : "bg-white border border-surface-200 text-surface-400 hover:border-brand-600 hover:text-brand-600"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 bg-white border border-surface-200 rounded-xl text-surface-400 hover:text-brand-600 hover:border-brand-600 disabled:opacity-50 disabled:hover:text-surface-400 disabled:hover:border-surface-200 transition-all shadow-sm"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-surface-950/40 backdrop-blur-md"
                        />
                        <m.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-surface-200"
                        >
                            <div className="flex items-center justify-between p-8 border-b border-surface-100">
                                <h2 className="text-2xl font-black text-surface-950 uppercase tracking-tight">
                                    {editingProduct ? 'Edit' : 'Add New'} <span className="text-brand-600">Product</span>
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-100 rounded-xl transition-colors text-surface-400 hover:text-surface-900">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Column 1: Core Logistics */}
                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            <h3 className="text-xs font-black text-brand-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-600" /> Core Identity
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Part Name</label>
                                                    <div className="relative">
                                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                                        <input
                                                            required
                                                            value={formData.name}
                                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-12 pr-6 font-bold text-surface-900 focus:border-brand-500 outline-none transition-all"
                                                            placeholder="e.g. Performance Brake Pads"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Base Price</label>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={formData.price}
                                                                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                                className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-10 pr-4 font-bold text-surface-900 focus:border-brand-500 outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Stock Level</label>
                                                        <div className="relative">
                                                            <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                                            <input
                                                                type="number"
                                                                value={formData.stock}
                                                                onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                                                className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-10 pr-4 font-bold text-surface-900 focus:border-brand-500 outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Shipping Weight (kg)</label>
                                                    <div className="relative">
                                                        <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={formData.weight}
                                                            onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                                                            className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-10 pr-4 font-bold text-surface-900 focus:border-brand-500 outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Global Category</label>
                                                    <CustomSelect
                                                        options={categoryFormOptions}
                                                        value={formData.categoryId}
                                                        onChange={(val) => setFormData({ ...formData, categoryId: val })}
                                                        triggerClassName="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 px-4 font-bold text-surface-900 hover:border-brand-500"
                                                        listClassName="top-full"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Image Reference URL</label>
                                                    <div className="relative">
                                                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                                        <input
                                                            required
                                                            value={formData.image}
                                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                                            className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-12 pr-6 font-bold text-surface-900 focus:border-brand-500 outline-none"
                                                            placeholder="https://images.unsplash..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-surface-100">
                                            <h3 className="text-xs font-black text-brand-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-600" /> Service & Fulfillment
                                            </h3>
                                            <div className="grid grid-cols-1 gap-5">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Warranty Coverage</label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input type="checkbox" checked={formData.hasWarranty} onChange={e => setFormData({ ...formData, hasWarranty: e.target.checked })} className="w-3 h-3 text-brand-600 rounded" />
                                                            <span className="text-[10px] font-bold text-surface-400 uppercase">Enable</span>
                                                        </label>
                                                    </div>
                                                    <input 
                                                        value={formData.warranty}
                                                        onChange={e => setFormData({ ...formData, warranty: e.target.value })}
                                                        className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 px-5 font-bold text-surface-950 focus:border-brand-500 outline-none shadow-sm"
                                                        placeholder="e.g. 2-YEAR FULL WARRANTY"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Delivery Protocol</label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input type="checkbox" checked={formData.hasDelivery} onChange={e => setFormData({ ...formData, hasDelivery: e.target.checked })} className="w-3 h-3 text-brand-600 rounded" />
                                                            <span className="text-[10px] font-bold text-surface-400 uppercase">Enable</span>
                                                        </label>
                                                    </div>
                                                    <input 
                                                        value={formData.delivery}
                                                        onChange={e => setFormData({ ...formData, delivery: e.target.value })}
                                                        className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 px-5 font-bold text-surface-950 focus:border-brand-500 outline-none shadow-sm"
                                                        placeholder="e.g. EXPRESS LOGISTICS"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Return Policy</label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input type="checkbox" checked={formData.hasReturns} onChange={e => setFormData({ ...formData, hasReturns: e.target.checked })} className="w-3 h-3 text-brand-600 rounded" />
                                                            <span className="text-[10px] font-bold text-surface-400 uppercase">Enable</span>
                                                        </label>
                                                    </div>
                                                    <input 
                                                        value={formData.returns}
                                                        onChange={e => setFormData({ ...formData, returns: e.target.value })}
                                                        className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 px-5 font-bold text-surface-950 focus:border-brand-500 outline-none shadow-sm"
                                                        placeholder="e.g. 30-DAY EASY RETURNS"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2: SEO & Technicals */}
                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> Google Search Optimization
                                            </h3>
                                            <div className="p-6 bg-indigo-50/30 rounded-4xl border border-indigo-100 space-y-5">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest pl-1">Search Result Title</label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                                                        <input
                                                            value={formData.metaTitle}
                                                            onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                                                            className="w-full bg-white border border-indigo-100 rounded-xl py-3 pl-12 pr-6 font-bold text-indigo-950 focus:border-brand-500 outline-none shadow-sm"
                                                            placeholder="Optimized for Google..."
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest pl-1">Meta Description</label>
                                                    <textarea
                                                        rows={3}
                                                        value={formData.metaDescription}
                                                        onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                                        className="w-full bg-white border border-indigo-100 rounded-xl py-3 px-5 font-bold text-indigo-950 focus:border-brand-500 outline-none resize-none shadow-sm"
                                                        placeholder="Snippets for search results..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black text-surface-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-surface-400" /> Engineering Breakdown
                                            </h3>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Full Description</label>
                                                <textarea
                                                    required
                                                    rows={6}
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-4 px-5 font-bold text-surface-950 focus:border-brand-500 outline-none resize-none transition-all"
                                                    placeholder="Technical specifications and fitment data..."
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-surface-100">
                                            <h3 className="text-xs font-black text-red-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-600" /> Legal & Compliance
                                            </h3>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Product-Specific Terms</label>
                                                <textarea 
                                                    rows={3}
                                                    value={formData.terms}
                                                    onChange={e => setFormData({ ...formData, terms: e.target.value })}
                                                    className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-4 px-5 font-bold text-surface-950 focus:border-brand-500 outline-none resize-none shadow-sm"
                                                    placeholder="Liability waivers or special handling clauses..."
                                                />
                                            </div>
                                        </div>
 
                                        <div className="pt-8 border-t border-surface-100">
                                            <h3 className="text-xs font-black text-brand-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-600" /> Market Tags
                                            </h3>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Product Tags (Comma Separated)</label>
                                                <div className="relative">
                                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                                    <input
                                                        value={formData.tags}
                                                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                                        className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-12 pr-6 font-bold text-surface-900 focus:border-brand-500 outline-none transition-all"
                                                        placeholder="e.g. New, Trendy, Best Seller"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-8 py-4 bg-surface-50 hover:bg-surface-100 text-surface-600 font-black rounded-2xl transition-all uppercase tracking-widest text-sm"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isIdling}
                                        className="flex items-center gap-2 px-12 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 text-white font-black rounded-2xl transition-all shadow-xl shadow-brand-600/20 active:scale-95 uppercase tracking-widest text-sm"
                                    >
                                        {isIdling ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <Save size={20} />
                                        )}
                                        <span>{isIdling ? 'DEPLOYING...' : 'DEPLOY CHANGES'}</span>
                                    </button>
                                </div>
                            </form>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Bulk CSV Import Modal */}
            <AnimatePresence>
                {isImportModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setIsImportModalOpen(false);
                                setParsedProducts([]);
                            }}
                            className="absolute inset-0 bg-surface-950/40 backdrop-blur-md"
                        />
                        <m.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-surface-200"
                        >
                            <div className="flex items-center justify-between p-8 border-b border-surface-100">
                                <h2 className="text-2xl font-black text-surface-950 uppercase tracking-tight flex items-center gap-3">
                                    <FileSpreadsheet className="text-brand-600 animate-pulse" size={28} />
                                    <span>Bulk Product <span className="text-brand-600">CSV Importer</span></span>
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsImportModalOpen(false);
                                        setParsedProducts([]);
                                    }}
                                    className="p-2 hover:bg-surface-100 rounded-xl transition-colors text-surface-400 hover:text-surface-900"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
                                {/* Top Banner / Actions */}
                                <div className="bg-surface-50 p-6 rounded-4xl border border-surface-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="space-y-1 text-center sm:text-left">
                                        <h3 className="font-black text-surface-950 uppercase tracking-tight">Need a format guide?</h3>
                                        <p className="text-xs text-surface-500 font-medium">Download our pre-structured template containing custom column mappings.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleDownloadTemplate}
                                        className="flex items-center gap-2 px-6 py-3 bg-brand-50 hover:bg-brand-100 text-brand-700 font-black rounded-2xl border border-brand-100 transition-all active:scale-95 text-xs tracking-wider uppercase cursor-pointer"
                                    >
                                        <FileSpreadsheet size={16} />
                                        <span>Download CSV Template</span>
                                    </button>
                                </div>

                                {/* Drag and Drop Ingest Area */}
                                <div
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-[2.5rem] py-16 px-8 flex flex-col items-center justify-center gap-4 transition-all ${
                                        dragActive
                                            ? "border-brand-500 bg-brand-50/30 scale-[0.99]"
                                            : "border-surface-200 bg-surface-50/30 hover:border-surface-300 hover:bg-surface-50/50"
                                    }`}
                                >
                                    <input
                                        type="file"
                                        id="csv-file-input"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <div className="w-20 h-20 rounded-3xl bg-brand-50 border border-brand-100 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                                        <UploadCloud size={38} className="text-brand-600" />
                                    </div>
                                    <div className="text-center space-y-1 max-w-md">
                                        <h4 className="font-black text-surface-950 uppercase tracking-tight text-lg">
                                            Drag & Drop Product CSV
                                        </h4>
                                        <p className="text-sm text-surface-500 font-medium leading-relaxed">
                                            Drag your exported Comma Separated Values (.csv) file here, or{" "}
                                            <label
                                                htmlFor="csv-file-input"
                                                className="text-brand-600 font-black underline cursor-pointer hover:text-brand-700 transition-colors"
                                            >
                                                browse files
                                            </label>
                                        </p>
                                    </div>
                                </div>

                                {/* Parsed Inventory Preview */}
                                {parsedProducts.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-black text-brand-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-ping" />
                                                <span>Parsed Inventory Preview ({parsedProducts.length} Items)</span>
                                            </h3>
                                            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                                                {parsedProducts.filter(p => p.isValid).length} Valid Records Ready
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-4xl border border-surface-200 shadow-sm overflow-hidden">
                                            <div className="max-h-[30vh] overflow-y-auto custom-scrollbar">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-surface-50/50 border-b border-surface-200 text-surface-500 font-black text-[9px] uppercase tracking-[0.2em]">
                                                            <th className="py-4 px-6">Status / Warnings</th>
                                                            <th className="py-4 px-6">Product Details</th>
                                                            <th className="py-4 px-6">Category</th>
                                                            <th className="py-4 px-6">Price</th>
                                                            <th className="py-4 px-6">Stock</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-surface-100 text-sm">
                                                        {parsedProducts.map((item, idx) => (
                                                            <tr key={idx} className="hover:bg-surface-50/30 transition-colors">
                                                                <td className="py-3 px-6 max-w-xs">
                                                                    {item.isValid ? (
                                                                        <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                                            <CheckCircle size={12} />
                                                                            <span>Valid</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="space-y-1">
                                                                            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                                                <AlertTriangle size={12} />
                                                                                <span>Warning</span>
                                                                            </div>
                                                                            <ul className="list-disc pl-4 text-[10px] text-amber-700 font-medium space-y-0.5">
                                                                                {item.warnings.map((warn: string, wIdx: number) => (
                                                                                    <li key={wIdx}>{warn}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="py-3 px-6 font-bold text-surface-900">
                                                                    <div className="font-bold text-surface-950 uppercase tracking-tight">{item.name || "Unnamed Product"}</div>
                                                                    <div className="text-[10px] text-surface-400 font-black tracking-widest uppercase">SKU: {item.sku || "N/A"}</div>
                                                                </td>
                                                                <td className="py-3 px-6 font-bold">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest bg-surface-50 border border-surface-100 px-2.5 py-1 rounded-full text-surface-500">
                                                                        {item.categoryName}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-6 font-black text-surface-950">
                                                                    LKR {item.price.toFixed(2)}
                                                                </td>
                                                                <td className="py-3 px-6 font-bold text-surface-500">
                                                                    {item.stock} Units
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-t border-surface-100 flex justify-end gap-4 bg-surface-50/50">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsImportModalOpen(false);
                                        setParsedProducts([]);
                                    }}
                                    className="px-8 py-4 bg-white border border-surface-200 text-surface-600 font-black rounded-2xl transition-all uppercase tracking-widest text-xs hover:text-surface-950 hover:border-surface-300 cursor-pointer"
                                >
                                    Discard
                                </button>
                                <button
                                    type="button"
                                    onClick={handleBulkImportSubmit}
                                    disabled={importLoading || parsedProducts.filter(p => p.isValid).length === 0}
                                    className="flex items-center gap-2 px-12 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-surface-200 disabled:text-surface-400 disabled:shadow-none text-white font-black rounded-2xl transition-all shadow-xl shadow-brand-600/20 active:scale-95 uppercase tracking-widest text-xs cursor-pointer"
                                >
                                    {importLoading ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    <span>
                                        {importLoading
                                            ? "Deploying Ingestion..."
                                            : `Import ${parsedProducts.filter(p => p.isValid).length} Valid Products`}
                                    </span>
                                </button>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
