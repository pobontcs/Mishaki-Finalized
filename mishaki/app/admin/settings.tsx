"use client";

import { useState, useEffect } from "react";
import { Settings, Save, RefreshCcw } from "lucide-react";
import { getSettings, updateSettings, StoreSettingData } from "../lib/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err.message || "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setSettings((prev) => {
      if (!prev) return prev;
      
      let finalValue: any = value;
      if (type === "checkbox") {
        finalValue = (e.target as HTMLInputElement).checked;
      } else if (type === "number") {
        finalValue = parseFloat(value) || 0;
      }

      return {
        ...prev,
        [name]: finalValue,
      };
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      setSuccess("Settings updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <RefreshCcw className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchSettings} className="px-4 py-2 bg-red-600 text-white rounded-lg">Retry</button>
      </div>
    );
  }

  return (
    <div className="animate-slide-up flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your store details, shipping zones, and features.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}
      {success && <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-red-700" />
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input
                type="text"
                name="store_name"
                value={settings?.store_name || ""}
                onChange={handleInputChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Tagline</label>
              <input
                type="text"
                name="store_tagline"
                value={settings?.store_tagline || ""}
                onChange={handleInputChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="contact_email"
                value={settings?.contact_email || ""}
                onChange={handleInputChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                type="text"
                name="contact_phone"
                value={settings?.contact_phone || ""}
                onChange={handleInputChange}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
              <textarea
                name="address"
                value={settings?.address || ""}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Financial & Shipping */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Financial & Shipping</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                <input
                  type="text"
                  name="currency_symbol"
                  value={settings?.currency_symbol || ""}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Code</label>
                <input
                  type="text"
                  name="currency_code"
                  value={settings?.currency_code || ""}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standard Shipping</label>
                <input
                  type="number"
                  name="shipping_fee_standard"
                  value={settings?.shipping_fee_standard || 0}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Express Shipping</label>
                <input
                  type="number"
                  name="shipping_fee_express"
                  value={settings?.shipping_fee_express || 0}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold</label>
                <input
                  type="number"
                  name="free_shipping_threshold"
                  value={settings?.free_shipping_threshold || 0}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                <input
                  type="number"
                  name="low_stock_threshold"
                  value={settings?.low_stock_threshold || 5}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="enable_cod"
                  checked={settings?.enable_cod || false}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-600 rounded border-zinc-300 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-700">Enable Cash on Delivery (COD)</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="enable_bkash"
                  checked={settings?.enable_bkash || false}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-600 rounded border-zinc-300 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-700">Enable bKash</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="enable_nagad"
                  checked={settings?.enable_nagad || false}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-600 rounded border-zinc-300 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-700">Enable Nagad</span>
              </label>
              
              <div className="pt-3 border-t border-zinc-100">
                <label className="block text-sm font-medium text-gray-700 mb-1">bKash Merchant Number</label>
                <input
                  type="text"
                  name="bkash_merchant_number"
                  value={settings?.bkash_merchant_number || ""}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>
          </div>
          
          {/* Store Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Store Status</h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3 p-3 border border-amber-200 bg-amber-50 rounded-xl">
                <input
                  type="checkbox"
                  name="maintenance_mode"
                  checked={settings?.maintenance_mode || false}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                />
                <div>
                  <span className="text-sm font-bold text-amber-900 block">Maintenance Mode</span>
                  <span className="text-xs text-amber-700">When enabled, customers will see a maintenance page and cannot place orders.</span>
                </div>
              </label>

              <div>
                <label className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    name="announcement_active"
                    checked={settings?.announcement_active || false}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 rounded border-zinc-300 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Show Top Announcement Bar</span>
                </label>
                <input
                  type="text"
                  name="announcement_text"
                  value={settings?.announcement_text || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. Free shipping on all orders over $100!"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 disabled:opacity-50"
                  disabled={!settings?.announcement_active}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
