import { useEffect, useState } from "react";

function Purchases() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/purchases")
      .then((response) => response.json())
      .then((data) => setPurchases(data))
      .catch((error) => console.log("Error:", error));
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🛍️ Purchases</h1>
      <p>Purchase List</p>

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
                border: "1px solid #ddd"
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

export default Purchases;