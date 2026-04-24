/* eslint-disable */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { alerts } from "@/lib/alerts";
import { RiTruckLine, RiBankCardLine, RiShieldCheckLine, RiArrowRightSLine, RiLock2Line, RiArrowLeftLine, RiCheckboxCircleFill, RiBox3Line, RiBankLine, RiSmartphoneLine, RiLoader4Line } from "react-icons/ri";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { useSettingsStore } from "@/store/settingsStore";
import { useState, useEffect, useMemo } from "react";

type Step = "shipping" | "payment" | "bank_details" | "success";
type PaymentMethod = "PAYHERE" | "BANK_TRANSFER" | "COD";

export default function CheckoutPage() {
    const [step, setStep] = useState<Step>("shipping");
    const { payhereEnabled, bankEnabled, codEnabled, bankName, bankAccount, bankBranch, codTerms, deliveryTerms, deliveryBaseFee, deliveryExtraFee, syncSettings } = useSettingsStore();
    
    useEffect(() => {
        syncSettings();
    }, [syncSettings]);
    /* eslint-disable */
    const storeName = useSettingsStore(state => state.storeName);

    // Determine the first available payment method as default
    const defaultMethod = useMemo(() => {
        if (payhereEnabled) return "PAYHERE";
        if (bankEnabled) return "BANK_TRANSFER";
        if (codEnabled) return "COD";
        return "PAYHERE"; // Fallback
    }, [payhereEnabled, bankEnabled, codEnabled]);

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(defaultMethod);

    // Update payment method if the current one becomes disabled or on initial load
    useEffect(() => {
        const isCurrentMethodEnabled = 
            (paymentMethod === "PAYHERE" && payhereEnabled) ||
            (paymentMethod === "BANK_TRANSFER" && bankEnabled) ||
            (paymentMethod === "COD" && codEnabled);

        if (!isCurrentMethodEnabled) {
            setPaymentMethod(defaultMethod);
        }
    }, [defaultMethod, payhereEnabled, bankEnabled, codEnabled, paymentMethod]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [payhereReady, setPayhereReady] = useState(false);
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const [finalTotal, setFinalTotal] = useState(0);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalWeight = items.reduce((acc, item) => acc + (item.weight || 0) * item.quantity, 0);
    
    // Dynamic Shipping fee calculation
    const shippingFee = items.length > 0 
        ? totalWeight > 1 
            ? (deliveryBaseFee || 400) + Math.ceil(totalWeight - 1) * (deliveryExtraFee || 100)
            : (deliveryBaseFee || 400)
        : 0;

    const total = subtotal + shippingFee;

    const [shippingData, setShippingData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zip: "",
    });

    useEffect(() => {
        // Load PayHere JS SDK (Sandbox)
        const script = document.createElement("script");
        script.src = "https://sandbox.payhere.lk/lib/payhere.js";
        script.async = true;
        script.onload = () => setPayhereReady(true);
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleOrderSubmission = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    shippingData,
                    total,
                    shippingFee,
                    paymentMethod,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Order sequence failed.");

            if (paymentMethod === "PAYHERE" && data.payhereData) {
                if (!(window as any).payhere) {
                    throw new Error("PayHere SDK failed to initialize. Please refresh the page.");
                }

                setFinalTotal(total);

                // Trigger PayHere
                (window as any).payhere.onCompleted = function(orderId: string) {
                    clearCart();
                    setStep("success");
                    alerts.success("Payment Authorized Successfully!");
                };

                (window as any).payhere.onDismissed = function() {
                    setIsProcessing(false);
                    alerts.error("Payment sequence was dismissed.");
                };

                (window as any).payhere.onError = function(error: string) {
                    setIsProcessing(false);
                    alerts.error("Security Authentication Failed", error);
                };

                (window as any).payhere.startPayment(data.payhereData);
            } else if (paymentMethod === "BANK_TRANSFER") {
                // Bank Transfer
                setFinalTotal(total);
                clearCart();
                setStep("bank_details");
                alerts.success("Order Registered. Awaiting Transfer.");
            } else {
                // COD
                setFinalTotal(total);
                clearCart();
                setStep("success");
                alerts.success("Order Placed via Cash on Delivery!");
            }
        } catch (error: any) {
            console.error("Checkout Error:", error);
            alerts.error("Terminal Fault", error.message);
        } finally {
            if (paymentMethod !== "PAYHERE") setIsProcessing(false);
        }
    };

    if (items.length === 0 && !["success", "bank_details"].includes(step)) {
        return (
            <div className="min-h-screen bg-surface-50 pt-32 pb-12 flex flex-col items-center justify-center container mx-auto px-4 text-center">
                <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center text-surface-300 mb-10 shadow-sm border border-surface-200">
                    <RiBox3Line size={56} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-surface-950 uppercase mb-4 tracking-tighter">Your cart is empty</h1>
                <p className="text-surface-500 font-medium mb-12 max-w-sm italic text-lg leading-relaxed">Boost your vehicle's performance with our precision components before checking out.</p>
                <Link href="/products" className="apex-button max-w-xs mx-auto">
                    Browse Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 pt-40 pb-24">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    {!["success", "bank_details"].includes(step) && (
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 text-brand-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4"
                                >
                                    <RiLock2Line size={14} />
                                    <span>256-bit Secure Session</span>
                                </motion.div>
                                <h1 className="text-5xl md:text-7xl font-black text-surface-950 uppercase tracking-tighter leading-none">SECURE <span className="text-brand-600">CHECKOUT</span></h1>
                            </div>

                            {/* Progress Stepper */}
                            <div className="flex items-center gap-6 bg-white p-3 rounded-2xl border border-surface-200 shadow-sm">
                                <div className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-500 ${step === "shipping" ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" : "text-surface-400 font-bold"}`}>
                                    <RiTruckLine size={20} />
                                    <span className="font-black text-xs uppercase tracking-widest hidden sm:inline">Shipping</span>
                                </div>
                                <RiArrowRightSLine size={24} className="text-surface-300" />
                                <div className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-500 ${step === "payment" ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" : "text-surface-400 font-bold"}`}>
                                    <RiBankCardLine size={20} />
                                    <span className="font-black text-xs uppercase tracking-widest hidden sm:inline">Payment</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                        {/* Main Interaction Area */}
                        <div className="lg:col-span-8">
                            <AnimatePresence mode="wait">
                                {step === "shipping" && (
                                    <motion.div
                                        key="shipping"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="bg-white rounded-3xl p-8 md:p-16 border border-surface-200 shadow-sm"
                                    >
                                        <h2 className="text-2xl md:text-3xl font-black text-surface-950 mb-12 uppercase tracking-tighter flex items-center gap-4">
                                            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 border border-brand-100">
                                                <RiTruckLine size={24} />
                                            </div>
                                            Logistics Destination
                                        </h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">First Name</label>
                                                <input
                                                    type="text"
                                                    className="vibez-input bg-surface-50"
                                                    placeholder="e.g. Lewis"
                                                    value={shippingData.firstName}
                                                    onChange={e => setShippingData({ ...shippingData, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    className="vibez-input bg-surface-50"
                                                    placeholder="e.g. Hamilton"
                                                    value={shippingData.lastName}
                                                    onChange={e => setShippingData({ ...shippingData, lastName: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-8 mb-12">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Fleet Delivery Address</label>
                                                <input
                                                    type="text"
                                                    className="vibez-input bg-surface-50"
                                                    placeholder="123 Performance Way"
                                                    value={shippingData.address}
                                                    onChange={e => setShippingData({ ...shippingData, address: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">City</label>
                                                    <input
                                                        type="text"
                                                        className="vibez-input bg-surface-50"
                                                        placeholder="Detroit"
                                                        value={shippingData.city}
                                                        onChange={e => setShippingData({ ...shippingData, city: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] ml-2">Zip / Postal</label>
                                                    <input
                                                        type="text"
                                                        className="vibez-input bg-surface-50"
                                                        placeholder="48201"
                                                        value={shippingData.zip}
                                                        onChange={e => setShippingData({ ...shippingData, zip: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {deliveryTerms && (
                                            <div className="mb-12 p-6 bg-surface-50 rounded-2xl border border-surface-100 flex items-start gap-4 shadow-inner">
                                                <RiTruckLine className="text-brand-500 shrink-0 mt-0.5" size={24} />
                                                <div>
                                                    <p className="text-sm font-black text-surface-950 uppercase tracking-tight mb-1">Delivery Information</p>
                                                    <p className="text-sm text-surface-500 font-medium italic whitespace-pre-line leading-relaxed">{deliveryTerms}</p>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => {
                                                if (!shippingData.firstName || !shippingData.address || !shippingData.city) {
                                                    alerts.error("Missing Logistics Data", "Please complete all shipping fields to proceed.");
                                                    return;
                                                }
                                                setStep("payment");
                                            }}
                                            className="apex-button w-full"
                                        >
                                            Continue to Payment <RiArrowRightSLine size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </motion.div>
                                )}

                                {step === "payment" && (
                                    <motion.div
                                        key="payment"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="bg-white rounded-3xl p-8 md:p-16 border border-surface-200 shadow-sm"
                                    >
                                        <button
                                            onClick={() => setStep("shipping")}
                                            className="flex items-center gap-2 text-surface-400 hover:text-brand-600 font-black uppercase tracking-[0.2em] text-[10px] mb-10 transition-all group"
                                        >
                                            <RiArrowLeftLine size={14} className="group-hover:-translate-x-1 transition-transform" /> Modify Shipping
                                        </button>

                                        <h2 className="text-2xl md:text-3xl font-black text-surface-950 mb-12 uppercase tracking-tighter flex items-center gap-4">
                                            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 border border-brand-100">
                                                <RiBankCardLine size={24} />
                                            </div>
                                            Payment Methods
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                            {payhereEnabled && (
                                                <button
                                                    onClick={() => setPaymentMethod("PAYHERE")}
                                                    className={`p-6 md:p-8 rounded-2xl border-2 transition-all text-left flex flex-col gap-6 relative overflow-hidden group ${paymentMethod === "PAYHERE" ? "border-brand-600 bg-brand-50 shadow-md" : "border-surface-200 hover:border-brand-300 bg-surface-50"}`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === "PAYHERE" ? "bg-brand-600 text-white" : "bg-white text-surface-400 border border-surface-200"}`}>
                                                        <RiSmartphoneLine size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-surface-950 uppercase tracking-tight text-lg md:text-xl mb-1">PayHere</h3>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400 leading-relaxed">Credit Cards, Wallets, Net Banking</p>
                                                    </div>
                                                    {paymentMethod === "PAYHERE" && <div className="absolute top-6 right-6 text-brand-600"><RiCheckboxCircleFill size={24} /></div>}
                                                </button>
                                            )}

                                            {bankEnabled && (
                                                <button
                                                    onClick={() => setPaymentMethod("BANK_TRANSFER")}
                                                    className={`p-6 md:p-8 rounded-2xl border-2 transition-all text-left flex flex-col gap-6 relative overflow-hidden group ${paymentMethod === "BANK_TRANSFER" ? "border-brand-600 bg-brand-50 shadow-md" : "border-surface-200 hover:border-brand-300 bg-surface-50"}`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === "BANK_TRANSFER" ? "bg-brand-600 text-white" : "bg-white text-surface-400 border border-surface-200"}`}>
                                                        <RiBankLine size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-surface-950 uppercase tracking-tight text-lg md:text-xl mb-1">Transfer</h3>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400 leading-relaxed">Manual bank deposit / transfer</p>
                                                    </div>
                                                    {paymentMethod === "BANK_TRANSFER" && <div className="absolute top-6 right-6 text-brand-600"><RiCheckboxCircleFill size={24} /></div>}
                                                </button>
                                            )}

                                            {codEnabled && (
                                                <button
                                                    onClick={() => setPaymentMethod("COD")}
                                                    className={`p-6 md:p-8 rounded-2xl border-2 transition-all text-left flex flex-col gap-6 relative overflow-hidden group ${paymentMethod === "COD" ? "border-brand-600 bg-brand-50 shadow-md" : "border-surface-200 hover:border-brand-300 bg-surface-50"}`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === "COD" ? "bg-brand-600 text-white" : "bg-white text-surface-400 border border-surface-200"}`}>
                                                        <RiTruckLine size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-surface-950 uppercase tracking-tight text-lg md:text-xl mb-1">C.O.D.</h3>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400 leading-relaxed">Pay upon logistics acquisition</p>
                                                    </div>
                                                    {paymentMethod === "COD" && <div className="absolute top-6 right-6 text-brand-600"><RiCheckboxCircleFill size={24} /></div>}
                                                </button>
                                            )}
                                        </div>

                                        <button
                                            onClick={handleOrderSubmission}
                                            disabled={isProcessing || (paymentMethod === "PAYHERE" && !payhereReady)}
                                            className="apex-button w-full group"
                                        >
                                            {isProcessing ? (
                                                <>INITIALIZING GATEWAY <RiLoader4Line className="animate-spin" size={20} /></>
                                            ) : paymentMethod === "PAYHERE" && !payhereReady ? (
                                                <>SYNCHRONIZING GATEWAY <RiLoader4Line className="animate-spin" size={20} /></>
                                            ) : (
                                                <>PLACE THE ORDER <RiShieldCheckLine size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                            )}
                                        </button>
                                    </motion.div>
                                )}

                                {step === "bank_details" && (
                                    <motion.div
                                        key="bank_details"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-3xl p-10 md:p-20 border border-surface-200 shadow-xl text-center"
                                    >
                                        <div className="w-24 h-24 md:w-32 md:h-32 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mx-auto mb-10 border border-brand-100 shadow-inner">
                                            <RiBankLine size={48} className="md:w-16 md:h-16" />
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black text-surface-950 uppercase tracking-tighter mb-6 leading-none">ORDER <span className="text-brand-600">PENDING</span></h2>
                                        <p className="text-surface-500 font-medium text-lg mb-12 max-w-sm mx-auto italic">To finalize your acquisition, please execute a bank transfer using the details below.</p>
                                        
                                        <div className="bg-surface-50 p-8 md:p-10 rounded-3xl border-2 border-dashed border-surface-200 text-left space-y-8 mb-12">
                                            <div className="flex justify-between items-center pb-6 border-b border-surface-200">
                                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Bank Entity</span>
                                                <span className="font-black text-surface-950 uppercase tracking-tight">{bankName || "N/A"}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-surface-200 gap-2">
                                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Account Number</span>
                                                <span className="font-black text-surface-950 text-xl tracking-widest">{bankAccount || "N/A"}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-6 border-b border-surface-200">
                                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Swift / Branch</span>
                                                <span className="font-black text-surface-950 uppercase tracking-tight">{bankBranch || "N/A"}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Transfer Amount</span>
                                                <PriceDisplay amount={finalTotal} className="text-2xl font-black text-brand-600 tracking-tighter" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Link href="/products" className="vibez-button-outline">
                                                Return to Catalog
                                            </Link>
                                            <Link href="/profile" className="vibez-button shadow-md">
                                                <span>Order Status</span> <RiTruckLine size={18} />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}

                                {step === "success" && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-3xl p-10 md:p-24 border border-surface-200 shadow-2xl text-center relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 inset-x-0 h-2 bg-emerald-500" />
                                        <div className="w-24 h-24 md:w-32 md:h-32 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-10 border border-emerald-100 shadow-inner">
                                            <RiCheckboxCircleFill size={64} className="animate-bounce" />
                                        </div>
                                        <h2 className="text-4xl md:text-6xl font-black text-surface-950 uppercase tracking-tighter mb-6 leading-none">
                                            {paymentMethod === "COD" ? "ORDER" : "TRANSACTION"} <span className={paymentMethod === "COD" ? "text-brand-600" : "text-emerald-600"}>{paymentMethod === "COD" ? "CONFIRMED" : "SECURED"}</span>
                                        </h2>
                                        <p className="text-surface-500 font-medium text-lg md:text-xl mb-16 max-w-md mx-auto italic leading-relaxed">
                                            {paymentMethod === "COD" 
                                                ? (codTerms || "Your request has been received. Our logistics team will collect payment upon delivery.")
                                                : "Payment authorized successfully. Your order is now prioritized in the processing queue."}
                                            <br className="mb-4 block" />
                                            <span className="bg-surface-50 px-4 py-2 rounded-xl border border-surface-200 inline-block mt-4">
                                                Amount: <PriceDisplay amount={finalTotal} className="font-black text-surface-950" />
                                            </span>
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Link href="/products" className="vibez-button-outline">
                                                Return to Shop
                                            </Link>
                                            <Link href="/profile" className="vibez-button shadow-md">
                                                <span>Track Delivery</span> <RiTruckLine size={18} />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Sidebar */}
                        {!["success", "bank_details"].includes(step) && (
                            <aside className="lg:col-span-4 sticky top-32">
                                <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-md">
                                    <h3 className="text-xl font-black text-surface-950 mb-8 uppercase tracking-tighter flex items-center gap-3">
                                        Manifest Summary
                                    </h3>

                                    <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-4 group">
                                                <div className="w-16 h-16 bg-surface-50 rounded-xl overflow-hidden border border-surface-100 shrink-0 group-hover:border-brand-300 transition-colors">
                                                    <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 py-0.5">
                                                    <p className="font-black text-surface-950 text-sm uppercase tracking-tight line-clamp-1 group-hover:text-brand-600 transition-colors">{item.name}</p>
                                                    <p className="text-[9px] text-surface-400 font-black uppercase tracking-[0.2em] mt-1">Qty: {item.quantity}</p>
                                                    <PriceDisplay amount={item.price * item.quantity} className="text-base font-black text-brand-600 mt-1 block" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4 pt-6 border-t-2 border-dashed border-surface-200">
                                        <div className="flex justify-between text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]">
                                            <span>Subtotal</span>
                                            <PriceDisplay amount={subtotal} className="text-surface-950" />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] items-center">
                                            <span>
                                                Logistic Fee ({totalWeight.toFixed(2)}kg)
                                            </span>
                                            <PriceDisplay amount={shippingFee} className={shippingFee === 0 ? "text-emerald-600" : "text-surface-950"} />
                                        </div>
                                        <div className="flex justify-between items-center pt-6 border-t border-surface-100 mt-4">
                                            <span className="text-xl font-black text-surface-950 uppercase tracking-tight">Total AMT</span>
                                            <PriceDisplay amount={total} className="text-3xl font-black text-surface-950 tracking-tighter" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-6 bg-surface-50 rounded-2xl border border-surface-200 shadow-sm">
                                    <div className="flex items-center gap-2 text-surface-950 font-black text-[10px] uppercase tracking-widest mb-2">
                                        <RiTruckLine size={16} className="text-brand-600" /> Logistics Terms
                                    </div>
                                    <p className="text-xs text-surface-500 font-medium whitespace-pre-line leading-relaxed italic">
                                        {deliveryTerms || "Standard delivery terms apply. Please expect logistics contact upon dispatch."}
                                    </p>
                                </div>

                                <div className="mt-8 flex flex-col items-center gap-3 text-surface-400 font-black text-[9px] uppercase tracking-[0.3em]">
                                    <div className="flex items-center gap-2">
                                        <RiShieldCheckLine size={16} className="text-emerald-500" />
                                        {storeName} Buyer Protection
                                    </div>
                                </div>
                            </aside>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
