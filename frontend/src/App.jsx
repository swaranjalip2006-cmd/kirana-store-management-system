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
            🏪 Kirana Store
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
            <div style={heroStoreIconStyle}>
              🏪
            </div>

            <h2 style={heroStoreTextStyle}>
              Smart Store
              <br />
              Management
            </h2>
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

function AdminDashboard({
  user,
  page,
  setPage,
  counts,
  onLogout
}) {
  const backButton = (
    <button
      onClick={() => setPage("dashboard")}
      style={backButtonStyle}
    >
      ← Back to Dashboard
    </button>
  );

  if (page === "products") {
    return (
      <div style={pageStyle}>
        {backButton}
        <Products />
      </div>
    );
  }

  if (page === "categories") {
    return (
      <div style={pageStyle}>
        {backButton}
        <Categories />
      </div>
    );
  }

  if (page === "suppliers") {
    return (
      <div style={pageStyle}>
        {backButton}
        <Suppliers />
      </div>
    );
  }

  if (page === "purchases") {
    return (
      <div style={pageStyle}>
        {backButton}
        <Purchases />
      </div>
    );
  }

  if (page === "sales") {
    return (
      <div style={pageStyle}>
        {backButton}
        <Sales />
      </div>
    );
  }

  if (page === "customers") {
    return (
      <div style={pageStyle}>
        {backButton}
        <Customers />
      </div>
    );
  }

  if (page === "khata") {
    return (
      <div style={pageStyle}>
        {backButton}
        <Khata />
      </div>
    );
  }

  /* =========================
     REPORTS PAGE
  ========================= */

  if (page === "reports") {
    return (
      <div style={pageStyle}>
        {backButton}
        <Reports />
      </div>
    );
  }

  return (
    <div style={dashboardStyle}>

      <header style={headerStyle}>

        <div style={topBarStyle}>

          <div>

            <h1 style={titleStyle}>
              Kirana Store Management System
            </h1>

            <p style={subtitleStyle}>
              Admin Dashboard
            </p>

          </div>

          <div style={userBoxStyle}>

            <span>
              Welcome, <strong>{user.name}</strong>
            </span>

            <span style={roleStyle}>
              {user.role}
            </span>

            <button
              onClick={onLogout}
              style={logoutButtonStyle}
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      <div style={gridStyle}>

        <div
          onClick={() => setPage("products")}
          style={cardStyle}
        >
          <h2>🛒 Products</h2>
          <h3>{counts.products}</h3>
          <p>Manage products and stock</p>
        </div>

        <div
          onClick={() => setPage("categories")}
          style={cardStyle}
        >
          <h2>📂 Categories</h2>
          <h3>{counts.categories}</h3>
          <p>Manage product categories</p>
        </div>

        <div
          onClick={() => setPage("suppliers")}
          style={cardStyle}
        >
          <h2>🚚 Suppliers</h2>
          <h3>{counts.suppliers}</h3>
          <p>Manage suppliers</p>
        </div>

        <div
          onClick={() => setPage("purchases")}
          style={cardStyle}
        >
          <h2>🛍️ Purchases</h2>
          <h3>{counts.purchases}</h3>
          <p>Manage purchases</p>
        </div>

        <div
          onClick={() => setPage("sales")}
          style={cardStyle}
        >
          <h2>💰 Sales</h2>
          <h3>{counts.sales}</h3>
          <p>Manage sales and billing</p>
        </div>

        <div
          onClick={() => setPage("customers")}
          style={cardStyle}
        >
          <h2>👥 Customers</h2>
          <h3>{counts.customers}</h3>
          <p>Manage customers</p>
        </div>

        <div
          onClick={() => setPage("khata")}
          style={cardStyle}
        >
          <h2>📒 Digital Khata</h2>
          <h3>₹100</h3>
          <p>Current outstanding balance</p>
        </div>

        <div
          onClick={() => setPage("reports")}
          style={cardStyle}
        >
          <h2>📊 Reports</h2>
          <h3>View</h3>
          <p>Business reports and analytics</p>
        </div>

      </div>

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
  return (
    <div style={dashboardStyle}>

      <header style={headerStyle}>

        <div style={topBarStyle}>

          <div>

            <h1 style={titleStyle}>
              Kirana Store
            </h1>

            <p style={subtitleStyle}>
              Customer Dashboard
            </p>

          </div>

          <div style={userBoxStyle}>

            <span>
              Welcome, <strong>{user.name}</strong>
            </span>

            <button
              onClick={onLogout}
              style={logoutButtonStyle}
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      <div style={customerWelcomeStyle}>

        <h2>
          Welcome to Kirana Store
        </h2>

        <p>
          You are logged in as a customer.
        </p>

      </div>

      <div style={gridStyle}>

        <div style={cardStyle}>
          <h2>🛒 Products</h2>
          <p>View available products</p>
        </div>

        <div style={cardStyle}>
          <h2>🧾 My Orders</h2>
          <p>View your purchase history</p>
        </div>

        <div style={cardStyle}>
          <h2>📒 My Khata</h2>
          <p>View credit and outstanding balance</p>
        </div>

        <div style={cardStyle}>
          <h2>🔔 Notifications</h2>
          <p>Payment reminders and updates</p>
        </div>

      </div>

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