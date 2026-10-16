
import { useCallback, useEffect, useState } from "react";

function Khata() {
  const [entries, setEntries] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [customer, setCustomer] = useState("");
  const [type, setType] = useState("credit");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadEntries = useCallback(async () => {
    const response = await fetch("http://localhost:5000/khata");

    if (!response.ok) {
      throw new Error("Could not load khata records");
    }

    const data = await response.json();
    setEntries(Array.isArray(data) ? data : []);
  }, []);

  const loadCustomers = useCallback(async () => {
    const response = await fetch("http://localhost:5000/customers");

    if (!response.ok) {
      throw new Error("Could not load customers");
    }

    const data = await response.json();
    setCustomers(Array.isArray(data) ? data : []);
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([loadEntries(), loadCustomers()]);
  }, [loadEntries, loadCustomers]);

  useEffect(() => {
    refreshData().catch((err) => {
      console.error(err);
      setError("Unable to load Khata data. Please refresh.");
    });
  }, [refreshData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const numericAmount = Number(amount);

    if (!customer) {
      setError("Please select a customer.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/khata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customer,
          type,
          amount: numericAmount,
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update Khata.");
        return;
      }

      setMessage("Khata updated successfully!");

      setCustomer("");
      setType("credit");
      setAmount("");
      setDescription("");

      await refreshData();
    } catch (err) {
      console.error("Khata submit error:", err);
      setError(
        "Could not update Khata. Check whether the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (value) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  return (
    <div
      style={{
        padding: "clamp(12px, 4vw, 30px)",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1100px",
        margin: "0 auto",
        overflowWrap: "anywhere",
      }}
    >
      <h1>📒 Digital Khata</h1>
      <p>Customer Credit and Payment Records</p>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          marginBottom: "30px",
          borderRadius: "10px",
          border: "1px solid #ddd",
        }}
      >
        <h2>➕ Add Credit / Payment</h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
            gap: "12px",
          }}
        >
          <select
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            required
            style={{ padding: "12px", minWidth: 0, width: "100%" }}
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
            required
            style={{ padding: "12px", minWidth: 0, width: "100%" }}
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
            min="0.01"
            step="0.01"
            style={{ padding: "12px", minWidth: 0, width: "100%" }}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ padding: "12px", minWidth: 0, width: "100%" }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 20px",
              backgroundColor: loading ? "#94a3b8" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              width: "100%",
            }}
          >
            {loading ? "Saving..." : "Update Khata"}
          </button>
        </form>

        {message && (
          <p role="status" style={{ color: "green", marginTop: "15px" }}>
            {message}
          </p>
        )}

        {error && (
          <p role="alert" style={{ color: "red", marginTop: "15px" }}>
            {error}
          </p>
        )}
      </div>

      <h2>Khata Records</h2>

      {entries.length === 0 ? (
        <p>No khata entries found.</p>
      ) : (
        entries.map((entry) => (
          <div
            key={entry._id}
            style={{
              backgroundColor: "white",
              padding: "18px",
              marginBottom: "15px",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          >
            <h3>{entry.customer?.name || "Unknown Customer"}</h3>

            <p>
              <strong>Type:</strong>{" "}
              {entry.type === "credit" ? "Credit" : "Payment"}
            </p>

            <p>
              <strong>Amount:</strong> ₹{formatAmount(entry.amount)}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {entry.description || "—"}
            </p>

            <p>
              <strong>Transaction Date:</strong>{" "}
              {entry.date
                ? new Date(entry.date).toLocaleString("en-IN")
                : "Not available"}
            </p>

            <p>
              <strong>Balance after transaction:</strong>{" "}
              {typeof entry.balanceAfter === "number" ? (
                <>₹{formatAmount(entry.balanceAfter)}</>
              ) : (
                <span style={{ color: "#92400e" }}>
                  Not recorded for this older transaction
                </span>
              )}
            </p>

            <p>
              <strong>Current Customer Balance:</strong>{" "}
              {entry.customer &&
              typeof entry.customer.balance === "number" ? (
                <>₹{formatAmount(entry.customer.balance)}</>
              ) : (
                "Not available"
              )}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Khata;
