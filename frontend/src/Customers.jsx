import { useEffect, useState } from "react";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCustomers = () => {
    fetch("http://localhost:5000/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.log("Error:", error));
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleAddCustomer = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          name: name,
          phone: phone,
          address: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to add customer");
        return;
      }

      setMessage("Customer added successfully!");

      setName("");
      setPhone("");
      setAddress("");

      loadCustomers();
    } catch (error) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>👥 Customers</h1>
      <p>Customer Management</p>

      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          marginBottom: "30px",
          borderRadius: "10px",
          border: "1px solid #ddd",
        }}
      >
        <h2>➕ Add Customer</h2>

        <form onSubmit={handleAddCustomer}>
          <input
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              padding: "12px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{
              padding: "12px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
            Add Customer
          </button>
        </form>

        {message && (
          <p style={{ color: "green", marginTop: "15px" }}>{message}</p>
        )}

        {error && (
          <p style={{ color: "red", marginTop: "15px" }}>{error}</p>
        )}
      </div>

      <h2>Customer List</h2>

      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div>
          {customers.map((customer) => (
            <div
              key={customer._id}
              style={{
                backgroundColor: "white",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            >
              <h2>{customer.name}</h2>
              <p>Phone: {customer.phone}</p>
              <p>Address: {customer.address}</p>
              <p>Balance: ₹{customer.balance}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Customers;