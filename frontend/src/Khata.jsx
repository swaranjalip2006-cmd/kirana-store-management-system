import { useEffect, useState } from "react";

function Khata() {
  const [entries, setEntries] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [customer, setCustomer] = useState("");
  const [type, setType] = useState("credit");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadEntries = () => {
    fetch("http://localhost:5000/khata")
      .then((response) => response.json())
      .then((data) => setEntries(data))
      .catch((error) => console.log("Error:", error));
  };

  const loadCustomers = () => {
    fetch("http://localhost:5000/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.log("Error:", error));
  };

  useEffect(() => {
    loadEntries();
    loadCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/khata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          customer,
          type,
          amount: Number(amount),
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update khata");
        return;
      }

      setMessage("Khata updated successfully!");

      setCustomer("");
      setType("credit");
      setAmount("");
      setDescription("");

      loadEntries();
      loadCustomers();
    } catch (error) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>📒 Digital Khata</h1>
      <p>Customer Credit and Payment Records</p>

      {/* Add Khata Entry */}
      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          marginBottom: "30px",
          borderRadius: "10px",
          border: "1px solid #ddd",
        }}
      >
        <h2>➕ Add Credit / Payment</h2>

        <form onSubmit={handleSubmit}>
          <select
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
            style={{
              padding: "12px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            <option value="">Select Customer</option>

            {customers.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              padding: "12px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            <option value="credit">Credit</option>
            <option value="payment">Payment</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            style={{
              padding: "12px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{
              padding: "12px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "12px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Update Khata
          </button>
        </form>

        {message && (
          <p style={{ color: "green", marginTop: "15px" }}>{message}</p>
        )}

        {error && (
          <p style={{ color: "red", marginTop: "15px" }}>{error}</p>
        )}
      </div>

      {/* Khata Records */}
      <h2>Khata Records</h2>

      {entries.length === 0 ? (
        <p>No khata entries found.</p>
      ) : (
        <div>
          {entries.map((entry) => (
            <div
              key={entry._id}
              style={{
                backgroundColor: "white",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            >
              <h2>
                {entry.customer
                  ? entry.customer.name
                  : "Unknown Customer"}
              </h2>

              <p>
                Type:{" "}
                {entry.type === "credit"
                  ? "Credit"
                  : "Payment"}
              </p>

              <p>Amount: ₹{entry.amount}</p>

              <p>Description: {entry.description}</p>

              <p>
                Current Balance: ₹
                {entry.customer ? entry.customer.balance : 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Khata;