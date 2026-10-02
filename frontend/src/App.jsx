import { useEffect, useState } from "react";
import Products from "./Products";
import Categories from "./Categories";
import Suppliers from "./Suppliers";
import Purchases from "./Purchases";
import Sales from "./Sales";
import Customers from "./Customers";
import Khata from "./Khata";

function App() {
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
    Promise.all([
      fetch("http://localhost:5000/products").then((res) => res.json()),
      fetch("http://localhost:5000/categories").then((res) => res.json()),
      fetch("http://localhost:5000/suppliers").then((res) => res.json()),
      fetch("http://localhost:5000/purchases").then((res) => res.json()),
      fetch("http://localhost:5000/sales").then((res) => res.json()),
      fetch("http://localhost:5000/customers").then((res) => res.json())
    ])
      .then((data) => {
        setCounts({
          products: data[0].length,
          categories: data[1].length,
          suppliers: data[2].length,
          purchases: data[3].length,
          sales: data[4].length,
          customers: data[5].length
        });
      })
      .catch((error) => {
        console.log("Dashboard Error:", error);
      });
  }, []);

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
      <div style={headerStyle}>
        <h1 style={titleStyle}>🛒 Kirana Store</h1>

        <p style={subtitleStyle}>
          Store Management Dashboard
        </p>
      </div>

      <div style={gridStyle}>
        <div onClick={() => setPage("products")} style={cardStyle}>
          <h2>📦 Products</h2>
          <h3>{counts.products}</h3>
          <p>Manage products and stock</p>
        </div>

        <div onClick={() => setPage("categories")} style={cardStyle}>
          <h2>🏷️ Categories</h2>
          <h3>{counts.categories}</h3>
          <p>Manage product categories</p>
        </div>

        <div onClick={() => setPage("suppliers")} style={cardStyle}>
          <h2>🚚 Suppliers</h2>
          <h3>{counts.suppliers}</h3>
          <p>Manage suppliers</p>
        </div>

        <div onClick={() => setPage("purchases")} style={cardStyle}>
          <h2>🛍️ Purchases</h2>
          <h3>{counts.purchases}</h3>
          <p>Manage purchases</p>
        </div>

        <div onClick={() => setPage("sales")} style={cardStyle}>
          <h2>💰 Sales</h2>
          <h3>{counts.sales}</h3>
          <p>Manage sales and billing</p>
        </div>

        <div onClick={() => setPage("customers")} style={cardStyle}>
          <h2>👥 Customers</h2>
          <h3>{counts.customers}</h3>
          <p>Manage customers</p>
        </div>

        <div onClick={() => setPage("khata")} style={cardStyle}>
          <h2>📒 Digital Khata</h2>
          <h3>₹100</h3>
          <p>Current outstanding balance</p>
        </div>
      </div>
    </div>
  );
}

const dashboardStyle = {
  fontFamily: "Arial, sans-serif",
  minHeight: "100vh",
  backgroundColor: "#f5f6fa",
  padding: "clamp(15px, 4vw, 40px)",
  boxSizing: "border-box"
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "30px"
};

const titleStyle = {
  fontSize: "clamp(28px, 5vw, 42px)",
  marginBottom: "10px"
};

const subtitleStyle = {
  color: "#666",
  fontSize: "clamp(14px, 2vw, 18px)",
  margin: 0
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
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

const pageStyle = {
  fontFamily: "Arial, sans-serif",
  minHeight: "100vh",
  backgroundColor: "#f5f6fa",
  padding: "clamp(15px, 4vw, 40px)",
  boxSizing: "border-box"
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

export default App;