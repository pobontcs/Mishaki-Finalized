/**
 * Centralized API client for Mishaki Frontend connecting to FastAPI Backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// Helper for authenticated requests
async function authFetch(url: string, options: RequestInit = {}, tokenOverride?: string) {
  const token = tokenOverride || (typeof window !== "undefined" ? localStorage.getItem("mishaki_admin_token") : null);
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, { ...options, headers });
}

export function getImageUrl(path?: string | null): string {
  if (!path) return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlN2U1ZTQiLz48L3N2Zz4=";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  
  // Use the Next.js rewrite we added for /backend-uploads/ to allow image optimization to work
  if (path.startsWith("/uploads/")) {
    return path.replace("/uploads/", "/backend-uploads/");
  }
  
  // Fallback (shouldn't hit this based on our DB)
  const baseUrl = "http://127.0.0.1:8000";
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

export interface StoreSettingData {
  id?: number;
  store_name: string;
  store_tagline: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  currency_symbol: string;
  currency_code: string;
  shipping_fee_standard: number;
  shipping_fee_express: number;
  free_shipping_threshold: number;
  estimated_delivery_days: string;
  enable_cod: boolean;
  enable_card: boolean;
  enable_bkash: boolean;
  bkash_merchant_number: string;
  enable_nagad: boolean;
  announcement_text?: string;
  announcement_active: boolean;
  maintenance_mode: boolean;
  low_stock_threshold: number;
  updated_at?: string;
}

export interface LandingSettingData {
  id?: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url?: string;
  new_arrivals_images: string;
  about_title: string;
  about_description: string;
  about_image_url?: string;
  about_note: string;
  feature_blocks: string;
  primary_color: string;
  background_style: string;
  updated_at?: string;
}

export interface CategoryData {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export interface ProductSizeData {
  id?: number;
  size: string;
  stock: number;
}

export interface InventoryLogData {
  id: number;
  date: string;
  type: string;
  product_name: string;
  size?: string;
  qty: number;
  ref_id: string;
  status: string;
  notes?: string;
}

export interface ProductImageData {
  id?: number;
  image_url: string;
  alt_text?: string;
  is_main: boolean;
  sort_order?: number;
}

export interface ProductData {
  id: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  buying_price: number;
  selling_price: number;
  compare_at_price?: number;
  discount_percentage: number;
  stock_quantity: number;
  total_stock: number;
  profit_margin?: number;
  profit_margin_percentage?: number;
  material?: string;
  color?: string;
  variant?: string;
  category_id?: number;
  is_active: boolean;
  is_dynamic_stock?: boolean;
  main_image?: string;
  image?: string;
  title?: string;
  created_at: string;
  updated_at: string;
  sizes?: ProductSizeData[];
  images?: ProductImageData[];
}

export interface ProductCreateInput {
  sku: string;
  name: string;
  description?: string;
  price: number;
  buying_price: number;
  selling_price: number;
  compare_at_price?: number;
  discount_percentage?: number;
  stock_quantity: number;
  material?: string;
  color?: string;
  variant?: string;
  category_id?: number;
  is_active?: boolean;
  is_dynamic_stock?: boolean;
  sizes?: { size: string; stock: number }[];
  images?: { image_url: string; is_main: boolean; sort_order?: number }[];
}

export interface OrderItemData {
  id: number;
  product_id?: number;
  product_name: string;
  variant?: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  image_url?: string;
}

export interface OrderData {
  id: number;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  street_address: string;
  house_number?: string;
  address_description?: string;
  city: string;
  postal_code: string;
  payment_method: string;
  payment_status: string;
  bkash_number?: string;
  transaction_id?: string;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItemData[];
}

export interface OrderCreateInput {
  customer_name: string;
  email: string;
  phone: string;
  street_address: string;
  house_number?: string;
  address_description?: string;
  city: string;
  postal_code: string;
  payment_method: string;
  bkash_number?: string;
  transaction_id?: string;
  card_number?: string;
  subtotal: number;
  shipping_fee: number;
  discount_amount?: number;
  total_amount: number;
  notes?: string;
  items: {
    product_id?: number;
    product_name: string;
    variant?: string;
    unit_price: number;
    quantity: number;
    total_price: number;
    image_url?: string;
  }[];
}

export interface DashboardOverview {
  current_stock: number;
  pending_orders: number;
  pending_shipments: number;
  completed_orders: number;
  total_revenue: number;
}

export interface FinancialKPI {
  title: string;
  amount: string;
  change: string;
  isPositive: boolean;
}

export interface ExpenseBreakdown {
  date: string;
  product_name: string;
  stock_type: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
}

export interface FinancialAnalysisData {
  kpis: FinancialKPI[];
  revenue_chart: { name: string; revenue: number; expenses: number }[];
  category_sales: { name: string; sales: number }[];
  expense_breakdown: ExpenseBreakdown[];
}

// --- SETTINGS API ---
export async function getSettings(): Promise<StoreSettingData> {
  const res = await authFetch(`${API_BASE_URL}/settings`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function updateSettings(data: Partial<StoreSettingData>): Promise<StoreSettingData> {
  const res = await authFetch(`${API_BASE_URL}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}

export async function getLandingSettings(): Promise<LandingSettingData> {
  const res = await authFetch(`${API_BASE_URL}/settings/landing`);
  if (!res.ok) throw new Error("Failed to fetch landing settings");
  return res.json();
}

export async function updateLandingSettings(data: Partial<LandingSettingData>): Promise<LandingSettingData> {
  const res = await authFetch(`${API_BASE_URL}/settings/landing`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update landing settings");
  return res.json();
}

// --- CATEGORIES API ---
export async function getCategories(): Promise<CategoryData[]> {
  const res = await fetch(`${API_BASE_URL}/categories`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
  return res.json();
}

// --- PRODUCTS API ---
export async function getProducts(category?: string, search?: string): Promise<ProductData[]> {
  const params = new URLSearchParams();
  if (category && category !== "All") params.append("category", category);
  if (search) params.append("search", search);

  const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
  return res.json();
}

export async function getProduct(id: number): Promise<ProductData> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch product: ${res.statusText}`);
  return res.json();
}

export async function createProduct(data: ProductCreateInput): Promise<ProductData> {
  const res = await authFetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Failed to create product");
  }
  return res.json();
}

export async function updateProduct(id: number, data: Partial<ProductCreateInput>): Promise<ProductData> {
  const res = await authFetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update product: ${res.statusText}`);
  return res.json();
}

export async function uploadProductImage(file: File): Promise<{ image_url: string; message: string }> {
  const formData = new FormData();
  formData.append("file", file);

  // We need custom headers (omitting Content-Type so browser sets boundary)
  const token = typeof window !== "undefined" ? localStorage.getItem("mishaki_admin_token") : null;
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE_URL}/uploads/image`, {
    method: "POST",
    headers,
    body: formData,
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Failed to upload image");
  }
  return res.json();
}

export async function applyProductDiscount(id: number, discountPercentage: number): Promise<ProductData> {
  const res = await authFetch(`${API_BASE_URL}/products/${id}/discount`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ discount_percentage: discountPercentage }),
  });
  if (!res.ok) throw new Error(`Failed to apply discount: ${res.statusText}`);
  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await authFetch(`${API_BASE_URL}/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete product: ${res.statusText}`);
}

// --- ORDERS API ---
export async function getOrders(status?: string, search?: string): Promise<OrderData[]> {
  const params = new URLSearchParams();
  if (status && status !== "All") params.append("status", status);
  if (search) params.append("search", search);

  const res = await authFetch(`${API_BASE_URL}/orders?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch orders: ${res.statusText}`);
  return res.json();
}

export async function sendOrderEmail(orderId: number, subject: string, body: string): Promise<any> {
  const res = await authFetch(`${API_BASE_URL}/orders/${orderId}/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject, body }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Failed to send order email");
  }
  return res.json();
}

export async function createOrder(data: OrderCreateInput): Promise<OrderData> {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Failed to create order");
  }
  return res.json();
}

export async function updateProductStatus(id: number, status: string): Promise<ProductData> {
  const res = await authFetch(`${API_BASE_URL}/products/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Failed to update product status");
  return res.json();
}

export async function getInventoryLogs(typeFilter?: string): Promise<InventoryLogData[]> {
  let url = `${API_BASE_URL}/inventory/history`;
  if (typeFilter) url += `?type=${encodeURIComponent(typeFilter)}`;
  const res = await authFetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch inventory logs");
  return res.json();
}

export async function updateOrderStatus(id: number, status: string): Promise<OrderData> {
  const res = await authFetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Failed to update order status: ${res.statusText}`);
  return res.json();
}

export async function cancelOrderItems(id: number, items: { item_id: number; cancel_quantity: number }[]): Promise<OrderData> {
  const res = await authFetch(`${API_BASE_URL}/orders/${id}/cancel-items`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Failed to cancel order items");
  }
  return res.json();
}

// --- ANALYTICS API ---
export async function getDashboardOverview(): Promise<DashboardOverview> {
  const res = await authFetch(`${API_BASE_URL}/analytics/overview`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch dashboard overview: ${res.statusText}`);
  return res.json();
}

export async function getFinancialAnalysis(timeframe: string = "Yearly"): Promise<FinancialAnalysisData> {
  const res = await authFetch(`${API_BASE_URL}/analytics/financials?timeframe=${encodeURIComponent(timeframe)}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch financial analysis: ${res.statusText}`);
  return res.json();
}
