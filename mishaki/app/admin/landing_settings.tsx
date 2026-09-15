"use client";

import { useState, useEffect, useRef } from "react";
import { getLandingSettings, updateLandingSettings, LandingSettingData, uploadProductImage, getImageUrl } from "../lib/api";
import { Save, Loader2, LayoutTemplate, Type, Palette, Image as ImageIcon, UploadCloud, X, Camera } from "lucide-react";
import Image from "next/image";

export default function LandingSettingsPage() {
  const [settings, setSettings] = useState<LandingSettingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getLandingSettings();
      setSettings(data);
      if (data.new_arrivals_images) {
        try {
          setGalleryImages(JSON.parse(data.new_arrivals_images));
        } catch {
          setGalleryImages([]);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load landing settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof LandingSettingData) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const result = await uploadProductImage(file); // Re-using product image upload
      setSettings((prev) => prev ? { ...prev, [fieldName]: result.image_url } : null);
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadProductImage(files[i]);
        uploadedUrls.push(result.image_url);
      }
      setGalleryImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      alert("Failed to upload gallery images.");
    } finally {
      setUploadingImage(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      setError(null);
      const updatedSettings = {
        ...settings,
        new_arrivals_images: JSON.stringify(galleryImages)
      };
      await updateLandingSettings(updatedSettings);
      alert("Landing settings saved successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save landing settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-red-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
        Error: {error}
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="animate-slide-up flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Landing Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your 4-Row layout and 3D experience.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || uploadingImage}
          className="bg-red-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-800 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ROW 1: HERO SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2 bg-zinc-50/50">
            <LayoutTemplate className="w-5 h-5 text-red-700" />
            <h2 className="text-lg font-bold text-gray-900">Row 1: Hero Section</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
              <input
                type="text"
                name="hero_title"
                value={settings.hero_title}
                onChange={handleChange}
                className="w-full bg-white text-black border border-zinc-300 rounded-lg px-4 py-2.5 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
              <textarea
                name="hero_subtitle"
                rows={2}
                value={settings.hero_subtitle}
                onChange={handleChange}
                className="w-full bg-white text-black border border-zinc-300 rounded-lg px-4 py-2.5 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
              <div className="flex items-center gap-4">
                {settings.hero_image_url && (
                  <div className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden">
                    <Image src={getImageUrl(settings.hero_image_url)} alt="Hero" fill className="object-cover" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => heroImageInputRef.current?.click()}
                  className="bg-zinc-100 text-zinc-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" /> Upload Hero Image
                </button>
                <input 
                  type="file" 
                  ref={heroImageInputRef} 
                  onChange={(e) => handleImageUpload(e, 'hero_image_url')} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: NEW ARRIVALS */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2 bg-zinc-50/50">
            <ImageIcon className="w-5 h-5 text-red-700" />
            <h2 className="text-lg font-bold text-gray-900">Row 2: New Arrivals Gallery</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500">Upload 3-4 images to display in the New Arrivals scroll gallery.</p>
            
            <div className="flex flex-wrap gap-4">
              {galleryImages.map((url, idx) => (
                <div key={idx} className="relative w-24 h-32 rounded-lg border border-gray-200 overflow-hidden group">
                  <Image src={getImageUrl(url)} alt={`Gallery ${idx}`} fill className="object-cover" />
                  <button 
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="w-24 h-32 rounded-lg border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-500 hover:text-red-700 hover:border-red-400 hover:bg-red-50 transition-colors"
              >
                <UploadCloud className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium">Add Photo</span>
              </button>
              <input 
                type="file" 
                multiple
                ref={galleryInputRef} 
                onChange={handleGalleryUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>
        </div>

        {/* ROW 4: ABOUT SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2 bg-zinc-50/50">
            <Type className="w-5 h-5 text-red-700" />
            <h2 className="text-lg font-bold text-gray-900">Row 4: About Mishaki</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Title</label>
                <input
                  type="text"
                  name="about_title"
                  value={settings.about_title}
                  onChange={handleChange}
                  className="w-full bg-white text-black border border-zinc-300 rounded-lg px-4 py-2.5 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Description</label>
                <textarea
                  name="about_description"
                  rows={3}
                  value={settings.about_description}
                  onChange={handleChange}
                  className="w-full bg-white text-black border border-zinc-300 rounded-lg px-4 py-2.5 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Image</label>
                <div className="flex items-center gap-4">
                  {settings.about_image_url && (
                    <div className="relative w-16 h-16 rounded-full border border-gray-200 overflow-hidden">
                      <Image src={getImageUrl(settings.about_image_url)} alt="About" fill className="object-cover" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => aboutImageInputRef.current?.click()}
                    className="bg-zinc-100 text-zinc-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" /> Upload About Image
                  </button>
                  <input 
                    type="file" 
                    ref={aboutImageInputRef} 
                    onChange={(e) => handleImageUpload(e, 'about_image_url')} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Journey Note (Note shape frame)</label>
                <textarea
                  name="about_note"
                  rows={8}
                  value={settings.about_note}
                  onChange={handleChange}
                  placeholder="A note detailing the journey of Mishaki..."
                  className="w-full bg-amber-50 text-amber-900 border border-amber-200 rounded-lg px-4 py-4 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none font-medium italic shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
