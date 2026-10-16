
import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/products"
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load products");
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      price: "",
      quantity: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Please login again as Admin.");
      return;
    }

    try {
      setLoading(true);

      const isEditing = Boolean(editingId);
      const url = isEditing
        ? `http://localhost:5000/products/${editingId}`
        : "http://localhost:5000/products";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers,
        body: JSON.stringify({
          name: form.name.trim(),
          category: form.category.trim(),
          price: Number(form.price),
          quantity: Number(form.quantity)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save product"
        );
      }

      setMessage(
        isEditing
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      category:
        typeof product.category === "object"
          ? product.category?.name || ""
          : product.category || "",
      price: product.price ?? "",
      quantity: product.quantity ?? 0
    });

    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    if (!token) {
      setError("Please login again as Admin.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/products/${product._id}`,
        {
          method: "DELETE",
          headers
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete product");
      }

      setMessage("Product deleted successfully!");

      if (editingId === product._id) {
        resetForm();
      }

      await loadProducts();
    } catch (err) {
      setError(err.message || "Unable to connect to server");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "11px",
    marginTop: "6px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    marginRight: "8px",
    marginTop: "8px"
  };

  return (
    <div
      style={{
        padding: "clamp(15px, 4vw, 30px)",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f6fa",
        minHeight: "100vh",
        boxSizing: "border-box"
      }}
    >
      <h1>📦 Products Management</h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "22px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          maxWidth: "600px",
          marginBottom: "30px"
        }}
      >
        <h2>
          {editingId ? "✏️ Edit Product" : "➕ Add New Product"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Rice"
            style={inputStyle}
            required
          />

          <label>Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Grocery"
            style={inputStyle}
            required
          />

          <label>Price (₹)</label>
          <input
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label>Quantity / Stock</label>
          <input
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={form.quantity}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              backgroundColor: "#1976d2"
            }}
          >
            {loading
              ? "Saving..."
              : editingId
                ? "Update Product"
                : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                ...buttonStyle,
                backgroundColor: "#666"
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {message && (
        <p style={{ color: "green" }}>{message}</p>
      )}

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      <h2>📋 Product List ({products.length})</h2>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            style={{
              backgroundColor: "white",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "10px",
              border: "1px solid #ddd"
            }}
          >
            <h3>{product.name}</h3>
            <p>
              Category: {product.category?.name || product.category || "N/A"}
            </p>
            <p>Price: ₹{product.price}</p>
            <p>Stock: {product.quantity ?? product.stock ?? 0}</p>

            <button
              onClick={() => handleEdit(product)}
              style={{
                ...buttonStyle,
                backgroundColor: "#1976d2"
              }}
            >
              ✏️ Edit
            </button>

            <button
              onClick={() => handleDelete(product)}
              style={{
                ...buttonStyle,
                backgroundColor: "#d32f2f"
              }}
            >
              🗑️ Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Products;
