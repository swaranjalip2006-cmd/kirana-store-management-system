import { useEffect, useState } from "react";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/suppliers")
      .then((response) => response.json())
      .then((data) => setSuppliers(data))
      .catch((error) => console.log("Error:", error));
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🚚 Suppliers</h1>
      <p>Supplier List</p>

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
                border: "1px solid #ddd"
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

export default Suppliers;