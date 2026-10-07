import { useEffect, useState } from "react";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [supplier, setSupplier] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [message, setMessage] = useState("");

  const loadPurchases = () => {
    fetch("http://localhost:5000/purchases")
      .then((response) => response.json())
      .then((data) => setPurchases(data))
      .catch((error) => console.log("Error:", error));
  };

  const loadSuppliers = () => {
    fetch("http://localhost:5000/suppliers")
      .then((response) => response.json())
      .then((data) => setSuppliers(data))
      .catch((error) => console.log("Error:", error));
  };

  const loadProducts = () => {
    fetch("http://localhost:5000/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.log("Error:", error));
  };

  useEffect(() => {
    loadPurchases();
    loadSuppliers();
    loadProducts();
  }, []);

  const handleAddPurchase = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          supplier,
          product,
          quantity: Number(quantity),
          purchasePrice: Number(purchasePrice),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to add purchase");
        return;
      }

      setMessage("Purchase added successfully!");

      setSupplier("");
      setProduct("");
      setQuantity("");
      setPurchasePrice("");

      loadPurchases();
      loadProducts();
    } catch (error) {
      console.log("Error:", error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
        backgroundColor: "#f5f6fa",
        minHeight: "100vh",
      }}
    >
      <h1>🛍️ Purchases</h1>
      <p>Purchase Management</p>

      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          marginBottom: "30px",
        }}
      >
        <h2>Add Purchase</h2>

        <form onSubmit={handleAddPurchase}>
          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Select Supplier</option>

            {suppliers.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Select Product</option>

            {products.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} - Current Stock: {item.quantity}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            required
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Purchase Price"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            min="1"
            required
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              padding: "12px 20px",
              backgroundColor: "#333",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Add Purchase
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "15px", color: "green" }}>
            {message}
          </p>
        )}
      </div>

      <h2>Purchase List</h2>

      {purchases.length === 0 ? (
        <p>No purchases found.</p>
      ) : (
        <div>
          {purchases.map((purchase) => (
            <div
              key={purchase._id}
              style={{
                backgroundColor: "white",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            >
              <h2>Purchase Details</h2>

              <p>
                Supplier:{" "}
                {purchase.supplier
                  ? purchase.supplier.name
                  : "Unknown"}
              </p>

              <p>
                Product:{" "}
                {purchase.product
                  ? purchase.product.name
                  : "Unknown"}
              </p>

              <p>Quantity: {purchase.quantity}</p>

              <p>Purchase Price: ₹{purchase.purchasePrice}</p>

              <p>Total Amount: ₹{purchase.totalAmount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  maxWidth: "500px",
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "15px",
  boxSizing: "border-box",
};

export default Purchases;