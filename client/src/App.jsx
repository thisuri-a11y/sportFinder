import { useCallback, useEffect, useState } from "react";
import {
  searchProducts,
  getShops,
  getAllProducts,
  createShop,
  createProduct,
} from "./api";
import "./App.css";

const tabs = [
  { id: "search", label: "Find gear" },
  { id: "shops", label: "Shops" },
  { id: "catalog", label: "Catalogue" },
  { id: "owners", label: "Shop owners" },
];

function formatLkr(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(n);
}

function ShopBadge({ shop }) {
  if (!shop || typeof shop !== "object") return null;
  return (
    <div className="shop-badge">
      <span className="shop-badge__name">{shop.shopName}</span>
      <span className="shop-badge__meta">{shop.district}</span>
      {shop.contactNumber && (
        <a className="shop-badge__phone" href={`tel:${shop.contactNumber}`}>
          {shop.contactNumber}
        </a>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("search");
  const [district, setDistrict] = useState("");
  const [productName, setProductName] = useState("");
  const [results, setResults] = useState([]);
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [ownerShop, setOwnerShop] = useState({
    shopName: "",
    district: "",
    address: "",
    contactNumber: "",
  });
  const [ownerProduct, setOwnerProduct] = useState({
    shopId: "",
    productName: "",
    brand: "",
    category: "",
    price: "",
    availability: true,
  });
  const [ownerMessage, setOwnerMessage] = useState("");

  const runSearch = async (e) => {
    e?.preventDefault();
    setError("");
    if (!district.trim()) {
      setError("Enter a district to search (required by the API).");
      return;
    }
    setLoading(true);
    try {
      const data = await searchProducts(district, productName);
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Search failed.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadShops = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getShops();
      setShops(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load shops.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCatalog = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "shops") loadShops();
    if (tab === "catalog") loadCatalog();
  }, [tab, loadShops, loadCatalog]);

  useEffect(() => {
    if (tab === "owners" && shops.length === 0) {
      loadShops();
    }
  }, [tab, shops.length, loadShops]);

  const onCreateShop = async (e) => {
    e.preventDefault();
    setOwnerMessage("");
    setError("");
    try {
      await createShop(ownerShop);
      setOwnerMessage("Shop created successfully.");
      setOwnerShop({
        shopName: "",
        district: "",
        address: "",
        contactNumber: "",
      });
      await loadShops();
    } catch (err) {
      setError(err.message || "Could not create shop.");
    }
  };

  const onCreateProduct = async (e) => {
    e.preventDefault();
    setOwnerMessage("");
    setError("");
    const price = Number(ownerProduct.price);
    if (!ownerProduct.shopId) {
      setError("Choose a shop for the new product.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price.");
      return;
    }
    try {
      await createProduct({
        shopId: ownerProduct.shopId,
        productName: ownerProduct.productName.trim(),
        brand: ownerProduct.brand.trim(),
        category: ownerProduct.category.trim(),
        price,
        availability: ownerProduct.availability,
      });
      setOwnerMessage("Product added successfully.");
      setOwnerProduct((p) => ({
        ...p,
        productName: "",
        brand: "",
        category: "",
        price: "",
        availability: true,
      }));
    } catch (err) {
      setError(err.message || "Could not create product.");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header__brand">
          <span className="header__logo" aria-hidden>
            ◈
          </span>
          <div>
            <h1 className="header__title">SportFinder</h1>
            <p className="header__tagline">
              Find sports equipment across Sri Lanka by district and product
              name.
            </p>
          </div>
        </div>
        <nav className="nav" aria-label="Main">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`nav__btn${tab === t.id ? " nav__btn--active" : ""}`}
              onClick={() => {
                setTab(t.id);
                setError("");
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {error && (
        <div className="banner banner--error" role="alert">
          {error}
        </div>
      )}

      <main className="main">
        {tab === "search" && (
          <section className="panel" aria-labelledby="search-heading">
            <h2 id="search-heading" className="panel__title">
              Search by district
            </h2>
            <p className="panel__lead">
              The API matches shops whose district contains your text (for
              example, <strong>Colombo</strong> matches “Colombo District”).
            </p>
            <form className="form" onSubmit={runSearch}>
              <label className="field">
                <span className="field__label">District</span>
                <input
                  className="field__input"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Colombo, Kandy, Galle"
                  autoComplete="address-level1"
                />
              </label>
              <label className="field">
                <span className="field__label">Product name (optional)</span>
                <input
                  className="field__input"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Yonex, football, racket"
                />
              </label>
              <button className="btn btn--primary" type="submit" disabled={loading}>
                {loading ? "Searching…" : "Search"}
              </button>
            </form>

            <div className="results">
              <h3 className="results__heading">
                Results{" "}
                <span className="results__count">({results.length})</span>
              </h3>
              {results.length === 0 && !loading && (
                <p className="muted">
                  Run a search to see products from shops in that district.
                </p>
              )}
              <ul className="card-grid">
                {results.map((p) => (
                  <li key={p._id} className="card">
                    <div className="card__top">
                      <span className="pill pill--category">{p.category}</span>
                      <span
                        className={`pill ${p.availability ? "pill--ok" : "pill--off"}`}
                      >
                        {p.availability ? "In stock" : "Out of stock"}
                      </span>
                    </div>
                    <h4 className="card__title">{p.productName}</h4>
                    <p className="card__brand">{p.brand}</p>
                    <p className="card__price">{formatLkr(p.price)}</p>
                    <ShopBadge shop={p.shopId} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {tab === "shops" && (
          <section className="panel" aria-labelledby="shops-heading">
            <div className="panel__row">
              <h2 id="shops-heading" className="panel__title">
                Registered shops
              </h2>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={loadShops}
                disabled={loading}
              >
                Refresh
              </button>
            </div>
            {shops.length === 0 && !loading && (
              <p className="muted">No shops yet. Add one under Shop owners.</p>
            )}
            <ul className="list">
              {shops.map((s) => (
                <li key={s._id} className="list__item">
                  <div>
                    <strong>{s.shopName}</strong>
                    <span className="list__district">{s.district}</span>
                  </div>
                  <p className="list__address">{s.address}</p>
                  <a className="list__phone" href={`tel:${s.contactNumber}`}>
                    {s.contactNumber}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "catalog" && (
          <section className="panel" aria-labelledby="catalog-heading">
            <div className="panel__row">
              <h2 id="catalog-heading" className="panel__title">
                Full product catalogue
              </h2>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={loadCatalog}
                disabled={loading}
              >
                Refresh
              </button>
            </div>
            <ul className="card-grid">
              {products.map((p) => (
                <li key={p._id} className="card card--compact">
                  <div className="card__top">
                    <span className="pill pill--category">{p.category}</span>
                  </div>
                  <h4 className="card__title">{p.productName}</h4>
                  <p className="card__brand">{p.brand}</p>
                  <p className="card__price">{formatLkr(p.price)}</p>
                  <ShopBadge shop={p.shopId} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "owners" && (
          <section className="panel" aria-labelledby="owners-heading">
            <h2 id="owners-heading" className="panel__title">
              Shop owners
            </h2>
            <p className="panel__lead">
              Create shops and list products through the same REST API the app
              uses.
            </p>
            {ownerMessage && (
              <div className="banner banner--success">{ownerMessage}</div>
            )}

            <div className="split">
              <form className="form form--boxed" onSubmit={onCreateShop}>
                <h3 className="form__heading">New shop</h3>
                <label className="field">
                  <span className="field__label">Shop name</span>
                  <input
                    className="field__input"
                    required
                    value={ownerShop.shopName}
                    onChange={(e) =>
                      setOwnerShop((s) => ({ ...s, shopName: e.target.value }))
                    }
                  />
                </label>
                <label className="field">
                  <span className="field__label">District</span>
                  <input
                    className="field__input"
                    required
                    value={ownerShop.district}
                    onChange={(e) =>
                      setOwnerShop((s) => ({ ...s, district: e.target.value }))
                    }
                  />
                </label>
                <label className="field">
                  <span className="field__label">Address</span>
                  <input
                    className="field__input"
                    required
                    value={ownerShop.address}
                    onChange={(e) =>
                      setOwnerShop((s) => ({ ...s, address: e.target.value }))
                    }
                  />
                </label>
                <label className="field">
                  <span className="field__label">Contact number</span>
                  <input
                    className="field__input"
                    required
                    value={ownerShop.contactNumber}
                    onChange={(e) =>
                      setOwnerShop((s) => ({
                        ...s,
                        contactNumber: e.target.value,
                      }))
                    }
                  />
                </label>
                <button className="btn btn--primary" type="submit">
                  Create shop
                </button>
              </form>

              <form className="form form--boxed" onSubmit={onCreateProduct}>
                <h3 className="form__heading">New product</h3>
                <label className="field">
                  <span className="field__label">Shop</span>
                  <select
                    className="field__input"
                    required
                    value={ownerProduct.shopId}
                    onChange={(e) =>
                      setOwnerProduct((p) => ({ ...p, shopId: e.target.value }))
                    }
                  >
                    <option value="">Select shop…</option>
                    {shops.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.shopName} — {s.district}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span className="field__label">Product name</span>
                  <input
                    className="field__input"
                    required
                    value={ownerProduct.productName}
                    onChange={(e) =>
                      setOwnerProduct((p) => ({
                        ...p,
                        productName: e.target.value,
                      }))
                    }
                  />
                </label>
                <label className="field">
                  <span className="field__label">Brand</span>
                  <input
                    className="field__input"
                    required
                    value={ownerProduct.brand}
                    onChange={(e) =>
                      setOwnerProduct((p) => ({ ...p, brand: e.target.value }))
                    }
                  />
                </label>
                <label className="field">
                  <span className="field__label">Category</span>
                  <input
                    className="field__input"
                    required
                    value={ownerProduct.category}
                    onChange={(e) =>
                      setOwnerProduct((p) => ({
                        ...p,
                        category: e.target.value,
                      }))
                    }
                  />
                </label>
                <label className="field">
                  <span className="field__label">Price (LKR)</span>
                  <input
                    className="field__input"
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={ownerProduct.price}
                    onChange={(e) =>
                      setOwnerProduct((p) => ({ ...p, price: e.target.value }))
                    }
                  />
                </label>
                <label className="field field--inline">
                  <input
                    type="checkbox"
                    checked={ownerProduct.availability}
                    onChange={(e) =>
                      setOwnerProduct((p) => ({
                        ...p,
                        availability: e.target.checked,
                      }))
                    }
                  />
                  <span>Available</span>
                </label>
                <button className="btn btn--primary" type="submit">
                  Add product
                </button>
              </form>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          API:{" "}
          <code>
            {import.meta.env.VITE_API_URL || "same origin / proxied to :8000"}
          </code>
          — run <code>npm start</code> in the project root, then{" "}
          <code>npm run client</code> for this UI.
        </p>
      </footer>
    </div>
  );
}
