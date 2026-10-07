import { useEffect, useState } from "react";

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  const [product, setProduct] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [message, setMessage] = useState("");

  const loadSales = () => {
    fetch("http://localhost:5000/sales")
      .then((response) => response.json())
      .then((data) => setSales(data))
      .catch((error) => console.log("Error:", error));
  };

  const loadProducts = () => {
    fetch("http://localhost:5000/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.log("Error:", error));
  };

  useEffect(() => {
    loadSales();
    loadProducts();
  }, []);

  const handleAddSale = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          product,
          customerName,
          quantity: Number(quantity),
          sellingPrice: Number(sellingPrice),
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to complete sale");
        return;
      }

      setMessage("Sale completed successfully!");

      setProduct("");
      setCustomerName("");
      setQuantity("");
      setSellingPrice("");
      setPaymentMethod("Cash");

      loadSales();
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
      <h1>💰 Sales & Billing</h1>
      <p>Sales Management</p>

      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          marginBottom: "30px",
        }}
      >
        <h2>Add Sale / Billing</h2>

        <form onSubmit={handleAddSale}>
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Select Product</option>

            {products.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} - Stock: {item.quantity}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            style={inputStyle}
          />

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
            placeholder="Selling Price"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            min="1"
            required
            style={inputStyle}
          />

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={inputStyle}
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Credit">Credit</option>
          </select>

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
            Complete Sale
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "15px", color: "green" }}>
            {message}
          </p>
        )}
      </div>

      <h2>Sales List</h2>

      {sales.length === 0 ? (
        <p>No sales found.</p>
      ) : (
        <div>
          {sales.map((sale) => (
            <div
              key={sale._id}
              style={{
                backgroundColor: "white",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            >
              <h2>Sale Details</h2>

              <p>
                Product:{" "}
                {sale.product
                  ? sale.product.name
                  : "Unknown"}
              </p>

              <p>Customer: {sale.customerName}</p>

              <p>Quantity: {sale.quantity}</p>

              <p>Selling Price: ₹{sale.sellingPrice}</p>

              <p>Total Amount: ₹{sale.totalAmount}</p>

              <p>Payment Method: {sale.paymentMethod}</p>
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

export default Sales;