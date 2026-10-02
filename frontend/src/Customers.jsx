import { useEffect, useState } from "react";

function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.log("Error:", error));
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>👥 Customers</h1>
      <p>Customer List</p>

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
                border: "1px solid #ddd"
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