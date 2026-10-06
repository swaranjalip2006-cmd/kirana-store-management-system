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
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setPage("dashboard");
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
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
        <h2>Welcome to Kirana Store</h2>

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
   STYLES
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

export default App;