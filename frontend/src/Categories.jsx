import { useEffect, useState } from "react";

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.log("Error:", error));
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🏷️ Categories</h1>
      <p>Category List</p>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div>
          {categories.map((category) => (
            <div
              key={category._id}
              style={{
                backgroundColor: "white",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
                border: "1px solid #ddd"
              }}
            >
              <h2>{category.name}</h2>
              <p>Description: {category.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;