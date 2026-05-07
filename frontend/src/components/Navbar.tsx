import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const fadeOutRotate = keyframes`
  0% { opacity: 1; transform: rotate(0deg) scale(1); }
  100% { opacity: 0; transform: rotate(90deg) scale(0.5); }
`;

const fadeInRotate = keyframes`
  0% { opacity: 0; transform: rotate(-90deg) scale(0.5); }
  100% { opacity: 1; transform: rotate(0deg) scale(1); }
`;

const cartBump = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.25); }
  70% { transform: scale(1.25); }
  100% { transform: scale(1); }
`;

const Nav = styled.nav<{ isHomePage: boolean }>`
  background: ${props => props.isHomePage ? 'transparent' : 'var(--header-bg, white)'};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  box-sizing: border-box;
  box-shadow: ${props => props.isHomePage ? 'none' : 'var(--shadow, 0 2px 10px rgba(0,0,0,0.05))'};
  transition: all 0.3s ease;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
`;

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 2;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  justify-content: flex-end;
`;

const Logo = styled(Link)<{ isHomePage: boolean }>`
  font-size: 1.3rem;
  font-weight: 700;
  text-decoration: none;
  color: ${props => props.isHomePage ? 'white' : 'var(--text-primary, #000)'};
  letter-spacing: 3px;
  white-space: nowrap;
  
  span {
    font-weight: 300;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 1200px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)<{ isHomePage: boolean }>`
  text-decoration: none;
  color: ${props => props.isHomePage ? 'white' : 'var(--text-primary, #000)'};
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 1px;
  transition: color 0.3s ease;
  position: relative;
  padding-bottom: 5px;
  white-space: nowrap;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: ${props => props.isHomePage ? 'white' : 'var(--text-primary, #000)'};
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform: translateX(-50%);
  }
  
  &:hover {
    opacity: 0.8;
  }
  
  &:hover::after {
    width: 100%;
    left: 0;
    transform: translateX(0);
  }
  
  &.active::after {
    width: 100%;
    left: 0;
    transform: translateX(0);
  }
`;

const LanguageSwitcher = styled.div`
  position: relative;
`;

const LanguageButton = styled.button<{ isHomePage: boolean }>`
  background: transparent;
  border: 1px solid ${props => props.isHomePage ? 'rgba(255,255,255,0.3)' : 'var(--border-color)'};
  border-radius: 30px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 0.8rem;
  color: ${props => props.isHomePage ? 'white' : 'var(--text-primary)'};
  transition: all 0.3s;
  white-space: nowrap;
  
  &:hover {
    border-color: ${props => props.isHomePage ? 'white' : '#000'};
  }
`;

const LanguageDropdown = styled.div<{ isHomePage: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  z-index: 100;
  min-width: 100px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const LanguageOption = styled.div<{ isHomePage: boolean }>`
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  color: var(--text-primary);
  font-size: 0.8rem;
  white-space: nowrap;
  
  &:hover {
    background: var(--bg-secondary);
  }
`;

const IconButton = styled.button<{ isHomePage: boolean }>`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: ${props => props.isHomePage ? 'white' : 'var(--text-primary)'};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 0;
    height: 2px;
    background: ${props => props.isHomePage ? 'white' : 'var(--text-primary, #000)'};
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform: translateX(-50%);
  }
  
  &:hover::after {
    width: 100%;
    left: 0;
    transform: translateX(0);
  }
  
  &:hover {
    opacity: 0.8;
  }
`;

const IconLink = styled(Link)<{ isHomePage: boolean; bump: boolean }>`
  text-decoration: none;
  color: ${props => props.isHomePage ? 'white' : 'var(--text-primary, #000)'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0.5rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 0;
    height: 2px;
    background: ${props => props.isHomePage ? 'white' : 'var(--text-primary, #000)'};
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform: translateX(-50%);
  }
  
  &:hover::after {
    width: 100%;
    left: 0;
    transform: translateX(0);
  }
  
  &:hover {
    opacity: 0.8;
  }
  
  animation: ${props => props.bump ? cartBump : 'none'} 0.3s ease-in-out;
`;

const IconWrapper = styled.div<{ isAnimating: boolean; isVisible: boolean }>`
  animation: ${props => {
    if (!props.isAnimating) return 'none';
    return props.isVisible ? fadeInRotate : fadeOutRotate;
  }} 0.3s ease forwards;
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchInput = styled.input<{ isHomePage: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.isHomePage ? 'rgba(255,255,255,0.3)' : 'var(--border-color, #ddd)'};
  border-radius: 30px;
  background: ${props => props.isHomePage ? 'rgba(255,255,255,0.1)' : 'var(--bg-secondary, #f5f5f5)'};
  color: ${props => props.isHomePage ? 'white' : 'var(--text-primary, #000)'};
  font-size: 0.8rem;
  width: 150px;
  transition: all 0.3s;
  
  &::placeholder {
    color: ${props => props.isHomePage ? 'rgba(255,255,255,0.6)' : 'var(--text-secondary, #999)'};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.isHomePage ? 'white' : 'var(--text-primary, #000)'};
    width: 180px;
  }
`;

const SuggestionsDropdown = styled.div<{ isHomePage: boolean; show: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.isHomePage ? 'rgba(0,0,0,0.9)' : 'var(--card-bg, white)'};
  border-radius: 12px;
  margin-top: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  z-index: 200;
  display: ${props => props.show ? 'block' : 'none'};
  overflow: hidden;
`;

const SuggestionItem = styled.div<{ isHomePage: boolean }>`
  padding: 0.8rem 1rem;
  cursor: pointer;
  color: ${props => props.isHomePage ? 'white' : 'var(--text-primary, #333)'};
  font-size: 0.8rem;
  transition: background 0.2s;
  border-bottom: 1px solid ${props => props.isHomePage ? 'rgba(255,255,255,0.1)' : 'var(--border-color, #eee)'};
  
  &:hover {
    background: ${props => props.isHomePage ? 'rgba(255,255,255,0.1)' : 'var(--bg-secondary, #f5f5f5)'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SuggestionName = styled.span`
  font-weight: 500;
`;

const SuggestionPrice = styled.span<{ isHomePage: boolean }>`
  float: right;
  color: ${props => props.isHomePage ? 'rgba(255,255,255,0.6)' : 'var(--text-secondary, #999)'};
  font-size: 0.75rem;
  margin-left: 0.5rem;
`;

const NoSuggestions = styled.div<{ isHomePage: boolean }>`
  padding: 1rem;
  text-align: center;
  color: ${props => props.isHomePage ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary, #999)'};
  font-size: 0.8rem;
`;

const CartIcon = styled.div<{ isHomePage: boolean }>`
  width: 22px;
  height: 22px;
  position: relative;
  cursor: pointer;
  
  svg {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: ${props => props.isHomePage ? 'white' : 'var(--text-primary, #000)'};
    stroke-width: 2;
  }
`;

const UserIcon = styled.div<{ isHomePage: boolean }>`
  width: 22px;
  height: 22px;
  position: relative;
  cursor: pointer;
  
  svg {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: ${props => props.isHomePage ? 'white' : 'var(--text-primary, #000)'};
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -10px;
  background: #ff4444;
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 50%;
  min-width: 18px;
  text-align: center;
`;

const CartIconSVG = () => (
  <svg viewBox="0 0 24 24">
    <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6l-3-4H6zM3 6h18" />
    <path d="M8 10V6" />
    <path d="M16 10V6" />
    <circle cx="10" cy="14" r="1" />
    <circle cx="14" cy="14" r="1" />
  </svg>
);

const UserIconSVG = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SunIcon: React.FC<{ isDark?: boolean }> = ({ isDark }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? 'white' : 'black'}>
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon: React.FC<{ isDark?: boolean }> = ({ isDark }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={isDark ? 'white' : 'black'}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const API_URL = 'http://localhost:8000/api';

interface SuggestionProduct {
  id: number;
  name: string;
  price: number;
}

const Navbar: React.FC = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [bumpCart, setBumpCart] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const isHomePage = location.pathname === '/';
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/products/?search=${encodeURIComponent(searchQuery)}`);
        setSuggestions(response.data.slice(0, 5));
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    const handleCartUpdate = () => {
      setBumpCart(true);
      setTimeout(() => setBumpCart(false), 300);
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);
  
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (product: SuggestionProduct) => {
    navigate(`/product/${product.id}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };
  
  const handleThemeToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      toggleTheme();
      setTimeout(() => setIsAnimating(false), 300);
    }, 150);
  };
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLangMenuOpen(false);
  };
  
  const getLanguageFlag = () => {
    switch (i18n.language) {
      case 'en': return '🇬🇧 EN';
      case 'ru': return '🇷🇺 RU';
      case 'pl': return '🇵🇱 PL';
      default: return '🌐';
    }
  };
  
  return (
    <Nav isHomePage={isHomePage}>
      <LeftSection>
        <Logo to="/" isHomePage={isHomePage}>C<span>OZYRO</span></Logo>
      </LeftSection>
      
      <CenterSection>
        <NavLinks>
          <NavLink to="/" isHomePage={isHomePage} className={isActive('/') ? 'active' : ''}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/products" isHomePage={isHomePage} className={isActive('/products') ? 'active' : ''}>
            {t('nav.shop')}
          </NavLink>
          <NavLink to="/recommended" isHomePage={isHomePage}>
            {t('nav.recommended')}
          </NavLink>
          <NavLink to="/contacts" isHomePage={isHomePage}>
            {t('nav.contacts')}
          </NavLink>
          <NavLink to="/how-to-buy" isHomePage={isHomePage}>
            {t('nav.howToBuy')}
          </NavLink>
        </NavLinks>
      </CenterSection>
      
      <RightSection>
        <LanguageSwitcher>
          <LanguageButton onClick={() => setLangMenuOpen(!langMenuOpen)} isHomePage={isHomePage}>
            {getLanguageFlag()}
          </LanguageButton>
          {langMenuOpen && (
            <LanguageDropdown isHomePage={isHomePage}>
              <LanguageOption onClick={() => changeLanguage('en')} isHomePage={isHomePage}>
                🇬🇧 English
              </LanguageOption>
              <LanguageOption onClick={() => changeLanguage('ru')} isHomePage={isHomePage}>
                🇷🇺 Русский
              </LanguageOption>
              <LanguageOption onClick={() => changeLanguage('pl')} isHomePage={isHomePage}>
                🇵🇱 Polski
              </LanguageOption>
            </LanguageDropdown>
          )}
        </LanguageSwitcher>
        
        <IconButton onClick={handleThemeToggle} isHomePage={isHomePage}>
          <IconWrapper isAnimating={isAnimating} isVisible={true}>
            {theme === 'light' ? (
              <MoonIcon isDark={false} />
            ) : (
              <SunIcon isDark={true} />
            )}
          </IconWrapper>
        </IconButton>
        
        <IconLink to="/cart" isHomePage={isHomePage} bump={bumpCart} data-cart-icon>
          <CartIcon isHomePage={isHomePage}>
            <CartIconSVG />
          </CartIcon>
          {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
        </IconLink>
        
        <IconLink to={isAuthenticated ? "/account" : "/auth"} isHomePage={isHomePage} bump={false}>
          <UserIcon isHomePage={isHomePage}>
            <UserIconSVG />
          </UserIcon>
        </IconLink>
        
        <SearchWrapper ref={searchRef}>
          <SearchInput
            isHomePage={isHomePage}
            type="text"
            placeholder={t('nav.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          
          <SuggestionsDropdown isHomePage={isHomePage} show={showSuggestions}>
            {suggestions.length > 0 ? (
              suggestions.map((product) => (
                <SuggestionItem 
                  key={product.id} 
                  isHomePage={isHomePage}
                  onClick={() => handleSuggestionClick(product)}
                >
                  <SuggestionName>{product.name}</SuggestionName>
                  <SuggestionPrice isHomePage={isHomePage}>${product.price}</SuggestionPrice>
                </SuggestionItem>
              ))
            ) : searchQuery.length >= 2 ? (
              <NoSuggestions isHomePage={isHomePage}>
                {t('recommended.noResults')}
              </NoSuggestions>
            ) : null}
          </SuggestionsDropdown>
        </SearchWrapper>
      </RightSection>
    </Nav>
  );
};

export default Navbar;