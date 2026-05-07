import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { GlobalStyles } from './styles/GlobalStyles';
import LoadingSpinner from './components/LoadingSpinner';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import SearchPage from './pages/SearchPage';
import RecommendedPage from './pages/RecommendedPage';
import ContactsPage from './pages/ContactsPage';
import HowToBuyPage from './pages/HowToBuyPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import ChatBot from './components/ChatBot';
import MusicPlayer from './components/MusicPlayer';  // 👈 ДОБАВИТЬ ЭТУ СТРОКУ
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Минимальная задержка для плавного отображения
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <GlobalStyles />
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:type" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/recommended" element={<RecommendedPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/how-to-buy" element={<HowToBuyPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Routes>
            <ChatBot />
            <MusicPlayer />  {/* 👈 ДОБАВИТЬ ЭТУ СТРОКУ */}
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;