/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { Save, Globe, DollarSign, RefreshCw, AlertCircle, Tag, CreditCard, Smartphone, Landmark, Truck } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        storeName: "ZYNEX STORE",
        currencyCode: "LKR",
        currencySymbol: "LKR",
        payhereEnabled: true,
        bankEnabled: true,
        codEnabled: true,
        bankName: "",
        bankAccount: "",
        bankBranch: "",
        codTerms: "",
        deliveryTerms: "",
        deliveryBaseFee: 400,
        deliveryExtraFee: 100,
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data && !data.error) {
                setSettings({
                    storeName: data.storeName,
                    currencyCode: data.currencyCode,
                    currencySymbol: data.currencySymbol,
                    payhereEnabled: data.payhereEnabled,
                    bankEnabled: data.bankEnabled,
                    codEnabled: data.codEnabled,
                    bankName: data.bankName || "",
                    bankAccount: data.bankAccount || "",
                    bankBranch: data.bankBranch || "",
                    codTerms: data.codTerms || "",
                    deliveryTerms: data.deliveryTerms || "",
                    deliveryBaseFee: data.deliveryBaseFee || 400,
                    deliveryExtraFee: data.deliveryExtraFee || 100,
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                // Success feedback could be added here
                alert("Settings updated successfully!");
            }
        } catch (error) {
            console.error("Failed to update settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <RefreshCw className="w-10 h-10 text-brand-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 font-outfit">
            <div className="flex items-center justify-between border-b border-surface-200 pb-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-surface-950 uppercase">
                        SYSTEM <span className="text-brand-600">SETTINGS</span>
                    </h1>
                    <p className="text-surface-500 font-bold text-sm tracking-widest uppercase">Configure global site parameters</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 text-white font-black rounded-xl transition-all active:scale-95 shadow-xl shadow-brand-600/20 uppercase tracking-widest text-sm"
                >
                    {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Branding Section */}
                <section className="bg-white p-8 rounded-3xl border border-surface-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                            <Tag size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-surface-950 uppercase tracking-tight">Store Identity</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Store Name</label>
                            <input
                                value={settings.storeName}
                                onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                                className="w-full bg-surface-50 border border-surface-200 rounded-xl py-4 px-6 font-bold text-surface-950 focus:border-brand-500 outline-none transition-all"
                                placeholder="e.g. ZYNEX STORE"
                            />
                        </div>
                    </div>
                </section>

                {/* Currency Section */}
                <section className="bg-white p-8 rounded-3xl border border-surface-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                            <Globe size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-surface-950 uppercase tracking-tight">Currency Configuration</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Currency Code (ISO)</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-300 font-black">CODE</span>
                                <input
                                    value={settings.currencyCode}
                                    onChange={e => setSettings({ ...settings, currencyCode: e.target.value.toUpperCase() })}
                                    className="w-full bg-surface-50 border border-surface-200 rounded-xl py-4 pl-20 pr-6 font-bold text-surface-900 focus:border-brand-500 outline-none transition-all"
                                    placeholder="USD, LKR, EUR"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Currency Symbol</label>
                            <div className="relative">
                                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                <input
                                    value={settings.currencySymbol}
                                    onChange={e => setSettings({ ...settings, currencySymbol: e.target.value })}
                                    className="w-full bg-surface-50 border border-surface-200 rounded-xl py-4 pl-14 pr-6 font-bold text-surface-900 focus:border-brand-500 outline-none transition-all"
                                    placeholder="$, Rs, €"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-4">
                        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="text-sm font-black text-amber-900 uppercase tracking-tight mb-1">Exchange Rate Reminder</p>
                            <p className="text-sm text-amber-700 font-medium">Changing the currency symbol will update the storefront display immediately. Ensure your product prices are set relative to this default currency.</p>
                        </div>
                    </div>
                </section>

                {/* Payment Configuration Section */}
                <section className="bg-white p-8 rounded-3xl border border-surface-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                            <CreditCard size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-surface-950 uppercase tracking-tight">Payment Gateways</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 bg-surface-50 rounded-2xl border border-surface-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm">
                                    <Smartphone size={24} />
                                </div>
                                <div>
                                    <p className="font-black text-surface-950 uppercase tracking-tight">PayHere Online</p>
                                    <p className="text-xs text-surface-500 font-medium italic">Enable real-time credit card processing</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, payhereEnabled: !settings.payhereEnabled })}
                                className={`w-16 h-8 rounded-full transition-all duration-300 relative ${settings.payhereEnabled ? 'bg-brand-600' : 'bg-surface-300'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${settings.payhereEnabled ? 'left-9' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-surface-50 rounded-2xl border border-surface-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm">
                                    <Landmark size={24} />
                                </div>
                                <div>
                                    <p className="font-black text-surface-950 uppercase tracking-tight">Bank Transfer</p>
                                    <p className="text-xs text-surface-500 font-medium italic">Enable manual bank deposit payments</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, bankEnabled: !settings.bankEnabled })}
                                className={`w-16 h-8 rounded-full transition-all duration-300 relative ${settings.bankEnabled ? 'bg-brand-600' : 'bg-surface-300'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${settings.bankEnabled ? 'left-9' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-surface-50 rounded-2xl border border-surface-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <p className="font-black text-surface-950 uppercase tracking-tight">Cash on Delivery</p>
                                    <p className="text-xs text-surface-500 font-medium italic">Allow payments upon logistics arrival</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, codEnabled: !settings.codEnabled })}
                                className={`w-16 h-8 rounded-full transition-all duration-300 relative ${settings.codEnabled ? 'bg-brand-600' : 'bg-surface-300'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${settings.codEnabled ? 'left-9' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {settings.bankEnabled && (
                        <div className="mt-8 pt-8 border-t border-surface-100 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600">
                                <Landmark size={18} />
                            </div>
                            <h3 className="font-black text-surface-950 uppercase tracking-tight text-sm">Dynamic Bank Credentials</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Bank Name</label>
                                <input
                                    value={settings.bankName}
                                    onChange={e => setSettings({ ...settings, bankName: e.target.value })}
                                    className="w-full bg-surface-50 border border-surface-200 rounded-xl py-3 px-5 font-bold text-surface-950 focus:border-brand-500 outline-none transition-all text-sm"
                                    placeholder="e.g. Bank of Ceylon"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Account Number</label>
                                <input
                                    value={settings.bankAccount}
                                    onChange={e => setSettings({ ...settings, bankAccount: e.target.value })}
                                    className="w-full bg-surface-50 border border-surface-200 rounded-xl py-3 px-5 font-bold text-surface-950 focus:border-brand-500 outline-none transition-all text-sm"
                                    placeholder="e.g. 001-234567-8"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Branch / Swift</label>
                                <input
                                    value={settings.bankBranch}
                                    onChange={e => setSettings({ ...settings, bankBranch: e.target.value })}
                                    className="w-full bg-surface-50 border border-surface-200 rounded-xl py-3 px-5 font-bold text-surface-950 focus:border-brand-500 outline-none transition-all text-sm"
                                    placeholder="e.g. Colombo Main"
                                />
                            </div>
                        </div>
                    </div>
                    )}

                    {settings.codEnabled && (
                        <div className="mt-8 pt-8 border-t border-surface-100 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600">
                                    <Truck size={18} />
                                </div>
                                <h3 className="font-black text-surface-950 uppercase tracking-tight text-sm">COD Terms & Conditions</h3>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">COD Manifesto</label>
                                <textarea
                                    value={settings.codTerms}
                                    onChange={e => setSettings({ ...settings, codTerms: e.target.value })}
                                    rows={4}
                                    className="w-full bg-surface-50 border border-surface-200 rounded-xl py-4 px-6 font-medium text-surface-950 focus:border-brand-500 outline-none transition-all text-sm resize-none italic"
                                    placeholder="Enter your Cash on Delivery terms here... e.g. Payment strictly required upon logistics acquisition."
                                />
                            </div>
                        </div>
                    )}
                </section>

                {/* Logistics Configuration Section */}
                <section className="bg-white p-8 rounded-3xl border border-surface-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                            <Truck size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-surface-950 uppercase tracking-tight">Logistics Details</h2>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Delivery Terms</label>
                        <textarea
                            value={settings.deliveryTerms}
                            onChange={e => setSettings({ ...settings, deliveryTerms: e.target.value })}
                            rows={4}
                            className="w-full bg-surface-50 border border-surface-200 rounded-xl py-4 px-6 font-medium text-surface-950 focus:border-brand-500 outline-none transition-all text-sm resize-none italic"
                            placeholder="Enter delivery terms and details here... e.g. Standard delivery takes 3-5 business days."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Base Delivery Fee (1st kg) (LKR)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={settings.deliveryBaseFee}
                                onChange={e => setSettings({ ...settings, deliveryBaseFee: parseFloat(e.target.value) })}
                                className="w-full bg-surface-50 border border-surface-200 rounded-xl py-4 px-6 font-medium text-surface-950 focus:border-brand-500 outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Additional Fee (per kg) (LKR)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={settings.deliveryExtraFee}
                                onChange={e => setSettings({ ...settings, deliveryExtraFee: parseFloat(e.target.value) })}
                                className="w-full bg-surface-50 border border-surface-200 rounded-xl py-4 px-6 font-medium text-surface-950 focus:border-brand-500 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>
                </section>

                {/* System Stats Section placeholder or other content */}
            </div>
        </div>
    );
}
