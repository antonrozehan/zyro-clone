import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import { useTranslate } from '../hooks/useTranslate';
import { cache } from '../utils/cache';

const PageContainer = styled.div`
  padding-top: 2rem;
  min-height: 100vh;
  background: var(--bg-primary);
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TitleWrapper = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
`;

const ResultsCount = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const BurgerButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 42px;
  height: 42px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--bg-primary);
    border-color: #000;
  }
  
  span {
    display: block;
    width: 20px;
    height: 2px;
    background: var(--text-primary);
    border-radius: 2px;
  }
  
  span:nth-child(2) {
    width: 14px;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const Sidebar = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 100vh;
  background: var(--bg-primary);
  z-index: 1000;
  padding: 2rem;
  transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const CloseButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 42px;
  height: 42px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  
  &:hover {
    background: var(--bg-primary);
    border-color: #000;
  }
  
  span {
    display: block;
    width: 20px;
    height: 2px;
    background: var(--text-primary);
    border-radius: 2px;
  }
  
  span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  span:nth-child(2) {
    opacity: 0;
  }
  span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
`;

const FilterTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 1rem 0 0.8rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border-color);
  
  &:first-of-type {
    margin-top: 0;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 1rem;
`;

const SortButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SortButton = styled.button<{ $active: boolean }>`
  padding: 0.6rem 1rem;
  background: ${props => props.$active ? '#000' : 'var(--bg-secondary)'};
  color: ${props => props.$active ? '#fff' : 'var(--text-primary)'};
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s;
  font-size: 0.85rem;
  
  &:hover {
    border-color: #000;
  }
`;

const PriceInputs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PriceInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  text-align: center;
  font-size: 0.85rem;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const SliderWrapper = styled.div`
  margin: 15px 0;
  
  .rc-slider-track {
    background-color: #000;
  }
  
  .rc-slider-handle {
    border-color: #000;
    background-color: #000;
    box-shadow: none;
  }
  
  .rc-slider-rail {
    background-color: #ddd;
  }
`;

const CategoryCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  cursor: pointer;
  color: var(--text-primary);
  
  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const ResetButton = styled.button`
  width: 100%;
  padding: 0.7rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
  margin-bottom: 2rem;
  
  &:hover {
    border-color: #000;
    background: #000;
    color: white;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

// Простой скелетон-карточка для мгновенного отображения
const SkeletonCardWrapper = styled.div`
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  height: 280px;
  animation: pulse 1.5s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const SkeletonCard: React.FC = () => <SkeletonCardWrapper />;

const API_URL = 'https://zyro-backend-e9i6.onrender.com/api';

interface Category {
  id: number;
  name: string;
  slug: string;
}

type SortType = 'rating' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

const RecommendedPage: React.FC = () => {
  const { t } = useTranslate();
  // Мгновенно берем данные из кэша
  const [products, setProducts] = useState<any[]>(() => {
    const cached = cache.get('products_all');
    return cached || [];
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const cached = cache.get('categories');
    return cached || [];
  });
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(products.length === 0);
  const [sortBy, setSortBy] = useState<SortType>('rating');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (products.length === 0 || categories.length === 0) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (products.length > 0 && categories.length > 0) {
      filterAndSortProducts();
    }
  }, [sortBy, priceRange, selectedCategories, products, categories]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/products/`),
        axios.get(`${API_URL}/categories/`)
      ]);
      
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      cache.set('products_all', productsRes.data);
      cache.set('categories', categoriesRes.data);
      
      const prices = productsRes.data.map((p: any) => parseFloat(p.price));
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange([min, max]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];
    
    filtered = filtered.filter(
      (p) => parseFloat(p.price) >= priceRange[0] && parseFloat(p.price) <= priceRange[1]
    );
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => {
        const productCategoryName = p.category_name || p.category?.name;
        const selectedCategoryNames = categories
          .filter(cat => selectedCategories.includes(cat.slug))
          .map(cat => cat.name);
        
        return selectedCategoryNames.includes(productCategoryName);
      });
    }
    
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price_asc':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price_desc':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredProducts(filtered);
  };

  const handleSortChange = (sort: SortType) => {
    setSortBy(sort);
    setIsSidebarOpen(false);
  };

  const handlePriceChange = (value: number | number[]) => {
    setPriceRange(value as [number, number]);
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategories(prev =>
      prev.includes(categorySlug)
        ? prev.filter(c => c !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  const handleReset = () => {
    setSortBy('rating');
    setPriceRange([minPrice, maxPrice]);
    setSelectedCategories([]);
    setIsSidebarOpen(false);
  };

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Показываем скелетоны только если нет данных и идет загрузка
  if (loading && products.length === 0) {
    return (
      <>
        <Navbar />
        <PageContainer>
          <Container>
            <Header>
              <BurgerButton onClick={openSidebar}>
                <span></span>
                <span></span>
                <span></span>
              </BurgerButton>
              <TitleWrapper>
                <Title>{t('recommended.title')}</Title>
                <ResultsCount>-- {t('recommended.productsFound')}</ResultsCount>
              </TitleWrapper>
            </Header>
            <Grid>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </Grid>
          </Container>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageContainer>
        <Container>
          <Header>
            <BurgerButton onClick={openSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </BurgerButton>
            
            <TitleWrapper>
              <Title>{t('recommended.title')}</Title>
              <ResultsCount>{filteredProducts.length} {t('recommended.productsFound')}</ResultsCount>
            </TitleWrapper>
          </Header>
          
          <Overlay $isOpen={isSidebarOpen} onClick={closeSidebar} />
          
          <Sidebar $isOpen={isSidebarOpen}>
            <CloseButton onClick={closeSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </CloseButton>
            
            <FilterTitle>{t('recommended.sortBy')}</FilterTitle>
            <SortButtons>
              <SortButton $active={sortBy === 'rating'} onClick={() => handleSortChange('rating')}>
                ⭐ {t('recommended.topRated')}
              </SortButton>
              <SortButton $active={sortBy === 'price_asc'} onClick={() => handleSortChange('price_asc')}>
                💰 {t('recommended.priceLowHigh')}
              </SortButton>
              <SortButton $active={sortBy === 'price_desc'} onClick={() => handleSortChange('price_desc')}>
                💰 {t('recommended.priceHighLow')}
              </SortButton>
              <SortButton $active={sortBy === 'name_asc'} onClick={() => handleSortChange('name_asc')}>
                📝 {t('recommended.nameAZ')}
              </SortButton>
              <SortButton $active={sortBy === 'name_desc'} onClick={() => handleSortChange('name_desc')}>
                📝 {t('recommended.nameZA')}
              </SortButton>
            </SortButtons>
            
            <FilterTitle>{t('recommended.priceRange')}</FilterTitle>
            <FilterSection>
              <SliderWrapper>
                <Slider
                  range
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange}
                  onChange={handlePriceChange}
                />
              </SliderWrapper>
              <PriceInputs>
                <PriceInput
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                />
                <PriceInput
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                />
              </PriceInputs>
            </FilterSection>
            
            <FilterTitle>{t('recommended.categories')}</FilterTitle>
            <FilterSection>
              {categories.map((cat) => (
                <CategoryCheckbox key={cat.id}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => handleCategoryChange(cat.slug)}
                  />
                  {cat.name}
                </CategoryCheckbox>
              ))}
            </FilterSection>
            
            <ResetButton onClick={handleReset}>{t('recommended.reset')}</ResetButton>
          </Sidebar>
          
          <Grid>
            {filteredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        </Container>
      </PageContainer>
    </>
  );
};

export default RecommendedPage;