import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useApp } from './context/AppContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ReturnOrderPage = lazy(() => import('./pages/ReturnOrderPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage'));
const AdminReturnsPage = lazy(() => import('./pages/AdminReturnsPage'));
const AdminCouponsPage = lazy(() => import('./pages/AdminCouponsPage'));
const AdminFeaturedPage = lazy(() => import('./pages/AdminFeaturedPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const Loader = () => (
  <div className="container-shell py-16">Loading...</div>
);

const App = () => {
  const { loading } = useApp();

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<CategoryPage />} />
          <Route path="/categories" element={<Navigate to="/shop" replace />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute role={["customer", "admin"]}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/returns/new"
            element={
              <ProtectedRoute role="customer">
                <ReturnOrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute role="customer">
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute role="admin">
                <AdminProductsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="admin">
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/returns"
            element={
              <ProtectedRoute role="admin">
                <AdminReturnsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/coupons"
            element={
              <ProtectedRoute role="admin">
                <AdminCouponsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/featured"
            element={
              <ProtectedRoute role="admin">
                <AdminFeaturedPage />
              </ProtectedRoute>
            }
          />

          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;