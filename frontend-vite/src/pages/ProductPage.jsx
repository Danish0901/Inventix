import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const isAdmin = ApiService.isAdmin();

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Pagination Set-Up
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  // ✅ Add your S3 base URL here
  const BASE_URL = "https://inventixproducts12.s3.ap-south-1.amazonaws.com/";

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productData = await ApiService.getAllProducts();

        if (productData.status === 200) {
          setTotalPages(Math.ceil(productData.products.length / itemsPerPage));

          // ✅ Map products to prepend S3 URL
          const updatedProducts = productData.products.map((product) => ({
            ...product,
            imageUrl: product.imageUrl
              ? `${BASE_URL}${product.imageUrl}`
              : null,
          }));

          setProducts(
            updatedProducts.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting Products: " + error
        );
      }
    };

    getProducts();
  }, [currentPage]);

  // Delete a product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this Product?")) {
      try {
        await ApiService.deleteProduct(productId);
        showMessage("Product sucessfully Deleted");
        window.location.reload(); // reload page
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Deleting a product: " + error
        );
      }
    }
  };

  // Method to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className="product-page">
        <div className="product-header">
          <h1>Products</h1>
          {isAdmin && (
            <button
              className="add-product-btn"
              onClick={() => navigate("/add-product")}
            >
              Add Product
            </button>
          )}
        </div>

        {products && (
          <div className="product-list">
            {products.map((product) => (
              <div key={product.id} className="product-item">
                {product.imageUrl ? (
                  <img
                    className="product-image"
                    src={product.imageUrl}
                    alt={product.name}
                  />
                ) : (
                  <div className="product-image-placeholder">No Image</div>
                )}

                <div className="product-info">
                  <h3 className="name">{product.name}</h3>
                  <p className="sku">Sku: {product.sku}</p>
                  <p className="price">Price: {product.price}</p>
                  <p className="quantity">Quantity: {product.stockQuantity}</p>
                </div>

                {isAdmin && (
                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Layout>
  );
};

export default ProductPage;
