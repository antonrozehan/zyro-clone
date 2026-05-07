import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import { useTranslation } from 'react-i18next';
import { cache } from '../utils/cache';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  min-height: 70vh;
`;

const SearchHeader = styled.div`
  margin-bottom: 2rem;
`;

const SearchTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
`;

const SearchQuery = styled.span`
  color: var(--text-secondary);
  font-weight: normal;
`;

const ResultsCount = styled.p`
  color: var(--text-secondary);
  margin-bottom: 1rem;
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const SortSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const CategoryBadge = styled.button<{ active: boolean }>`
  padding: 0.4rem 1rem;
  background: ${props => props.active ? '#000' : 'var(--bg-primary)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.active ? '#000' : 'var(--border-color)'};
  border-radius: 30px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #000;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 4rem;
  
  h3 {
    font-size: 1.5rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
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

const API_URL = 'http://localhost:8000/api';

const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (query) {
      fetchProducts();
    } else {
      setLoading(false);
      setProducts([]);
    }
  }, [query, sortBy, categoryFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const cacheKey = `search_${query}_${categoryFilter}_${sortBy}`;
      const cached = cache.get(cacheKey);
      if (cached) {
        setProducts(cached);
        setLoading(false);
        return;
      }
      
      let url = `${API_URL}/products/?search=${encodeURIComponent(query)}`;
      if (categoryFilter !== 'all') {
        url += `&type=${categoryFilter}`;
      }
      const response = await axios.get(url);
      let filteredProducts = response.data;
      
      if (sortBy === 'price_asc') {
        filteredProducts.sort((a: any, b: any) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        filteredProducts.sort((a: any, b: any) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filteredProducts.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
      }
      
      cache.set(cacheKey, filteredProducts);
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!query) {
    return (
      <>
        <Navbar />
        <PageContainer>
          <NoResults>
            <h3>{t('search.enterTerm')}</h3>
            <p>{t('search.enterTermDesc')}</p>
          </NoResults>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageContainer>
        <SearchHeader>
          <SearchTitle>
            {t('search.resultsFor')} <SearchQuery>"{query}"</SearchQuery>
          </SearchTitle>
          <ResultsCount>{products.length} {t('search.productsFound')}</ResultsCount>
        </SearchHeader>
        
        <FilterBar>
          <CategoryFilter>
            <CategoryBadge 
              active={categoryFilter === 'all'} 
              onClick={() => setCategoryFilter('all')}
            >
              {t('search.all')}
            </CategoryBadge>
            <CategoryBadge 
              active={categoryFilter === 'headphone'} 
              onClick={() => setCategoryFilter('headphone')}
            >
              {t('search.headphones')}
            </CategoryBadge>
            <CategoryBadge 
              active={categoryFilter === 'speaker'} 
              onClick={() => setCategoryFilter('speaker')}
            >
              {t('search.speakers')}
            </CategoryBadge>
            <CategoryBadge 
              active={categoryFilter === 'audio'} 
              onClick={() => setCategoryFilter('audio')}
            >
              {t('search.audioSpeakers')}
            </CategoryBadge>
          </CategoryFilter>
          
          <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="relevance">{t('search.sortRelevance')}</option>
            <option value="price_asc">{t('search.sortPriceAsc')}</option>
            <option value="price_desc">{t('search.sortPriceDesc')}</option>
            <option value="rating">{t('search.sortRating')}</option>
          </SortSelect>
        </FilterBar>
        
        {loading ? (
          <Grid>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </Grid>
        ) : products.length === 0 ? (
          <NoResults>
            <h3>{t('search.noResults')}</h3>
            <p>{t('search.noResultsDesc')}</p>
            <Link to="/products" style={{ color: '#000', textDecoration: 'underline' }}>
              {t('search.browseAll')} →
            </Link>
          </NoResults>
        ) : (
          <Grid>
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        )}
      </PageContainer>
    </>
  );
};

export default SearchPage;