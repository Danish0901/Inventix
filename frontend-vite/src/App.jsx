import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ProtectedRoute,
  AdminRoute,
  AdminOrManagerRoute,
} from "./service/Guard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CategoryPage from "./pages/CategoryPage";
import SupplierPage from "./pages/SupplierPage";
import AddEditSupplierPage from "./pages/AddEditSupplierPage";
import ProductPage from "./pages/ProductPage";
import AddEditProductPage from "./pages/AddEditProductPage";
import PurchasePage from "./pages/PurchasePage";
import SellPage from "./pages/SellPage";
import TransactionsPage from "./pages/TransactionsPage";
import TransactionDetailsPage from "./pages/TransactionDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/category"
          element={<AdminRoute element={<CategoryPage />} />}
        />
        <Route
          path="/supplier"
          element={<AdminOrManagerRoute element={<SupplierPage />} />}
        />
        <Route
          path="/add-supplier"
          element={<AdminRoute element={<AddEditSupplierPage />} />}
        />
        <Route
          path="/edit-supplier/:supplierId"
          element={<AdminRoute element={<AddEditSupplierPage />} />}
        />

        {/* PRODUCT ROUTES */}
        {/* Only MANAGERS can view products */}
        <Route
          path="/product"
          element={<AdminOrManagerRoute element={<ProductPage />} />}
        />
        {/* Only ADMIN can add/edit products */}
        <Route
          path="/add-product"
          element={<AdminRoute element={<AddEditProductPage />} />}
        />
        <Route
          path="/edit-product/:productId"
          element={<AdminRoute element={<AddEditProductPage />} />}
        />

        {/* ADMIN AND MANAGERS ROUTES */}
        <Route
          path="/purchase"
          element={<ProtectedRoute element={<PurchasePage />} />}
        />
        <Route
          path="/sell"
          element={<ProtectedRoute element={<SellPage />} />}
        />
        <Route
          path="/transaction"
          element={<ProtectedRoute element={<TransactionsPage />} />}
        />
        <Route
          path="/transaction/:transactionId"
          element={<ProtectedRoute element={<TransactionDetailsPage />} />}
        />

        <Route
          path="/profile"
          element={<ProtectedRoute element={<ProfilePage />} />}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<DashboardPage />} />}
        />

        {/* DEFAULT: redirect to login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
