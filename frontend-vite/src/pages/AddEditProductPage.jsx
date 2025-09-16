import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditProductPage = () => {
  const { productId } = useParams("");
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStokeQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const BASE_URL = "https://inventixproducts12.s3.ap-south-1.amazonaws.com/";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await ApiService.getAllCategory();
        setCategories(categoriesData.categories);
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error Getting all Categories: " + error
        );
      }
    };

    const fetProductById = async () => {
      if (productId) {
        setIsEditing(true);
        try {
          const productData = await ApiService.getProductById(productId);
          if (productData.status === 200) {
            setName(productData.product.name);
            setSku(productData.product.sku);
            setPrice(productData.product.price);
            setStokeQuantity(productData.product.stockQuantity);
            setCategoryId(productData.product.categoryId);
            setDescription(productData.product.description);

            setImageUrl(
              productData.product.imageUrl
                ? `${BASE_URL}${productData.product.imageUrl}`
                : ""
            );
          } else {
            showMessage(productData.message);
          }
        } catch (error) {
          showMessage(
            error.response?.data?.message ||
              "Error Getting a Product by Id: " + error
          );
        }
      }
    };

    fetchCategories();
    if (productId) fetProductById();
  }, [productId]);

  // Method to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result); // user imageUrl to preview
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("price", price);
    formData.append("stockQuantity", stockQuantity);
    formData.append("categoryId", categoryId);
    formData.append("description", description);
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      if (isEditing) {
        formData.append("productId", productId);
        await ApiService.updateProduct(formData);
        showMessage("Product successfully updated");
      } else {
        await ApiService.addProduct(formData);
        showMessage("Product successfully Saved 🤩");
      }
      navigate("/product");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Saving a Product: " + error
      );
    }
  };

  if (!ApiService.isAdmin()) {
    return (
      <Layout>
        <div className="not-allowed">
          <h2>Access Denied</h2>
          <p>Only Admins can add or edit products.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className="product-form-page">
        <h1>{isEditing ? "Edit Product" : "Add Product"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product-name">Product Name</label>
            <input
              id="product-name"
              name="productName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product-sku">Sku</label>
            <input
              id="product-sku"
              name="sku"
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock-quantity">Stock Quantity</label>
            <input
              id="stock-quantity"
              name="stockQuantity"
              type="number"
              value={stockQuantity}
              onChange={(e) => setStokeQuantity(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product-price">Price</label>
            <input
              id="product-price"
              name="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product-description">Description</label>
            <textarea
              id="product-description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="product-category">Category</label>
            <select
              id="product-category"
              name="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="product-image">Product Image</label>
            <input
              id="product-image"
              name="imageFile"
              type="file"
              onChange={handleImageChange}
            />
            {imageUrl && (
              <img src={imageUrl} alt="preview" className="image-preview" />
            )}
          </div>

          {/* Only show buttons if user is Admin */}
          {ApiService.isAdmin() && (
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {isEditing ? "Save Changes" : "Add Product"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/product")}
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default AddEditProductPage;
