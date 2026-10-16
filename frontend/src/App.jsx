import { useEffect, useState } from "react";

import Login from "./Login";
import Products from "./Products";
import Categories from "./Categories";
import Suppliers from "./Suppliers";
import Purchases from "./Purchases";
import Sales from "./Sales";
import Customers from "./Customers";
import Khata from "./Khata";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Homepage first
  const [showLogin, setShowLogin] = useState(false);

  const [page, setPage] = useState("dashboard");

  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    suppliers: 0,
    purchases: 0,
    sales: 0,
    customers: 0
  });

  useEffect(() => {
    if (!user) return;

    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {};

      const responses = await Promise.all([
        fetch("http://localhost:5000/products", { headers }),
        fetch("http://localhost:5000/categories", { headers }),
        fetch("http://localhost:5000/suppliers", { headers }),
        fetch("http://localhost:5000/purchases", { headers }),
        fetch("http://localhost:5000/sales", { headers }),
        fetch("http://localhost:5000/customers", { headers })
      ]);

      const data = await Promise.all(
        responses.map(async (response) => {
          if (!response.ok) {
            return [];
          }

          const result = await response.json();

          return Array.isArray(result) ? result : [];
        })
      );

      setCounts({
        products: data[0].length,
        categories: data[1].length,
        suppliers: data[2].length,
        purchases: data[3].length,
        sales: data[4].length,
        customers: data[5].length
      });
    } catch (error) {
      console.log("Dashboard Error:", error);
    }
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setShowLogin(false);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setShowLogin(false);
    setPage("dashboard");
  };

  /*
    FLOW:
    Homepage → Login → Dashboard
  */

  if (!user && !showLogin) {
    return (
      <HomePage
        onLogin={() => setShowLogin(true)}
      />
    );
  }

  if (!user && showLogin) {
  return (
    <Login
      onLogin={handleLogin}
      onBackHome={() => setShowLogin(false)}
    />
  );
}


  if (user.role === "Customer") {
    return (
      <CustomerDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <AdminDashboard
      user={user}
      page={page}
      setPage={setPage}
      counts={counts}
      onLogout={handleLogout}
    />
  );
}

/* =========================
   HOME PAGE
========================= */

function HomePage({ onLogin }) {
  return (
    <div style={homePageStyle}>

      {/* NAVBAR */}
      <header style={homeHeaderStyle}>
        <div style={homeNavStyle}>

          

<div style={homeLogoStyle}>
  <img
    src="/kirana-icon.png"
    alt="Smart Kirana Logo"
    style={{
      width: "42px",
      height: "42px",
      objectFit: "contain",
      marginRight: "10px",
      verticalAlign: "middle"
    }}
  />
  Smart Kirana
</div>

<button
  onClick={onLogin}
  style={homeLoginButtonStyle}
>
  Login
</button>

</div>
</header>


      {/* HERO SECTION */}
      <section style={heroSectionStyle}>

        <div style={heroContentStyle}>

          <div style={heroTextStyle}>

            <p style={welcomeLabelStyle}>
              WELCOME TO
            </p>

            <h1 style={heroTitleStyle}>
              Kirana Store
              <br />
              Management System
            </h1>

            <p style={heroDescriptionStyle}>
              A simple and efficient solution to manage your
              kirana store products, inventory, purchases,
              sales, customers and digital khata.
            </p>

            <button
              onClick={onLogin}
              style={heroLoginButtonStyle}
            >
              Login to Dashboard →
            </button>

          </div>

          

          <div style={heroIconBoxStyle}>
            <img
              src="/kirana-icon.png"
              alt="Smart Kirana"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "contain",
                marginBottom: "15px"
              }}
            />

            <h2 style={heroStoreTextStyle}>
              Smart Kirana
            </h2>

            <p
              style={{
                textAlign: "center",
                color: "#1976d2",
                fontSize: "15px",
                margin: "8px 0 0"
              }}
            >
              Store Management System
            </p>
          </div>
        </div>
      </section>


      {/* ABOUT SECTION */}
      <section style={aboutSectionStyle}>

        <div style={sectionContainerStyle}>

          <h2 style={sectionTitleStyle}>
            About the System
          </h2>

          <p style={sectionDescriptionStyle}>
            Kirana Store Management System helps store owners
            manage daily business activities digitally and
            efficiently from one place.
          </p>

        </div>

      </section>

      {/* FEATURES */}
      <section style={featuresSectionStyle}>

        <div style={sectionContainerStyle}>

          <h2 style={sectionTitleStyle}>
            Key Features
          </h2>

          <div style={featureGridStyle}>

            <div style={featureCardStyle}>
              <div style={featureIconStyle}>
                🛒
              </div>

              <h3>
                Products Management
              </h3>

              <p>
                Manage products, prices and available stock.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={featureIconStyle}>
                📦
              </div>

              <h3>
                Inventory Management
              </h3>

              <p>
                Track stock and manage purchases efficiently.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={featureIconStyle}>
                💰
              </div>

              <h3>
                Sales & Billing
              </h3>

              <p>
                Manage sales and generate billing records.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={featureIconStyle}>
                👥
              </div>

              <h3>
                Customer Management
              </h3>

              <p>
                Maintain customer information and records.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={featureIconStyle}>
                📒
              </div>

              <h3>
                Digital Khata
              </h3>

              <p>
                Manage customer credit and payment records.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={featureIconStyle}>
                📊
              </div>

              <h3>
                Reports & Analytics
              </h3>

              <p>
                View important business reports and analytics.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <p>
          © 2026 Kirana Store Management System
        </p>

        <p>
          Smart • Simple • Efficient
        </p>
      </footer>

    </div>
  );
}

/* =========================
   ADMIN / STAFF DASHBOARD
========================= */

function AdminDashboard({ user, page, setPage, counts, onLogout })
 {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "products", label: "Products", icon: "🛒" },
    { id: "categories", label: "Categories", icon: "📂" },
    { id: "suppliers", label: "Suppliers", icon: "🚚" },
    { id: "purchases", label: "Purchases", icon: "🛍️" },
    { id: "sales", label: "Sales & Billing", icon: "💰" },
    { id: "customers", label: "Customers", icon: "👥" },
    { id: "khata", label: "Digital Khata", icon: "📒" },
    { id: "reports", label: "Reports", icon: "📊" },
  ];

  const navigate = (nextPage) => {
    setPage(nextPage);
    setSidebarOpen(false);
  };

  let pageContent;

  switch (page) {
    case "products":
      pageContent = <Products />;
      break;
    case "categories":
      pageContent = <Categories />;
      break;
    case "suppliers":
      pageContent = <Suppliers />;
      break;
    case "purchases":
      pageContent = <Purchases />;
      break;
    case "sales":
      pageContent = <Sales />;
      break;
    case "customers":
      pageContent = <Customers />;
      break;
    case "khata":
      pageContent = <Khata />;
      break;
    case "reports":
      pageContent = <Reports />;
      break;
    default:
      pageContent = (
        <>
          <div className="admin-welcome">
            <h2>Welcome back, {user.name}! 👋</h2>
            <p>Here is your Kirana Store business overview.</p>
          </div>

          <div className="admin-dashboard-grid">
            {[
              {
                id: "products",
                icon: "🛒",
                title: "Products",
                count: counts.products,
                description: "Manage products and stock",
              },
              {
                id: "categories",
                icon: "📂",
                title: "Categories",
                count: counts.categories,
                description: "Manage product categories",
              },
              {
                id: "suppliers",
                icon: "🚚",
                title: "Suppliers",
                count: counts.suppliers,
                description: "Manage suppliers",
              },
              {
                id: "purchases",
                icon: "🛍️",
                title: "Purchases",
                count: counts.purchases,
                description: "Manage purchases",
              },
              {
                id: "sales",
                icon: "💰",
                title: "Sales & Billing",
                count: counts.sales,
                description: "Manage sales and billing",
              },
              {
                id: "customers",
                icon: "👥",
                title: "Customers",
                count: counts.customers,
                description: "Manage customer records",
              },
              {
                id: "khata",
                icon: "📒",
                title: "Digital Khata",
                count: "Open",
                description: "Manage credit and payments",
              },
              {
                id: "reports",
                icon: "📊",
                title: "Reports",
                count: "View",
                description: "Business reports and analytics",
              },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                className="admin-dashboard-card"
                onClick={() => navigate(item.id)}
              >
                <span className="admin-card-icon">{item.icon}</span>
                <span className="admin-card-title">{item.title}</span>
                <span className="admin-card-count">{item.count}</span>
                <span className="admin-card-description">
                  {item.description}
                </span>
                <span className="admin-card-link">Open section →</span>
              </button>
            ))}
          </div>
        </>
      );
  }

  return (
    <div className="admin-app-shell">
      <style>{`
        .admin-app-shell {
          display: flex;
          min-height: 100vh;
          background: #f5f6fa;
          color: #222;
          font-family: Arial, sans-serif;
        }

        .admin-sidebar {
          width: 250px;
          flex: 0 0 250px;
          box-sizing: border-box;
          background: #172554;
          color: white;
          padding: 22px 14px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .admin-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 10px 25px;
          font-size: 19px;
          font-weight: 700;
        }

        .admin-brand img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          background: white;
          border-radius: 8px;
        }

        .admin-sidebar-label {
          color: #a5b4fc;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 1.5px;
          padding: 0 12px 12px;
        }

        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .admin-nav-button {
          display: flex;
          align-items: center;
          gap: 11px;
          width: 100%;
          padding: 12px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #dbeafe;
          text-align: left;
          font-size: 14px;
          cursor: pointer;
        }

        .admin-nav-button:hover {
          background: #263b73;
          color: white;
        }

        .admin-nav-button.active {
          background: #3b82f6;
          color: white;
          font-weight: bold;
        }

        .admin-sidebar-bottom {
          margin-top: auto;
          padding-top: 24px;
        }

        .admin-signed-in {
          color: #cbd5e1;
          font-size: 12px;
          overflow-wrap: anywhere;
          padding: 0 10px 12px;
        }

        .admin-sidebar-logout {
          width: 100%;
          padding: 11px;
          border: 1px solid #64748b;
          border-radius: 8px;
          color: white;
          background: #1e293b;
          cursor: pointer;
          font-size: 14px;
        }

        .admin-sidebar-logout:hover {
          background: #334155;
        }

        .admin-main {
          flex: 1;
          min-width: 0;
          padding: 28px;
          box-sizing: border-box;
        }

        .admin-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .admin-topbar h1 {
          font-size: clamp(23px, 3vw, 32px);
          margin: 0 0 7px;
        }

        .admin-topbar p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .admin-user-box {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: white;
        }

        .admin-role {
          padding: 5px 9px;
          border-radius: 15px;
          background: #dbeafe;
          color: #1d4ed8;
          font-size: 12px;
        }

        .admin-top-logout {
          border: 0;
          border-radius: 6px;
          padding: 9px 12px;
          background: #172554;
          color: white;
          cursor: pointer;
        }

        .admin-welcome {
          margin-bottom: 24px;
          padding: 22px;
          border-radius: 12px;
          border: 1px solid #dbeafe;
          background: white;
        }

        .admin-welcome h2 {
          margin: 0 0 8px;
          font-size: 23px;
        }

        .admin-welcome p {
          margin: 0;
          color: #64748b;
        }

        .admin-dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(205px, 1fr));
          gap: 18px;
        }

        .admin-dashboard-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 9px;
          min-width: 0;
          min-height: 190px;
          padding: 21px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          color: #1e293b;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .admin-dashboard-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 7px 18px rgba(15, 23, 42, 0.09);
        }

        .admin-card-icon {
          font-size: 27px;
        }

        .admin-card-title {
          font-size: 17px;
          font-weight: 700;
        }

        .admin-card-count {
          font-size: 27px;
          font-weight: 700;
          color: #2563eb;
        }

        .admin-card-description {
          font-size: 13px;
          color: #64748b;
        }

        .admin-card-link {
          margin-top: auto;
          color: #2563eb;
          font-size: 12px;
          font-weight: bold;
        }

        .admin-page-panel {
          padding: 22px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          min-width: 0;
          overflow-x: auto;
        }

        .admin-back-button {
          padding: 10px 14px;
          margin-bottom: 18px;
          border: 0;
          border-radius: 7px;
          background: #172554;
          color: white;
          cursor: pointer;
        }

        .admin-mobile-bar {
          display: none;
        }

        @media (max-width: 760px) {
          .admin-app-shell {
            display: block;
          }

          .admin-mobile-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 12px 16px;
            background: #172554;
            color: white;
            position: sticky;
            top: 0;
            z-index: 20;
          }

          .admin-mobile-menu-button {
            border: 1px solid #64748b;
            border-radius: 7px;
            padding: 8px 11px;
            background: #263b73;
            color: white;
            cursor: pointer;
          }

          .admin-sidebar {
            display: none;
            width: 100%;
            min-height: auto;
          }

          .admin-sidebar.mobile-open {
            display: flex;
          }

          .admin-sidebar-bottom {
            margin-top: 20px;
          }

          .admin-main {
            padding: 18px 12px;
          }

          .admin-page-panel {
            padding: 14px;
          }

          .admin-dashboard-grid {
            grid-template-columns: repeat(auto-fit, minmax(155px, 1fr));
            gap: 12px;
          }

          .admin-dashboard-card {
            padding: 15px;
            min-height: 170px;
          }

          .admin-user-box {
            width: 100%;
          }
        }
      `}</style>

      <div className="admin-mobile-bar">
        <strong>🛒 Smart Kirana</strong>
        <button
          type="button"
          className="admin-mobile-menu-button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      <aside
        className={`admin-sidebar${sidebarOpen ? " mobile-open" : ""}`}
      >
        <div className="admin-brand">
          <img src="/kirana-icon.png" alt="Smart Kirana" />
          <span>Smart Kirana</span>
        </div>

        <div className="admin-sidebar-label">MAIN MENU</div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`admin-nav-button${page === item.id ? " active" : ""}`}
              onClick={() => navigate(item.id)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-signed-in">
            Signed in as <strong>{user.name}</strong>
          </div>
          <button
            type="button"
            className="admin-sidebar-logout"
            onClick={onLogout}
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Kirana Store Management System</h1>
            <p>{page === "dashboard"
              ? "Admin Dashboard"
              : navItems.find((item) => item.id === page)?.label || "Dashboard"}
            </p>
          </div>

          <div className="admin-user-box">
            <span>
              Welcome, <strong>{user.name}</strong>
            </span>
            <span className="admin-role">{user.role}</span>
            <button
              type="button"
              className="admin-top-logout"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {page === "dashboard" ? (
          pageContent
        ) : (
          <section className="admin-page-panel">
            <button
              type="button"
              className="admin-back-button"
              onClick={() => navigate("dashboard")}
            >
              ← Back to Dashboard
            </button>
            {pageContent}
          </section>
        )}
      </main>
    </div>
  );
}

/* =========================
   REPORTS
========================= */

function Reports() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/reports",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load reports");
        return;
      }

      setReport(data.report);

    } catch (error) {
      console.log("Reports Error:", error);
      setError("Unable to connect to server");
    }
  };

  if (error) {
    return (
      <div style={reportContainerStyle}>

        <h1>
          📊 Business Reports
        </h1>

        <div style={errorStyle}>
          {error}
        </div>

      </div>
    );
  }

  if (!report) {
    return (
      <div style={reportContainerStyle}>

        <h1>
          📊 Business Reports
        </h1>

        <p>
          Loading reports...
        </p>

      </div>
    );
  }

  return (
    <div style={reportContainerStyle}>

      <h1 style={reportTitleStyle}>
        📊 Business Reports
      </h1>

      <p style={reportSubtitleStyle}>
        Overview of your Kirana Store business
      </p>

      <div style={reportGridStyle}>

        <div style={reportCardStyle}>
          <h2>🛒 Total Products</h2>
          <h1>{report.totalProducts ?? 0}</h1>
          <p>Products available in store</p>
        </div>

        <div style={reportCardStyle}>
          <h2>📦 Total Stock</h2>
          <h1>{report.totalStock ?? 0}</h1>
          <p>Total available stock quantity</p>
        </div>

        <div style={reportCardStyle}>
          <h2>💰 Total Sales</h2>
          <h1>₹{report.totalSales ?? 0}</h1>
          <p>Total sales amount</p>
        </div>

        <div style={reportCardStyle}>
          <h2>🧾 Total Orders</h2>
          <h1>{report.totalOrders ?? 0}</h1>
          <p>Total completed orders</p>
        </div>

      </div>

    </div>
  );
}

/* =========================
   CUSTOMER DASHBOARD
========================= */
function CustomerDashboard({ user, onLogout }) {
  const [customerPage, setCustomerPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [khata, setKhata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "products", label: "Products", icon: "🛒" },
    { id: "orders", label: "My Orders", icon: "🧾" },
    { id: "khata", label: "My Khata", icon: "📒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "profile", label: "My Profile", icon: "👤" },
  ];

  const navigate = (nextPage) => {
    setCustomerPage(nextPage);
    setSidebarOpen(false);
    setMessage("");
    if (nextPage === "products") loadProducts();
    if (nextPage === "orders") loadOrders();
    if (nextPage === "khata") loadKhata();
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/products", { headers });
      const data = await response.json();
      setProducts(response.ok && Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Products Error:", error);
      setProducts([]);
    } finally { setLoading(false); }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/sales", { headers });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setOrders(data.filter((sale) => {
          const customerName = sale.customerName || sale.customer?.name || "";
          return customerName.toLowerCase() === (user.name || "").toLowerCase();
        }));
      } else setOrders([]);
    } catch (error) {
      console.log("Orders Error:", error);
      setOrders([]);
    } finally { setLoading(false); }
  };

  const loadKhata = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/khata", { headers });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setKhata(data.filter((entry) => {
          const customerName = entry.customer?.name || entry.customerName || "";
          return customerName.toLowerCase() === (user.name || "").toLowerCase();
        }));
      } else setKhata([]);
    } catch (error) {
      console.log("Khata Error:", error);
      setKhata([]);
    } finally { setLoading(false); }
  };

  let customerContent;
  if (customerPage === "products") {
    customerContent = <>
      <div style={customerWelcomeStyle}><h1>🛒 Available Products</h1><p>View products available in Kirana Store.</p></div>
      {loading ? <p>Loading products...</p> : products.length === 0 ? <div style={customerWelcomeStyle}><p>No products available.</p></div> :
        <div style={gridStyle}>{products.map((product) => <div key={product._id} style={cardStyle}>
          <h2>🛒 {product.name}</h2>
          <p><strong>Category:</strong> {product.category?.name || product.category || "N/A"}</p>
          <p><strong>Price:</strong> ₹{product.price ?? 0}</p>
          <p><strong>Stock:</strong> {product.quantity ?? product.stock ?? 0}</p>
        </div>)}</div>}
    </>;
  } else if (customerPage === "orders") {
    customerContent = <>
      <div style={customerWelcomeStyle}><h1>🧾 My Orders</h1><p>Purchase history for {user.name}.</p></div>
      {loading ? <p>Loading orders...</p> : orders.length === 0 ? <div style={customerWelcomeStyle}><p>No orders found.</p></div> :
        <div style={gridStyle}>{orders.map((order) => <div key={order._id} style={cardStyle}>
          <h2>🧾 Order</h2>
          <p><strong>Product:</strong> {order.product?.name || order.productName || "N/A"}</p>
          <p><strong>Quantity:</strong> {order.quantity ?? 0}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount ?? order.total ?? 0}</p>
          <p><strong>Payment:</strong> {order.paymentMethod || "N/A"}</p>
        </div>)}</div>}
    </>;
  } else if (customerPage === "khata") {
    customerContent = <>
      <div style={customerWelcomeStyle}><h1>📒 My Khata</h1><p>Credit and outstanding balance for {user.name}.</p></div>
      {loading ? <p>Loading Khata...</p> : khata.length === 0 ? <div style={customerWelcomeStyle}><p>No Khata entries found.</p></div> :
        <div style={gridStyle}>{khata.map((entry) => <div key={entry._id} style={cardStyle}>
          <h2>📒 Khata Entry</h2>
          <p><strong>Type:</strong> {entry.type || "Credit"}</p>
          <p><strong>Amount:</strong> ₹{entry.amount ?? 0}</p>
          <p><strong>Balance:</strong> ₹{entry.balance ?? 0}</p>
          <p><strong>Date:</strong> {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "N/A"}</p>
        </div>)}</div>}
    </>;
  } else if (customerPage === "notifications") {
    customerContent = <>
      <div style={customerWelcomeStyle}><h1>🔔 Notifications</h1><p>Payment reminders and important updates.</p></div>
      <div style={gridStyle}>
        <div style={cardStyle}><h2>💳 Payment Reminder</h2><p>Check your Digital Khata for any outstanding balance.</p></div>
        <div style={cardStyle}><h2>🛒 Store Update</h2><p>You can view the latest available products from the Products section.</p></div>
      </div>
    </>;
  } else if (customerPage === "profile") {
    customerContent = <>
      <div style={customerWelcomeStyle}><h1>👤 My Profile</h1><p>View your account information.</p></div>
      <div style={{ ...cardStyle, maxWidth: 650, cursor: "default" }}>
        <p><strong>Name:</strong> {user.name || "N/A"}</p>
        <p><strong>Email:</strong> {user.email || "N/A"}</p>
        <p><strong>Role:</strong> {user.role || "Customer"}</p>
        <button onClick={onLogout} style={logoutButtonStyle}>↪ Logout</button>
      </div>
    </>;
  } else {
    customerContent = <>
      <header style={headerStyle}><div style={topBarStyle}>
        <div><h1 style={titleStyle}>Kirana Store</h1><p style={subtitleStyle}>Customer Dashboard</p></div>
        <div style={userBoxStyle}><span>Welcome, <strong>{user.name}</strong></span><span style={roleStyle}>Customer</span></div>
      </div></header>
      <div style={customerWelcomeStyle}><h2>Welcome to Kirana Store</h2><p>You are logged in as a customer.</p></div>
      <div style={gridStyle}>
        <div onClick={() => navigate("products")} style={cardStyle}><h2>🛒 Products</h2><p>View available products</p></div>
        <div onClick={() => navigate("orders")} style={cardStyle}><h2>🧾 My Orders</h2><p>View your purchase history</p></div>
        <div onClick={() => navigate("khata")} style={cardStyle}><h2>📒 My Khata</h2><p>View credit and outstanding balance</p></div>
        <div onClick={() => navigate("notifications")} style={cardStyle}><h2>🔔 Notifications</h2><p>Payment reminders and updates</p></div>
        <div onClick={() => navigate("profile")} style={cardStyle}><h2>👤 My Profile</h2><p>View your account information</p></div>
      </div>
    </>;
  }

  return (
    <div className="customer-app-shell">
      <style>{`
        .customer-app-shell { display:flex; min-height:100vh; background:#f5f6fa; font-family:Arial,sans-serif; color:#222; }
        .customer-sidebar { width:250px; flex:0 0 250px; background:#0f766e; color:white; padding:22px 14px; box-sizing:border-box; display:flex; flex-direction:column; }
        .customer-brand { display:flex; align-items:center; gap:10px; padding:4px 10px 24px; font-size:19px; font-weight:700; }
        .customer-brand img { width:38px; height:38px; object-fit:contain; background:white; border-radius:9px; }
        .customer-nav { display:flex; flex-direction:column; gap:6px; }
        .customer-nav-button { border:0; width:100%; text-align:left; color:#ccfbf1; background:transparent; padding:12px 13px; border-radius:8px; cursor:pointer; font-size:14px; }
        .customer-nav-button:hover { background:#115e59; color:white; }
        .customer-nav-button.active { background:#14b8a6; color:#042f2e; font-weight:700; }
        .customer-sidebar-bottom { margin-top:auto; padding-top:24px; }
        .customer-logout { width:100%; padding:12px; border:1px solid #5eead4; border-radius:8px; color:white; background:#134e4a; cursor:pointer; font-size:14px; }
        .customer-main { min-width:0; flex:1; padding:clamp(16px,3vw,34px); box-sizing:border-box; overflow-x:hidden; }
        .customer-mobile-bar { display:none; }
        @media (max-width:760px) {
          .customer-app-shell { display:block; }
          .customer-mobile-bar { display:flex; align-items:center; justify-content:space-between; gap:12px; background:#0f766e; color:white; padding:12px 16px; position:sticky; top:0; z-index:30; }
          .customer-mobile-menu-button { border:1px solid #5eead4; background:#115e59; color:white; border-radius:7px; padding:8px 12px; font-size:16px; }
          .customer-sidebar { display:none; width:100%; }
          .customer-sidebar.mobile-open { display:flex; }
          .customer-brand { padding-bottom:16px; }
          .customer-main { padding:16px 12px 24px; }
        }
      `}</style>
      <div className="customer-mobile-bar">
        <strong>🛒 Smart Kirana</strong>
        <button className="customer-mobile-menu-button" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle customer navigation">
          {sidebarOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>
      <aside className={`customer-sidebar${sidebarOpen ? " mobile-open" : ""}`}>
        <div className="customer-brand"><img src="/kirana-icon.png" alt="Smart Kirana" /><span>Smart Kirana</span></div>
        <nav className="customer-nav" aria-label="Customer navigation">
          {navItems.map((item) => <button key={item.id} className={`customer-nav-button${customerPage === item.id ? " active" : ""}`} onClick={() => navigate(item.id)}>
            <span style={{ display:"inline-block", width:27 }}>{item.icon}</span>{item.label}
          </button>)}
        </nav>
        <div className="customer-sidebar-bottom">
          <div style={{ fontSize:13, color:"#ccfbf1", padding:"0 10px 12px", overflowWrap:"anywhere" }}>Signed in as <strong>{user.name}</strong></div>
          <button className="customer-logout" onClick={onLogout}>↪ Logout</button>
        </div>
      </aside>
      <main className="customer-main">{customerContent}</main>
    </div>
  );
}

/* =========================
   HOMEPAGE STYLES
========================= */

const homePageStyle = {
  fontFamily: "Arial, sans-serif",
  minHeight: "100vh",
  backgroundColor: "#f5f6fa",
  color: "#222"
};

const homeHeaderStyle = {
  backgroundColor: "white",
  borderBottom: "1px solid #ddd",
  position: "sticky",
  top: 0,
  zIndex: 10
};

const homeNavStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "18px 25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px"
};


const homeLogoStyle = {
  display: "flex",
  alignItems: "center",
  fontSize: "22px",
  fontWeight: "bold"
};


const homeLoginButtonStyle = {
  padding: "10px 24px",
  border: "none",
  borderRadius: "7px",
  backgroundColor: "#222",
  color: "white",
  cursor: "pointer",
  fontSize: "15px"
};

const heroSectionStyle = {
  backgroundColor: "#eeeeee",
  padding: "clamp(50px, 8vw, 100px) 25px"
};

const heroContentStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "50px",
  flexWrap: "wrap"
};

const heroTextStyle = {
  flex: "1 1 500px"
};

const welcomeLabelStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  letterSpacing: "2px",
  marginBottom: "15px"
};

const heroTitleStyle = {
  fontSize: "clamp(36px, 6vw, 62px)",
  lineHeight: "1.1",
  margin: "0 0 25px"
};

const heroDescriptionStyle = {
  fontSize: "18px",
  lineHeight: "1.7",
  color: "#555",
  maxWidth: "650px",
  marginBottom: "30px"
};

const heroLoginButtonStyle = {
  padding: "14px 25px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#222",
  color: "white",
  cursor: "pointer",
  fontSize: "16px"
};

const heroIconBoxStyle = {
  flex: "1 1 280px",
  minHeight: "300px",
  backgroundColor: "#d9efff",
  border: "1px solid #a8d8f5",
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  boxSizing: "border-box",
  boxShadow: "0 5px 20px rgba(0,0,0,0.08)"
};

const heroStoreIconStyle = {
  fontSize: "100px",
  marginBottom: "15px"
};

const heroStoreTextStyle = {
  textAlign: "center",
  margin: "25px 0 0 0",
  lineHeight: "1.4",
  color: "#1976d2",
  fontSize: "22px",
  fontWeight: "700"
};

const aboutSectionStyle = {
  backgroundColor: "white",
  padding: "70px 25px"
};

const sectionContainerStyle = {
  maxWidth: "1200px",
  margin: "0 auto"
};

const sectionTitleStyle = {
  textAlign: "center",
  fontSize: "32px",
  marginBottom: "15px"
};

const sectionDescriptionStyle = {
  textAlign: "center",
  maxWidth: "750px",
  margin: "0 auto",
  color: "#666",
  fontSize: "17px",
  lineHeight: "1.7"
};

const featuresSectionStyle = {
  padding: "70px 25px",
  backgroundColor: "#f5f6fa"
};

const featureGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: "20px",
  marginTop: "35px"
};

const featureCardStyle = {
  backgroundColor: "white",
  padding: "28px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  minHeight: "190px",
  boxSizing: "border-box",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
};

const featureIconStyle = {
  fontSize: "42px",
  marginBottom: "10px"
};

const footerStyle = {
  backgroundColor: "#222",
  color: "white",
  padding: "25px",
  textAlign: "center"
};

/* =========================
   DASHBOARD STYLES
========================= */

const dashboardStyle = {
  fontFamily: "Arial, sans-serif",
  minHeight: "100vh",
  backgroundColor: "#f5f6fa",
  padding: "clamp(15px, 4vw, 40px)",
  boxSizing: "border-box"
};

const pageStyle = {
  fontFamily: "Arial, sans-serif",
  minHeight: "100vh",
  backgroundColor: "#f5f6fa",
  padding: "clamp(15px, 4vw, 40px)",
  boxSizing: "border-box"
};

const headerStyle = {
  marginBottom: "30px"
};

const topBarStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap"
};

const titleStyle = {
  fontSize: "clamp(26px, 5vw, 40px)",
  margin: "0 0 8px 0"
};

const subtitleStyle = {
  color: "#666",
  fontSize: "17px",
  margin: 0
};

const userBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  backgroundColor: "white",
  padding: "12px 15px",
  borderRadius: "10px",
  border: "1px solid #ddd"
};

const roleStyle = {
  backgroundColor: "#eee",
  padding: "5px 10px",
  borderRadius: "15px",
  fontSize: "13px"
};

const logoutButtonStyle = {
  padding: "8px 14px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#222",
  color: "white",
  cursor: "pointer"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: "20px",
  maxWidth: "1200px",
  margin: "0 auto"
};

const cardStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  cursor: "pointer",
  boxSizing: "border-box",
  minHeight: "170px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
};

const backButtonStyle = {
  padding: "10px 16px",
  marginBottom: "20px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#333",
  color: "white",
  cursor: "pointer",
  fontSize: "14px"
};

const customerWelcomeStyle = {
  maxWidth: "1200px",
  margin: "0 auto 25px",
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  boxSizing: "border-box"
};

/* =========================
   REPORT STYLES
========================= */

const reportContainerStyle = {
  maxWidth: "1200px",
  margin: "0 auto"
};

const reportTitleStyle = {
  margin: "0 0 8px 0",
  fontSize: "32px"
};

const reportSubtitleStyle = {
  color: "#666",
  marginBottom: "25px"
};

const reportGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: "20px"
};

const reportCardStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
};

const errorStyle = {
  backgroundColor: "#ffe5e5",
  color: "#b00020",
  padding: "15px",
  borderRadius: "8px",
  marginTop: "20px"
};

export default App;