import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

const SellPage = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await ApiService.getAllProducts();
        setProducts(productData.products);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting Products: " + error
        );
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !quantity) {
      showMessage("Please fill in all required fields");
      return;
    }

    const body = {
      productId,
      quantity: parseInt(quantity),
      description,
      note,
    };

    try {
      const response = await ApiService.sellProduct(body);
      showMessage(response.message);
      resetForm();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Selling Product: " + error
      );
    }
  };

  const resetForm = () => {
    setProductId("");
    setDescription("");
    setNote("");
    setQuantity("");
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  if (!ApiService.isManager()) {
    return (
      <Layout>
        <div className="not-allowed">
          <h2>Access Denied</h2>
          <p>Only Managers can access this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className="purchase-form-page">
        <h1>Return To Supplier</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product-select">Select product</label>
            <select
              id="product-select"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity-input">Quantity</label>
            <input
              id="quantity-input"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description-input">Description</label>
            <input
              id="description-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="note-input">Note</label>
            <input
              id="note-input"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button type="submit">Return</button>
        </form>
      </div>
    </Layout>
  );
};

export default SellPage;
