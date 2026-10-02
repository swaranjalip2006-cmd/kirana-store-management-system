import { useEffect, useState } from "react";

function Sales() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/sales")
      .then((response) => response.json())
      .then((data) => setSales(data))
      .catch((error) => console.log("Error:", error));
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>💰 Sales & Billing</h1>
      <p>Sales List</p>

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
                border: "1px solid #ddd"
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

export default Sales;