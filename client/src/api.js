const base = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

async function readErrorMessage(res) {
  try {
    const body = await res.json();
    return body.error || body.message || res.statusText;
  } catch {
    return res.statusText;
  }
}

function url(path) {
  return `${base}${path}`;
}

export async function searchProducts(district, productName) {
  const q = new URLSearchParams({ district });
  if (productName?.trim()) q.set("productName", productName.trim());
  const res = await fetch(url(`/api/product/search?${q}`));
  if (!res.ok) throw new Error(await readErrorMessage(res));
  return res.json();
}

export async function getShops() {
  const res = await fetch(url("/api/shop/getallshops"));
  if (!res.ok) throw new Error(await readErrorMessage(res));
  return res.json();
}

export async function getAllProducts() {
  const res = await fetch(url("/api/product/getallproducts"));
  if (!res.ok) throw new Error(await readErrorMessage(res));
  return res.json();
}

export async function createShop(payload) {
  const res = await fetch(url("/api/shop/create"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await readErrorMessage(res));
  return res.json();
}

export async function createProduct(payload) {
  const res = await fetch(url("/api/product/create"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await readErrorMessage(res));
  return res.json();
}
