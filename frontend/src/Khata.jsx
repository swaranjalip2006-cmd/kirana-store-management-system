import { useEffect, useState } from "react";

function Khata() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/khata")
      .then((response) => response.json())
      .then((data) => setEntries(data))
      .catch((error) => console.log("Error:", error));
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>📒 Digital Khata</h1>
      <p>Customer Credit and Payment Records</p>

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
                border: "1px solid #ddd"
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
                {entry.customer
                  ? entry.customer.balance
                  : 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Khata;