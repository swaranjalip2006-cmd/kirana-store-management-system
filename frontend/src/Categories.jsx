import { useEffect, useState } from "react";

function Categories() {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/categories");
      const data = await response.json();

      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Please enter category name.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to add category.");
        return;
      }

      setMessage("Category added successfully.");

      setName("");
      setDescription("");

      loadCategories();
    } catch (error) {
      console.log("Error:", error);
      setError("Unable to connect to server.");
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f6fa",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h1>🗂️ Categories</h1>
      <p>Manage store categories</p>

      {/* Add Category */}
      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          marginBottom: "30px",
          maxWidth: "600px",
        }}
      >
        <h2>Add Category</h2>

        <form onSubmit={handleAddCategory}>
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: "bold",
              }}
            >
              Category Name
            </label>

            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: "bold",
              }}
            >
              Description
            </label>

            <input
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#c00000" }}>
              {error}
            </p>
          )}

          {message && (
            <p style={{ color: "green" }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#222",
              color: "white",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Add Category
          </button>
        </form>
      </div>

      {/* Category List */}
      <h2>Category List</h2>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div>
          {categories.map((category) => (
            <div
              key={category._id}
              style={{
                backgroundColor: "white",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                maxWidth: "700px",
              }}
            >
              <h2>{category.name}</h2>
              <p>
                Description: {category.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;