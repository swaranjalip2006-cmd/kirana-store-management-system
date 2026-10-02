import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.log("Error:", error));
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>📦 Products</h1>
      <p>Product List</p>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div>
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                backgroundColor: "white",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                border: "1px solid #ddd"
              }}
            >
              <h2>{product.name}</h2>
              <p>Category: {product.category}</p>
              <p>Price: ₹{product.price}</p>
              <p>Stock: {product.quantity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;