import { useEffect, useState } from "react";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const loadSuppliers = () => {
    fetch("http://localhost:5000/suppliers")
      .then((response) => response.json())
      .then((data) => setSuppliers(data))
      .catch((error) => console.log("Error:", error));
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          phone,
          address,
          company,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to add supplier");
        return;
      }

      setMessage("Supplier added successfully!");

      setName("");
      setPhone("");
      setAddress("");
      setCompany("");

      loadSuppliers();
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
      <h1>🚚 Suppliers</h1>
      <p>Supplier Management</p>

      <div
        style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          marginBottom: "30px",
        }}
      >
        <h2>Add Supplier</h2>

        <form onSubmit={handleAddSupplier}>
          <input
            type="text"
            placeholder="Supplier Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
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
            Add Supplier
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "15px", color: "green" }}>{message}</p>
        )}
      </div>

      <h2>Supplier List</h2>

      {suppliers.length === 0 ? (
        <p>No suppliers found.</p>
      ) : (
        <div>
          {suppliers.map((supplier) => (
            <div
              key={supplier._id}
              style={{
                backgroundColor: "white",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            >
              <h2>{supplier.name}</h2>
              <p>Phone: {supplier.phone}</p>
              <p>Address: {supplier.address}</p>
              <p>Company: {supplier.company}</p>
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

export default Suppliers;