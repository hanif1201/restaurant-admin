import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context providers
import { AuthProvider } from "./contexts/AuthContext";
import { AlertProvider } from "./contexts/AlertContext";
import { RestaurantProvider } from "./contexts/RestaurantContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Auth pages
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Main pages
import Dashboard from "./pages/Dashboard";
import MenuPage from "./pages/Menu/Menu";
import AddMenuItem from "./pages/Menu/AddMenuItem";
import EditMenuItem from "./pages/Menu/EditMenuItem";
import OrdersPage from "./pages/Orders/Orders";
import OrderDetail from "./pages/Orders/OrderDetail";
import ProfilePage from "./pages/Settings/Profile";
import AccountPage from "./pages/Settings/Account";
import BusinessHoursPage from "./pages/Settings/BusinessHours";
import AnalyticsPage from "./pages/Analytics/Analytics";

// Utilities
import useAuth from "./hooks/useAuth";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  return children;
};

// Restaurant route - checks if user is a restaurant
const RestaurantRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "restaurant") {
    return <Navigate to='/login' />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <AlertProvider>
        <RestaurantProvider>
          <Router>
            <Routes>
              {/* Auth routes */}
              <Route path='/' element={<AuthLayout />}>
                <Route path='/login' element={<Login />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route
                  path='/reset-password/:token'
                  element={<ResetPassword />}
                />
              </Route>

              {/* Main application routes - protected */}
              <Route
                path='/'
                element={
                  <ProtectedRoute>
                    <RestaurantRoute>
                      <MainLayout />
                    </RestaurantRoute>
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />

                {/* Menu routes */}
                <Route path='/menu' element={<MenuPage />} />
                <Route path='/menu/add' element={<AddMenuItem />} />
                <Route path='/menu/edit/:id' element={<EditMenuItem />} />

                {/* Order routes */}
                <Route path='/orders' element={<OrdersPage />} />
                <Route path='/orders/:id' element={<OrderDetail />} />

                {/* Settings routes */}
                <Route path='/settings/profile' element={<ProfilePage />} />
                <Route path='/settings/account' element={<AccountPage />} />
                <Route path='/settings/hours' element={<BusinessHoursPage />} />

                {/* Analytics route */}
                <Route path='/analytics' element={<AnalyticsPage />} />
              </Route>

              {/* Default redirect to dashboard or login */}
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
          </Router>

          {/* Toast notifications container */}
          <ToastContainer position='top-right' autoClose={5000} />
        </RestaurantProvider>
      </AlertProvider>
    </AuthProvider>
  );
};

export default App;
