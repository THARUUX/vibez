/* eslint-disable */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, Eye, MoreHorizontal, CheckCircle2, Clock, XCircle, Truck, AlertCircle, Loader2, X, MapPin, User as UserIcon, Package, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomSelect, SelectOption } from "@/components/common/CustomSelect";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { alerts } from "@/lib/alerts";

const STATUS_OPTIONS: SelectOption[] = [
    { value: "all", label: "Every Status" },
    { value: "PENDING", label: "Pending" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
];

const INLINE_STATUS_OPTIONS: SelectOption[] = [
    { value: "PENDING", label: "Pending" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "CANCELLATION_REQUESTED", label: "Cancellation Requested" },
];

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                alerts.success("Status Updated", "The transaction workflow has been updated.");
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleAction = async (order: any, action: string) => {
        if (action === 'export') {
            setSelectedOrder(order);
            setTimeout(() => window.print(), 500);
        } else if (action === 'email') {
            const subject = encodeURIComponent(`Order Update: ${order.id.substring(0, 8).toUpperCase()}`);
            const body = encodeURIComponent(`Hello ${order.shippingFirstName},\n\nYour order ${order.id} is currently ${order.status}.\n\nBest regards,\nSupport Team`);
            window.location.href = `mailto:${order.user?.email || ''}?subject=${subject}&body=${body}`;
        } else if (action === 'delete') {
            const confirmed = await alerts.confirm(
                "Archive Transaction?",
                "This will permanently erase this record from the digital ledger. Proceed with decommissioning?"
            );
            if (!confirmed) return;

            try {
                const res = await fetch(`/api/orders/${order.id}`, { method: 'DELETE' });
                if (res.ok) {
                    setOrders(prev => prev.filter(o => o.id !== order.id));
                    alerts.success("Archived", "The transaction has been purged.");
                } else {
                    alerts.error("Failure", "Could not decommission the record.");
                }
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status.toUpperCase()) {
            case 'COMPLETED':
            case 'DELIVERED': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'PROCESSING': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'SHIPPED': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-200';
            case 'CANCELLATION_REQUESTED': return 'bg-purple-50 text-purple-600 border-purple-200';
            default: return 'bg-surface-50 text-surface-500 border-surface-200';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingFirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingLastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <div className="max-w-7xl mx-auto space-y-8 font-outfit">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-surface-950 uppercase">
                        SALES <span className="text-brand-600">LEDGER</span>
                    </h1>
                    <p className="text-surface-500 font-medium">Monitor system transactions and order fulfillment status.</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-surface-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Search IDs, customers, or emails..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface-50 border border-surface-200 rounded-xl py-3 pl-12 pr-6 text-surface-900 focus:outline-none focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
                    />
                </div>

                <CustomSelect
                    options={STATUS_OPTIONS}
                    value={filterStatus}
                    onChange={setFilterStatus}
                    triggerClassName="bg-surface-50 border border-surface-200 rounded-xl py-3 px-5 text-surface-700 font-bold hover:border-surface-400 min-w-[160px]"
                    listClassName="top-full"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-surface-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-surface-400 font-black uppercase tracking-widest text-lg">No transactions found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-50/50 border-b border-surface-200 text-surface-500 font-black text-[10px] uppercase tracking-[0.2em]">
                                    <th className="py-6 px-8">Transaction ID</th>
                                    <th className="py-6 px-8">Customer Data</th>
                                    <th className="py-6 px-8">Date Initiated</th>
                                    <th className="py-6 px-8">Total Revenue</th>
                                    <th className="py-6 px-8">Status / Workflow</th>
                                    <th className="py-6 px-8 text-right">Inspect</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {filteredOrders.map((order, i) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-surface-50/50 transition-colors group"
                                    >
                                        <td className="py-5 px-8">
                                            <span className="font-black text-surface-950 group-hover:text-brand-600 transition-colors">
                                                {order.id.substring(0, 8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="font-bold text-surface-950 text-sm">{order.shippingFirstName} {order.shippingLastName}</div>
                                            <div className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">{order.user?.email || 'Guest User'}</div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className="text-sm font-bold text-surface-500 uppercase tracking-tighter">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className="font-black text-surface-950">${parseFloat(order.total).toFixed(2)}</span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex flex-col gap-1.5 items-start">
                                                <CustomSelect
                                                    options={INLINE_STATUS_OPTIONS}
                                                    value={order.status}
                                                    onChange={(val) => handleStatusUpdate(order.id, val)}
                                                    getOptionStyle={getStatusStyle}
                                                    triggerClassName={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}
                                                    listClassName="min-w-[220px]"
                                                    className="w-auto"
                                                />
                                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">{order.orderItems?.length || 0} UNIT(S)</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2.5 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all border border-transparent hover:border-brand-100 shadow-sm active:scale-90"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <CustomSelect
                                                    options={[
                                                        { value: "export", label: "Export as PDF" },
                                                        { value: "email", label: "Email Customer" },
                                                        { value: "delete", label: "Archive Transaction" },
                                                    ]}
                                                    value=""
                                                    onChange={(val) => handleAction(order, val)}
                                                    triggerClassName="p-2.5 text-surface-400 hover:text-surface-900 hover:bg-surface-50 rounded-xl transition-all border border-transparent hover:border-surface-200"
                                                    placeholder=""
                                                    className="w-auto"
                                                >
                                                    <MoreHorizontal size={18} />
                                                </CustomSelect>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            </div>

            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 print:p-0 print:static print:z-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-surface-950/60 backdrop-blur-xl print:hidden"
                            onClick={() => setSelectedOrder(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl border border-surface-200 overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:rounded-none"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-surface-100 flex items-center justify-between bg-surface-50/50 print:bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                                        <Package size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tighter text-surface-950">Transaction Inspect</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-black text-surface-400 uppercase tracking-widest">ID: {selectedOrder.id.toUpperCase()}</span>
                                            <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(selectedOrder.status)}`}>
                                                {selectedOrder.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-3 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 overflow-y-auto flex-1 space-y-10 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Left Column: Logistics */}
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-surface-400 mb-4">
                                                <UserIcon size={14} className="text-brand-600" /> Customer Credentials
                                            </h3>
                                            <div className="p-6 bg-surface-50 rounded-2xl border border-surface-100">
                                                <p className="font-black text-surface-950 text-lg">{selectedOrder.shippingFirstName} {selectedOrder.shippingLastName}</p>
                                                <p className="text-sm font-bold text-surface-400 mt-1">{selectedOrder.user?.email || 'Guest Session'}</p>
                                                <div className="mt-4 pt-4 border-t border-surface-100 flex items-center gap-4 text-xs font-bold text-surface-600">
                                                    <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1.5"><Truck size={12} /> Priority Logistics</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-surface-400 mb-4">
                                                <MapPin size={14} className="text-brand-600" /> Shipping Destination
                                            </h3>
                                            <div className="p-6 bg-surface-50 rounded-2xl border border-surface-100">
                                                <p className="font-black text-surface-950">{selectedOrder.shippingAddress}</p>
                                                <p className="text-sm font-bold text-surface-600 mt-1">{selectedOrder.shippingCity}, {selectedOrder.shippingZip}</p>
                                                <div className="mt-4 p-3 bg-white border border-surface-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-surface-400 text-center">
                                                    Carrier Routing Assigned
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Financials & Items */}
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-surface-400 mb-4">
                                                <DollarSign size={14} className="text-brand-600" /> Revenue Manifest
                                            </h3>
                                            <div className="space-y-3">
                                                {selectedOrder.orderItems.map((item: any) => (
                                                    <div key={item.id} className="flex items-center gap-4 p-4 bg-white border border-surface-100 rounded-2xl group hover:border-brand-200 transition-colors">
                                                        <div className="w-14 h-14 bg-surface-50 rounded-xl border border-surface-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                                                            <img src={item.product?.image} alt="" className="w-full h-full object-contain rounded-lg shadow-sm" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-black text-surface-950 truncate text-sm leading-tight">{item.product?.name}</p>
                                                            <p className="font-bold text-surface-400 text-[9px] uppercase tracking-[0.15em] mt-1">{item.quantity} UNIT(S) @ <PriceDisplay amount={Number(item.price)} /></p>
                                                        </div>
                                                        <div className="text-right">
                                                            <PriceDisplay amount={Number(item.price) * item.quantity} className="font-black text-surface-950 text-sm" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 border-t border-surface-100 bg-surface-50/50">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Net Revenue</p>
                                            <PriceDisplay amount={Number(selectedOrder.total)} className="text-3xl font-black text-brand-600 tracking-tighter" />
                                        </div>
                                        <div className="h-10 w-px bg-surface-200 hidden sm:block" />
                                        <div className="hidden sm:block">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Payment Verified</p>
                                            <div className="flex items-center gap-2 mt-1 text-emerald-600 font-bold text-sm">
                                                <CheckCircle2 size={16} /> Secure Transaction
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button 
                                            onClick={() => window.print()}
                                            className="flex-1 sm:flex-none px-6 py-3 bg-white hover:bg-surface-950 hover:text-white text-surface-950 font-black rounded-xl border border-surface-200 transition-all uppercase text-[10px] tracking-widest active:scale-95 shadow-sm"
                                        >
                                            Download Invoice
                                        </button>
                                        <button 
                                            onClick={() => setSelectedOrder(null)}
                                            className="flex-1 sm:flex-none px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl transition-all uppercase text-[10px] tracking-widest active:scale-95 shadow-lg shadow-brand-500/20"
                                        >
                                            Confirm Audit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
